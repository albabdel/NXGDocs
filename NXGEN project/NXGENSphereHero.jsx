import React from 'react';
import Link from '@docusaurus/Link';

/**
 * NXGEN Sphere Background Hero Component
 * 
 * This recreates the iconic nxgen.io homepage sphere effect
 * Pure CSS implementation - no external dependencies
 * 
 * Make sure to import sphere-background.css in your custom.css
 */

export default function NXGENSphereHero() {
  return (
    <div className="nxgen-sphere-background">
      {/* The Main Sphere */}
      <div className="nxgen-sphere">
        {/* Sphere visual layers */}
        <div className="sphere-glow"></div>
        <div className="sphere-body"></div>
        <div className="sphere-grid"></div>
        
        {/* Content inside sphere */}
        <div className="sphere-content">
          {/* XO Logo */}
          <div className="xo-logo">
            <div className="xo-inner">XO</div>
          </div>
          
          <div className="by-nxgen">BY NXGEN</div>
          
          <div className="sphere-tagline">
            Proactive Monitoring Operating System
          </div>
          
          {/* CTA Button */}
          <Link to="/getting-started" className="sphere-cta">
            <div className="cta-icon">🔥</div>
            <span>I'm Genie. Ready to scale with GCXONE?</span>
            <div className="cta-arrow">→</div>
          </Link>
          
          {/* Explore By Section */}
          <div className="explore-by-section">
            <div className="explore-label">EXPLORE BY</div>
            <div className="explore-buttons">
              <Link to="/explore/breakthroughs" className="explore-button">
                <div className="explore-icon">💡</div>
                <div className="explore-label-text">Breakthroughs</div>
              </Link>
              <Link to="/explore/job-functions" className="explore-button">
                <div className="explore-icon">👥</div>
                <div className="explore-label-text">Job Functions</div>
              </Link>
              <Link to="/explore/core-benefits" className="explore-button">
                <div className="explore-icon">⚡</div>
                <div className="explore-label-text">Core Benefits</div>
              </Link>
              <Link to="/explore/solution-kits" className="explore-button">
                <div className="explore-icon">📦</div>
                <div className="explore-label-text">Solution Kits</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section - Outside the sphere */}
      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-value">60K+</div>
          <div className="stat-label">Cameras & Sensors</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">20K+</div>
          <div className="stat-label">Monitored Sites</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">1.5M+</div>
          <div className="stat-label">Events per 24 hours</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">1M+</div>
          <div className="stat-label">False Alarm Filtered</div>
        </div>
      </div>
    </div>
  );
}
