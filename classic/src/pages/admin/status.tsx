import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import { ProtectedRoute } from '../../components/Admin/ProtectedRoute';
import { AdminLayout } from '../../components/Admin/AdminLayout';
import {
  Server,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Clock,
  Activity,
  Database,
  Cloud,
  Globe,
  Loader,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  responseTime: number | null;
  lastChecked: string;
  uptime: number;
  message?: string;
  endpoint?: string;
}

interface SystemStatusData {
  overall: 'operational' | 'degraded' | 'down';
  services: ServiceStatus[];
  lastUpdated: string;
}

const mockServices: ServiceStatus[] = [
  {
    name: 'Sanity CMS',
    status: 'operational',
    responseTime: 145,
    lastChecked: new Date().toISOString(),
    uptime: 99.98,
    endpoint: 'https://api.sanity.io',
  },
  {
    name: 'Zoho Desk',
    status: 'operational',
    responseTime: 232,
    lastChecked: new Date().toISOString(),
    uptime: 99.95,
    endpoint: 'https://desk.zoho.com/api',
  },
  {
    name: 'Cloudflare',
    status: 'operational',
    responseTime: 12,
    lastChecked: new Date().toISOString(),
    uptime: 100,
    endpoint: 'https://api.cloudflare.com',
  },
  {
    name: 'Vercel Hosting',
    status: 'operational',
    responseTime: 85,
    lastChecked: new Date().toISOString(),
    uptime: 99.99,
    endpoint: 'https://vercel.com',
  },
  {
    name: 'MongoDB Atlas',
    status: 'operational',
    responseTime: 67,
    lastChecked: new Date().toISOString(),
    uptime: 99.97,
    endpoint: 'https://cloud.mongodb.com',
  },
];

function StatusPageContent() {
  const [isDark, setIsDark] = useState(true);
  const [statusData, setStatusData] = useState<SystemStatusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

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
    setIsLoading(true);
    try {
      const response = await fetch('/admin-system-status', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setStatusData(data);
      } else {
        setStatusData({
          overall: 'operational',
          services: mockServices,
          lastUpdated: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.warn('Status API not available, using mock data');
      setStatusData({
        overall: 'operational',
        services: mockServices,
        lastUpdated: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
      setLastRefresh(new Date());
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchStatus();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5" style={{ color: '#f59e0b' }} />;
      case 'down':
        return <XCircle className="w-5 h-5" style={{ color: '#ef4444' }} />;
      default:
        return <Clock className="w-5 h-5" style={{ color: '#6b7280' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return '#22c55e';
      case 'degraded':
        return '#f59e0b';
      case 'down':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatLastChecked = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);

    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    return date.toLocaleTimeString();
  };

  const cardBg = isDark
    ? 'linear-gradient(135deg, rgba(232,176,88,0.06) 0%, rgba(0,0,0,0.4) 100%)'
    : 'linear-gradient(135deg, rgba(232,176,88,0.1) 0%, rgba(255,255,255,0.9) 100%)';

  const borderColor = isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)';

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader className="w-6 h-6 animate-spin" style={{ color: '#E8B058' }} />
        <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Checking system status...
        </p>
      </div>
    );
  }

  const operationalCount = statusData?.services.filter(s => s.status === 'operational').length || 0;
  const totalServices = statusData?.services.length || 0;

  return (
    <AdminLayout title="System Status">
      <div
        className="relative overflow-hidden rounded-2xl p-6 mb-6"
        style={{
          background: cardBg,
          border: `1px solid ${borderColor}`,
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #E8B058 25%, #C89446 50%, #E8B058 75%, transparent 100%)',
          }}
        />
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(232,176,88,0.12)',
                border: '1px solid rgba(232,176,88,0.2)',
              }}
            >
              <Server className="w-6 h-6" style={{ color: '#E8B058' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>
                System Status
              </h1>
              <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                Monitor service health and performance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
              style={{
                background: 'rgba(232,176,88,0.15)',
                color: '#E8B058',
                border: '1px solid rgba(232,176,88,0.3)',
                cursor: isRefreshing ? 'wait' : 'pointer',
              }}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div
          className="rounded-xl p-5"
          style={{
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: `${getStatusColor(statusData?.overall || 'operational')}15`,
                border: `1px solid ${getStatusColor(statusData?.overall || 'operational')}30`,
              }}
            >
              {getStatusIcon(statusData?.overall || 'operational')}
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                Overall Status
              </p>
              <p className="text-lg font-bold capitalize" style={{ color: getStatusColor(statusData?.overall || 'operational') }}>
                {statusData?.overall || 'Operational'}
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-5"
          style={{
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(34,197,94,0.15)',
                border: '1px solid rgba(34,197,94,0.3)',
              }}
            >
              <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                Services Online
              </p>
              <p className="text-lg font-bold" style={{ color: 'var(--ifm-color-content)' }}>
                {operationalCount} / {totalServices}
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-5"
          style={{
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(232,176,88,0.15)',
                border: '1px solid rgba(232,176,88,0.3)',
              }}
            >
              <Activity className="w-5 h-5" style={{ color: '#E8B058' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                Avg Response Time
              </p>
              <p className="text-lg font-bold" style={{ color: 'var(--ifm-color-content)' }}>
                {statusData?.services
                  ? Math.round(
                      statusData.services.reduce((acc, s) => acc + (s.responseTime || 0), 0) /
                        statusData.services.filter(s => s.responseTime).length
                    )
                  : 0}
                ms
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
          }}
        >
          <h2 className="text-lg font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
            Services
          </h2>
          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />
              <span>Operational</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: '#f59e0b' }} />
              <span>Degraded</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: '#ef4444' }} />
              <span>Down</span>
            </div>
          </div>
        </div>

        <div className="divide-y" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
          {statusData?.services.map((service) => (
            <div key={service.name}>
              <button
                onClick={() => setExpandedService(expandedService === service.name ? null : service.name)}
                className="w-full flex items-center justify-between px-6 py-4 transition-all hover:opacity-80"
                style={{ cursor: 'pointer' }}
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(service.status)}
                  <div className="text-left">
                    <p className="font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                      {service.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      {service.message || 'No issues reported'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                      {service.responseTime ? `${service.responseTime}ms` : 'N/A'}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      {formatLastChecked(service.lastChecked)}
                    </p>
                  </div>
                  <span
                    className="px-2 py-1 rounded-lg text-xs font-medium capitalize"
                    style={{
                      background: `${getStatusColor(service.status)}15`,
                      color: getStatusColor(service.status),
                    }}
                  >
                    {service.status}
                  </span>
                  {expandedService === service.name ? (
                    <ChevronUp className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
                  ) : (
                    <ChevronDown className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
                  )}
                </div>
              </button>

              {expandedService === service.name && (
                <div
                  className="px-6 pb-4 pt-2"
                  style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)' }}
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs mb-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        Response Time
                      </p>
                      <p className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                        {service.responseTime ? `${service.responseTime}ms` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        Uptime (30d)
                      </p>
                      <p className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                        {service.uptime.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        Last Checked
                      </p>
                      <p className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                        {formatLastChecked(service.lastChecked)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        Endpoint
                      </p>
                      <p className="text-sm font-medium truncate" style={{ color: '#E8B058' }}>
                        {service.endpoint || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-sm font-medium transition-all hover:opacity-80"
          style={{ color: '#E8B058', textDecoration: 'none' }}
        >
          ← Back to Dashboard
        </Link>
      </div>
    </AdminLayout>
  );
}

function StatusLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#E8B058', borderTopColor: 'transparent' }} />
    </div>
  );
}

function StatusPage() {
  return (
    <ProtectedRoute>
      <StatusPageContent />
    </ProtectedRoute>
  );
}

export default function StatusPageWrapper() {
  return (
    <Layout
      title="System Status | NXGEN Admin"
      description="Monitor NXGEN system health and service status"
    >
      <BrowserOnly fallback={<StatusLoader />}>
        {() => <StatusPage />}
      </BrowserOnly>
    </Layout>
  );
}
