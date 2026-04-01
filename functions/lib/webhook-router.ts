export interface SanityWebhookPayload {
  _id: string;
  _type: string;
  product?: string;
  slug?: { current: string };
  title?: string;
  status?: string;
}

export interface ProductBuildConfig {
  product: string;
  projectName: string;
  deploymentHookUrl: string;
}

const PRODUCT_PROJECT_MAP: Record<string, string> = {
  gcxone: 'gcxone',
  gcsurge: 'gcsurge',
};

const CLOUDFLARE_ACCOUNT_ID = 'ff9df0a2daf8c9eb1032f67dd551c784';

export function detectProductFromPayload(payload: SanityWebhookPayload): string[] {
  const product = payload.product;
  
  if (!product || product === 'shared') {
    return ['gcxone', 'gcsurge'];
  }
  
  if (PRODUCT_PROJECT_MAP[product]) {
    return [product];
  }
  
  console.warn(`Unknown product '${product}', defaulting to gcxone`);
  return ['gcxone'];
}

export function routeToProduct(products: string[]): ProductBuildConfig[] {
  return products.map((product) => {
    const projectName = PRODUCT_PROJECT_MAP[product];
    if (!projectName) {
      throw new Error(`Unknown product: ${product}`);
    }
    
    return {
      product,
      projectName,
      deploymentHookUrl: `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${projectName}/deployments`,
    };
  });
}

export async function validateSanitySignature(request: Request, secret: string): Promise<boolean> {
  const signature = request.headers.get('X-Sanity-Signature');
  if (!signature) {
    return false;
  }

  const body = await request.clone().text();
  
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const expectedSignature = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const expectedHex = Array.from(new Uint8Array(expectedSignature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  
  return signature === expectedHex;
}

export function createProductBuildTrigger(apiToken: string) {
  return async (config: ProductBuildConfig): Promise<{ success: boolean; product: string; error?: string }> => {
    try {
      const response = await fetch(config.deploymentHookUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ branch: 'main' }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`Failed to trigger build for ${config.product}: ${error}`);
        return { success: false, product: config.product, error };
      }

      const result = await response.json() as { result?: { url?: string } };
      console.log(`Build triggered for ${config.product}: ${result.result?.url || 'pending'}`);
      return { success: true, product: config.product };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Error triggering build for ${config.product}: ${message}`);
      return { success: false, product: config.product, error: message };
    }
  };
}
