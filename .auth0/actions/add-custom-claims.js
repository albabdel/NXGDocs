/**
 * Handler that will be called during the execution of a PostLogin flow.
 * 
 * This action adds custom claims to the ID token for:
 * 1. Supabase RLS - requires 'role: authenticated' claim
 * 2. NXGEN Docs - role-based content, preferences
 * 3. User identification - email, name for easier access
 *
 * @param {Event} event - Details about the user and context
 * @param {PostLoginAPI} api - Methods for modifying the token
 */
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://docs.nxgen.cloud';
  
  // REQUIRED for Supabase RLS
  // Supabase requires 'role' claim set to 'authenticated'
  api.accessToken.setCustomClaim('role', 'authenticated');
  api.idToken.setCustomClaim('role', 'authenticated');
  
  // Add user identification claims
  if (event.user.email) {
    api.idToken.setCustomClaim('email', event.user.email);
    api.accessToken.setCustomClaim('email', event.user.email);
  }
  
  if (event.user.name) {
    api.idToken.setCustomClaim('name', event.user.name);
  }
  
  // Add role from app_metadata (admin, operator, manager, user)
  const appMetadata = event.user.app_metadata || {};
  const userRole = appMetadata.role || 'user';
  api.idToken.setCustomClaim(`${namespace}/role`, userRole);
  api.accessToken.setCustomClaim(`${namespace}/role`, userRole);
  
  // Add organization ID if present
  if (appMetadata.orgId) {
    api.idToken.setCustomClaim(`${namespace}/orgId`, appMetadata.orgId);
  }
  
  // Add preferences from user_metadata
  const userMetadata = event.user.user_metadata || {};
  if (userMetadata.preferences) {
    api.idToken.setCustomClaim(`${namespace}/preferences`, userMetadata.preferences);
  }
  
  // Log for debugging (visible in Auth0 dashboard)
  console.log(`Added custom claims for user: ${event.user.email}`);
  console.log(`Role: ${userRole}`);
};
