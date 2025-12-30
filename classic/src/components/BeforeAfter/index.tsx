import React from 'react';
import { ArrowRight } from 'lucide-react';
import clsx from 'clsx';

export interface BeforeAfterProps {
    before: React.ReactNode;
    after: React.ReactNode;
    beforeLabel?: string;
    afterLabel?: string;
    className?: string;
}

export default function BeforeAfter({
    before,
    after,
    beforeLabel = 'Before',
    afterLabel = 'After',
    className,
}: BeforeAfterProps) {
    return (
        <div className={clsx('my-8', className)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Before Column */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 text-sm font-semibold rounded-md bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                            {beforeLabel}
                        </span>
                    </div>
                    <div className="p-4 rounded-lg border-2 border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/10">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            {before}
                        </div>
                    </div>
                </div>

                {/* Arrow Icon */}
                <div className="hidden md:flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                </div>

                {/* After Column */}
                <div className="space-y-2 md:col-start-2">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 text-sm font-semibold rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                            {afterLabel}
                        </span>
                    </div>
                    <div className="p-4 rounded-lg border-2 border-green-200 dark:border-green-800/50 bg-green-50/50 dark:bg-green-900/10">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            {after}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Arrow - shown below on mobile */}
            <div className="md:hidden flex items-center justify-center my-4">
                <ArrowRight className="w-6 h-6 text-gray-400 dark:text-gray-500 rotate-90" />
            </div>
        </div>
    );
}

