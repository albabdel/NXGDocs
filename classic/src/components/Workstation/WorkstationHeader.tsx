import React from 'react';
import { LogOut, Headphones, Moon, Sun } from 'lucide-react';

interface WorkstationHeaderProps {
  isDark: boolean;
  onLogout: () => void;
}

export default function WorkstationHeader({ isDark, onLogout }: WorkstationHeaderProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 mb-8"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(232,176,88,0.06) 0%, rgba(0,0,0,0.4) 100%)'
          : 'linear-gradient(135deg, rgba(232,176,88,0.1) 0%, rgba(255,255,255,0.9) 100%)',
        border: `1px solid ${isDark ? 'rgba(232,176,88,0.18)' : 'rgba(232,176,88,0.25)'}`,
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #E8B058 25%, #C89446 50%, #E8B058 75%, transparent 100%)',
        }}
      />

      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Left side - Logo and title */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(232,176,88,0.12)',
              border: '1px solid rgba(232,176,88,0.2)',
            }}
          >
            <Headphones className="w-5 h-5" style={{ color: '#E8B058' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>
              Support Workstation
            </h1>
            <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              NXGEN Technology AG · Internal Workstation
            </p>
          </div>
        </div>

        {/* Right side - Controls */}
        <div className="flex items-center gap-3">
          {/* Dark mode indicator */}
          <div
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
              color: 'var(--ifm-color-content-secondary)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            }}
          >
            {isDark ? (
              <Moon className="w-4 h-4" style={{ color: '#E8B058' }} />
            ) : (
              <Sun className="w-4 h-4" style={{ color: '#E8B058' }} />
            )}
            <span>{isDark ? 'Dark' : 'Light'}</span>
          </div>

          {/* Sign out button */}
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
              color: 'var(--ifm-color-content-secondary)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              cursor: 'pointer',
            }}
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
