import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

export interface TabsProps {
    defaultValue: string;
    children: React.ReactNode;
    className?: string;
}

export function Tabs({ defaultValue, children, className }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultValue);

    const tabs = React.Children.toArray(children);

    // Sync with URL hash if present
    useEffect(() => {
        const hash = window.location.hash.slice(1);
        if (hash) {
            const tabExists = tabs.some((tab: any) => tab.props.value === hash);
            if (tabExists) {
                setActiveTab(hash);
            }
        }
    }, [tabs]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        // Update URL hash without scrolling
        if (window.history.replaceState) {
            window.history.replaceState(null, '', `#${value}`);
        }
    };

    return (
        <div className={clsx('my-6', className)}>
            {/* Tab buttons */}
            <div
                className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto"
                role="tablist"
                aria-orientation="horizontal"
            >
                {tabs.map((tab: any) => {
                    const isActive = activeTab === tab.props.value;
                    return (
                        <button
                            key={tab.props.value}
                            onClick={() => handleTabChange(tab.props.value)}
                            className={clsx(
                                'px-4 py-2.5 font-medium text-sm transition-colors whitespace-nowrap',
                                'border-b-2 -mb-px relative',
                                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:rounded-t-md',
                                isActive
                                    ? 'border-primary-500 text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-900/20'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
                            )}
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`tabpanel-${tab.props.value}`}
                            id={`tab-${tab.props.value}`}
                        >
                            {tab.props.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab content */}
            <div className="mt-4" role="tabpanel">
                {tabs.find((tab: any) => tab.props.value === activeTab)}
            </div>
        </div>
    );
}

export interface TabItemProps {
    value: string;
    label: string;
    children: React.ReactNode;
    className?: string;
}

export function TabItem({ value, label, children, className }: TabItemProps) {
    return (
        <div
            id={`tabpanel-${value}`}
            role="tabpanel"
            aria-labelledby={`tab-${value}`}
            className={clsx('prose dark:prose-invert max-w-none', className)}
        >
            {children}
        </div>
    );
}

// Default export for easier importing
export default Tabs;
