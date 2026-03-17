// functions/lib/sync-admin-user.ts
// Sync admin users to Sanity on first login

import { createClient } from '@sanity/client';

interface AdminUser {
  userId: string;
  email: string;
  name: string;
  orgId: string;
}

interface SyncEnv {
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_API_TOKEN: string;
}

function getSanityClient(env: SyncEnv) {
  return createClient({
    projectId: env.SANITY_PROJECT_ID,
    dataset: env.SANITY_DATASET,
    token: env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
  });
}

export async function syncAdminUser(env: SyncEnv, user: AdminUser): Promise<void> {
  const client = getSanityClient(env);

  try {
    const existing = await client.fetch(
      `*[_type == "adminUser" && zohoId == $zohoId][0]`,
      { zohoId: user.userId }
    );

    const now = new Date().toISOString();

    if (existing) {
      await client
        .patch(existing._id)
        .set({
          lastLoginAt: now,
          loginCount: (existing.loginCount || 0) + 1,
          name: user.name,
          email: user.email,
        })
        .commit();
      console.log(`[syncAdminUser] Updated user ${user.email}`);
    } else {
      await client.create({
        _type: 'adminUser',
        zohoId: user.userId,
        email: user.email,
        name: user.name,
        role: 'admin',
        orgId: user.orgId,
        lastLoginAt: now,
        loginCount: 1,
        createdAt: now,
        isActive: true,
      });
      console.log(`[syncAdminUser] Created new user ${user.email}`);
    }
  } catch (error) {
    console.error('[syncAdminUser] Error:', error);
  }
}
