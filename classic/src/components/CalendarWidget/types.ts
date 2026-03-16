/**
 * Calendar types for Zoho Calendar integration
 */

export interface Calendar {
  uid: string;
  name: string;
  color: string;
  isDefault: boolean;
  isOwned: boolean;
  visibility: 'public' | 'private';
}

export interface CalendarEvent {
  id: string;
  uid: string;
  title: string;
  description: string;
  location: string;
  start: string; // ISO datetime string
  end: string; // ISO datetime string
  isAllDay: boolean;
  isReminderSet: boolean;
  reminderMinutes: number | null;
  isRecurring: boolean;
  recurrenceRule: string | null;
  status: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';
  visibility: 'public' | 'private';
  organizer: EventOrganizer | null;
  attendees: EventAttendee[];
  reminders: EventReminder[];
  calendarUid: string;
  createdTime: string;
  modifiedTime: string;
  webUrl?: string;
}

export interface EventOrganizer {
  name: string;
  email: string;
}

export interface EventAttendee {
  id: string;
  name: string;
  email: string;
  status: 'accepted' | 'declined' | 'tentative' | 'needsAction';
  isOrganizer: boolean;
}

export interface EventReminder {
  method: 'popup' | 'email';
  minutes: number;
}

export interface CalendarListResponse {
  data: Calendar[];
}

export interface EventsListResponse {
  data: CalendarEvent[];
}

export interface EventResponse {
  data: CalendarEvent;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  location?: string;
  start: string;
  end: string;
  isAllDay?: boolean;
  calendarUid?: string;
  attendees?: { email: string; name?: string }[];
  reminders?: { method: 'popup' | 'email'; minutes: number }[];
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  location?: string;
  start?: string;
  end?: string;
  isAllDay?: boolean;
  status?: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';
  attendees?: { email: string; name?: string }[];
}

export type CalendarViewMode = 'month' | 'week' | 'day';
