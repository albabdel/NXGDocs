export { default as MailWidget } from './MailWidget';
export { default as MailFullView } from './MailFullView';
export { default as MailList } from './MailList';
export { default as MailThread } from './MailThread';
export { default as MailCompose } from './MailCompose';

// Re-export types and API functions
export * from './types';
export * from './mailApi';

// Re-export props type for consumers embedding MailWidget
export type { MailWidgetProps } from './MailWidget';
