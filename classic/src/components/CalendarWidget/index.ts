// Calendar Widget Components
export { default as CalendarWidget } from './CalendarWidget';
export { default as CalendarFullView } from './CalendarFullView';
export { default as EventModal } from './EventModal';
export { default as EventDetail } from './EventDetail';

// Default export for backward compatibility
export { default } from './CalendarWidget';

// Re-export types
export type {
  Calendar,
  CalendarEvent,
  EventOrganizer,
  EventAttendee,
  EventReminder,
  CalendarListResponse,
  EventsListResponse,
  EventResponse,
  CreateEventInput,
  UpdateEventInput,
  CalendarViewMode,
} from './types';

// Re-export API functions
export {
  listCalendars,
  listEvents,
  listAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getTodayEvents,
  getEventsInRange,
  getNextEvent,
  formatEventTime,
  getCountdownToEvent,
  getEventColor,
} from './calendarApi';
