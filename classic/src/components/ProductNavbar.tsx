import React from 'react';
import styles from './ProductNavbar.module.css';

declare const PRODUCT: string;
const productId = typeof process !== 'undefined' ? (process.env.PRODUCT || 'gcxone') : 'gcxone';

const PRODUCT_NAMES: Record<string, string> = { gcxone: 'GCXONE' };
const PRODUCT_LOGOS: Record<string, string> = { gcxone: '/img/XoLogo.png' };

export default function ProductNavbar(): JSX.Element {
  const name = PRODUCT_NAMES[productId] || PRODUCT_NAMES.gcxone;
  const logoSrc = PRODUCT_LOGOS[productId] || PRODUCT_LOGOS.gcxone;
  return (
    <nav className={styles.productNavbar}>
      <div className={styles.navbarBrand}>
        <img src={logoSrc} alt={name + ' Logo'} className={styles.navbarLogo} />
        <span className={styles.navbarTitle}>{name} Documentation</span>
      </div>
    </nav>
  );
}
