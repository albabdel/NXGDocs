import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { ExternalLink, Heart } from 'lucide-react';
import styles from './Footer.module.css';

declare const PRODUCT: string;
const productId = typeof process !== 'undefined' ? (process.env.PRODUCT || 'gcxone') : 'gcxone';
const PRODUCT_LOGOS: Record<string, string> = { gcxone: '/img/xo-logo.png' };

interface FooterLinkSection {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}

const FOOTER_LINKS: Record<string, FooterLinkSection[]> = {
  gcxone: [
    { title: 'Documentation', links: [
      { label: 'Breakthroughs', href: '/docs/breakthroughs' },
      { label: 'Getting Started', href: '/docs/getting-started' },
      { label: 'Devices', href: '/docs/devices' },
      { label: 'Features', href: '/docs/features' },
    ]},
    { title: 'Resources', links: [
      { label: 'Support Center', href: 'https://nxgen.cloud/support', external: true },
      { label: 'Updates Hub', href: '/updates' },
      { label: 'Release Notes', href: '/releases' },
      { label: 'Product Roadmap', href: '/roadmap' },
      { label: 'NXGEN Website', href: 'https://nxgen.cloud', external: true },
    ]},
    { title: 'Company', links: [
      { label: 'About Us', href: 'https://nxgen.cloud/about', external: true },
      { label: 'Contact', href: 'https://nxgen.cloud/contact', external: true },
      { label: 'Privacy Policy', href: 'https://nxgen.cloud/privacy', external: true },
      { label: 'Terms of Service', href: 'https://nxgen.cloud/terms', external: true },
    ]},
  ],
};

const PRODUCT_INFO: Record<string, { name: string; tagline: string; description: string }> = {
  gcxone: { name: 'GCXONE', tagline: 'Proactive Monitoring Operating System', description: 'GCXONE is the industry\'s most advanced security platform, redefining how organizations protect what matters most.' },
};

export default function Footer(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const currentYear = new Date().getFullYear();
  const productInfo = PRODUCT_INFO[productId] || PRODUCT_INFO.gcxone;
  const footerLinks = FOOTER_LINKS[productId] || FOOTER_LINKS.gcxone;

  return (
    <footer className={styles.footer}>
      <div className={styles.topBorder} />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brandSection}>
            <div className={styles.logoWrapper}>
              <img src={PRODUCT_LOGOS[productId] || '/img/xo-logo.png'} alt={productInfo.name + ' Logo'} className={styles.logo} />
            </div>
            <p className={styles.tagline}>{productInfo.tagline}</p>
            <p className={styles.description}>{productInfo.description}</p>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title} className={styles.linksSection}>
              <h4 className={styles.sectionTitle}>{section.title}</h4>
              <ul className={styles.linksList}>
                {section.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
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
            <span>(c) {currentYear} NXGEN. All rights reserved.</span>
          </div>
          <div className={styles.builtWith}>
            <span>Built with</span>
            <Heart className={styles.heartIcon} />
            <span>using</span>
            <a href="https://docusaurus.io" target="_blank" rel="noopener noreferrer" className={styles.docusaurusLink}>Docusaurus</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
