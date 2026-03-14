import React from 'react';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import { motion } from 'framer-motion';
import {
  Code,
  BookOpen,
  FileText,
  Map,
  ArrowRight,
  Database,
  Sparkles,
} from 'lucide-react';

interface ResourceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  count?: number | string;
  badge?: string;
}

interface ResourcesSectionProps {
  releaseCount?: number;
  roadmapCount?: number;
}

export default function ResourcesSection({
  releaseCount = 0,
  roadmapCount = 0,
}: ResourcesSectionProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const resources: ResourceItem[] = [
    {
      title: 'API Reference',
      description: 'REST and GraphQL API documentation for developers',
      icon: <Code className="w-5 h-5" />,
      href: '/docs/api',
      badge: 'Technical',
    },
    {
      title: 'Knowledge Base',
      description: 'FAQs, troubleshooting guides, and best practices',
      icon: <BookOpen className="w-5 h-5" />,
      href: '/docs/knowledge-base',
    },
    {
      title: 'Release Notes',
      description: 'Latest platform updates and feature releases',
      icon: <FileText className="w-5 h-5" />,
      href: '/releases',
      count: releaseCount > 0 ? `${releaseCount} releases` : undefined,
    },
    {
      title: 'Product Roadmap',
      description: 'Upcoming features and platform improvements',
      icon: <Map className="w-5 h-5" />,
      href: '/roadmap',
      count: roadmapCount > 0 ? `${roadmapCount} items` : undefined,
      badge: 'Preview',
    },
  ];

  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-3 ${
            isDark
              ? 'bg-[#E8B058]/10 text-[#E8B058] border border-[#E8B058]/20'
              : 'bg-[#E8B058]/10 text-[#7A5518] border border-[#E8B058]/25'
          }`}
        >
          Resources
        </span>
        <h2
          className="text-2xl font-bold"
          style={{ color: 'var(--ifm-color-content)' }}
        >
          Additional Resources
        </h2>
        <p
          className="text-sm mt-1"
          style={{ color: 'var(--ifm-color-content-secondary)' }}
        >
          Technical references and platform updates
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {resources.map((resource, index) => (
          <motion.div
            key={resource.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            whileHover={{ y: -3 }}
          >
            <Link
              to={resource.href}
              className="block p-5 rounded-xl border no-underline group transition-all duration-200 h-full"
              style={{
                background: isDark
                  ? 'rgba(255,255,255,0.025)'
                  : 'rgba(255,255,255,0.65)',
                borderColor: isDark
                  ? 'rgba(255,255,255,0.07)'
                  : 'rgba(232,176,88,0.12)',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-lg"
                  style={{
                    background: 'rgba(232,176,88,0.1)',
                    color: 'var(--ifm-color-primary)',
                  }}
                >
                  {resource.icon}
                </div>
                {resource.badge && (
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                      isDark
                        ? 'bg-[#E8B058]/15 text-[#E8B058] border border-[#E8B058]/25'
                        : 'bg-[#E8B058]/10 text-[#7A5518] border border-[#E8B058]/20'
                    }`}
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    {resource.badge}
                  </span>
                )}
              </div>

              <h3
                className="font-semibold mb-1.5 group-hover:text-[#E8B058] transition-colors"
                style={{ color: 'var(--ifm-color-content)' }}
              >
                {resource.title}
              </h3>

              <p
                className="text-xs leading-relaxed mb-3"
                style={{ color: 'var(--ifm-color-content-secondary)' }}
              >
                {resource.description}
              </p>

              <div className="flex items-center justify-between">
                {resource.count && (
                  <span
                    className={`text-xs font-medium ${
                      isDark ? 'text-white/40' : 'text-[#5A3B10]/50'
                    }`}
                  >
                    {resource.count}
                  </span>
                )}
                <ArrowRight
                  className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                  style={{ color: 'var(--ifm-color-primary)' }}
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
