import type { ZohoTicket } from '../ZohoTickets/types';

/**
 * Widget types for the Support Workstation dashboard
 */

export type WidgetType = 'tickets' | 'mail' | 'calendar' | 'crm';

export interface WidgetConfig {
  id: WidgetType;
  title: string;
  icon: string;
  isExpanded: boolean;
  isAvailable: boolean;
}

export interface WorkstationProps {
  token: string;
  onLogout: () => void;
  isDark: boolean;
}

export interface WorkstationHeaderProps {
  isDark: boolean;
  onLogout: () => void;
}

export interface WidgetCardProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  isDark: boolean;
  isAvailable: boolean;
  children: React.ReactNode;
  accentColor?: string;
}

export interface TicketsWidgetProps {
  token: string;
  isDark: boolean;
  onTicketSelect: (ticket: ZohoTicket) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export interface PlaceholderWidgetProps {
  title: string;
  icon: React.ReactNode;
  isDark: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  accentColor?: string;
}

/**
 * Default widget configurations
 */
export const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'tickets', title: 'Tickets', icon: 'Headphones', isExpanded: true, isAvailable: true },
  { id: 'mail', title: 'Mail', icon: 'Mail', isExpanded: false, isAvailable: false },
  { id: 'calendar', title: 'Calendar', icon: 'Calendar', isExpanded: false, isAvailable: false },
  { id: 'crm', title: 'CRM', icon: 'Users', isExpanded: false, isAvailable: false },
];

/**
 * Accent colors for widgets (matching NXGEN gold theme)
 */
export const WIDGET_ACCENT_COLORS: Record<WidgetType, string> = {
  tickets: '#E8B058',
  mail: '#3b82f6',
  calendar: '#22c55e',
  crm: '#8b5cf6',
};
