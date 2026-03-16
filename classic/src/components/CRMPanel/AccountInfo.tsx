import React, { useState, useEffect } from 'react';
import {
  Building2,
  Globe,
  Users,
  DollarSign,
  Headphones,
  Loader,
  ExternalLink,
  Phone,
} from 'lucide-react';
import type { CRMAccount } from './types';

interface AccountInfoProps {
  token: string;
  accountId: string;
  isDark: boolean;
  onFetchOpenTickets?: (token: string, accountId: string) => Promise<number>;
}

export default function AccountInfo({
  token,
  accountId,
  isDark,
  onFetchOpenTickets,
}: AccountInfoProps) {
  const [account, setAccount] = useState<CRMAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openTicketsCount, setOpenTicketsCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchAccount = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { getAccount } = await import('./crmApi');
        const accountData = await getAccount(token, accountId);

        if (!mounted) return;

        if (accountData) {
          setAccount(accountData);
        } else {
          setError('Account not found');
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load account');
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAccount();

    return () => {
      mounted = false;
    };
  }, [token, accountId]);

  useEffect(() => {
    if (!onFetchOpenTickets || !account) return;

    let mounted = true;

    const fetchTickets = async () => {
      try {
        const count = await onFetchOpenTickets(token, accountId);
        if (mounted) {
          setOpenTicketsCount(count);
        }
      } catch (err) {
        console.warn('Failed to fetch open tickets count:', err);
        if (mounted) {
          setOpenTicketsCount(0);
        }
      }
    };

    fetchTickets();

    return () => {
      mounted = false;
    };
  }, [token, accountId, account, onFetchOpenTickets]);

  const cardBorder = {
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
  };

  if (isLoading) {
    return (
      <div
        className="rounded-xl border p-6"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
          ...cardBorder,
        }}
      >
        <div className="flex items-center justify-center py-8">
          <Loader className="w-5 h-5 animate-spin" style={{ color: '#E8B058' }} />
          <span
            className="ml-2 text-sm"
            style={{ color: 'var(--ifm-color-content-secondary)' }}
          >
            Loading account...
          </span>
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div
        className="rounded-xl border p-6"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
          ...cardBorder,
        }}
      >
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Building2
            className="w-8 h-8 mb-2"
            style={{ color: 'var(--ifm-color-content-secondary)', opacity: 0.5 }}
          />
          <p
            className="text-sm font-medium"
            style={{ color: 'var(--ifm-color-content)' }}
          >
            {error || 'Account not available'}
          </p>
        </div>
      </div>
    );
  }

  const websiteUrl = account.website
    ? (account.website.startsWith('http') ? account.website : `https://${account.website}`)
    : null;
  
  const displayWebsite = account.website
    ? account.website.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : null;

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
        ...cardBorder,
      }}
    >
      {/* Header */}
      <div
        className="p-4 flex items-start gap-4"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(0,0,0,0.2) 100%)'
            : 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(255,255,255,0.4) 100%)',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        }}
      >
        {/* Logo placeholder */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'rgba(139,92,246,0.12)',
            border: '1px solid rgba(139,92,246,0.2)',
          }}
        >
          {account.logoUrl ? (
            <img
              src={account.logoUrl}
              alt={account.accountName}
              className="w-12 h-12 rounded-lg object-contain"
            />
          ) : (
            <Building2 className="w-7 h-7" style={{ color: '#8b5cf6' }} />
          )}
        </div>

        {/* Account Name */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-lg font-semibold truncate"
            style={{ color: 'var(--ifm-color-content)' }}
          >
            {account.accountName}
          </h3>
          {websiteUrl && displayWebsite && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm flex items-center gap-1 hover:underline"
              style={{ color: '#8b5cf6' }}
            >
              <Globe className="w-3 h-3" />
              {displayWebsite}
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          )}
        </div>

        {/* Open Tickets Badge */}
        {openTicketsCount !== null && (
          <div
            className="px-3 py-1.5 rounded-lg flex items-center gap-2"
            style={{
              background: openTicketsCount > 0 ? 'rgba(232,176,88,0.12)' : 'rgba(34,197,94,0.12)',
              border: `1px solid ${openTicketsCount > 0 ? 'rgba(232,176,88,0.2)' : 'rgba(34,197,94,0.2)'}`,
            }}
          >
            <Headphones
              className="w-4 h-4"
              style={{ color: openTicketsCount > 0 ? '#E8B058' : '#22c55e' }}
            />
            <span
              className="text-sm font-semibold"
              style={{ color: openTicketsCount > 0 ? '#E8B058' : '#22c55e' }}
            >
              {openTicketsCount} open
            </span>
          </div>
        )}
      </div>

      {/* Account Details Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Industry */}
          {account.industry && (
            <div className="flex items-center gap-2">
              <Building2
                className="w-4 h-4 flex-shrink-0"
                style={{ color: 'var(--ifm-color-content-secondary)' }}
              />
              <div className="min-w-0">
                <p
                  className="text-xs"
                  style={{ color: 'var(--ifm-color-content-secondary)' }}
                >
                  Industry
                </p>
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: 'var(--ifm-color-content)' }}
                >
                  {account.industry}
                </p>
              </div>
            </div>
          )}

          {/* Employees */}
          {account.employees && (
            <div className="flex items-center gap-2">
              <Users
                className="w-4 h-4 flex-shrink-0"
                style={{ color: 'var(--ifm-color-content-secondary)' }}
              />
              <div className="min-w-0">
                <p
                  className="text-xs"
                  style={{ color: 'var(--ifm-color-content-secondary)' }}
                >
                  Employees
                </p>
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: 'var(--ifm-color-content)' }}
                >
                  {typeof account.employees === 'number'
                    ? account.employees.toLocaleString()
                    : account.employees}
                </p>
              </div>
            </div>
          )}

          {/* Annual Revenue */}
          {account.annualRevenue && (
            <div className="flex items-center gap-2">
              <DollarSign
                className="w-4 h-4 flex-shrink-0"
                style={{ color: 'var(--ifm-color-content-secondary)' }}
              />
              <div className="min-w-0">
                <p
                  className="text-xs"
                  style={{ color: 'var(--ifm-color-content-secondary)' }}
                >
                  Revenue
                </p>
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: 'var(--ifm-color-content)' }}
                >
                  {typeof account.annualRevenue === 'number'
                    ? `$${(account.annualRevenue / 1000000).toFixed(1)}M`
                    : account.annualRevenue}
                </p>
              </div>
            </div>
          )}

          {/* Phone */}
          {account.phone && (
            <div className="flex items-center gap-2">
              <Phone
                className="w-4 h-4 flex-shrink-0"
                style={{ color: 'var(--ifm-color-content-secondary)' }}
              />
              <div className="min-w-0">
                <p
                  className="text-xs"
                  style={{ color: 'var(--ifm-color-content-secondary)' }}
                >
                  Phone
                </p>
                <a
                  href={`tel:${account.phone}`}
                  className="text-sm font-medium truncate hover:underline"
                  style={{ color: 'var(--ifm-color-content)' }}
                >
                  {account.phone}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Account Owner */}
        {account.owner && (
          <div
            className="mt-4 pt-4 flex items-center gap-3"
            style={{
              borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(139,92,246,0.12)',
                border: '1px solid rgba(139,92,246,0.2)',
              }}
            >
              <Users className="w-4 h-4" style={{ color: '#8b5cf6' }} />
            </div>
            <div>
              <p
                className="text-xs"
                style={{ color: 'var(--ifm-color-content-secondary)' }}
              >
                Account Owner
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: 'var(--ifm-color-content)' }}
              >
                {account.owner.name}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
