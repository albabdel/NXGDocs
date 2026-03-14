import React from 'react';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import { motion } from 'framer-motion';
import {
  BookOpen,
  FileText,
  Cpu,
  Shield,
  Bell,
  Users,
  Settings,
  Radio,
  Zap,
  ArrowRight,
  Sparkles,
  Clock,
} from 'lucide-react';

interface CategoryItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  articleCount: number;
  isNew?: boolean;
  updatedRecently?: boolean;
}

interface CategoriesGridProps {
  categories: CategoryItem[];
}

const defaultCategories: CategoryItem[] = [
  {
    title: 'Getting Started',
    description: 'Setup guides, first-time login, and platform overview',
    icon: <Rocket className="w-5 h-5" />,
    href: '/docs/getting-started',
    articleCount: 12,
    isNew: true,
  },
  {
    title: 'Devices & Integrations',
    description: 'Supported hardware, protocols, and configuration guides',
    icon: <Cpu className="w-5 h-5" />,
    href: '/docs/devices',
    articleCount: 48,
    updatedRecently: true,
  },
  {
    title: 'Alert Management',
    description: 'Alarm processing, notifications, and escalation rules',
    icon: <Bell className="w-5 h-5" />,
    href: '/alarm-management',
    articleCount: 15,
  },
  {
    title: 'User Management',
    description: 'Roles, permissions, and access control configuration',
    icon: <Users className="w-5 h-5" />,
    href: '/user-management',
    articleCount: 8,
  },
  {
    title: 'Security & Compliance',
    description: 'Authentication, audit logs, and security best practices',
    icon: <Shield className="w-5 h-5" />,
    href: '/docs/security',
    articleCount: 10,
  },
  {
    title: 'Configuration',
    description: 'System settings, preferences, and customization',
    icon: <Settings className="w-5 h-5" />,
    href: '/docs/configuration',
    articleCount: 22,
  },
  {
    title: 'Towers & Sites',
    description: 'Station hierarchy, monitoring, and site management',
    icon: <Radio className="w-5 h-5" />,
    href: '/towers',
    articleCount: 18,
    updatedRecently: true,
  },
  {
    title: 'Breakthroughs',
    description: 'Core platform capabilities and innovations',
    icon: <Zap className="w-5 h-5" />,
    href: '/docs/breakthroughs',
    articleCount: 10,
    isNew: true,
  },
];

function Rocket({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

export default function CategoriesGrid({ categories = defaultCategories }: CategoriesGridProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-3 ${
              isDark
                ? 'bg-[#E8B058]/10 text-[#E8B058] border border-[#E8B058]/20'
                : 'bg-[#E8B058]/10 text-[#7A5518] border border-[#E8B058]/25'
            }`}
          >
            Documentation
          </span>
          <h2
            className="text-2xl font-bold"
            style={{ color: 'var(--ifm-color-content)' }}
          >
            Browse by Category
          </h2>
          <p
            className="text-sm mt-1"
            style={{ color: 'var(--ifm-color-content-secondary)' }}
          >
            Explore documentation organized by topic
          </p>
        </div>
        <Link
          to="/docs"
          className={`hidden md:inline-flex items-center gap-1.5 text-sm font-medium no-underline group ${
            isDark ? 'text-[#E8B058] hover:text-[#D4A047]' : 'text-[#7A5518] hover:text-[#5A3B10]'
          }`}
        >
          View All Docs
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <Link
              to={category.href}
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
              <div className="relative">
                <div
                  className="absolute -top-1 -right-1 w-1 h-8 rounded-full"
                  style={{
                    background: 'linear-gradient(180deg, #E8B058, transparent)',
                    opacity: 0.5,
                  }}
                />
              </div>

              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-lg"
                  style={{
                    background: 'rgba(232,176,88,0.1)',
                    color: 'var(--ifm-color-primary)',
                  }}
                >
                  {category.icon}
                </div>
                {(category.isNew || category.updatedRecently) && (
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                      category.isNew
                        ? isDark
                          ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                          : 'bg-green-500/10 text-green-600 border border-green-500/20'
                        : isDark
                        ? 'bg-[#E8B058]/15 text-[#E8B058] border border-[#E8B058]/25'
                        : 'bg-[#E8B058]/10 text-[#7A5518] border border-[#E8B058]/20'
                    }`}
                  >
                    {category.isNew ? (
                      <>
                        <Sparkles className="w-2.5 h-2.5" />
                        New
                      </>
                    ) : (
                      <>
                        <Clock className="w-2.5 h-2.5" />
                        Updated
                      </>
                    )}
                  </span>
                )}
              </div>

              <h3
                className="font-semibold mb-1.5 group-hover:text-[#E8B058] transition-colors"
                style={{ color: 'var(--ifm-color-content)' }}
              >
                {category.title}
              </h3>

              <p
                className="text-xs leading-relaxed mb-3 line-clamp-2"
                style={{ color: 'var(--ifm-color-content-secondary)' }}
              >
                {category.description}
              </p>

              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-medium ${
                    isDark ? 'text-white/40' : 'text-[#5A3B10]/50'
                  }`}
                >
                  {category.articleCount} articles
                </span>
                <ArrowRight
                  className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
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
