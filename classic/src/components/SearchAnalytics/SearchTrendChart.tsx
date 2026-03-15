import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import styles from './Charts.module.css';

interface DailyStat {
  date: string;
  searches: number;
  uniqueQueries: number;
  zeroResults: number;
}

interface SearchTrendChartProps {
  data: DailyStat[];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function SearchTrendChart({ data }: SearchTrendChartProps): JSX.Element {
  const chartData = useMemo(() => {
    return data.map(d => ({
      ...d,
      displayDate: formatDate(d.date),
    }));
  }, [data]);

  const maxValue = useMemo(() => {
    if (data.length === 0) return 10;
    return Math.max(...data.map(d => Math.max(d.searches, d.uniqueQueries))) * 1.1;
  }, [data]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Search Trends</h3>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#E8B058' }} />
            <span>Searches</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#22c55e' }} />
            <span>Unique Queries</span>
          </div>
        </div>
      </div>
      <div className={styles.chartWrapper}>
        {data.length === 0 ? (
          <div className={styles.emptyChart}>
            No data available for the selected period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8B058" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#E8B058" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 148, 70, 0.1)" vertical={false} />
              <XAxis
                dataKey="displayDate"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--nxgen-text-secondary, #a0a0a0)', fontSize: 11 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--nxgen-text-secondary, #a0a0a0)', fontSize: 11 }}
                domain={[0, maxValue]}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(30, 30, 35, 0.95)',
                  border: '1px solid rgba(200, 148, 70, 0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#E8B058', fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="searches"
                stroke="#E8B058"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSearches)"
              />
              <Area
                type="monotone"
                dataKey="uniqueQueries"
                stroke="#22c55e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUnique)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
