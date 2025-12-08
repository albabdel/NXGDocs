import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

interface Feature {
  name: string;
  slug: string;
  title: string;
  description: string;
  logoPath?: string;
}

// Helper function to safely import logo
function importLogo(featureName: string): string | null {
  try {
    return require(`@site/docs/features/${featureName}/logo.svg`).default;
  } catch {
    return null;
  }
}

// Define features with their metadata
const features: Feature[] = [
  {
    name: 'NOVA99x',
    slug: '/docs/features/NOVA99x/content',
    title: 'Nova99x',
    description: 'Silence the Noise. Focus on What\'s Real.',
    logoPath: importLogo('NOVA99x'),
  },
  {
    name: 'BulkImport',
    slug: '/docs/features/BulkImport/content',
    title: 'Bulk Import',
    description: 'Thousands of Sites. Imported in Minutes.',
    logoPath: importLogo('BulkImport'),
  },
  {
    name: 'CustomView',
    slug: '/docs/features/CustomView/content',
    title: 'Custom View',
    description: 'See What Matters. Filter Out What Doesn\'t.',
    logoPath: importLogo('CustomView'),
  },
  {
    name: 'HealthCheck',
    slug: '/docs/features/HealthCheck/content',
    title: 'Health Check',
    description: 'Catch Failures Before They Cost You.',
    logoPath: importLogo('HealthCheck'),
  },
  {
    name: 'MarketPlace',
    slug: '/docs/features/MarketPlace/content',
    title: 'Marketplace',
    description: 'Launch New Client Services Instantly. Expand Revenue. Zero Hassle.',
    logoPath: importLogo('MarketPlace'),
  },
  {
    name: 'PulseView',
    slug: '/docs/features/PulseView/content',
    title: 'PulseView',
    description: 'Turn Any Camera Into a Time Machine.',
    logoPath: importLogo('PulseView'),
  },
  {
    name: 'TimeSync',
    slug: '/docs/features/TimeSync/content',
    title: 'TimeSync',
    description: 'Every Camera. Perfectly Aligned.',
    logoPath: importLogo('TimeSync'),
  },
  {
    name: 'TowerGuard',
    slug: '/docs/features/TowerGuard/content',
    title: 'TowerGuard',
    description: 'Deploy Towers 3x Faster. With Zero Site Downtime.',
    logoPath: importLogo('TowerGuard'),
  },
  {
    name: 'ZenMode',
    slug: '/docs/features/ZenMode/content',
    title: 'Zen Mode',
    description: 'Less Distraction. More Action.',
    logoPath: importLogo('ZenMode'),
  },
];

function FeatureCard({ feature }: { feature: Feature }) {
  const href = useBaseUrl(feature.slug);
  return (
    <div className={styles.featureCard}>
      <Link to={href} className={styles.featureLink}>
        {feature.logoPath && (
          <div className={styles.featureIcon}>
            <img src={feature.logoPath} alt={`${feature.title} logo`} />
          </div>
        )}
        <div className={styles.featureContent}>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      </Link>
    </div>
  );
}

export default function FeaturesGrid(): React.JSX.Element {
  return (
    <div className={styles.featuresGrid}>
      {features.map((feature) => (
        <FeatureCard key={feature.name} feature={feature} />
      ))}
    </div>
  );
}
