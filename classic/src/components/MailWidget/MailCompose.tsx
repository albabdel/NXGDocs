import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Paperclip,
  Loader,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  User,
  Trash2,
} from 'lucide-react';
import { sendEmail } from './mailApi';
import type { MailMessage, MailComposeState } from './types';

interface MailComposeProps {
  token: string;
  isDark: boolean;
  replyTo?: MailMessage | null;
  onClose: () => void;
  onSent: () => void;
}

interface RecipientInputProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  isDark: boolean;
  placeholder: string;
}

function RecipientInput({ label, value, onChange, isDark, placeholder }: RecipientInputProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addRecipient();
    } else if (e.key === 'Backspace' && input === '' && value.length > 0) {
      removeRecipient(value.length - 1);
    }
  };

  const addRecipient = () => {
    const email = input.trim().toLowerCase();
    if (email && !value.includes(email) && email.includes('@')) {
      onChange([...value, email]);
      setInput('');
    }
  };

  const removeRecipient = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="flex items-center gap-2 py-2">
      <span className="text-xs font-medium w-8" style={{ color: 'var(--ifm-color-content-secondary)' }}>
        {label}
      </span>
      <div className="flex-1 flex flex-wrap items-center gap-1">
        {value.map((email, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
            style={{
              background: isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.1)',
              color: '#3b82f6',
            }}
          >
            {email}
            <button
              onClick={() => removeRecipient(idx)}
              className="hover:opacity-70"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addRecipient}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] text-sm outline-none bg-transparent"
          style={{ color: 'var(--ifm-color-content)' }}
        />
      </div>
    </div>
  );
}

export default function MailCompose({ token, isDark, replyTo, onClose, onSent }: MailComposeProps) {
  const [to, setTo] = useState<string[]>(replyTo ? [replyTo.sender.email] : []);
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [subject, setSubject] = useState(replyTo ? `Re: ${replyTo.subject}` : '');
  const [content, setContent] = useState(
    replyTo
      ? `<p><br></p><p>On ${new Date(replyTo.timestamp).toLocaleString()}, ${replyTo.sender.firstName} ${replyTo.sender.lastName} wrote:</p><blockquote style="border-left: 2px solid #ccc; padding-left: 10px; margin-left: 10px; color: #666;">${replyTo.content || replyTo.summary}</blockquote>`
      : ''
  );
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const accentColor = '#3b82f6';

  useEffect(() => {
    // Focus on the right field
    if (!replyTo && to.length === 0) {
      // Focus on to field
    } else if (!subject) {
      // Focus on subject
    } else {
      textareaRef.current?.focus();
    }
  }, []);

  const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (to.length === 0 || !subject.trim() || !content.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setSending(true);
    setError(null);

    try {
      await sendEmail(token, {
        to,
        cc: cc.length > 0 ? cc : undefined,
        bcc: bcc.length > 0 ? bcc : undefined,
        subject,
        content,
        contentType: 'html',
        attachments,
        inReplyTo: replyTo?.id,
      });

      setSuccess(true);
      setTimeout(() => {
        onSent();
      }, 1500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const containerStyle = {
    background: isDark ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.98)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  };

  const inputStyle = {
    background: 'transparent',
    color: 'var(--ifm-color-content)',
    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[80vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl"
        style={containerStyle}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
        >
          <h2 className="text-lg font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
            {replyTo ? 'Reply' : 'New Message'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all hover:opacity-80"
            style={{
              background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              color: 'var(--ifm-color-content)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Success state */}
          {success && (
            <div className="flex flex-col items-center justify-center py-16">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(34,197,94,0.15)' }}
              >
                <Send className="w-8 h-8" style={{ color: '#22c55e' }} />
              </div>
              <p className="text-lg font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                Email sent!
              </p>
            </div>
          )}

          {!success && (
            <>
              {/* Error */}
              {error && (
                <div
                  className="flex items-start gap-3 rounded-xl p-3 mb-4"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#ef4444' }} />
                  <p className="text-xs" style={{ color: '#ef4444' }}>
                    {error}
                  </p>
                </div>
              )}

              {/* To field */}
              <div style={inputStyle}>
                <RecipientInput
                  label="To"
                  value={to}
                  onChange={setTo}
                  isDark={isDark}
                  placeholder="Add recipients..."
                />
              </div>

              {/* Cc/Bcc toggle */}
              <button
                onClick={() => setShowCcBcc(!showCcBcc)}
                className="flex items-center gap-1 text-xs py-2 transition-all hover:opacity-70"
                style={{ color: accentColor, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showCcBcc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {showCcBcc ? 'Hide Cc/Bcc' : 'Show Cc/Bcc'}
              </button>

              {/* Cc/Bcc fields */}
              {showCcBcc && (
                <>
                  <div style={inputStyle}>
                    <RecipientInput
                      label="Cc"
                      value={cc}
                      onChange={setCc}
                      isDark={isDark}
                      placeholder="Add Cc recipients..."
                    />
                  </div>
                  <div style={inputStyle}>
                    <RecipientInput
                      label="Bcc"
                      value={bcc}
                      onChange={setBcc}
                      isDark={isDark}
                      placeholder="Add Bcc recipients..."
                    />
                  </div>
                </>
              )}

              {/* Subject */}
              <div className="py-3" style={inputStyle}>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full text-sm outline-none bg-transparent"
                  style={{ color: 'var(--ifm-color-content)' }}
                />
              </div>

              {/* Body */}
              <div className="py-3">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write your message..."
                  rows={12}
                  className="w-full text-sm outline-none resize-none bg-transparent"
                  style={{ color: 'var(--ifm-color-content)', lineHeight: '1.6' }}
                />
              </div>

              {/* Attachments */}
              {attachments.length > 0 && (
                <div className="py-3">
                  <h4 className="text-xs font-medium mb-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                    Attachments ({attachments.length})
                  </h4>
                  <div className="space-y-2">
                    {attachments.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 rounded-lg p-2"
                        style={{
                          background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                          border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                        }}
                      >
                        <Paperclip className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} />
                        <span className="flex-1 text-xs truncate" style={{ color: 'var(--ifm-color-content)' }}>
                          {file.name}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                          {formatBytes(file.size)}
                        </span>
                        <button
                          onClick={() => handleRemoveAttachment(idx)}
                          className="p-1 rounded hover:opacity-70"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ifm-color-content-secondary)' }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div
            className="flex items-center justify-between p-4 border-t"
            style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-80"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                  color: 'var(--ifm-color-content-secondary)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  cursor: 'pointer',
                }}
              >
                <Paperclip className="w-3.5 h-3.5" />
                Attach
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleAddAttachment}
              />
            </div>

            <button
              onClick={handleSend}
              disabled={sending || to.length === 0 || !subject.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: to.length > 0 && subject.trim() ? accentColor : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                color: to.length > 0 && subject.trim() ? '#fff' : 'var(--ifm-color-content-secondary)',
                cursor: to.length > 0 && subject.trim() && !sending ? 'pointer' : 'not-allowed',
                opacity: to.length > 0 && subject.trim() ? 1 : 0.6,
                border: 'none',
              }}
            >
              {sending ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
