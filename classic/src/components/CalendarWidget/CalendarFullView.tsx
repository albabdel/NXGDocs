import React, { useEffect, useState, useMemo } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader,
  AlertCircle,
} from 'lucide-react';
import {
  getEventsInRange,
  listCalendars,
} from './calendarApi';
import type { CalendarEvent, Calendar, CalendarViewMode } from './types';
import EventModal from './EventModal';
import EventDetail from './EventDetail';

interface CalendarFullViewProps {
  token: string;
  isDark: boolean;
  onClose: () => void;
}

const CALENDAR_ACCENT = '#22c55e';

export default function CalendarFullView({
  token,
  isDark,
  onClose,
}: CalendarFullViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Calculate date range based on view mode
  const dateRange = useMemo(() => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    if (viewMode === 'month') {
      start.setDate(1);
      start.setDate(start.getDate() - start.getDay()); // Start from Sunday
      end.setMonth(end.getMonth() + 1, 0); // Last day of month
      end.setDate(end.getDate() + (6 - end.getDay())); // End on Saturday
    } else if (viewMode === 'week') {
      start.setDate(start.getDate() - start.getDay()); // Sunday
      end.setDate(start.getDate() + 6); // Saturday
    } else {
      // Day view
      end.setDate(end.getDate() + 1);
    }

    return { start, end };
  }, [currentDate, viewMode]);

  // Fetch events and calendars
  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      listCalendars(token),
      getEventsInRange(token, dateRange.start, dateRange.end),
    ])
      .then(([calResponse, eventsList]) => {
        setCalendars(calResponse.data ?? []);
        setEvents(eventsList ?? []);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load calendar');
      })
      .finally(() => setLoading(false));
  }, [token, dateRange.start, dateRange.end]);

  // Generate calendar grid for month/week view
  const calendarDays = useMemo(() => {
    const days: Date[] = [];
    const current = new Date(dateRange.start);

    while (current <= dateRange.end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [dateRange]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();

    events.forEach((event) => {
      const dateKey = new Date(event.start).toDateString();
      const existing = map.get(dateKey) ?? [];
      map.set(dateKey, [...existing, event]);
    });

    return map;
  }, [events]);

  // Navigation handlers
  const navigatePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Handle day click
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setShowEventModal(true);
  };

  // Handle event click
  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
  };

  // Handle event creation/update
  const handleEventSaved = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
    setSelectedDate(null);
    // Refresh events
    getEventsInRange(token, dateRange.start, dateRange.end)
      .then(setEvents)
      .catch(console.error);
  };

  // Format month/year header
  const formatHeader = () => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  // Get event color
  const getEventColor = (event: CalendarEvent): string => {
    const calendar = calendars.find((c) => c.uid === event.calendarUid);
    return calendar?.color ?? CALENDAR_ACCENT;
  };

  // Check if date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is in current month (for month view styling)
  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth();
  };

  const overlayBg = 'rgba(0,0,0,0.7)';
  const modalBg = isDark ? '#0f0f1a' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(34,197,94,0.2)';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: overlayBg, backdropFilter: 'blur(4px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ background: modalBg, border: `1px solid ${borderColor}` }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{
            background: isDark ? `${CALENDAR_ACCENT}08` : `${CALENDAR_ACCENT}05`,
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold" style={{ color: CALENDAR_ACCENT }}>
              Calendar
            </h2>
            {/* View Mode Toggle */}
            <div
              className="flex items-center rounded-lg p-1"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              }}
            >
              {(['month', 'week', 'day'] as CalendarViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className="px-3 py-1 rounded-md text-xs font-medium transition-all"
                  style={{
                    background: viewMode === mode ? CALENDAR_ACCENT : 'transparent',
                    color: viewMode === mode ? '#000' : 'var(--ifm-color-content-secondary)',
                    cursor: 'pointer',
                    border: 'none',
                  }}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all hover:opacity-80"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ifm-color-content-secondary)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div
          className="flex items-center justify-between px-6 py-3 shrink-0"
          style={{
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={navigatePrev}
              className="p-2 rounded-lg transition-all hover:opacity-80"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <ChevronLeft className="w-4 h-4" style={{ color: 'var(--ifm-color-content)' }} />
            </button>
            <h3 className="text-base font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
              {formatHeader()}
            </h3>
            <button
              onClick={navigateNext}
              className="p-2 rounded-lg transition-all hover:opacity-80"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <ChevronRight className="w-4 h-4" style={{ color: 'var(--ifm-color-content)' }} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
              style={{
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                color: 'var(--ifm-color-content)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Today
            </button>
            <button
              onClick={() => {
                setSelectedDate(new Date());
                setShowEventModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
              style={{
                background: CALENDAR_ACCENT,
                color: '#000',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              New Event
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin" style={{ color: CALENDAR_ACCENT }} />
            </div>
          ) : error ? (
            <div
              className="flex items-center justify-center gap-2 py-12"
              style={{ color: '#ef4444' }}
            >
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          ) : viewMode === 'day' ? (
            // Day View
            <DayView
              date={currentDate}
              events={events.filter(
                (e) => new Date(e.start).toDateString() === currentDate.toDateString()
              )}
              calendars={calendars}
              isDark={isDark}
              onEventClick={handleEventClick}
              onHourClick={(hour) => {
                const date = new Date(currentDate);
                date.setHours(hour, 0, 0, 0);
                setSelectedDate(date);
                setShowEventModal(true);
              }}
            />
          ) : (
            // Month/Week View
            <>
              {/* Day Headers */}
              <div
                className="grid gap-1 mb-2"
                style={{
                  gridTemplateColumns: `repeat(${viewMode === 'week' ? 7 : 7}, minmax(0, 1fr))`,
                }}
              >
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-semibold py-2"
                    style={{ color: 'var(--ifm-color-content-secondary)' }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${viewMode === 'week' ? 7 : 7}, minmax(0, 1fr))`,
                }}
              >
                {calendarDays.map((day) => {
                  const dayEvents = eventsByDate.get(day.toDateString()) ?? [];
                  const showDay = viewMode === 'month' || day >= dateRange.start;

                  if (!showDay && viewMode === 'week') return null;

                  return (
                    <div
                      key={day.toISOString()}
                      className="min-h-[80px] rounded-lg p-1.5 transition-all hover:opacity-80"
                      style={{
                        background: isToday(day)
                          ? `${CALENDAR_ACCENT}15`
                          : isDark
                            ? 'rgba(255,255,255,0.02)'
                            : 'rgba(0,0,0,0.02)',
                        border: isToday(day)
                          ? `1px solid ${CALENDAR_ACCENT}40`
                          : `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                        cursor: 'pointer',
                        opacity: viewMode === 'month' && !isCurrentMonth(day) ? 0.5 : 1,
                      }}
                      onClick={() => handleDayClick(day)}
                    >
                      <div
                        className="text-xs font-medium mb-1"
                        style={{
                          color: isToday(day)
                            ? CALENDAR_ACCENT
                            : 'var(--ifm-color-content)',
                        }}
                      >
                        {day.getDate()}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className="text-xs px-1.5 py-0.5 rounded truncate"
                            style={{
                              background: `${getEventColor(event)}20`,
                              color: getEventColor(event),
                              border: `1px solid ${getEventColor(event)}30`,
                            }}
                            onClick={(e) => handleEventClick(event, e)}
                          >
                            {event.isAllDay ? '• ' : ''}
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div
                            className="text-xs px-1.5"
                            style={{ color: 'var(--ifm-color-content-secondary)' }}
                          >
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          token={token}
          isDark={isDark}
          date={selectedDate ?? new Date()}
          event={null}
          onClose={() => {
            setShowEventModal(false);
            setSelectedDate(null);
          }}
          onSaved={handleEventSaved}
        />
      )}

      {/* Event Detail */}
      {selectedEvent && (
        <EventDetail
          token={token}
          isDark={isDark}
          event={selectedEvent}
          calendars={calendars}
          onClose={() => setSelectedEvent(null)}
          onUpdated={handleEventSaved}
          onDeleted={handleEventSaved}
        />
      )}
    </div>
  );
}

// Day View Component
function DayView({
  date,
  events,
  calendars,
  isDark,
  onEventClick,
  onHourClick,
}: {
  date: Date;
  events: CalendarEvent[];
  calendars: Calendar[];
  isDark: boolean;
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
  onHourClick: (hour: number) => void;
}) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventColor = (event: CalendarEvent): string => {
    const calendar = calendars.find((c) => c.uid === event.calendarUid);
    return calendar?.color ?? CALENDAR_ACCENT;
  };

  const getEventsForHour = (hour: number): CalendarEvent[] => {
    return events.filter((event) => {
      if (event.isAllDay) return false;
      const startHour = new Date(event.start).getHours();
      return startHour === hour;
    });
  };

  const allDayEvents = events.filter((e) => e.isAllDay);

  return (
    <div className="space-y-2">
      {/* All-day events */}
      {allDayEvents.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold mb-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            All Day
          </h4>
          <div className="flex flex-wrap gap-2">
            {allDayEvents.map((event) => (
              <div
                key={event.id}
                className="px-3 py-1.5 rounded-lg text-sm"
                style={{
                  background: `${getEventColor(event)}15`,
                  color: getEventColor(event),
                  border: `1px solid ${getEventColor(event)}30`,
                  cursor: 'pointer',
                }}
                onClick={(e) => onEventClick(event, e)}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hour Grid */}
      <div className="space-y-0.5">
        {hours.map((hour) => {
          const hourEvents = getEventsForHour(hour);
          const hourLabel = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;

          return (
            <div
              key={hour}
              className="flex items-stretch gap-3 min-h-[48px]"
              onClick={() => onHourClick(hour)}
              style={{ cursor: 'pointer' }}
            >
              {/* Time Label */}
              <div
                className="w-16 text-xs font-medium py-1 shrink-0"
                style={{ color: 'var(--ifm-color-content-secondary)' }}
              >
                {hourLabel}
              </div>

              {/* Events Area */}
              <div
                className="flex-1 rounded-lg px-2 py-1 transition-all hover:opacity-80"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                }}
              >
                {hourEvents.map((event) => (
                  <div
                    key={event.id}
                    className="text-sm px-2 py-1 rounded mb-0.5"
                    style={{
                      background: `${getEventColor(event)}15`,
                      color: getEventColor(event),
                    }}
                    onClick={(e) => onEventClick(event, e)}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
