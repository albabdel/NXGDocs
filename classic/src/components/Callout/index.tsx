import React from 'react';
import { AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

const ICONS = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
};

const STYLES = {
    info: 'bg-blue-50 border-blue-500 text-blue-900 dark:bg-blue-900/20 dark:text-blue-200',
    success: 'bg-green-50 border-green-500 text-green-900 dark:bg-green-900/20 dark:text-green-200',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-200',
    error: 'bg-red-50 border-red-500 text-red-900 dark:bg-red-900/20 dark:text-red-200',
};

export default function Callout({ type = 'info', title, children }: {
    type?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    children: React.ReactNode;
}) {
    const Icon = ICONS[type];

    return (
        <div className={clsx(
            'border-l-4 p-4 my-4 rounded-r-lg',
            STYLES[type]
        )}>
            <div className="flex items-start">
                <Icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                    {title && <p className="font-semibold mb-1">{title}</p>}
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
