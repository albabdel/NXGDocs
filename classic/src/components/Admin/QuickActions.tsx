import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import {
  Zap,
  FileText,
  Ticket,
  BarChart3,
  FileCheck,
  Users,
  Settings,
  PlusCircle,
} from 'lucide-react';

export interface QuickActionItem {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  href: string;
  color: string;
  external?: boolean;
}

export interface QuickActionsProps {
  compact?: boolean;
  maxItems?: number;
}

const defaultActions: QuickActionItem[] = [
  { icon: PlusCircle, label: 'New Content', href: '/admin/content?action=new', color: '#E8B058' },
  { icon: Ticket, label: 'New Ticket', href: '/admin/tickets?action=new', color: '#f59e0b' },
  { icon: BarChart3, label: 'View Reports', href: '/admin/analytics', color: '#3b82f6' },
  { icon: FileCheck, label: 'Review Queue', href: '/admin/content?status=pending_review', color: '#22c55e' },
  { icon: Users, label: 'User Management', href: '/admin/users', color: '#8b5cf6' },
  { icon: Settings, label: 'System Settings', href: '/admin/settings', color: '#6b7280' },
];

export function QuickActions({ compact = false, maxItems = 6 }: QuickActionsProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  const displayActions = defaultActions.slice(0, maxItems);

  if (compact) {
    return (
      <div className="quick-actions">
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--ifm-color-content)' }}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {displayActions.slice(0, 4).map(({ icon: Icon, label, href, color }) => (
            <Link
              key={label}
              to={href}
              className="flex items-center gap-2 p-2 rounded-lg transition-all hover:scale-[1.02]"
              style={{
                background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                textDecoration: 'none',
              }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
              <span className="text-xs font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="quick-actions rounded-xl p-5"
      style={{
        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5" style={{ color: '#E8B058' }} />
        <h3 className="font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
          Quick Actions
        </h3>
      </div>
      <div className="action-grid grid grid-cols-2 gap-2">
        {displayActions.map(({ icon: Icon, label, href, color }) => (
          <Link
            key={label}
            to={href}
            className="flex items-center gap-2 p-3 rounded-lg transition-all hover:scale-[1.02] group"
            style={{
              background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
              textDecoration: 'none',
              borderLeft: `3px solid ${color}`,
            }}
          >
            <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
            <span className="text-sm font-medium truncate" style={{ color: 'var(--ifm-color-content)' }}>
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
