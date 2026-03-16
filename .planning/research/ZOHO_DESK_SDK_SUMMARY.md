# Research Summary: Zoho Desk JavaScript SDK for Web Applications

**Domain:** Customer Support Help Desk SDK
**Researched:** March 16, 2026
**Overall confidence:** MEDIUM

## Executive Summary

Zoho Desk does **NOT provide a dedicated JavaScript SDK for web applications** (browser-based React/Vue/Angular apps). The available SDKs are primarily designed for:

1. **React Native mobile apps** - `@zohocorp/zohodesk-portal-*` packages
2. **Server-side Node.js** - For backend integrations using OAuth 2.0
3. **ASAP SDKs** - For iOS/Android native mobile apps
4. **Embedded App JS SDK** - For widgets embedded inside Zoho CRM/Desk (not standalone apps)

For web applications that need to integrate with Zoho Desk, developers must use the **REST API directly** with manual OAuth 2.0 implementation or use the **ASAP Help Widget** (a pre-built embeddable widget).

## Key Findings

**Stack:** No official web JS SDK exists; use REST API directly with OAuth 2.0 or ASAP Help Widget
**Architecture:** OAuth 2.0 authorization code flow for agents; JWT-based auth for portal users/customers
**Critical pitfall:** No SDK simplifies token management for web apps - you must implement OAuth flow manually

## Implications for Roadmap

Based on research, suggested phase structure:

1. **Phase 1: Core API Integration** - Manual OAuth 2.0 implementation
   - Addresses: Authentication, token storage, refresh logic
   - Avoids: Pitfall of assuming SDK handles auth automatically

2. **Phase 2: Ticket Operations** - REST API wrappers
   - Addresses: CRUD operations for tickets
   - Uses: Direct API calls with proper auth headers

3. **Phase 3: Portal User Features** - JWT authentication integration
   - Addresses: Customer portal login flow
   - Requires: JWT token generation from backend

**Phase ordering rationale:**
- OAuth must be implemented first before any API calls
- Token management is foundational for all operations
- Portal user auth requires different flow (JWT) vs agent auth (OAuth)

**Research flags for phases:**
- Phase 1: Needs deeper research on OAuth token refresh implementation patterns
- Phase 2: Standard REST patterns, unlikely to need research
- Phase 3: JWT-based portal authentication needs more investigation

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| SDK Availability | HIGH | Confirmed no web JS SDK exists from official sources |
| OAuth Flow | MEDIUM | Based on Zoho CRM SDK patterns, assumed similar for Desk |
| Portal User Auth | LOW | Found JWT method in React Native SDK but web docs unavailable |
| Token Management | LOW | Must be implemented manually, no SDK assistance |
| Ticket Operations | MEDIUM | API documented in OpenAPI spec |

## Gaps to Address

- **No official web JS SDK documentation** - Zoho does not publish web SDK docs
- **Portal user JWT authentication** - How to generate JWT tokens from backend
- **Token refresh implementation** - Best practices for web apps
- **React-specific integration** - No official React hooks/components available

## Available SDKs Summary

| SDK | Platform | Use Case | Auth Method |
|-----|----------|----------|-------------|
| `@zohocorp/zohodesk-portal-core` | React Native | Mobile portal app | JWT Token |
| `@zohocorp/zohodesk-portal-configuration` | React Native | SDK configuration | - |
| `@zohocorp/zohodesk-portal-ticket` | React Native | Ticket operations | - |
| `@zohocorp/zohodesk-portal-apikit` | React Native | Core API wrapper | JWT Token |
| ASAP SDK | iOS/Android | Native mobile apps | JWT Token |
| Embedded App JS SDK | Browser (in Zoho) | Widgets in Zoho apps | Context-provided |
| **NONE** | Browser (standalone) | Web apps | **Must implement OAuth** |

## Sources

- GitHub: `zoho/react-native-zohodesk-portal-sdk` - Official React Native SDK
- GitHub: `zoho/embeddedApp-js-sdk` - For Zoho-embedded widgets only
- GitHub: `zoho/zohodesk-oas` - OpenAPI specification for Zoho Desk API
- Zoho Developer: `developer.zoho.com` - API overview
- Zoho CRM SDK docs: `www.zoho.com/crm/developer/docs/sdk/server-side/nodejs-sdk.html` - OAuth patterns

---

*Research completed: 2026-03-16*
*Ready for roadmap: yes (with caveats)*
