import React, { useEffect, useState } from 'react';
import { X, Loader, Send, FileText, Zap } from 'lucide-react';
import { createTicket, listAgents, listStatuses, addComment } from './zohoApi';
import type { ZohoAgent, ZohoStatus } from './types';
import { TICKET_TEMPLATES, generateAutoReply } from './supportConfig';

interface Props {
  isDark: boolean;
  isCustomer?: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateTicketModal({ isDark, isCustomer, onClose, onCreated }: Props) {
  const [agents, setAgents] = useState<ZohoAgent[]>([]);
  const [statuses, setStatuses] = useState<ZohoStatus[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Open');
  const [assigneeId, setAssigneeId] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [autoReply, setAutoReply] = useState(true);

  useEffect(() => {
    listAgents({ isCustomer }).then(r => setAgents(r.data ?? [])).catch(() => {});
    listStatuses({ isCustomer }).then(r => {
      const data = r.data ?? [];
      setStatuses(data);
      if (data.length && !data.find(s => s.displayName === 'Open')) {
        setStatus(data[0].displayName);
      }
    }).catch(() => {});
  }, [isCustomer]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !email.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const newTicket = await createTicket({
        data: {
          subject: subject.trim(),
          description: description.trim(),
          email: email.trim(),
          priority,
          status,
          assigneeId: assigneeId || undefined,
        },
        isCustomer,
      });
      
      if (autoReply && newTicket.id) {
        try {
          const replyContent = generateAutoReply(newTicket.ticketNumber, priority);
          await addComment({ ticketId: newTicket.id, content: replyContent, isPublic: true, isCustomer });
        } catch {
          // Silently fail auto-reply - ticket was created successfully
        }
      }
      
      onCreated();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  }

  const overlayBg = 'rgba(0,0,0,0.6)';
  const modalBg = isDark ? '#1a1a2e' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)';

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
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 500,
    marginBottom: '0.375rem',
    color: 'var(--ifm-color-content-secondary)',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: overlayBg, backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: modalBg, border: `1px solid ${borderColor}` }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            background: isDark ? 'rgba(232,176,88,0.06)' : 'rgba(232,176,88,0.05)',
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <h2 className="text-base font-bold" style={{ color: 'var(--ifm-color-content)' }}>
            Create New Ticket
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
          {/* Template Selector */}
          <div>
            <label style={labelStyle}>
              <FileText className="w-3 h-3 inline mr-1" style={{ color: '#E8B058' }} />
              Ticket Template
            </label>
            <select
              value={selectedTemplate}
              onChange={e => {
                const templateId = e.target.value;
                setSelectedTemplate(templateId);
                if (templateId) {
                  const template = TICKET_TEMPLATES.find(t => t.id === templateId);
                  if (template) {
                    setSubject(template.subjectPrefix);
                    setDescription(template.descriptionTemplate);
                    setPriority(template.priority);
                  }
                }
              }}
              style={inputStyle}
            >
              <option value="">Select a template (optional)</option>
              {TICKET_TEMPLATES.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} - {t.description}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label style={labelStyle}>Subject <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Ticket subject"
              required
              style={inputStyle}
            />
          </div>

          {/* Contact Email */}
          <div>
            <label style={labelStyle}>Contact Email <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="customer@example.com"
              required
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the issue..."
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Row: Priority + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} style={inputStyle}>
                {['Critical', 'High', 'Medium', 'Low'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
                {statuses.length > 0
                  ? statuses.map(s => <option key={s.id} value={s.displayName}>{s.displayName}</option>)
                  : ['Open', 'On Hold', 'Closed'].map(s => <option key={s} value={s}>{s}</option>)
                }
              </select>
            </div>
          </div>

          {/* Assignee — agents only */}
          {!isCustomer && agents.length > 0 && (
            <div>
              <label style={labelStyle}>Assign to</label>
              <select value={assigneeId} onChange={e => setAssigneeId(e.target.value)} style={inputStyle}>
                <option value="">Unassigned</option>
                {agents.map(ag => (
                  <option key={ag.id} value={ag.id}>
                    {ag.name || `${ag.firstName} ${ag.lastName}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Auto-reply option */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{
              background: isDark ? 'rgba(232,176,88,0.06)' : 'rgba(232,176,88,0.04)',
              border: `1px solid ${isDark ? 'rgba(232,176,88,0.15)' : 'rgba(232,176,88,0.15)'}`,
            }}
          >
            <input
              type="checkbox"
              id="autoReply"
              checked={autoReply}
              onChange={e => setAutoReply(e.target.checked)}
              style={{ accentColor: '#E8B058', cursor: 'pointer' }}
            />
            <label
              htmlFor="autoReply"
              className="text-xs flex items-center gap-1"
              style={{ color: 'var(--ifm-color-content)', cursor: 'pointer' }}
            >
              <Zap className="w-3 h-3" style={{ color: '#E8B058' }} />
              Send automatic acknowledgment reply
            </label>
          </div>

          {error && (
            <p className="text-xs rounded-lg px-3 py-2" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
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
              disabled={!subject.trim() || !email.trim() || submitting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: subject.trim() && email.trim() && !submitting ? '#E8B058' : 'rgba(232,176,88,0.3)',
                color: subject.trim() && email.trim() && !submitting ? '#000' : 'rgba(0,0,0,0.4)',
                cursor: !subject.trim() || !email.trim() || submitting ? 'not-allowed' : 'pointer',
                border: 'none',
              }}
            >
              {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
