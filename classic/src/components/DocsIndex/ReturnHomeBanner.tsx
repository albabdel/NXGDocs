import React from 'react';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import { motion } from 'framer-motion';
import { Home, ArrowRight, ExternalLink } from 'lucide-react';

export default function ReturnHomeBanner() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <div
        className="flex items-center justify-between p-4 rounded-xl border"
        style={{
          background: isDark
            ? 'rgba(255,255,255,0.02)'
            : 'rgba(255,255,255,0.5)',
          borderColor: isDark
            ? 'rgba(255,255,255,0.05)'
            : 'rgba(232,176,88,0.1)',
        }}
      >
        <Link
          to="/"
          className={`flex items-center gap-2 text-sm font-medium no-underline group ${
            isDark ? 'text-white/60 hover:text-white/90' : 'text-[#5A3B10]/60 hover:text-[#5A3B10]'
          }`}
        >
          <div
            className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{
              background: 'rgba(232,176,88,0.1)',
              color: 'var(--ifm-color-primary)',
            }}
          >
            <Home className="w-4 h-4" />
          </div>
          <span>Return to Home</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/docs"
            className={`text-xs font-medium no-underline hover:underline ${
              isDark ? 'text-white/40 hover:text-white/60' : 'text-[#5A3B10]/40 hover:text-[#5A3B10]/60'
            }`}
          >
            View All Docs
          </Link>
          <a
            href="https://nxgen.io"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1 text-xs font-medium no-underline hover:underline ${
              isDark ? 'text-[#E8B058]/70 hover:text-[#E8B058]' : 'text-[#7A5518]/70 hover:text-[#7A5518]'
            }`}
          >
            Visit NXGEN
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
