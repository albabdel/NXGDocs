import React from 'react';
import BreakthroughCard, { BreakthroughCardProps } from './BreakthroughCard';
import styles from './BreakthroughGrid.module.css';

export interface BreakthroughGridProps {
  breakthroughs?: BreakthroughCardProps[];
  children?: React.ReactNode;
}

// Default breakthrough data
const defaultBreakthroughs: BreakthroughCardProps[] = [
  {
    number: 1,
    icon: '📦',
    title: 'Bulkimport',
    tagline: 'Deploy 1000+ devices in minutes',
    description: 'Add entire fleets of devices with a single CSV upload. What used to take weeks now takes minutes.',
    link: '/docs/breakthroughs/bulkimport',
    color: '#4F46E5'
  },
  {
    number: 2,
    icon: '🎨',
    title: 'Custom View',
    tagline: 'Your workspace, your way',
    description: 'Create personalized dashboards for every role. Operators, installers, and managers each get exactly what they need.',
    link: '/docs/breakthroughs/custom-view',
    color: '#06B6D4'
  },
  {
    number: 3,
    icon: '🧞',
    title: 'Genie',
    tagline: 'AI that works for you',
    description: 'Your intelligent assistant that automates repetitive tasks, answers questions, and learns from your preferences.',
    link: '/docs/breakthroughs/genie',
    color: '#8B5CF6'
  },
  {
    number: 4,
    icon: '💚',
    title: 'Healthcheck',
    tagline: 'Proactive system monitoring',
    description: 'Automated health monitoring catches issues before they become problems. 99.9% uptime guaranteed.',
    link: '/docs/breakthroughs/healthcheck',
    color: '#10B981'
  },
  {
    number: 5,
    icon: '🏪',
    title: 'MarketPlace',
    tagline: 'Extend your platform',
    description: 'One-click integrations with 100+ third-party services. From access control to analytics.',
    link: '/docs/breakthroughs/marketplace',
    color: '#F59E0B'
  },
  {
    number: 6,
    icon: '📊',
    title: 'NOVA99x',
    tagline: 'Analytics reimagined',
    description: 'Turn data into insights with AI-powered analytics that predict issues and optimize operations.',
    link: '/docs/breakthroughs/nova99x',
    color: '#EF4444'
  },
  {
    number: 7,
    icon: '💓',
    title: 'Pulse View',
    tagline: 'Real-time system pulse',
    description: 'See the heartbeat of your entire security infrastructure at a glance. Know what\'s happening, instantly.',
    link: '/docs/breakthroughs/pulse-view',
    color: '#EC4899'
  },
  {
    number: 8,
    icon: '⏰',
    title: 'Time Sync',
    tagline: 'Perfect timing, always',
    description: 'Military-grade time synchronization ensures forensic-quality timestamps across all devices.',
    link: '/docs/breakthroughs/time-sync',
    color: '#14B8A6'
  },
  {
    number: 9,
    icon: '🗼',
    title: 'Tower Guard',
    tagline: 'Remote site protection',
    description: 'Monitor and secure remote towers, solar farms, and infrastructure sites without on-site staff.',
    link: '/docs/breakthroughs/tower-guard',
    color: '#6366F1'
  },
  {
    number: 10,
    icon: '🧘',
    title: 'Zen Mode',
    tagline: 'Focus on what matters',
    description: 'Eliminate distractions and noise. See only critical alerts and information when you need focus.',
    link: '/docs/breakthroughs/zen-mode',
    color: '#A855F7'
  }
];

export default function BreakthroughGrid({
  breakthroughs = defaultBreakthroughs,
  children
}: BreakthroughGridProps): JSX.Element {
  return (
    <div className={styles.breakthroughGrid}>
      {children || breakthroughs.map((breakthrough) => (
        <BreakthroughCard key={breakthrough.number} {...breakthrough} />
      ))}
    </div>
  );
}
