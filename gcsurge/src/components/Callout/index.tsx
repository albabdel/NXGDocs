import React from 'react';
import { AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';

export type CalloutType = 'info' | 'success' | 'warning' | 'error' | 'tip' | 'important' | 'note' | 'caution';

const ICONS = {
    info: Info, success: CheckCircle, warning: AlertTriangle, error: AlertCircle,
    tip: Info, important: AlertTriangle, note: Info, caution: AlertTriangle,
};

const STYLES: Record<CalloutType, React.CSSProperties & { borderLeft: string }> = {
    info:      { borderLeft: '4px solid #3B82F6', background: 'rgba(59,130,246,0.08)', color: 'inherit' },
    note:      { borderLeft: '4px solid #3B82F6', background: 'rgba(59,130,246,0.08)', color: 'inherit' },
    tip:       { borderLeft: '4px solid #10B981', background: 'rgba(16,185,129,0.08)', color: 'inherit' },
    success:   { borderLeft: '4px solid #10B981', background: 'rgba(16,185,129,0.08)', color: 'inherit' },
    warning:   { borderLeft: '4px solid #F59E0B', background: 'rgba(245,158,11,0.08)',  color: 'inherit' },
    important: { borderLeft: '4px solid #F59E0B', background: 'rgba(245,158,11,0.08)',  color: 'inherit' },
    caution:   { borderLeft: '4px solid #F97316', background: 'rgba(249,115,22,0.08)',  color: 'inherit' },
    error:     { borderLeft: '4px solid #EF4444', background: 'rgba(239,68,68,0.08)',   color: 'inherit' },
};

const ICON_COLOR: Record<CalloutType, string> = {
    info: '#3B82F6', note: '#3B82F6', tip: '#10B981', success: '#10B981',
    warning: '#F59E0B', important: '#F59E0B', caution: '#F97316', error: '#EF4444',
};

export interface CalloutProps {
    type?: CalloutType;
    title?: string;
    children: React.ReactNode;
}

export default function Callout({ type = 'info', title, children }: CalloutProps) {
    const Icon = ICONS[type];
    return (
        <div role="alert" style={{ ...STYLES[type], padding: '1rem', margin: '1rem 0', borderRadius: '0 8px 8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Icon size={18} style={{ color: ICON_COLOR[type], flexShrink: 0, marginTop: '2px' }} aria-hidden />
                <div style={{ flex: 1 }}>
                    {title && <p style={{ fontWeight: 600, marginBottom: '0.375rem' }}>{title}</p>}
                    <div>{children}</div>
                </div>
            </div>
        </div>
    );
}
