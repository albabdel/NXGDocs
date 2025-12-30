import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export default function Collapsible({
    title,
    children,
    defaultOpen = false,
    className,
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={clsx('my-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden', className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    'w-full flex items-center justify-between px-4 py-3',
                    'bg-gray-50 dark:bg-gray-800',
                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                    'transition-colors',
                    'text-left'
                )}
                aria-expanded={isOpen}
                aria-controls={`collapsible-content-${title}`}
            >
                <span className="font-medium text-gray-900 dark:text-gray-100">{title}</span>
                {isOpen ? (
                    <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2" />
                ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2" />
                )}
            </button>
            {isOpen && (
                <div
                    id={`collapsible-content-${title}`}
                    className="px-4 py-4 bg-white dark:bg-gray-900 prose prose-sm dark:prose-invert max-w-none"
                >
                    {children}
                </div>
            )}
        </div>
    );
}

