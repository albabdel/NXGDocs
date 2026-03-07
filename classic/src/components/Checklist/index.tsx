import React, { useState } from 'react';

interface ChecklistItemProps {
    id: string;
    title: string;
    description?: string;
}

export function ChecklistItem({ id, title, description }: ChecklistItemProps): React.JSX.Element {
    const [checked, setChecked] = useState(false);

    return (
        <div
            className="flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer"
            style={{
                backgroundColor: checked
                    ? 'rgba(232, 176, 88, 0.05)'
                    : 'var(--ifm-background-surface-color)',
                borderColor: checked ? '#E8B058' : 'var(--ifm-color-emphasis-200)',
            }}
            onClick={() => setChecked(!checked)}
        >
            <div
                className="flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center mt-0.5 transition-all"
                style={{
                    borderColor: checked ? '#E8B058' : 'var(--ifm-color-emphasis-400)',
                    backgroundColor: checked ? '#E8B058' : 'transparent',
                }}
            >
                {checked && (
                    <svg className="w-3.5 h-3.5 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}
            </div>
            <div className="flex-1">
                <div
                    className="font-semibold text-sm"
                    style={{
                        color: checked ? 'var(--ifm-color-content-secondary)' : 'var(--ifm-color-content)',
                        textDecoration: checked ? 'line-through' : 'none',
                    }}
                >
                    {title}
                </div>
                {description && (
                    <div
                        className="text-sm mt-1"
                        style={{ color: 'var(--ifm-color-content-secondary)' }}
                    >
                        {description}
                    </div>
                )}
            </div>
        </div>
    );
}

interface ChecklistProps {
    children: React.ReactNode;
}

export default function Checklist({ children }: ChecklistProps): React.JSX.Element {
    return (
        <div className="space-y-3 my-6">
            {children}
        </div>
    );
}
