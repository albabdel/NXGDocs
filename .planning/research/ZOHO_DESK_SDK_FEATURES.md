# Feature Landscape: Zoho Desk SDKs

**Domain:** Customer Support Help Desk SDK
**Researched:** March 16, 2026

## Table Stakes

Features expected in any help desk SDK. Missing = product feels incomplete.

| Feature | Available In | Why Expected | Complexity | Notes |
|---------|--------------|--------------|------------|-------|
| User Authentication | React Native SDK | Required for any integration | Medium | JWT for portal users, OAuth for agents |
| Token Management | Manual (web) | Required for API access | High | Must implement manually for web |
| Ticket CRUD | REST API | Core functionality | Medium | All operations via direct API calls |
| Contact Management | REST API | Associated with tickets | Low | API endpoints available |
| Knowledge Base | React Native SDK | Self-service support | Medium | KB SDK only for mobile |

## Differentiators

Features that set the SDK apart. Not expected, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| ASAP Help Widget | Pre-built embeddable widget | Low | Drop-in solution for basic needs |
| JWT Portal Auth | Seamless customer login | High | Requires backend token generation |
| React Native SDK | Full mobile portal app | Medium | Complete solution for mobile |
| OpenAPI Spec | Type-safe API clients | Low | Generate clients from spec |

## Anti-Features

Features to explicitly NOT expect.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Browser JS SDK | Zoho doesn't provide one | Use REST API directly |
| Token Auto-Refresh | No SDK to handle it | Implement refresh logic manually |
| React Hooks | No official hooks | Create custom hooks wrapping API |
| Server-Side SDK | Node SDK archived | Use REST API directly |

## SDK Capabilities Detail

### React Native SDK Capabilities (from source code analysis)

#### Initialization & Authentication
```javascript
// Initialize SDK
ZohoDeskPortalSDK.initialise(orgId, appId, dc);

// Check if user is signed in
ZohoDeskPortalSDK.isUserSignedIn(callback);

// Login with JWT token (portal users)
ZohoDeskPortalSDK.loginWithJWTToken(jwtToken, successCallback, errorCallback);

// Logout
ZohoDeskPortalSDK.logout(successCallback, errorCallback);
```

#### Configuration
```javascript
ZohoDeskPortalConfiguration.setConfiguration({
  disableSidemenu: false,
  disableLanguageChooser: false,
  disableKB: false,
  disableCommunity: false,
  disableSubmitTicket: false,
  disableMyTicket: false,
  // Security options
  disableDownloadAttachment: false,
  disableUploadAttachment: false,
  disableScreenShot: false,
  disableCopyPaste: false
});

ZohoDeskPortalConfiguration.setSDKLanguage('en');
ZohoDeskPortalConfiguration.setTheme(1); // Theme value
```

#### Ticket Operations
```javascript
// Get departments
ZohoDeskPortalSDK.getDepartments(successCallback, errorCallback);

// Get layouts for department
ZohoDeskPortalSDK.getLayouts(params, successCallback, errorCallback);

// Get ticket fields
ZohoDeskPortalSDK.getTicketFields(params, featureFlags, successCallback, errorCallback);

// Create ticket
ZohoDeskPortalSDK.createTicket(params, successCallback, errorCallback);

// Add attachments
ZohoDeskPortalSDK.addAttachments(fileName, fileData, successCallback, errorCallback);

// Update user information
ZohoDeskPortalSDK.updateUserInformation(params, successCallback, errorCallback);

// Show ticket list UI
ZohoDeskPortalTicket.show();

// Show specific ticket detail
ZohoDeskPortalTicket.showTicketDetail(ticketId);

// Configure ticket UI
ZohoDeskPortalTicket.setConfiguration({
  isReplyAllowed: true,
  isCommentAllowed: true,
  isTicketUpdateAllowed: true,
  isAddTicketAllowed: true
});
```

#### Submit Ticket
```javascript
// Pre-fill ticket fields
ZohoDeskPortalSubmitTicket.preFillTicketFields([{
  departmentId: '123',
  layoutId: '456',
  customizedTicketFields: [
    { fieldName: 'subject', value: 'Issue title', isEditable: true },
    { fieldName: 'description', value: 'Details...', isEditable: true }
  ]
}]);

// Get callback on ticket creation
ZohoDeskPortalSubmitTicket.getCallbackOnCreate(successCallback, errorCallback);
```

### REST API Capabilities (from OpenAPI spec)

#### Ticket Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tickets` | List all tickets |
| POST | `/api/v1/tickets` | Create a ticket |
| GET | `/api/v1/tickets/{ticketId}` | Get a ticket |
| PATCH | `/api/v1/tickets/{ticketId}` | Update a ticket |
| POST | `/api/v1/tickets/moveToTrash` | Move tickets to trash |
| POST | `/api/v1/tickets/{ticketId}/merge` | Merge two tickets |
| GET | `/api/v1/tickets/{ticketId}/resolution` | Get ticket resolution |
| PATCH | `/api/v1/tickets/{ticketId}/resolution` | Update resolution |
| GET | `/api/v1/tickets/{ticketId}/metrics` | Get ticket metrics |
| POST | `/api/v1/tickets/{ticketId}/markAsRead` | Mark as read |
| POST | `/api/v1/tickets/{ticketId}/markAsUnRead` | Mark as unread |

#### Contact Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/contacts/{contactId}/tickets` | List tickets by contact |

## Feature Dependencies

```
Authentication (OAuth/JWT) → Token Management → API Calls → Ticket Operations
                                    ↓
                              Token Refresh → Retry Failed Requests
```

## MVP Recommendation

For web applications, prioritize:

1. **OAuth 2.0 implementation** - Required before any API access
2. **Token storage and refresh** - Critical for reliability
3. **Ticket list and create** - Core functionality

Defer:
- **Portal user JWT**: Requires backend token generation
- **Advanced ticket operations**: Merge, split, metrics

## Sources

- React Native SDK source: `github.com/zoho/react-native-zohodesk-portal-sdk`
- OpenAPI spec: `github.com/zoho/zohodesk-oas/v1.0/Ticket.json`
- Zoho Desk API docs: `desk.zoho.com/DeskAPIDocument`
