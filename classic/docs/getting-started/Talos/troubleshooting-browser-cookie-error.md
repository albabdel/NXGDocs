---
title: "Unable to Open Evalink Talos - Browser Cookie Error"
description: "Guide to resolving 'Oops something went wrong' error when accessing Talos due to browser cookie settings"
tags:
  - role:all
  - category:troubleshooting
  - difficulty:beginner
  - platform:talos
sidebar_position: 7
last_updated: 2025-12-21
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Unable to Open Evalink Talos - Browser Cookie Error

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      If you can access Genesis applications but receive an "Oops something went wrong" error when trying to access Talos, the issue is likely related to browser cookie settings. This guide helps you resolve this common issue.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>🍪</div>
      <h3 style={{color: 'white', margin: 0}}>Cookie Error</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Browser Settings</p>
    </div>
  </div>
</div>

## Symptoms

You may experience the following:

- ✅ You can log in to Genesis successfully
- ✅ You can access Genesis applications like Dashboard and Video Viewer
- ❌ When trying to access Evalink/Talos (Alarm Management or Manage Workflows), you get the error: **"Oops something went wrong"**

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-warning)', marginBottom: '2rem', padding: '1.5rem'}}>
  <h3 style={{marginTop: 0}}>⚠️ Common Error Message</h3>
  <p style={{fontSize: '1.2rem', textAlign: 'center', margin: 0}}>
    <strong>"Oops something went wrong"</strong>
  </p>
</div>

## Root Cause

This error typically occurs when **third-party cookies are disabled** in your browser settings. Talos requires third-party cookies to function properly because it operates as an embedded application within the Genesis interface.

## Solution

### Step 1: Check Cookie Settings

1. **Open Browser Settings:**
   - Look for the **Eye icon** (👁️) or **Cookie icon** (🍪) in your browser's address bar
   - This icon indicates cookie settings for the current site

2. **Check Current Status:**
   - Verify if cookies are turned off
   - Check if third-party cookies are blocked

### Step 2: Enable Third-Party Cookies

If cookies are turned off or third-party cookies are blocked:

1. **Click the Cookie/Eye Icon:**
   - Click on the Eye icon (👁️) or Cookie icon in the address bar
   - This opens the site's cookie settings

2. **Turn On Third-Party Cookies:**
   - Look for the option to **"Turn on Third party Cookies"**
   - Enable this setting
   - Save the changes

3. **Refresh the Page:**
   - Reload the Talos page
   - The error should be resolved

### Browser-Specific Instructions

<Tabs>
  <TabItem value="chrome" label="Google Chrome" default>
    <div className="card shadow--md" style={{borderLeft: '6px solid #4285F4', marginTop: '1rem'}}>
      <div className="card__header">
        <h3>Chrome Cookie Settings</h3>
      </div>
      <div className="card__body">
        <ol>
          <li>Click the <strong>lock icon</strong> or <strong>eye icon</strong> in the address bar</li>
          <li>Click <strong>"Cookies and site data"</strong></li>
          <li>Ensure <strong>"Allow all cookies"</strong> is selected, or</li>
          <li>Select <strong>"Block third-party cookies in Incognito"</strong> and ensure regular browsing allows third-party cookies</li>
          <li>Alternatively, go to <strong>Settings > Privacy and security > Cookies and other site data</strong></li>
          <li>Select <strong>"Allow all cookies"</strong> or <strong>"Block third-party cookies in Incognito"</strong></li>
        </ol>
      </div>
    </div>
  </TabItem>

  <TabItem value="edge" label="Microsoft Edge">
    <div className="card shadow--md" style={{borderLeft: '6px solid #0078D4', marginTop: '1rem'}}>
      <div className="card__header">
        <h3>Edge Cookie Settings</h3>
      </div>
      <div className="card__body">
        <ol>
          <li>Click the <strong>lock icon</strong> in the address bar</li>
          <li>Click <strong>"Cookies and site permissions"</strong></li>
          <li>Ensure cookies are allowed</li>
          <li>Alternatively, go to <strong>Settings > Cookies and site permissions</strong></li>
          <li>Under <strong>"Cookies and site data"</strong>, ensure <strong>"Allow sites to save and read cookie data"</strong> is enabled</li>
          <li>Ensure <strong>"Block third-party cookies"</strong> is disabled</li>
        </ol>
      </div>
    </div>
  </TabItem>

  <TabItem value="firefox" label="Mozilla Firefox">
    <div className="card shadow--md" style={{borderLeft: '6px solid #FF7139', marginTop: '1rem'}}>
      <div className="card__header">
        <h3>Firefox Cookie Settings</h3>
      </div>
      <div className="card__body">
        <ol>
          <li>Click the <strong>shield icon</strong> in the address bar</li>
          <li>Click <strong>"Enhanced Tracking Protection"</strong> settings</li>
          <li>Select <strong>"Standard"</strong> or <strong>"Custom"</strong></li>
          <li>If Custom, ensure <strong>"Cookies"</strong> is set to <strong>"All cookies"</strong></li>
          <li>Alternatively, go to <strong>Options > Privacy & Security</strong></li>
          <li>Under <strong>"Cookies and Site Data"</strong>, ensure <strong>"Accept cookies and site data"</strong> is selected</li>
        </ol>
      </div>
    </div>
  </TabItem>

  <TabItem value="safari" label="Safari">
    <div className="card shadow--md" style={{borderLeft: '6px solid #000000', marginTop: '1rem'}}>
      <div className="card__header">
        <h3>Safari Cookie Settings</h3>
      </div>
      <div className="card__body">
        <ol>
          <li>Go to <strong>Safari > Preferences</strong></li>
          <li>Click the <strong>"Privacy"</strong> tab</li>
          <li>Under <strong>"Cookies and website data"</strong>, select <strong>"Always allow"</strong> or <strong>"Allow from websites I visit"</strong></li>
          <li>Ensure <strong>"Prevent cross-site tracking"</strong> is disabled if it blocks third-party cookies</li>
        </ol>
      </div>
    </div>
  </TabItem>
</Tabs>

## Verification

After enabling third-party cookies:

1. **Clear Browser Cache (Optional but Recommended):**
   - Clear cookies and cached data for the site
   - This ensures a fresh start

2. **Refresh the Page:**
   - Reload the Talos page
   - The "Oops something went wrong" error should be gone

3. **Test Access:**
   - Try accessing Alarm Management
   - Try accessing Manage Workflows
   - Both should now work correctly

## Additional Troubleshooting

If enabling third-party cookies doesn't resolve the issue:

### Check Browser Extensions

Some browser extensions can block cookies:

1. **Disable Extensions Temporarily:**
   - Disable ad blockers
   - Disable privacy extensions
   - Disable cookie management extensions
   - Test if Talos works

2. **Whitelist the Site:**
   - Add the Genesis/Talos site to your extension's whitelist
   - Re-enable the extension

### Check Network/Firewall Settings

Corporate firewalls or network policies might block cookies:

1. **Contact IT Support:**
   - If on a corporate network, contact IT
   - Request whitelisting of the Talos domain
   - Verify firewall rules allow cookie transmission

### Try Incognito/Private Mode

Test if the issue is related to stored cookies:

1. **Open Incognito/Private Window:**
   - This starts with a clean cookie state
   - Try accessing Talos
   - If it works, clear your regular browser cookies

2. **Clear Cookies:**
   - Clear all cookies for the Genesis/Talos domain
   - Log in again
   - Test Talos access

## Prevention

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-success)', marginBottom: '2rem', padding: '1.5rem'}}>
  <h3 style={{marginTop: 0}}>✅ Best Practices</h3>
  <ul>
    <li><strong>Keep third-party cookies enabled</strong> for the Genesis/Talos domain</li>
    <li><strong>Whitelist the site</strong> in privacy extensions and ad blockers</li>
    <li><strong>Use supported browsers</strong> (Chrome, Edge, Firefox, Safari)</li>
    <li><strong>Keep browsers updated</strong> to the latest version</li>
    <li><strong>Document cookie requirements</strong> for your team</li>
    <li><strong>Test after browser updates</strong> to ensure compatibility</li>
  </ul>
</div>

## Related Articles

- [Getting to Know Evalink Talos - Complete Guide](/docs/getting-started/Talos/getting-to-know-evalink-talos-complete)
- [Troubleshooting Time Synchronization Errors](/docs/getting-started/Talos/troubleshooting-time-synchronization-errors)
- [Troubleshooting Alarm Overflow Threshold](/docs/getting-started/Talos/troubleshooting-alarm-overflow-threshold)
- [What is Evalink Talos?](/docs/getting-started/what-is-evalink-talos)

## Need Help?

If you continue to experience issues after following these steps:

1. Check the [Troubleshooting Guide](/docs/troubleshooting)
2. Verify your browser version is up to date
3. [Contact GCXONE Support](/docs/support) with:
   - Browser type and version
   - Screenshot of the error
   - Cookie settings configuration
   - Any error messages from browser console

