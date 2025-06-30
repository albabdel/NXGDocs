import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon?: string;
  comingSoon?: boolean;
}

export default function EnhancedFeatureCard({ 
  title, 
  description, 
  href, 
  icon,
  comingSoon = false 
}: FeatureCardProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      to={href} 
      className={`${styles.featureCardLink} ${comingSoon ? styles.comingSoon : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`${styles.featureCard} ${isHovered ? styles.hovered : ''}`}>
        {icon && (
          <div className={styles.iconContainer}>
            <span className={styles.icon}>{icon}</span>
          </div>
        )}
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          {comingSoon && (
            <div className={styles.comingSoonBadge}>
              <span>Coming Soon</span>
            </div>
          )}
        </div>
        <div className={styles.hoverGlow}></div>
      </div>
    </Link>
  );
} 