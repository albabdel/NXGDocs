import React from 'react';
import { Search, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';
import useSearchAnalyticsEnhanced from '../SearchModal/hooks/useSearchAnalyticsEnhanced';
import MetricCard from './MetricCard';
import SearchTrendChart from './SearchTrendChart';
import TopQueriesTable from './TopQueriesTable';
import ZeroResultsTable from './ZeroResultsTable';
import styles from './SearchAnalyticsDashboard.module.css';

const DATE_RANGE_OPTIONS = [
  { value: 7, label: '7 days' },
  { value: 30, label: '30 days' },
  { value: 90, label: '90 days' },
] as const;

export default function SearchAnalyticsDashboard(): JSX.Element {
  const {
    summary,
    dailyStats,
    topQueries,
    zeroResultQueries,
    dateRange,
    setDateRange,
    isLoading,
    clearAnalytics,
  } = useSearchAnalyticsEnhanced();

  if (isLoading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Search Analytics</h1>
          <p className={styles.subtitle}>Monitor search performance and discover content gaps</p>
        </div>
        <div className={styles.controls}>
          <div className={styles.dateRangeSelector}>
            {DATE_RANGE_OPTIONS.map(option => (
              <button
                key={option.value}
                className={`${styles.dateRangeButton} ${dateRange === option.value ? styles.active : ''}`}
                onClick={() => setDateRange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button className={styles.clearButton} onClick={clearAnalytics}>
            Clear Data
          </button>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <MetricCard
          title="Total Searches"
          value={summary.totalSearches}
          change={summary.searchesChange}
          icon={<Search />}
        />
        <MetricCard
          title="Unique Queries"
          value={summary.uniqueQueries}
          change={summary.uniqueQueriesChange}
          icon={<BarChart3 />}
        />
        <MetricCard
          title="Success Rate"
          value={summary.avgCtr}
          change={summary.avgCtrChange}
          icon={<TrendingUp />}
          format="percent"
        />
        <MetricCard
          title="Zero Result Rate"
          value={summary.zeroResultRate}
          change={summary.zeroResultRateChange}
          icon={<AlertTriangle />}
          format="percent"
        />
      </div>

      <div className={styles.chartsSection}>
        <SearchTrendChart data={dailyStats} />
      </div>

      <div className={styles.tablesGrid}>
        <div className={styles.tableSection}>
          <h2 className={styles.sectionTitle}>Top Queries</h2>
          <TopQueriesTable queries={topQueries} />
        </div>
        <div className={styles.tableSection}>
          <h2 className={styles.sectionTitle}>Content Gaps</h2>
          <ZeroResultsTable queries={zeroResultQueries} />
        </div>
      </div>
    </div>
  );
}
