import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Users,
  Edit2,
  Trash2,
  Loader,
  AlertCircle,
  Check,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { deleteEvent, formatEventTime } from './calendarApi';
import type { CalendarEvent, Calendar as CalendarType } from './types';
import EventModal from './EventModal';

interface EventDetailProps {
  token: string;
  isDark: boolean;
  event: CalendarEvent;
  calendars: CalendarType[];
  onClose: () => void;
  onUpdated: () => void;
  onDeleted: () => void;
}

const CALENDAR_ACCENT = '#22c55e';

export default function EventDetail({
  token,
  isDark,
  event,
  calendars,
  onClose,
  onUpdated,
  onDeleted,
}: EventDetailProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calendar = calendars.find((c) => c.uid === event.calendarUid);
  const eventColor = calendar?.color ?? CALENDAR_ACCENT;

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    setDeleting(true);
    setError(null);

    try {
      await deleteEvent(token, event.calendarUid, event.id);
      onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      setDeleting(false);
    }
  };

  const getAttendeeStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Check className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />;
      case 'declined':
        return <XCircle className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />;
      case 'tentative':
        return <HelpCircle className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />;
      default:
        return <HelpCircle className="w-3.5 h-3.5" style={{ color: 'var(--ifm-color-content-secondary)' }} />;
    }
  };

  const getAttendeeStatusLabel = (status: string): string => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'declined':
        return 'Declined';
      case 'tentative':
        return 'Tentative';
      default:
        return 'Pending';
    }
  };

  const overlayBg = 'rgba(0,0,0,0.6)';
  const modalBg = isDark ? '#1a1a2e' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(34,197,94,0.2)';

  return (
    <>
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        style={{ background: overlayBg, backdropFilter: 'blur(4px)' }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: modalBg, border: `1px solid ${borderColor}` }}
        >
          {/* Header */}
          <div
            className="px-6 py-4"
            style={{
              background: isDark ? `${eventColor}08` : `${eventColor}05`,
              borderBottom: `1px solid ${borderColor}`,
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--ifm-color-content)' }}>
                  {event.title}
                </h2>
                {calendar && (
                  <div
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs"
                    style={{
                      background: `${eventColor}15`,
                      color: eventColor,
                      border: `1px solid ${eventColor}30`,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: eventColor }}
                    />
                    {calendar.name}
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg transition-all hover:opacity-80 shrink-0"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ifm-color-content-secondary)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5 space-y-4">
            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: `${eventColor}15`,
                  border: `1px solid ${eventColor}30`,
                }}
              >
                <Calendar className="w-4 h-4" style={{ color: eventColor }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                  {formatDate(event.start)}
                </p>
                <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  {event.isAllDay ? 'All Day' : formatEventTime(event)}
                </p>
              </div>
            </div>

            {/* Location */}
            {event.location && (
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: `${eventColor}15`,
                    border: `1px solid ${eventColor}30`,
                  }}
                >
                  <MapPin className="w-4 h-4" style={{ color: eventColor }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                    {event.location}
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            {event.description && (
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: `${eventColor}15`,
                    border: `1px solid ${eventColor}30`,
                  }}
                >
                  <FileText className="w-4 h-4" style={{ color: eventColor }} />
                </div>
                <div>
                  <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--ifm-color-content)' }}>
                    {event.description}
                  </p>
                </div>
              </div>
            )}

            {/* Attendees */}
            {event.attendees && event.attendees.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4" style={{ color: eventColor }} />
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                    Attendees ({event.attendees.length})
                  </span>
                </div>
                <div className="space-y-1.5 ml-6">
                  {event.attendees.map((attendee) => (
                    <div
                      key={attendee.id || attendee.email}
                      className="flex items-center justify-between p-2 rounded-lg"
                      style={{
                        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                          style={{
                            background: `${eventColor}20`,
                            color: eventColor,
                          }}
                        >
                          {(attendee.name || attendee.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                            {attendee.name || attendee.email}
                          </p>
                          {attendee.name && (
                            <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                              {attendee.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {getAttendeeStatusIcon(attendee.status)}
                        <span
                          className="text-xs"
                          style={{ color: 'var(--ifm-color-content-secondary)' }}
                        >
                          {getAttendeeStatusLabel(attendee.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Organizer */}
            {event.organizer && (
              <div className="pt-2 border-t" style={{ borderColor: borderColor }}>
                <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  Organized by{' '}
                  <span style={{ color: 'var(--ifm-color-content)' }}>
                    {event.organizer.name || event.organizer.email}
                  </span>
                </p>
              </div>
            )}

            {error && (
              <p
                className="text-xs rounded-lg px-3 py-2"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  color: '#ef4444',
                  border: '1px solid rgba(239,68,68,0.2)',
                }}
              >
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  color: '#ef4444',
                  border: '1px solid rgba(239,68,68,0.2)',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                }}
              >
                {deleting ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </button>
              <button
                onClick={() => setShowEditModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{
                  background: eventColor,
                  color: '#000',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EventModal
          token={token}
          isDark={isDark}
          date={new Date(event.start)}
          event={event}
          onClose={() => setShowEditModal(false)}
          onSaved={() => {
            setShowEditModal(false);
            onUpdated();
          }}
        />
      )}
    </>
  );
}
