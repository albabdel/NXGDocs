import React from 'react';
import clsx from 'clsx';

export default function Steps({ children }: { children: React.ReactNode }) {
    const steps = React.Children.toArray(children);

    return (
        <div className="my-8">
            {steps.map((step, index) => (
                <div key={index} className="flex gap-4 mb-6 last:mb-0">
                    <div className="flex flex-col items-center">
                        <div className={clsx(
                            'w-8 h-8 rounded-full flex items-center justify-center',
                            'bg-primary-500 text-white font-semibold text-sm flex-shrink-0'
                        )}>
                            {index + 1}
                        </div>
                        {index < steps.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-700 mt-2 flex-1" />
                        )}
                    </div>
                    <div className="flex-1 pb-6">
                        {step}
                    </div>
                </div>
            ))}
        </div>
    );
}

export function Step({ title, children }: {
    title?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            {title && <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">{title}</h4>}
            <div className="prose prose-sm dark:prose-invert max-w-none">
                {children}
            </div>
        </div>
    );
}
