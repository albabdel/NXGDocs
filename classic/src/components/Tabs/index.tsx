import React, { useState } from 'react';
import clsx from 'clsx';

export function Tabs({ defaultValue, children }: {
    defaultValue: string;
    children: React.ReactNode;
}) {
    const [activeTab, setActiveTab] = useState(defaultValue);

    const tabs = React.Children.toArray(children);

    return (
        <div className="my-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                {tabs.map((tab: any) => (
                    <button
                        key={tab.props.value}
                        onClick={() => setActiveTab(tab.props.value)}
                        className={clsx(
                            'px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap',
                            'border-b-2 -mb-px',
                            activeTab === tab.props.value
                                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:border-gray-300'
                        )}
                    >
                        {tab.props.label}
                    </button>
                ))}
            </div>
            <div className="mt-4">
                {tabs.find((tab: any) => tab.props.value === activeTab)}
            </div>
        </div>
    );
}

export function TabItem({ value, label, children }: {
    value: string;
    label: string;
    children: React.ReactNode;
}) {
    return <div className="prose dark:prose-invert max-w-none">{children}</div>;
}
