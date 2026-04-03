import React from 'react';
import Link from '@docusaurus/Link';
import { ExternalLink, Heart } from 'lucide-react';
import styles from './Footer.module.css';

const FOOTER_LINKS = [
  {
    title: 'Documentation',
    links: [
      { label: 'Device Integration Guide', href: '/docs' },
      { label: 'API Integration', href: '/docs' },
      { label: 'Pricing Model', href: '/docs' },
      { label: 'SMTP Setup', href: '/docs' },
      { label: 'FTP Setup', href: '/docs' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'NXGEN Website', href: 'https://nxgen.cloud', external: true },
      { label: 'Support', href: 'https://nxgen.cloud/support', external: true },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: 'https://nxgen.cloud/about', external: true },
      { label: 'Contact', href: 'https://nxgen.cloud/contact', external: true },
      { label: 'Privacy Policy', href: 'https://nxgen.cloud/privacy', external: true },
    ],
  },
];

export default function Footer(): JSX.Element {
  return (
    <footer className={styles.footer}>
      <div className={styles.topBorder} />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brandSection}>
            <div className={styles.logoWrapper}>
              <img src="/img/gcsurge-logo.png" alt="GC Surge Logo" className={styles.logo} />
            </div>
            <p className={styles.tagline}>Next-Generation Security Platform</p>
            <p className={styles.description}>
              GC Surge delivers powerful cloud-based security monitoring with real-time alerts and seamless device integration.
            </p>
          </div>
          {FOOTER_LINKS.map((section) => (
            <div key={section.title} className={styles.linksSection}>
              <h4 className={styles.sectionTitle}>{section.title}</h4>
              <ul className={styles.linksList}>
                {section.links.map((link) => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
                        {link.label}
                        <ExternalLink className={styles.externalIcon} />
                      </a>
                    ) : (
                      <Link to={link.href} className={styles.footerLink}>{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            <span>&copy; {new Date().getFullYear()} NXGEN. All rights reserved.</span>
          </div>
          <div className={styles.builtWith}>
            <span>Built with</span>
            <Heart className={styles.heartIcon} />
            <span>using</span>
            <a href="https://docusaurus.io" target="_blank" rel="noopener noreferrer" className={styles.docusaurusLink}>
              Docusaurus
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
