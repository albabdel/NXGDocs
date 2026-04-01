import React from 'react';
import Link from '@docusaurus/Link';
import { motion } from 'framer-motion';
import { Home, ArrowRight, ExternalLink } from 'lucide-react';

export default function ReturnHomeBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <div className="return-home-banner">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium no-underline group text-muted-dark hover:text-muted-light"
        >
          <div className="icon-container">
            <Home className="w-4 h-4" />
          </div>
          <span>Return to Home</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/docs"
            className="text-xs font-medium no-underline hover:underline text-muted-light hover:text-muted-dark"
          >
            View All Docs
          </Link>
          <a
            href="https://nxgen.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium no-underline hover:underline text-gold-link"
          >
            Visit NXGEN
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
