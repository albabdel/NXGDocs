import React from 'react';
import Link from '@docusaurus/Link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeatureCard({
    title,
    description,
    icon,
    link,
    badge,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    link: string;
    badge?: string;
}) {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <Link
                to={link}
                className="feature-card-glass block p-6 rounded-xl border no-underline group"
            >
                <div className="flex items-start justify-between mb-4">
                    <motion.div
                        className="card-icon w-12 h-12 flex items-center justify-center rounded-lg flex-shrink-0"
                        style={{
                            color: 'var(--ifm-color-primary)',
                        }}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                    >
                        {icon}
                    </motion.div>
                    {badge && (
                        <motion.span
                            className="px-2 py-1 text-xs font-medium rounded-full"
                            style={{
                                background: 'rgba(232, 176, 88, 0.12)',
                                color: 'var(--ifm-color-primary)',
                                border: '1px solid rgba(232,176,88,0.2)',
                            }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                        >
                            {badge}
                        </motion.span>
                    )}
                </div>
                <h3
                    className="text-base font-semibold mb-2"
                    style={{ color: 'var(--ifm-color-content)', transition: 'all 0.25s ease' }}
                >
                    {title}
                </h3>
                <p
                    className="text-sm mb-4 leading-relaxed"
                    style={{ color: 'var(--ifm-color-content-secondary)', transition: 'all 0.25s ease' }}
                >
                    {description}
                </p>
                <div
                    className="flex items-center text-sm font-medium"
                    style={{ color: 'var(--ifm-color-primary)', transition: 'all 0.25s ease' }}
                >
                    Learn more
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>
        </motion.div>
    );
}
