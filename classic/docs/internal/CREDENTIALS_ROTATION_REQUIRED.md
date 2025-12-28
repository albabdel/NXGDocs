# 🔐 CREDENTIALS ROTATION REQUIRED - URGENT

**Date:** 2025-12-28
**Status:** ⚠️ CRITICAL - IMMEDIATE ACTION REQUIRED
**Reason:** Credentials were exposed in version control

---

## 🚨 EXPOSED CREDENTIALS (DO NOT USE)

The following credentials were found hardcoded in source code and committed to git history.
**These credentials are COMPROMISED and must be rotated immediately.**

### Storyblok Credentials (EXPOSED)
```
Access Token: lZ1VpFd6y9FjoNcJQFlXLAtt
Management Token: SnZKlMe1dDulcvVEAt6EQAtt-127355674276436-YjsPjJbmPT5X5gxV9GD1
Space ID: 289434723537263 (not sensitive, can keep)
Region: eu (not sensitive, can keep)
```

### SMTP Credentials (EXPOSED)
```
User: emailappsmtp.1bb47c6b0a9025c9
Pass: HtPkPzaSjssz
Host: smtp.zeptomail.eu
```

### Hygraph Credentials (EXPOSED in .env.local history)
```
3 JWT tokens (2000+ characters each) were in .env.local
These are in git history and must be rotated
```

---

## ✅ STEP 1: GENERATE NEW CREDENTIALS

### 1.1 Rotate Storyblok Tokens

**Public Access Token:**
1. Go to https://app.storyblok.com
2. Login to your account
3. Navigate to: Settings → Access Tokens
4. Find existing token "lZ1VpFd6y9FjoNcJQFlXLAtt"
5. Click "Delete" or "Revoke" to invalidate it
6. Click "Generate New Token"
7. Copy the new token (you won't be able to see it again!)

**Management Token:**
1. Still in Settings → Access Tokens
2. Click on "Personal Access Tokens" tab
3. Find existing token ending in "...YjsPjJbmPT5X5gxV9GD1"
4. Click "Delete" or "Revoke"
5. Click "Generate New Token"
6. Give it a name: "Production Management Token"
7. Select scopes: "All spaces" + "Full access"
8. Click "Generate"
9. **IMPORTANT:** Copy the token immediately (shown only once!)

### 1.2 Rotate SMTP Credentials

**ZeptoMail:**
1. Login to your ZeptoMail account
2. Navigate to: Settings → SMTP
3. Find existing SMTP user: "emailappsmtp.1bb47c6b0a9025c9"
4. Click "Regenerate Password" or create a new SMTP user
5. Copy the new username and password

**Alternative:** Create a completely new SMTP user:
1. In ZeptoMail: Settings → SMTP → Add SMTP User
2. Name it: "nxgen-docs-production"
3. Copy the generated username and password

### 1.3 Rotate Hygraph Tokens (if using Hygraph)

1. Login to https://app.hygraph.com
2. Navigate to: Project Settings → API Access
3. Find existing tokens
4. Click "Delete" on old tokens
5. Click "Create Token"
6. Give it a name: "Production Content API"
7. Select permissions: Read content
8. Click "Create & Copy Token"

---

## ✅ STEP 2: UPDATE LOCAL ENVIRONMENT

### 2.1 Update .env.local File

Open `classic/.env.local` and update with NEW credentials:

```bash
# Storyblok Configuration (NEW TOKENS)
STORYBLOK_ACCESS_TOKEN=YOUR_NEW_PUBLIC_TOKEN_HERE
STORYBLOK_MANAGEMENT_TOKEN=YOUR_NEW_MANAGEMENT_TOKEN_HERE
STORYBLOK_REGION=eu
STORYBLOK_SPACE_ID=289434723537263
STORYBLOK_IS_PREVIEW=true

# SMTP Configuration (NEW CREDENTIALS)
SMTP_USER=YOUR_NEW_SMTP_USER_HERE
SMTP_PASS=YOUR_NEW_SMTP_PASSWORD_HERE

# Hygraph (if using - NEW TOKEN)
HYGRAPH_TOKEN=YOUR_NEW_HYGRAPH_TOKEN_HERE
HYGRAPH_MANAGEMENT_TOKEN=YOUR_NEW_HYGRAPH_MANAGEMENT_TOKEN_HERE
HYGRAPH_AS_SOURCE=false
```

### 2.2 Verify Local Build

```bash
cd classic
npm run build
```

**Expected output:**
- ✅ Storyblok content syncs successfully
- ✅ Build completes without errors
- ✅ No "STORYBLOK_ACCESS_TOKEN not set" errors

---

## ✅ STEP 3: UPDATE NETLIFY ENVIRONMENT VARIABLES

**This step is covered in TASK AQ-2, but here's a quick reference:**

1. Login to Netlify: https://app.netlify.com
2. Select site: gcxone.netlify.app
3. Navigate to: Site Settings → Environment Variables
4. **DELETE** all old variables with exposed credentials
5. **ADD** new variables with freshly rotated credentials:

| Variable Name | Value | Notes |
|---------------|-------|-------|
| STORYBLOK_ACCESS_TOKEN | [NEW_PUBLIC_TOKEN] | From Step 1.1 |
| STORYBLOK_MANAGEMENT_TOKEN | [NEW_MANAGEMENT_TOKEN] | From Step 1.1 |
| STORYBLOK_REGION | eu | Not sensitive |
| STORYBLOK_SPACE_ID | 289434723537263 | Not sensitive |
| STORYBLOK_IS_PREVIEW | false | Production mode |
| SMTP_USER | [NEW_SMTP_USER] | From Step 1.2 |
| SMTP_PASS | [NEW_SMTP_PASS] | From Step 1.2 |
| HYGRAPH_TOKEN | [NEW_TOKEN] | Optional - if using |
| HYGRAPH_AS_SOURCE | false | We use Storyblok |

6. Click "Save"
7. Trigger a new deploy to test

---

## ✅ STEP 4: VERIFY NEW CREDENTIALS WORK

### 4.1 Test Local Development
```bash
cd classic
npm run dev:preview  # Test with HTTPS preview
```

Visit: https://localhost:3010/storyblok-preview

**Expected:**
- ✅ Storyblok preview loads
- ✅ Can edit content in Visual Editor
- ✅ No authentication errors

### 4.2 Test Production Build
```bash
npm run build
```

**Expected:**
- ✅ Build succeeds
- ✅ Storyblok content fetched
- ✅ No credential errors

### 4.3 Test Netlify Deployment

1. Push changes to git
2. Watch Netlify build log
3. Verify build succeeds
4. Visit production site
5. Test feedback widget (tests SMTP credentials)

---

## ✅ STEP 5: SECURE CREDENTIAL STORAGE

### 5.1 Verify .env.local is Gitignored

```bash
cd classic
git check-ignore .env.local
```

**Expected output:**
```
classic/.env.local
```

If no output, add to `.gitignore`:
```bash
echo ".env.local" >> .gitignore
```

### 5.2 Document Required Variables

The `.env.example` file has been updated with all required variables.
New team members should:
1. Copy `.env.example` to `.env.local`
2. Fill in their own credentials
3. Never commit `.env.local`

---

## 📋 CHECKLIST

Before considering credentials rotation complete:

**Storyblok:**
- [ ] Old access token revoked in Storyblok dashboard
- [ ] Old management token revoked in Storyblok dashboard
- [ ] New access token generated
- [ ] New management token generated
- [ ] New tokens saved to password manager
- [ ] New tokens updated in local `.env.local`
- [ ] New tokens updated in Netlify dashboard

**SMTP:**
- [ ] Old SMTP credentials revoked/regenerated
- [ ] New SMTP user created or password regenerated
- [ ] New credentials saved to password manager
- [ ] New credentials updated in local `.env.local`
- [ ] New credentials updated in Netlify dashboard

**Hygraph (if using):**
- [ ] Old tokens revoked in Hygraph dashboard
- [ ] New tokens generated
- [ ] New tokens saved to password manager
- [ ] New tokens updated in local `.env.local`
- [ ] New tokens updated in Netlify dashboard

**Verification:**
- [ ] Local build succeeds with new credentials
- [ ] Local preview works with new credentials
- [ ] Netlify build succeeds with new credentials
- [ ] Production site works correctly
- [ ] Feedback widget works (SMTP test)
- [ ] Storyblok Visual Editor works

**Git Security:**
- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.local` purged from git history (TASK CC-2)
- [ ] No secrets in `netlify.toml`
- [ ] No hardcoded tokens in source code
- [ ] `.env.example` updated with placeholders only

---

## 🔒 ONGOING SECURITY PRACTICES

### Best Practices for Future

1. **Never commit credentials to version control**
   - Always use `.env.local` (gitignored)
   - Always use Netlify environment variables for production

2. **Rotate credentials regularly**
   - Every 90 days for production
   - Immediately if exposed or suspected compromise

3. **Use different credentials for different environments**
   - Development: Use separate Storyblok space or token
   - Production: Use production tokens
   - Never share credentials between environments

4. **Store credentials securely**
   - Use a password manager (1Password, LastPass, Bitwarden)
   - Never share credentials via email or Slack
   - Share via password manager sharing features

5. **Monitor for exposed credentials**
   - Enable GitHub secret scanning (if using GitHub)
   - Use tools like GitGuardian or TruffleHog
   - Review git commits before pushing

---

## 📞 SUPPORT

**If you need help rotating credentials:**

- Storyblok Support: support@storyblok.com
- ZeptoMail Support: https://www.zoho.com/zeptomail/help/
- Hygraph Support: support@hygraph.com
- Netlify Support: https://answers.netlify.com

---

**Document Status:** ACTIVE - Complete this ASAP
**Last Updated:** 2025-12-28
**Created By:** Claude Code (TASK CC-1)
