import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

// Stats Section (matching nxgen.io)
function StatsSection() {
  const stats = [
    { value: '60K+', label: 'Cameras & Sensors' },
    { value: '20K+', label: 'Monitored Sites' },
    { value: '1.5M+', label: 'Events per 24 hours' },
    { value: '1M+', label: 'False Alarm Filtered' },
  ];

  return (
    <section style={{
      padding: '5rem 2rem',
      background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #0A0A0A 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated grid background */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(200, 148, 70, 0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        opacity: 0.3,
        animation: 'moveGrid 20s linear infinite',
      }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          textAlign: 'center',
        }}>
          {stats.map((stat, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #FFFFFF 0%, #D4A574 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '0.75rem',
                textShadow: '0 0 40px rgba(200, 148, 70, 0.3)',
              }}>
                {stat.value}
              </div>
              <div style={{
                color: '#AAAAAA',
                fontSize: '1rem',
                fontWeight: 500,
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Hero Section with XO branding style
function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <header style={{
      position: 'relative',
      background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #0A0A0A 100%)',
      padding: '6rem 2rem',
      textAlign: 'center',
      overflow: 'hidden',
      borderBottom: '2px solid rgba(200, 148, 70, 0.2)',
    }}>
      {/* Animated background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse at center, rgba(200, 148, 70, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* XO Logo Style */}
        <div style={{
          width: '200px',
          height: '200px',
          margin: '0 auto 2rem',
          borderRadius: '50%',
          border: '2px solid rgba(200, 148, 70, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle, rgba(200, 148, 70, 0.15) 0%, transparent 70%)',
          boxShadow: '0 0 60px rgba(200, 148, 70, 0.3), inset 0 0 60px rgba(200, 148, 70, 0.1)',
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '3px solid #C89446',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            fontWeight: 700,
            color: '#C89446',
            textShadow: '0 0 20px rgba(200, 148, 70, 0.6)',
          }}>
            XO
          </div>
        </div>

        <div style={{
          fontSize: '0.9rem',
          color: '#C89446',
          textTransform: 'uppercase',
          letterSpacing: '3px',
          marginBottom: '1rem',
          fontWeight: 600,
        }}>
          BY NXGEN
        </div>

        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #FFFFFF 0%, #D4A574 50%, #C89446 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1rem',
          letterSpacing: '-1px',
        }}>
          {siteConfig.title}
        </h1>

        <p style={{
          fontSize: '1.35rem',
          color: '#AAAAAA',
          maxWidth: '700px',
          margin: '0 auto 3rem',
          lineHeight: 1.7,
        }}>
          {siteConfig.tagline}
        </p>

        {/* Video Tutorial CTA */}
        <div style={{
          background: 'linear-gradient(90deg, rgba(26, 26, 26, 0.8) 0%, rgba(18, 18, 18, 0.8) 100%)',
          border: '1px solid rgba(200, 148, 70, 0.3)',
          borderRadius: '50px',
          padding: '1rem 2rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '3rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#C89446';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(200, 148, 70, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(200, 148, 70, 0.3)';
          e.currentTarget.style.boxShadow = 'none';
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #C89446 0%, #B58237 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0A0A0A',
            fontSize: '0.9rem',
          }}>
            🔥
          </div>
          <span style={{ color: '#DDDDDD', fontWeight: 600 }}>
            GCXONE: The Proactive Monitoring Operating System
          </span>
          <span style={{ color: '#C89446', fontSize: '1.5rem' }}>→</span>
        </div>

        {/* Explore By Buttons */}
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '2rem',
        }}>
          <Link
            className="button button--primary"
            to="/explore/breakthroughs"
            style={{
              background: 'linear-gradient(135deg, #C89446 0%, #D4A574 100%)',
              color: '#0A0A0A',
              padding: '0.85rem 2.5rem',
              borderRadius: '8px',
              fontWeight: 700,
              border: 'none',
              boxShadow: '0 4px 15px rgba(200, 148, 70, 0.4)',
              transition: 'all 0.3s ease',
            }}>
            💡 Breakthroughs
          </Link>
          <Link
            className="button button--outline"
            to="/explore/job-functions"
            style={{
              background: 'transparent',
              color: '#C89446',
              padding: '0.85rem 2.5rem',
              borderRadius: '8px',
              fontWeight: 600,
              border: '2px solid #C89446',
            }}>
            👥 Job Functions
          </Link>
          <Link
            className="button button--outline"
            to="/explore/core-benefits"
            style={{
              background: 'transparent',
              color: '#C89446',
              padding: '0.85rem 2.5rem',
              borderRadius: '8px',
              fontWeight: 600,
              border: '2px solid #C89446',
            }}>
            ⚡ Core Benefits
          </Link>
          <Link
            className="button button--outline"
            to="/explore/solution-kits"
            style={{
              background: 'transparent',
              color: '#C89446',
              padding: '0.85rem 2.5rem',
              borderRadius: '8px',
              fontWeight: 600,
              border: '2px solid #C89446',
            }}>
            📦 Solution Kits
          </Link>
        </div>
      </div>
    </header>
  );
}

// Trust Banner
function TrustBanner() {
  return (
    <section style={{
      padding: '3rem 2rem',
      textAlign: 'center',
      background: '#0A0A0A',
      borderBottom: '1px solid rgba(200, 148, 70, 0.1)',
    }}>
      <div className="container">
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#FFFFFF',
          marginBottom: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '2px',
        }}>
          TRUSTED BY COMPANIES FROM 10+ COUNTRIES
        </h2>
        <p style={{
          color: '#888888',
          fontSize: '1rem',
        }}>
          Supporting innovation at every stage of growth
        </p>
      </div>
    </section>
  );
}

// Quick Access Cards
function QuickAccessSection() {
  const items = [
    {
      icon: '📚',
      title: 'Platform Overview',
      description: 'Learn about core concepts and architecture',
      link: '/platform/overview',
    },
    {
      icon: '⚡',
      title: 'Quick Start Guide',
      description: 'Get up and running in 5 minutes',
      link: '/getting-started',
    },
    {
      icon: '🔌',
      title: 'Device Integration',
      description: 'Connect your first device',
      link: '/integrations/setup',
    },
    {
      icon: '🎥',
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      link: '/tutorials',
    },
  ];

  return (
    <section style={{ padding: '5rem 2rem' }}>
      <div className="container">
        <h2 style={{
          textAlign: 'center',
          fontSize: '2.25rem',
          fontWeight: 600,
          background: 'linear-gradient(90deg, #FFFFFF 0%, #D4A574 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.75rem',
        }}>
          Get Started with GCXONE
        </h2>
        <p style={{
          textAlign: 'center',
          color: '#888888',
          marginBottom: '3rem',
          fontSize: '1.05rem',
        }}>
          Choose your path to mastering the platform
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
        }}>
          {items.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              style={{
                background: 'linear-gradient(135deg, #121212 0%, #1A1A1A 100%)',
                border: '1px solid #2A2A2A',
                borderRadius: '12px',
                padding: '2rem',
                transition: 'all 0.4s ease',
                textDecoration: 'none',
                display: 'block',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#C89446';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(200, 148, 70, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2A2A2A';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, rgba(200, 148, 70, 0.2) 0%, rgba(200, 148, 70, 0.1) 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                marginBottom: '1.5rem',
                border: '1px solid rgba(200, 148, 70, 0.3)',
              }}>
                {item.icon}
              </div>
              <h3 style={{
                fontSize: '1.35rem',
                fontWeight: 600,
                color: '#FFFFFF',
                marginBottom: '0.75rem',
              }}>
                {item.title}
              </h3>
              <p style={{
                color: '#AAAAAA',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                margin: 0,
              }}>
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Resources Section
function ResourcesSection() {
  const resources = [
    { icon: '📰', title: 'News', description: 'Latest updates and announcements', link: '/resources/news' },
    { icon: '📅', title: 'Events', description: 'Upcoming webinars and conferences', link: '/resources/events' },
    { icon: '🛟', title: '24/7 Support', description: 'Get help anytime, anywhere', link: '/resources/support' },
  ];

  return (
    <section style={{
      padding: '5rem 2rem',
      background: 'linear-gradient(135deg, #0A0A0A 0%, #121212 100%)',
      borderTop: '1px solid rgba(200, 148, 70, 0.1)',
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '3rem',
        }}>
          <div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 600,
              color: '#FFFFFF',
              marginBottom: '0.5rem',
            }}>
              Resources
            </h2>
            <p style={{ color: '#888888', margin: 0 }}>
              Everything you need to succeed
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
        }}>
          {resources.map((resource, idx) => (
            <div key={idx} className="card">
              <div className="card__icon" style={{ marginBottom: '1.5rem' }}>
                {resource.icon}
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#FFFFFF',
                marginBottom: '0.75rem',
              }}>
                {resource.title}
              </h3>
              <p style={{
                color: '#AAAAAA',
                fontSize: '0.95rem',
                marginBottom: '1.5rem',
              }}>
                {resource.description}
              </p>
              <Link
                to={resource.link}
                style={{
                  color: '#D4A574',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}>
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Support Section
function SupportSection() {
  return (
    <section style={{
      padding: '5rem 2rem',
      background: '#0A0A0A',
      borderTop: '1px solid rgba(200, 148, 70, 0.1)',
    }}>
      <div className="container">
        <h2 style={{
          textAlign: 'center',
          fontSize: '2.25rem',
          fontWeight: 600,
          background: 'linear-gradient(90deg, #FFFFFF 0%, #D4A574 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.75rem',
        }}>
          Need Help?
        </h2>
        <p style={{
          textAlign: 'center',
          color: '#888888',
          marginBottom: '3rem',
          fontSize: '1.05rem',
        }}>
          We're here to support you every step of the way
        </p>

        <div style={{
          maxWidth: '700px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {[
            { icon: '💬', title: 'Knowledge Base', desc: 'Search our comprehensive documentation', link: '/support/knowledge-base' },
            { icon: '📥', title: 'Download Integration', desc: 'Get the latest drivers and tools', link: '/support/downloads' },
            { icon: '🟢', title: 'System Live Status', desc: 'Check platform health and uptime', link: 'https://status.gcxone.com' },
            { icon: '📧', title: 'Contact Support', desc: 'Reach out to our expert team', link: '/support/contact' },
          ].map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className="quick-start__item"
              style={{ textDecoration: 'none' }}>
              <div className="quick-start__item-content">
                <div className="quick-start__item-icon">{item.icon}</div>
                <div className="quick-start__item-text">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
              <span style={{ fontSize: '1.5rem', color: '#C89446' }}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Homepage Component
export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="GCXONE - Proactive Monitoring Operating System by NXGEN Technology">
      <HomepageHeader />
      <StatsSection />
      <TrustBanner />
      <QuickAccessSection />
      <ResourcesSection />
      <SupportSection />
    </Layout>
  );
}
