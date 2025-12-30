import React from 'react';
import Link from '@docusaurus/Link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function BreakthroughsGatewayCard(): JSX.Element {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center py-6"
        >
            <Link
                to="/docs/breakthroughs"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg no-underline transition-all duration-200 hover:gap-3"
                style={{
                    background: 'rgba(232, 176, 88, 0.05)',
                    border: '1px solid rgba(232, 176, 88, 0.15)',
                    color: '#E8B058'
                }}
            >
                <span className="text-sm font-medium">
                    Explore Breakthroughs
                </span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
        </motion.div>
    );
}
