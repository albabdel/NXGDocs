import React from 'react';
import { AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

export type CalloutType = 'info' | 'success' | 'warning' | 'error' | 'tip' | 'important' | 'note' | 'caution';

const ICONS = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
    tip: Info,
    important: AlertTriangle,
    note: Info,
    caution: AlertTriangle,
};

const ICON_COLORS = {
    info: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    error: 'text-red-600 dark:text-red-400',
    tip: 'text-primary-600 dark:text-primary-400',
    important: 'text-yellow-600 dark:text-yellow-400',
    note: 'text-blue-600 dark:text-blue-400',
    caution: 'text-orange-600 dark:text-orange-400',
};

const STYLES = {
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 text-blue-900 dark:text-blue-200',
    success: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/50 text-green-900 dark:text-green-200',
    warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800/50 text-yellow-900 dark:text-yellow-200',
    error: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/50 text-red-900 dark:text-red-200',
    tip: 'bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-800/50 text-primary-900 dark:text-primary-200',
    important: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800/50 text-yellow-900 dark:text-yellow-200',
    note: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 text-blue-900 dark:text-blue-200',
    caution: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800/50 text-orange-900 dark:text-orange-200',
};

export interface CalloutProps {
    type?: CalloutType;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export default function Callout({
    type = 'info',
    title,
    children,
    className,
}: CalloutProps) {
    const Icon = ICONS[type];
    const iconColor = ICON_COLORS[type];

    return (
        <div
            className={clsx(
                'border-l-4 p-4 my-4 rounded-r-lg shadow-sm',
                STYLES[type],
                className
            )}
            role="alert"
            aria-live="polite"
        >
            <div className="flex items-start gap-3">
                <Icon
                    className={clsx(
                        'w-5 h-5 flex-shrink-0 mt-0.5',
                        iconColor
                    )}
                    aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                    {title && (
                        <p className="font-semibold mb-1.5 text-current">
                            {title}
                        </p>
                    )}
                    <div className="prose prose-sm dark:prose-invert max-w-none text-current">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
