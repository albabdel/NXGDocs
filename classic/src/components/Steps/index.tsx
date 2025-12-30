import React from 'react';
import clsx from 'clsx';
import { Check } from 'lucide-react';

export interface StepsProps {
    children: React.ReactNode;
    className?: string;
}

export default function Steps({ children, className }: StepsProps) {
    const steps = React.Children.toArray(children);

    return (
        <div className={clsx('my-8', className)}>
            <ol className="space-y-6" role="list">
                {steps.map((step, index) => (
                    <li key={index} className="flex gap-4">
                        {/* Step number/connector */}
                        <div className="flex flex-col items-center flex-shrink-0">
                            <div
                                className={clsx(
                                    'w-8 h-8 rounded-full flex items-center justify-center',
                                    'bg-primary-500 text-white font-semibold text-sm',
                                    'ring-4 ring-primary-100 dark:ring-primary-900/30',
                                    'shadow-sm'
                                )}
                                aria-label={`Step ${index + 1}`}
                            >
                                {index + 1}
                            </div>
                            {index < steps.length - 1 && (
                                <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2 flex-1 min-h-[2rem]" />
                            )}
                        </div>

                        {/* Step content */}
                        <div className="flex-1 pb-6 min-w-0">
                            {step}
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}

export interface StepProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function Step({ title, children, className }: StepProps) {
    return (
        <div className={className}>
            {title && (
                <h4 className="font-semibold mb-3 text-lg text-gray-900 dark:text-gray-100">
                    {title}
                </h4>
            )}
            <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                {children}
            </div>
        </div>
    );
}
