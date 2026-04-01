import React from 'react';
import Link from '@docusaurus/Link';
import { motion } from 'framer-motion';
import { Rocket, Plug, PlayCircle, HelpCircle, ArrowRight } from 'lucide-react';

interface QuickLinkItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
  variant?: 'primary' | 'secondary';
}

const quickLinks: QuickLinkItem[] = [
  {
    title: 'Getting Started',
    description: 'New user? Start here with step-by-step guides',
    icon: <Rocket className="w-5 h-5" />,
    href: '/getting-started',
    badge: 'New Users',
    variant: 'primary',
  },
  {
    title: 'Integration Hub',
    description: 'Browse supported devices and configure integrations',
    icon: <Plug className="w-5 h-5" />,
    href: '/integration-hub',
  },
  {
    title: 'Video Tutorials',
    description: 'Watch walkthroughs and how-to videos',
    icon: <PlayCircle className="w-5 h-5" />,
    href: '/video-tutorials',
  },
  {
    title: 'Contact Support',
    description: 'Get help from our support team',
    icon: <HelpCircle className="w-5 h-5" />,
    href: '/contact',
  },
];

export default function QuickLinksSection() {
  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <span className="section-badge">
          Quick Access
        </span>
        <h2
          className="text-2xl font-bold"
          style={{ color: 'var(--ifm-color-content)' }}
        >
          Start Here
        </h2>
        <p
          className="text-sm mt-1"
          style={{ color: 'var(--ifm-color-content-secondary)' }}
        >
          Essential resources for every user
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickLinks.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <Link
              to={item.href}
              className={`quick-link-card no-underline group ${
                item.variant === 'primary' ? 'quick-link-card-primary' : ''
              }`}
            >
              <div
                className="icon-container icon-container-lg flex-shrink-0 mr-4"
                style={{
                  background: item.variant === 'primary'
                    ? 'rgba(232,176,88,0.15)'
                    : undefined,
                }}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3
                    className="font-semibold text-sm"
                    style={{ color: 'var(--ifm-color-content)' }}
                  >
                    {item.title}
                  </h3>
                  {item.badge && (
                    <span className="status-badge-updated">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: 'var(--ifm-color-content-secondary)' }}
                >
                  {item.description}
                </p>
              </div>
              <ArrowRight
                className="w-4 h-4 flex-shrink-0 ml-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                style={{ color: 'var(--ifm-color-primary)' }}
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
