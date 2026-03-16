import React, { useState, Suspense } from 'react';
import {
  Headphones,
  Mail,
  Calendar,
  Users,
  ChevronDown,
  ChevronUp,
  Clock,
  Loader,
} from 'lucide-react';
import WorkstationHeader from './WorkstationHeader';
import ErrorBoundary from './ErrorBoundary';
import TicketList from '../ZohoTickets/TicketList';
import type { ZohoTicket } from '../ZohoTickets/types';
import type { WorkstationProps, WidgetType } from './types';

const MailWidget = React.lazy(() => import('../MailWidget/MailWidget'));
const CalendarWidget = React.lazy(() => import('../CalendarWidget/CalendarWidget'));
const CRMPanel = React.lazy(() => import('../CRMPanel/CRMPanel'));

function WidgetLoader() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader className="w-5 h-5 animate-spin" style={{ color: '#E8B058' }} />
    </div>
  );
}

function WidgetError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Clock className="w-8 h-8 mb-2" style={{ color: 'var(--ifm-color-content-secondary)', opacity: 0.5 }} />
      <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>{message}</p>
    </div>
  );
}

/**
 * Widget Card Component
 * Provides expand/collapse functionality with consistent styling
 */
interface WidgetCardProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  isDark: boolean;
  isAvailable: boolean;
  children: React.ReactNode;
  accentColor?: string;
}

function WidgetCard({
  title,
  icon,
  isExpanded,
  onToggle,
  isDark,
  isAvailable,
  children,
  accentColor = '#E8B058',
}: WidgetCardProps) {
  const cardBorder = {
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
  };

  return (
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
          borderBottom: isExpanded ? `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` : 'none',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: `${accentColor}15`,
              border: `1px solid ${accentColor}30`,
            }}
          >
            {icon}
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
              {title}
            </h3>
            {!isAvailable && (
              <span
                className="text-xs"
                style={{ color: 'var(--ifm-color-content-secondary)' }}
              >
                Coming Soon
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
          ) : (
            <ChevronDown className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
          )}
        </div>
      </button>

      {/* Widget Content */}
      {isExpanded && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Placeholder Widget for features not yet implemented
 */
function PlaceholderWidget({
  title,
  icon,
  isDark,
  isExpanded,
  onToggle,
  accentColor = '#E8B058',
}: {
  title: string;
  icon: React.ReactNode;
  isDark: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  accentColor?: string;
}) {
  return (
    <WidgetCard
      title={title}
      icon={icon}
      isExpanded={isExpanded}
      onToggle={onToggle}
      isDark={isDark}
      isAvailable={false}
      accentColor={accentColor}
    >
      <div className="flex flex-col items-center justify-center py-12">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{
            background: `${accentColor}10`,
            border: `1px solid ${accentColor}20`,
          }}
        >
          <Clock className="w-8 h-8" style={{ color: accentColor, opacity: 0.6 }} />
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>
          Coming Soon
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          {title} integration is under development
        </p>
      </div>
    </WidgetCard>
  );
}

/**
 * Main Workstation Dashboard Component
 */
export default function WorkstationDashboard({ token, onLogout, isDark }: WorkstationProps) {
  const [selectedTicket, setSelectedTicket] = useState<ZohoTicket | null>(null);
  const [expandedWidgets, setExpandedWidgets] = useState<Record<WidgetType, boolean>>({
    tickets: true,
    mail: false,
    calendar: false,
    crm: false,
  });

  const toggleWidget = (widgetId: WidgetType) => {
    setExpandedWidgets(prev => ({
      ...prev,
      [widgetId]: !prev[widgetId],
    }));
  };

  const handleTicketSelect = (ticket: ZohoTicket) => {
    setSelectedTicket(ticket);
    // For now, just log - in future this could open a detail modal
    console.log('Selected ticket:', ticket);
  };

  const widgetAccentColors: Record<WidgetType, string> = {
    tickets: '#E8B058',
    mail: '#3b82f6',
    calendar: '#22c55e',
    crm: '#8b5cf6',
  };

  return (
    <div>
      {/* Header */}
      <WorkstationHeader isDark={isDark} onLogout={onLogout} />

      {/* Widget Grid - 2x2 on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets Widget */}
        <WidgetCard
          title="Tickets"
          icon={<Headphones className="w-4 h-4" style={{ color: widgetAccentColors.tickets }} />}
          isExpanded={expandedWidgets.tickets}
          onToggle={() => toggleWidget('tickets')}
          isDark={isDark}
          isAvailable={true}
          accentColor={widgetAccentColors.tickets}
        >
          <TicketList
            token={token}
            isDark={isDark}
            isCustomer={false}
            onSelect={handleTicketSelect}
          />
        </WidgetCard>

        {/* Mail Widget */}
        <WidgetCard
          title="Mail"
          icon={<Mail className="w-4 h-4" style={{ color: widgetAccentColors.mail }} />}
          isExpanded={expandedWidgets.mail}
          onToggle={() => toggleWidget('mail')}
          isDark={isDark}
          isAvailable={true}
          accentColor={widgetAccentColors.mail}
        >
          <ErrorBoundary>
            <Suspense fallback={<WidgetLoader />}>
              <MailWidget
                token={token}
                isDark={isDark}
                isExpanded={expandedWidgets.mail}
                onToggle={() => toggleWidget('mail')}
                accentColor={widgetAccentColors.mail}
                showHeader={false}
              />
            </Suspense>
          </ErrorBoundary>
        </WidgetCard>

        {/* Calendar Widget */}
        <WidgetCard
          title="Calendar"
          icon={<Calendar className="w-4 h-4" style={{ color: widgetAccentColors.calendar }} />}
          isExpanded={expandedWidgets.calendar}
          onToggle={() => toggleWidget('calendar')}
          isDark={isDark}
          isAvailable={true}
          accentColor={widgetAccentColors.calendar}
        >
          <ErrorBoundary>
            <Suspense fallback={<WidgetLoader />}>
              <CalendarWidget
                token={token}
                isDark={isDark}
                isExpanded={expandedWidgets.calendar}
                onToggle={() => toggleWidget('calendar')}
                showHeader={false}
              />
            </Suspense>
          </ErrorBoundary>
        </WidgetCard>

        {/* CRM Widget */}
        <WidgetCard
          title="CRM"
          icon={<Users className="w-4 h-4" style={{ color: widgetAccentColors.crm }} />}
          isExpanded={expandedWidgets.crm}
          onToggle={() => toggleWidget('crm')}
          isDark={isDark}
          isAvailable={true}
          accentColor={widgetAccentColors.crm}
        >
          <ErrorBoundary>
            <Suspense fallback={<WidgetLoader />}>
              <CRMPanel
                token={token}
                isDark={isDark}
                accentColor={widgetAccentColors.crm}
              />
            </Suspense>
          </ErrorBoundary>
        </WidgetCard>
      </div>

      {/* Selected ticket indicator (for future use) */}
      {selectedTicket && (
        <div
          className="fixed bottom-4 right-4 px-4 py-3 rounded-xl shadow-lg"
          style={{
            background: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.95)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          }}
        >
          <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            Viewing: <span style={{ color: '#E8B058' }}>#{selectedTicket.ticketNumber}</span>
          </p>
        </div>
      )}
    </div>
  );
}
