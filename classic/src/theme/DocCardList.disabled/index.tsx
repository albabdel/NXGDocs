import React from 'react';
import Link from '@docusaurus/Link';
import { useCurrentSidebarCategory } from '@docusaurus/theme-common';
import styles from './styles.module.css';

// Default icon for items that don't have a specific logo
const DefaultIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z"></path>
    </svg>
);

function Card({ item }: { item: any }) {
    const href = item.href;
    const label = item.label;
    const description = item.description ?? item.customProps?.description;

    return (
        <div className={styles.featureCard}>
            <Link to={href} className={styles.featureLink}>
                <div className={styles.featureIcon}>
                    <DefaultIcon />
                </div>
                <div className={styles.featureContent}>
                    <h3>{label}</h3>
                    {description && <p>{description}</p>}
                </div>
            </Link>
        </div>
    );
}

export default function DocCardList({ items }: { items: any[] }): React.JSX.Element {
    const category = useCurrentSidebarCategory();
    const categoryItems = items || category?.items;

    if (!categoryItems) {
        return <></>;
    }

    return (
        <div className={styles.featuresGrid}>
            {categoryItems.map((item, index) => (
                <Card key={index} item={item} />
            ))}
        </div>
    );
}
