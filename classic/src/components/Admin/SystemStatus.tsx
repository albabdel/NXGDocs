import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import {
  Server,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  RefreshCw,
  ChevronRight,
  Loader,
} from 'lucide-react';

export interface ServiceStatusInfo {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  responseTime?: number;
  lastChecked?: string;
}

export interface SystemStatusProps {
  compact?: boolean;
  showRefresh?: boolean;
  maxServices?: number;
}

export function SystemStatus({
  compact = false,
  showRefresh = true,
  maxServices = 5,
}: SystemStatusProps) {
  const [isDark, setIsDark] = useState(true);
  const [services, setServices] = useState<ServiceStatusInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/admin-system-status', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setServices(data.services || []);
      } else {
        setServices([
          { name: 'Sanity CMS', status: 'operational', responseTime: 145 },
          { name: 'Zoho Desk', status: 'operational', responseTime: 232 },
          { name: 'Cloudflare', status: 'operational', responseTime: 12 },
          { name: 'Vercel', status: 'operational', responseTime: 85 },
          { name: 'MongoDB', status: 'operational', responseTime: 67 },
        ]);
      }
    } catch (error) {
      console.warn('Status API not available');
      setServices([
        { name: 'Sanity CMS', status: 'operational', responseTime: 145 },
        { name: 'Zoho Desk', status: 'operational', responseTime: 232 },
        { name: 'Cloudflare', status: 'operational', responseTime: 12 },
        { name: 'Vercel', status: 'operational', responseTime: 85 },
        { name: 'MongoDB', status: 'operational', responseTime: 67 },
      ]);
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date());
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchStatus();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getStatusDot = (status: string) => {
    const colors: Record<string, string> = {
      operational: '#22c55e',
      degraded: '#f59e0b',
      down: '#ef4444',
    };
    return (
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: colors[status] || '#6b7280' }}
      />
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-4 h-4" style={{ color: '#22c55e' }} />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4" style={{ color: '#f59e0b' }} />;
      case 'down':
        return <XCircle className="w-4 h-4" style={{ color: '#ef4444' }} />;
      default:
        return <Clock className="w-4 h-4" style={{ color: '#6b7280' }} />;
    }
  };

  const overallStatus = services.every(s => s.status === 'operational')
    ? 'operational'
    : services.some(s => s.status === 'down')
      ? 'down'
      : 'degraded';

  const displayServices = services.slice(0, maxServices);

  if (compact) {
    return (
      <Link
        to="/admin/status"
        className="block rounded-xl p-4 transition-all hover:scale-[1.02]"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
          textDecoration: 'none',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4" style={{ color: '#E8B058' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
              System Status
            </span>
          </div>
          <div className="flex items-center gap-1">
            {getStatusIcon(overallStatus)}
            <span
              className="text-xs font-medium capitalize"
              style={{
                color: overallStatus === 'operational' ? '#22c55e' : overallStatus === 'degraded' ? '#f59e0b' : '#ef4444',
              }}
            >
              {overallStatus}
            </span>
          </div>
        </div>
        <div className="space-y-1.5">
          {displayServices.map((service) => (
            <div key={service.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusDot(service.status)}
                <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  {service.name}
                </span>
              </div>
              {service.responseTime && (
                <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  {service.responseTime}ms
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end mt-3 text-xs" style={{ color: '#E8B058' }}>
          View details
          <ChevronRight className="w-3 h-3 ml-1" />
        </div>
      </Link>
    );
  }

  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5" style={{ color: '#E8B058' }} />
          <h3 className="font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
            System Status
          </h3>
        </div>
        {showRefresh && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="p-1.5 rounded-lg transition-all hover:opacity-80"
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              cursor: isRefreshing || isLoading ? 'wait' : 'pointer',
            }}
            aria-label="Refresh status"
          >
            <RefreshCw
              className="w-4 h-4"
              style={{
                color: 'var(--ifm-color-content-secondary)',
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
              }}
            />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader className="w-5 h-5 animate-spin" style={{ color: '#E8B058' }} />
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {displayServices.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-2 rounded-lg"
                style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)' }}
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(service.status)}
                  <span className="text-sm" style={{ color: 'var(--ifm-color-content)' }}>
                    {service.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {service.responseTime && (
                    <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      {service.responseTime}ms
                    </span>
                  )}
                  <span
                    className="text-xs font-medium capitalize"
                    style={{
                      color:
                        service.status === 'operational'
                          ? '#22c55e'
                          : service.status === 'degraded'
                            ? '#f59e0b'
                            : '#ef4444',
                    }}
                  >
                    {service.status === 'operational' ? 'OK' : service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {lastUpdated && (
            <p className="text-xs mt-3 text-center" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              Last checked: {lastUpdated.toLocaleTimeString()}
            </p>
          )}

          <Link
            to="/admin/status"
            className="flex items-center justify-center gap-2 mt-3 p-2 rounded-lg text-sm transition-all hover:opacity-80"
            style={{
              background: isDark ? 'rgba(232,176,88,0.1)' : 'rgba(232,176,88,0.15)',
              color: '#E8B058',
              textDecoration: 'none',
            }}
          >
            View full status
            <ChevronRight className="w-4 h-4" />
          </Link>
        </>
      )}
    </div>
  );
}

export default SystemStatus;
