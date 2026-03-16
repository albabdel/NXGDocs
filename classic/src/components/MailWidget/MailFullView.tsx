import React, { useEffect, useState } from 'react';
import {
  Mail,
  Inbox,
  Send,
  FileText,
  Trash2,
  Archive,
  AlertTriangle,
  Loader,
  AlertCircle,
  X,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { listFolders, listEmails, searchEmails } from './mailApi';
import MailList from './MailList';
import MailThread from './MailThread';
import MailCompose from './MailCompose';
import type { MailFolder, MailMessage, MailComposeState } from './types';

interface MailFullViewProps {
  token: string;
  isDark: boolean;
  onClose: () => void;
}

const FOLDER_ICONS: Record<string, React.ReactNode> = {
  inbox: <Inbox className="w-4 h-4" />,
  sent: <Send className="w-4 h-4" />,
  drafts: <FileText className="w-4 h-4" />,
  spam: <AlertTriangle className="w-4 h-4" />,
  trash: <Trash2 className="w-4 h-4" />,
  archive: <Archive className="w-4 h-4" />,
};

export default function MailFullView({ token, isDark, onClose }: MailFullViewProps) {
  const [folders, setFolders] = useState<MailFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<MailMessage | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [replyTo, setReplyTo] = useState<MailMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accentColor = '#3b82f6';

  // Load folders on mount
  useEffect(() => {
    setLoading(true);
    setError(null);

    listFolders(token)
      .then(res => {
        setFolders(res.data);
      })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load folders'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSelectEmail = (email: MailMessage) => {
    setSelectedEmail(email);
  };

  const handleBackToList = () => {
    setSelectedEmail(null);
  };

  const handleCompose = () => {
    setReplyTo(null);
    setShowCompose(true);
  };

  const handleReply = (email: MailMessage) => {
    setReplyTo(email);
    setShowCompose(true);
  };

  const handleSent = () => {
    setShowCompose(false);
    setReplyTo(null);
    // Refresh the list if viewing sent folder
    if (selectedFolder === 'sent') {
      // Force re-render by changing selectedFolder temporarily
      setSelectedFolder('inbox');
      setTimeout(() => setSelectedFolder('sent'), 0);
    }
  };

  const totalUnread = folders.reduce((sum, f) => sum + f.unreadCount, 0);

  const containerStyle = {
    background: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.98)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  };

  const sidebarStyle = {
    background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
    borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Main container */}
      <div
        className="relative w-full max-w-7xl h-[90vh] rounded-2xl overflow-hidden flex shadow-2xl"
        style={containerStyle}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg transition-all hover:opacity-80"
          style={{
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            color: 'var(--ifm-color-content)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sidebar */}
        <div className="w-56 flex-shrink-0 flex flex-col" style={sidebarStyle}>
          {/* Compose button */}
          <div className="p-4">
            <button
              onClick={handleCompose}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{
                background: accentColor,
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Plus className="w-4 h-4" />
              Compose
            </button>
          </div>

          {/* Folder list */}
          <div className="flex-1 overflow-y-auto px-2 pb-4">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-4 h-4 animate-spin" style={{ color: accentColor }} />
              </div>
            )}

            {error && (
              <div className="px-2 py-4">
                <p className="text-xs text-center" style={{ color: '#ef4444' }}>
                  {error}
                </p>
              </div>
            )}

            {!loading && !error && (
              <div className="space-y-1">
                {folders.map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => {
                      setSelectedFolder(folder.id);
                      setSelectedEmail(null);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all"
                    style={{
                      background: selectedFolder === folder.id ? `${accentColor}15` : 'transparent',
                      cursor: 'pointer',
                      border: 'none',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          color: selectedFolder === folder.id ? accentColor : 'var(--ifm-color-content-secondary)',
                        }}
                      >
                        {FOLDER_ICONS[folder.type] || <Inbox className="w-4 h-4" />}
                      </span>
                      <span
                        className="capitalize"
                        style={{
                          color: selectedFolder === folder.id ? accentColor : 'var(--ifm-color-content)',
                        }}
                      >
                        {folder.name}
                      </span>
                    </div>
                    {folder.unreadCount > 0 && (
                      <span
                        className="px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                        style={{ background: `${accentColor}20`, color: accentColor }}
                      >
                        {folder.unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer info */}
          <div
            className="p-4 border-t"
            style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
          >
            <p className="text-xs text-center" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              {totalUnread > 0 ? `${totalUnread} unread` : 'All caught up!'}
            </p>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex min-w-0">
          {/* Email list */}
          {!selectedEmail && (
            <div className="flex-1 flex flex-col">
              {/* Search bar */}
              <div className="p-4 border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: 'var(--ifm-color-content-secondary)' }}
                  />
                  <input
                    type="text"
                    placeholder="Search emails..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none transition-all"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      color: 'var(--ifm-color-content)',
                    }}
                  />
                </div>
              </div>

              {/* Email list */}
              <div className="flex-1 overflow-hidden">
                <MailList
                  token={token}
                  isDark={isDark}
                  folderId={selectedFolder}
                  searchQuery={searchQuery}
                  onSelectEmail={handleSelectEmail}
                  selectedEmailId={selectedEmail?.id}
                />
              </div>
            </div>
          )}

          {/* Email detail view */}
          {selectedEmail && (
            <MailThread
              token={token}
              isDark={isDark}
              emailId={selectedEmail.id}
              onBack={handleBackToList}
              onReply={handleReply}
            />
          )}
        </div>
      </div>

      {/* Compose modal */}
      {showCompose && (
        <MailCompose
          isDark={isDark}
          replyTo={replyTo}
          onClose={() => {
            setShowCompose(false);
            setReplyTo(null);
          }}
          onSent={handleSent}
          token={token}
        />
      )}
    </div>
  );
}
