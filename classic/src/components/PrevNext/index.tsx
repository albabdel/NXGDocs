import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

export interface PrevNextProps {
    previous?: {
        title: string;
        url: string;
    };
    next?: {
        title: string;
        url: string;
    };
    className?: string;
}

export default function PrevNext({ previous, next, className }: PrevNextProps) {
    if (!previous && !next) {
        return null;
    }

    return (
        <nav
            className={clsx(
                'my-8 grid grid-cols-1 md:grid-cols-2 gap-4',
                className
            )}
            aria-label="Article navigation"
        >
            {/* Previous Link */}
            {previous ? (
                <Link
                    to={previous.url}
                    className={clsx(
                        'group flex items-center gap-3 p-4 rounded-lg',
                        'border border-gray-200 dark:border-gray-700',
                        'bg-white dark:bg-gray-800',
                        'hover:border-primary-400 dark:hover:border-primary-600',
                        'hover:shadow-md transition-all',
                        'text-left'
                    )}
                >
                    <ChevronLeft className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-primary-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                            Previous
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                            {previous.title}
                        </div>
                    </div>
                </Link>
            ) : (
                <div /> // Empty spacer for grid alignment
            )}

            {/* Next Link */}
            {next ? (
                <Link
                    to={next.url}
                    className={clsx(
                        'group flex items-center gap-3 p-4 rounded-lg',
                        'border border-gray-200 dark:border-gray-700',
                        'bg-white dark:bg-gray-800',
                        'hover:border-primary-400 dark:hover:border-primary-600',
                        'hover:shadow-md transition-all',
                        'text-left md:text-right md:flex-row-reverse'
                    )}
                >
                    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-primary-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                            Next
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                            {next.title}
                        </div>
                    </div>
                </Link>
            ) : null}
        </nav>
    );
}

