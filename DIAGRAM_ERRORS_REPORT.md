# Mermaid Diagram Errors Report

## Executive Summary

**Issue:** HTML tags in Mermaid diagrams causing text overlap and rendering failures
**Root Cause:** Using `<br/>` and `<small>` HTML tags instead of proper Mermaid syntax
**Impact:** Diagrams display garbled text or fail to render completely

---

## Files Requiring Fixes (9 Files)

### 1. platform-fundamentals-hierarchy-model.md
- **Location:** Line 74-86
- **Issue:** HTML `<br/>` and `<small>` tags in node labels
- **Severity:** HIGH
- **Example:** `A[🏢 Tenant<br/><small>Top-Level Organization</small>]`

### 2. platform-fundamentals-microservices-architecture.md
- **Location:** Lines 75-110, 157-173
- **Issue:** HTML `<br/>` tags in nodes and sequence diagram participants
- **Severity:** HIGH
- **Example:** `API[API Gateway<br/>Standardized Interface]`

### 3. platform-fundamentals\multi-tenant.md
- **Location:** Line 40-68
- **Issue:** HTML `<br/>` tags in subgraph node labels
- **Severity:** MEDIUM
- **Example:** `TA1[Tenant A<br/>Data]`

### 4. platform-fundamentals\hierarchy-model.md
- **Location:** Line 74-86
- **Issue:** HTML `<br/>` and `<small>` tags (duplicate of #1)
- **Severity:** HIGH

### 5. platform-fundamentals\microservices-architecture.md
- **Location:** Lines 75-110, 157-173
- **Issue:** HTML tags (duplicate of #2)
- **Severity:** HIGH

### 6. getting-started\what-is-evalink-talos.md
- **Location:** Line 40-62
- **Issue:** HTML `<br/>` tags in node labels
- **Severity:** MEDIUM
- **Example:** `Device["📹 Security Device<br/>(Camera/Sensor)"]`

### 7. getting-started\required-ports.md
- **Location:** Line 19-41
- **Issue:** HTML `<br/>` tags in flowchart nodes
- **Severity:** MEDIUM
- **Example:** `Auth["Auth0<br/>(Authentication)"]`

### 8. getting-started\gcxone-talos-interaction.md
- **Location:** Lines 84-99, 194-206, 352-386
- **Issue:** HTML `<br/>` tags in multiple diagrams
- **Severity:** HIGH
- **Example:** Multiple nodes and participants with `<br/>` tags

### 9. getting-started\firewall-configuration.md
- **Location:** Line 88-119
- **Issue:** HTML `<br/>` tags in nodes AND edge labels
- **Severity:** HIGH
- **Example:** `Firewall -->|"Whitelisted IPs<br/>Ports 80/443"|`

---

## Common Issues Identified

### Issue Type 1: HTML `<br/>` in Node Labels (9 files)
**Problem:** Causes text overlap or literal HTML display
**Fix:** Remove `<br/>` tags or use Mermaid's newline syntax

### Issue Type 2: HTML `<small>` in Node Labels (2 files)
**Problem:** Complete rendering failure or garbled text
**Fix:** Remove `<small>` tags entirely

### Issue Type 3: HTML in Sequence Participants (2 files)
**Problem:** Participant names display incorrectly
**Fix:** Use plain text for participant aliases

### Issue Type 4: HTML in Edge Labels (1 file)
**Problem:** Edge labels break or overlap
**Fix:** Use simple text without HTML

---

## Recommended Solutions

### Option 1: Remove HTML Tags (Simplest)
Replace:
```mermaid
A[API Gateway<br/>Standardized Interface]
```

With:
```mermaid
A[API Gateway - Standardized Interface]
```

### Option 2: Use Multiline Strings (Most Accurate)
Replace:
```mermaid
A[API Gateway<br/>Standardized Interface]
```

With:
```mermaid
A["API Gateway
Standardized Interface"]
```

### Option 3: Use Mermaid's BR Tag (Without Slash)
Replace:
```mermaid
A[API Gateway<br/>Standardized Interface]
```

With:
```mermaid
A[API Gateway<br>Standardized Interface]
```

---

## Files Without Issues (11 files)

The following files have correct Mermaid syntax and require no changes:

1. alarm-management\escalation-rules.md
2. device-integration\iot-sensors.md
3. device-integration\alarm-panels.md
4. device-integration\ip-cameras.md
5. alarm-management\operator-training.md
6. admin-guide\device-health-status.md
7. getting-started\what-is-nxgen-gcxone.md
8. getting-started\ip-whitelisting.md
9. getting-started\Talos\talos-site-management.md
10. admin-guide\custom-property-hierarchy.md

---

## Next Steps

1. **Backup:** Create backup of files before editing
2. **Fix:** Apply corrections to all 9 affected files
3. **Test:** Rebuild site and verify diagrams render correctly
4. **Validate:** Check all diagrams in browser
5. **Document:** Update contribution guidelines to prevent future issues

---

**Generated:** 2025-12-28
**Total Issues:** 9 files with HTML tag rendering problems
**Estimated Fix Time:** 15-20 minutes
