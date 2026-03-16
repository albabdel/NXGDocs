// CRM Panel Component Exports
export { default as CRMPanel } from './CRMPanel';
export { default as ContactSearch } from './ContactSearch';
export { default as ContactCard } from './ContactCard';
export { default as AccountInfo } from './AccountInfo';

// API Functions
export {
  searchContacts,
  getContact,
  getContactByEmail,
  getAccount,
  getContactTickets,
  getAccountOpenTicketsCount,
} from './crmApi';

// Types
export type {
  CRMAddress,
  CRMContact,
  CRMAccount,
  CRMContactSearchResult,
  CRMContactListResponse,
  CRMContactSearchResponse,
  CRMAccountResponse,
  CRMTicketSummary,
  CRMTicketsResponse,
} from './types';
