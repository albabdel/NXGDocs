import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import {
    Home,
    Search,
    BookOpen,
    HelpCircle,
    ArrowRight,
    FileQuestion
} from 'lucide-react';
import QuickLink from '../components/QuickLink';

const popularPages = [
    {
        title: 'Getting Started',
        description: 'Learn the basics of GCXONE',
        icon: <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
        href: '#',
    },
    {
        title: 'Device Integration',
        description: 'Connect your devices to the platform',
        icon: <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
        href: '/docs/device-integration/standard-device-onboarding-process',
    },
    {
        title: 'Help Center',
        description: 'Get support and answers',
        icon: <HelpCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
        href: '/docs/troubleshooting-support/how-to-submit-a-support-ticket',
    },
];

export default function NotFound(): React.JSX.Element {
    return (
        <Layout title="Page Not Found">
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-6">
                <div className="max-w-2xl w-full text-center">

                    {/* 404 Icon */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center mb-8"
                    >
                        <div className="relative">
                            <FileQuestion className="w-32 h-32 text-gray-300 dark:text-gray-700" />
                            <div className="absolute -top-2 -right-2 w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                404
                            </div>
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                        Page Not Found
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-gray-600 dark:text-gray-400 mb-8"
                    >
                        We couldn't find the page you're looking for. It may have been moved or doesn't exist.
                    </motion.p>

                    {/* Search Bar - Triggers Algolia DocSearch */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full shadow-lg">
                            <Search className="w-5 h-5 text-gray-400" />
                            <span className="flex-1 text-gray-500 dark:text-gray-400">
                                Press <kbd className="px-2 py-1 mx-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium">Ctrl+K</kbd> or <kbd className="px-2 py-1 mx-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium">⌘K</kbd> to search
                            </span>
                        </div>
                    </motion.div>

                    {/* Action Button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex items-center justify-center gap-4 mb-12"
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-black rounded-full font-medium transition-all hover:shadow-lg no-underline"
                        >
                            <Home className="w-5 h-5" />
                            Go Home
                        </Link>
                    </motion.div>

                    {/* Popular Pages */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Popular Pages
                        </h2>
                        <div className="space-y-4">
                            {popularPages.map((page, index) => (
                                <motion.div
                                    key={page.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                                >
                                    <QuickLink
                                        title={page.title}
                                        description={page.description}
                                        icon={page.icon}
                                        href={page.href}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Help Text */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                        className="mt-12 text-sm text-gray-500 dark:text-gray-600"
                    >
                        If you believe this is an error, please{' '}
                        <Link
                            to="/docs/troubleshooting-support/how-to-submit-a-support-ticket"
                            className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                            contact support
                        </Link>
                    </motion.p>
                </div>
            </main>
        </Layout>
    );
}
