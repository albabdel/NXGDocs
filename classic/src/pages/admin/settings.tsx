import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { ProtectedRoute } from '../../components/Admin/ProtectedRoute';
import { AdminLayout } from '../../components/Admin/AdminLayout';
import { Settings, Globe, FileText, Bell, Shield, Workflow, ExternalLink, Info } from 'lucide-react';

function SettingsPageContent() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  const cardBg = isDark
    ? 'linear-gradient(135deg, rgba(232,176,88,0.06) 0%, rgba(0,0,0,0.4) 100%)'
    : 'linear-gradient(135deg, rgba(232,176,88,0.1) 0%, rgba(255,255,255,0.9) 100%)';

  const borderColor = isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)';

  const settingsSections = [
    {
      icon: Globe,
      title: 'General Settings',
      description: 'Basic site configuration and regional preferences',
      settings: [
        { label: 'Site Name', value: 'NxGen Docs', readOnly: true },
        { label: 'Default Language', value: 'English (en-US)' },
        { label: 'Timezone', value: 'UTC-5 (Eastern Time)' },
      ],
    },
    {
      icon: FileText,
      title: 'Content Settings',
      description: 'Content approval and synchronization preferences',
      settings: [
        { label: 'Auto-approve Threshold', value: '3 approvals required' },
        { label: 'Review Required for Types', value: 'Tutorials, API Reference' },
        { label: 'Confluence Sync Enabled', value: 'Disabled', isToggle: true },
      ],
    },
    {
      icon: Bell,
      title: 'Notification Settings',
      description: 'Email and integration notifications',
      settings: [
        { label: 'Email Notifications', value: 'Enabled', isToggle: true },
        { label: 'Slack Integration', value: 'Not configured', isPlaceholder: true },
      ],
    },
    {
      icon: Shield,
      title: 'Security Settings',
      description: 'Authentication and access control',
      settings: [
        { label: 'Session Timeout', value: '30 minutes', readOnly: true },
        { label: 'Two-Factor Auth', value: 'Enabled', readOnly: true },
        { label: 'IP Whitelist', value: 'Not configured', isPlaceholder: true },
      ],
    },
    {
      icon: Workflow,
      title: 'Workflow Settings',
      description: 'Content workflow and publishing rules',
      settings: [
        { label: 'Default Workflow Status', value: 'Draft' },
        { label: 'Auto-publish Schedule', value: 'Disabled' },
        { label: 'Review Assignment', value: 'Round-robin' },
      ],
    },
  ];

  return (
    <AdminLayout title="Settings">
      <div
        className="relative overflow-hidden rounded-2xl p-6 mb-8"
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
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(232,176,88,0.12)',
              border: '1px solid rgba(232,176,88,0.2)',
            }}
          >
            <Settings className="w-5 h-5" style={{ color: '#E8B058' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>
              Settings
            </h1>
            <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              Configure platform settings and preferences
            </p>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-4 mb-8 flex items-start gap-3"
        style={{
          background: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.05)',
          border: `1px solid ${isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.15)'}`,
        }}
      >
        <Info className="w-5 h-5 flex-shrink-0" style={{ color: '#3b82f6' }} />
        <p className="text-sm" style={{ color: 'var(--ifm-color-content)' }}>
          Settings are configured in Sanity Studio. Changes are reflected here.
        </p>
      </div>

      <div className="space-y-6">
        {settingsSections.map(({ icon: Icon, title, description, settings: sectionSettings }) => (
          <div
            key={title}
            className="rounded-xl p-6"
            style={{
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
            }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'rgba(232,176,88,0.1)',
                  border: '1px solid rgba(232,176,88,0.2)',
                }}
              >
                <Icon className="w-5 h-5" style={{ color: '#E8B058' }} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1" style={{ color: 'var(--ifm-color-content)' }}>
                  {title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  {description}
                </p>
              </div>
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors"
                style={{
                  background: 'rgba(232,176,88,0.1)',
                  border: '1px solid rgba(232,176,88,0.2)',
                  color: '#E8B058',
                }}
              >
                <ExternalLink className="w-4 h-4" />
                Edit in Studio
              </button>
            </div>

            <div className="space-y-3">
              {sectionSettings.map(({ label, value, readOnly, isToggle, isPlaceholder }) => (
                <div
                  key={label}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.4)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(232,176,88,0.1)'}`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm" style={{ color: 'var(--ifm-color-content)' }}>
                      {label}
                    </span>
                    {readOnly && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          background: 'rgba(232,176,88,0.1)',
                          color: '#E8B058',
                        }}
                      >
                        read-only
                      </span>
                    )}
                    {isPlaceholder && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          background: 'rgba(156,163,175,0.2)',
                          color: 'var(--ifm-color-content-secondary)',
                        }}
                      >
                        placeholder
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isToggle && (
                      <div
                        className="w-10 h-5 rounded-full relative transition-colors"
                        style={{
                          background: value === 'Enabled' ? '#22c55e' : 'rgba(156,163,175,0.3)',
                        }}
                      >
                        <div
                          className="w-4 h-4 rounded-full absolute top-0.5 transition-all bg-white"
                          style={{
                            left: value === 'Enabled' ? '22px' : '2px',
                          }}
                        />
                      </div>
                    )}
                    <span
                      className="text-sm"
                      style={{
                        color: isPlaceholder
                          ? 'var(--ifm-color-content-secondary)'
                          : 'var(--ifm-color-content)',
                      }}
                    >
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsPageContent />
    </ProtectedRoute>
  );
}

export default function SettingsPageWrapper() {
  return (
    <Layout title="Settings | Admin">
      <BrowserOnly fallback={<div>Loading...</div>}>
        {() => <SettingsPage />}
      </BrowserOnly>
    </Layout>
  );
}
