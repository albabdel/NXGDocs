import React, { useState, useEffect } from 'react';
import {
  X,
  Loader,
  Save,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Users,
  Plus,
  Trash2,
} from 'lucide-react';
import { createEvent, updateEvent } from './calendarApi';
import type { CalendarEvent } from './types';

interface EventModalProps {
  token: string;
  isDark: boolean;
  date: Date;
  event: CalendarEvent | null; // null for create, existing for edit
  onClose: () => void;
  onSaved: () => void;
}

const CALENDAR_ACCENT = '#22c55e';

export default function EventModal({
  token,
  isDark,
  date,
  event,
  onClose,
  onSaved,
}: EventModalProps) {
  const isEditing = event !== null;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState(event?.title ?? '');
  const [description, setDescription] = useState(event?.description ?? '');
  const [location, setLocation] = useState(event?.location ?? '');
  const [isAllDay, setIsAllDay] = useState(event?.isAllDay ?? false);

  // Initialize dates
  const initialStart = event
    ? new Date(event.start)
    : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0);
  const initialEnd = event
    ? new Date(event.end)
    : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 10, 0);

  const [startDate, setStartDate] = useState(formatDateForInput(initialStart));
  const [startTime, setStartTime] = useState(formatTimeForInput(initialStart));
  const [endDate, setEndDate] = useState(formatDateForInput(initialEnd));
  const [endTime, setEndTime] = useState(formatTimeForInput(initialEnd));

  // Attendees
  const [attendees, setAttendees] = useState<string[]>(() => {
    if (event?.attendees) {
      return event.attendees.map((a) => a.email);
    }
    return [];
  });
  const [newAttendee, setNewAttendee] = useState('');

  // Update time when all-day toggle changes
  useEffect(() => {
    if (isAllDay) {
      // For all-day, set start to midnight
      setStartTime('00:00');
      setEndTime('23:59');
    }
  }, [isAllDay]);

  const addAttendee = () => {
    const email = newAttendee.trim().toLowerCase();
    if (email && !attendees.includes(email) && isValidEmail(email)) {
      setAttendees([...attendees, email]);
      setNewAttendee('');
    }
  };

  const removeAttendee = (email: string) => {
    setAttendees(attendees.filter((a) => a !== email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const startDateTime = isAllDay
        ? new Date(`${startDate}T00:00:00`).toISOString()
        : new Date(`${startDate}T${startTime}`).toISOString();
      const endDateTime = isAllDay
        ? new Date(`${endDate}T23:59:59`).toISOString()
        : new Date(`${endDate}T${endTime}`).toISOString();

      if (isEditing && event) {
        await updateEvent(token, event.calendarUid, event.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          location: location.trim() || undefined,
          start: startDateTime,
          end: endDateTime,
          isAllDay,
          attendees: attendees.map((email) => ({ email })),
        });
      } else {
        await createEvent(token, {
          title: title.trim(),
          description: description.trim() || undefined,
          location: location.trim() || undefined,
          start: startDateTime,
          end: endDateTime,
          isAllDay,
          attendees: attendees.map((email) => ({ email })),
        });
      }

      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  const overlayBg = 'rgba(0,0,0,0.6)';
  const modalBg = isDark ? '#1a1a2e' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(34,197,94,0.2)';

  const inputStyle: React.CSSProperties = {
    background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.9)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
    borderRadius: '0.5rem',
    color: 'var(--ifm-color-content)',
    fontSize: '0.875rem',
    padding: '0.5rem 0.75rem',
    outline: 'none',
    width: '100%',
  };

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: 500,
    marginBottom: '0.375rem',
    color: 'var(--ifm-color-content-secondary)',
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: overlayBg, backdropFilter: 'blur(4px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: modalBg, border: `1px solid ${borderColor}` }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            background: isDark ? `${CALENDAR_ACCENT}08` : `${CALENDAR_ACCENT}05`,
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <h2 className="text-base font-bold" style={{ color: CALENDAR_ACCENT }}>
            {isEditing ? 'Edit Event' : 'Create Event'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-all hover:opacity-80"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ifm-color-content-secondary)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 130px)' }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>
              <Calendar className="w-3.5 h-3.5" style={{ color: CALENDAR_ACCENT }} />
              Title <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              required
              style={inputStyle}
            />
          </div>

          {/* All-day Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAllDay(!isAllDay)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: isAllDay ? CALENDAR_ACCENT : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                color: isAllDay ? '#000' : 'var(--ifm-color-content)',
                border: `1px solid ${isAllDay ? CALENDAR_ACCENT : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                cursor: 'pointer',
              }}
            >
              <Clock className="w-3.5 h-3.5" />
              All-day Event
            </button>
          </div>

          {/* Date/Time Pickers */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start */}
            <div>
              <label style={labelStyle}>
                Start {isAllDay ? 'Date' : 'Date & Time'}
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={inputStyle}
                />
                {!isAllDay && (
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    style={inputStyle}
                  />
                )}
              </div>
            </div>

            {/* End */}
            <div>
              <label style={labelStyle}>
                End {isAllDay ? 'Date' : 'Date & Time'}
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={inputStyle}
                />
                {!isAllDay && (
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    style={inputStyle}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label style={labelStyle}>
              <MapPin className="w-3.5 h-3.5" style={{ color: CALENDAR_ACCENT }} />
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location"
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>
              <FileText className="w-3.5 h-3.5" style={{ color: CALENDAR_ACCENT }} />
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Attendees */}
          <div>
            <label style={labelStyle}>
              <Users className="w-3.5 h-3.5" style={{ color: CALENDAR_ACCENT }} />
              Attendees
            </label>
            <div className="space-y-2">
              {/* Attendee List */}
              {attendees.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {attendees.map((email) => (
                    <div
                      key={email}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs"
                      style={{
                        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      }}
                    >
                      <span style={{ color: 'var(--ifm-color-content)' }}>{email}</span>
                      <button
                        type="button"
                        onClick={() => removeAttendee(email)}
                        className="p-0.5 rounded hover:opacity-70"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ifm-color-content-secondary)' }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* Add Attendee Input */}
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newAttendee}
                  onChange={(e) => setNewAttendee(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addAttendee();
                    }
                  }}
                  placeholder="email@example.com"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={addAttendee}
                  disabled={!newAttendee.trim() || !isValidEmail(newAttendee)}
                  className="p-2 rounded-lg transition-all"
                  style={{
                    background: newAttendee.trim() && isValidEmail(newAttendee)
                      ? CALENDAR_ACCENT
                      : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                    color: newAttendee.trim() && isValidEmail(newAttendee) ? '#000' : 'var(--ifm-color-content-secondary)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

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
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                color: 'var(--ifm-color-content-secondary)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || submitting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: title.trim() && !submitting ? CALENDAR_ACCENT : `${CALENDAR_ACCENT}60`,
                color: title.trim() && !submitting ? '#000' : 'rgba(0,0,0,0.4)',
                cursor: !title.trim() || submitting ? 'not-allowed' : 'pointer',
                border: 'none',
              }}
            >
              {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isEditing ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper functions
function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatTimeForInput(date: Date): string {
  return date.toTimeString().slice(0, 5);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
