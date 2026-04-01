import {
  detectProductFromPayload,
  routeToProduct,
  validateSanitySignature,
  createProductBuildTrigger,
  SanityWebhookPayload,
} from '../lib/webhook-router';

interface Env {
  SANITY_WEBHOOK_SECRET: string;
  CLOUDFLARE_API_TOKEN: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const isValid = await validateSanitySignature(request, env.SANITY_WEBHOOK_SECRET);
  if (!isValid) {
    console.error('Invalid Sanity webhook signature');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let payload: SanityWebhookPayload;
  try {
    const clonedRequest = request.clone();
    payload = await clonedRequest.json();
  } catch (e) {
    console.error('Failed to parse webhook payload:', e);
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log(`Received Sanity webhook for document: ${payload._id} (${payload._type})`);
  console.log(`Product field: ${payload.product || 'not specified'}`);

  const products = detectProductFromPayload(payload);
  console.log(`Products to rebuild: ${products.join(', ')}`);

  const buildConfigs = routeToProduct(products);
  const triggerBuild = createProductBuildTrigger(env.CLOUDFLARE_API_TOKEN);

  const results = await Promise.all(buildConfigs.map(triggerBuild));

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  if (failed.length > 0) {
    console.error(`Some builds failed to trigger:`, failed);
  }

  return new Response(
    JSON.stringify({
      success: true,
      documentId: payload._id,
      documentType: payload._type,
      product: payload.product,
      productsRebuilt: successful.map((r) => r.product),
      failures: failed.map((r) => ({ product: r.product, error: r.error })),
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
