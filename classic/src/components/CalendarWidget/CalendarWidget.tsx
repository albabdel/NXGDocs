import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Loader,
  AlertCircle,
} from 'lucide-react';
import {
  getTodayEvents,
  getNextEvent,
  formatEventTime,
  getCountdownToEvent,
} from './calendarApi';
import type { CalendarEvent } from './types';
import CalendarFullView from './CalendarFullView';

interface CalendarWidgetProps {
  token: string;
  isDark: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  /**
   * When true (default), renders the full widget with its own header and card shell.
   * When false, renders just the widget content for embedding in a parent WidgetCard.
   */
  showHeader?: boolean;
}

const CALENDAR_ACCENT = '#22c55e';

export default function CalendarWidget({
  token,
  isDark,
  isExpanded,
  onToggle,
  showHeader = true,
}: CalendarWidgetProps) {
  const [todayEvents, setTodayEvents] = useState<CalendarEvent[]>([]);
  const [nextEvent, setNextEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullView, setShowFullView] = useState(false);

  // Fetch next event on mount for embedded mode countdown display
  useEffect(() => {
    if (!token) return;

    // For embedded mode, always fetch next event for countdown
    // For self-contained mode, only fetch when expanded
    if (!showHeader && !isExpanded) {
      getNextEvent(token)
        .then((next) => setNextEvent(next))
        .catch(() => {/* silently fail for countdown preview */});
      return;
    }

    if (!isExpanded) return;

    setLoading(true);
    setError(null);

    Promise.all([getTodayEvents(token), getNextEvent(token)])
      .then(([events, next]) => {
        setTodayEvents(events);
        setNextEvent(next);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load calendar');
      })
      .finally(() => setLoading(false));
  }, [isExpanded, token, showHeader]);

  const cardBorder = {
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(34,197,94,0.15)',
  };

  // Render widget content (used in both modes)
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader className="w-6 h-6 animate-spin" style={{ color: CALENDAR_ACCENT }} />
        </div>
      );
    }

    if (error) {
      return (
        <div
          className="flex items-center gap-2 p-3 rounded-lg"
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          <AlertCircle className="w-4 h-4" style={{ color: '#ef4444' }} />
          <span className="text-xs" style={{ color: '#ef4444' }}>
            {error}
          </span>
        </div>
      );
    }

    return (
      <>
        {/* Next Event Countdown */}
        {nextEvent && (
          <div
            className="p-3 rounded-lg mb-4"
            style={{
              background: `${CALENDAR_ACCENT}10`,
              border: `1px solid ${CALENDAR_ACCENT}25`,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-3.5 h-3.5" style={{ color: CALENDAR_ACCENT }} />
              <span className="text-xs font-medium" style={{ color: CALENDAR_ACCENT }}>
                Next Event: {getCountdownToEvent(nextEvent)}
              </span>
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
              {nextEvent.title}
            </p>
            <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              {formatEventTime(nextEvent)}
            </p>
          </div>
        )}

        {/* Today's Events List */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            Today's Events
          </h4>
          {todayEvents.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              No events scheduled for today
            </p>
          ) : (
            <div className="space-y-2">
              {todayEvents.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-2 rounded-lg transition-all hover:opacity-80"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setShowFullView(true)}
                >
                  {/* Time Column */}
                  <div className="text-xs font-medium" style={{ color: CALENDAR_ACCENT, minWidth: '70px' }}>
                    {formatEventTime(event)}
                  </div>
                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--ifm-color-content)' }}>
                      {event.title}
                    </p>
                    {event.location && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" style={{ color: 'var(--ifm-color-content-secondary)' }} />
                        <span className="text-xs truncate" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                          {event.location}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {todayEvents.length > 5 && (
                <p className="text-xs text-center pt-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  +{todayEvents.length - 5} more events
                </p>
              )}
            </div>
          )}
        </div>

        {/* Open Calendar Button */}
        <button
          onClick={() => setShowFullView(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{
            background: CALENDAR_ACCENT,
            color: '#000',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Calendar className="w-4 h-4" />
          Open Calendar
        </button>
      </>
    );
  };

  // Render collapsed preview for embedded mode
  const renderCollapsedPreview = () => {
    if (!nextEvent) return null;
    return (
      <span className="text-xs" style={{ color: CALENDAR_ACCENT }}>
        {getCountdownToEvent(nextEvent)}
      </span>
    );
  };

  // Embedded mode: just render content without card shell
  if (!showHeader) {
    return (
      <>
        {isExpanded ? (
          <div className="p-4">
            {renderContent()}
          </div>
        ) : (
          renderCollapsedPreview()
        )}

        {/* Full Calendar View Modal */}
        {showFullView && (
          <CalendarFullView
            token={token}
            isDark={isDark}
            onClose={() => setShowFullView(false)}
          />
        )}
      </>
    );
  }

  // Self-contained mode: full card with header
  return (
    <>
      <div
        className="rounded-xl border overflow-hidden transition-all duration-200"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
          ...cardBorder,
        }}
      >
        {/* Widget Header */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-4 transition-all hover:opacity-80"
          style={{
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            cursor: 'pointer',
            border: 'none',
            borderBottom: isExpanded
              ? `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`
              : 'none',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: `${CALENDAR_ACCENT}15`,
                border: `1px solid ${CALENDAR_ACCENT}30`,
              }}
            >
              <Calendar className="w-4 h-4" style={{ color: CALENDAR_ACCENT }} />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
                Calendar
              </h3>
              {nextEvent && !isExpanded && (
                <span className="text-xs" style={{ color: CALENDAR_ACCENT }}>
                  {getCountdownToEvent(nextEvent)}
                </span>
              )}
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            style={{ color: 'var(--ifm-color-content-secondary)' }}
          />
        </button>

        {/* Widget Content */}
        {isExpanded && (
          <div className="p-4">
            {renderContent()}
          </div>
        )}
      </div>

      {/* Full Calendar View Modal */}
      {showFullView && (
        <CalendarFullView
          token={token}
          isDark={isDark}
          onClose={() => setShowFullView(false)}
        />
      )}
    </>
  );
}
