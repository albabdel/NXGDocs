import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { ExternalLink, Heart } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Decorative top border with gold accent */}
      <div className={styles.topBorder} />

      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.content}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <div className={styles.logoWrapper}>
              <img 
                src="/img/xo-logo.png" 
                alt="NXGEN Logo" 
                className={styles.logo}
              />
            </div>
            <p className={styles.tagline}>
              Proactive Monitoring Operating System
            </p>
            <p className={styles.description}>
              GCXONE is the industry's most advanced security platform,
              redefining how organizations protect what matters most.
            </p>
          </div>

          {/* Documentation Links */}
          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>Documentation</h4>
            <ul className={styles.linksList}>
              <li>
                <Link to="/docs/breakthroughs" className={styles.footerLink}>
                  <span className={styles.linkIcon}>✨</span>
                  Breakthroughs
                </Link>
              </li>
              <li>
                <Link to="/docs" className={styles.footerLink}>
                  Getting Started
                </Link>
              </li>
              <li>
                <Link to="/docs" className={styles.footerLink}>
                  Devices
                </Link>
              </li>
              <li>
                <Link to="#" className={styles.footerLink}>
                  Features
                </Link>
              </li>
              <li>
                <Link to="#" className={styles.footerLink}>
                  Troubleshooting
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>Resources</h4>
            <ul className={styles.linksList}>
              <li>
                <Link to="#" className={styles.footerLink}>
                  Support Center
                </Link>
              </li>
              <li>
                <Link to="#" className={styles.footerLink}>
                  Release Notes
                </Link>
              </li>
              <li>
                <a
                  href="https://nxgen.cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerLink}
                >
                  NXGEN Website
                  <ExternalLink className={styles.externalIcon} />
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>Company</h4>
            <ul className={styles.linksList}>
              <li>
                <a
                  href="https://nxgen.cloud/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerLink}
                >
                  About Us
                  <ExternalLink className={styles.externalIcon} />
                </a>
              </li>
              <li>
                <a
                  href="https://nxgen.cloud/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerLink}
                >
                  Contact
                  <ExternalLink className={styles.externalIcon} />
                </a>
              </li>
              <li>
                <a
                  href="https://nxgen.cloud/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerLink}
                >
                  Privacy Policy
                  <ExternalLink className={styles.externalIcon} />
                </a>
              </li>
              <li>
                <a
                  href="https://nxgen.cloud/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerLink}
                >
                  Terms of Service
                  <ExternalLink className={styles.externalIcon} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            <span>© {currentYear} NXGEN. All rights reserved.</span>
          </div>
          <div className={styles.builtWith}>
            <span>Built with</span>
            <Heart className={styles.heartIcon} />
            <span>using</span>
            <a
              href="https://docusaurus.io"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.docusaurusLink}
            >
              Docusaurus
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

