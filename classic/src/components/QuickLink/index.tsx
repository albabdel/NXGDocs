import React from 'react';
import Link from '@docusaurus/Link';
import { ArrowRight } from 'lucide-react';

export default function QuickLink({
    title,
    description,
    icon,
    href,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
}) {
    return (
        <Link
            to={href}
            className="flex items-start p-4 rounded-lg border no-underline group"
            style={{
                background: 'var(--ifm-background-surface-color)',
                borderColor: 'var(--ifm-color-emphasis-200)',
                transition: 'all 0.3s ease-in-out'
            }}
        >
            <div className="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 mr-4" style={{ 
                background: 'rgba(232, 176, 88, 0.1)', 
                color: 'var(--ifm-color-primary)',
                transition: 'all 0.3s ease-in-out' 
            }}>
                {icon}
            </div>
            <div className="flex-1">
                <h4 className="font-semibold mb-1" style={{ color: 'var(--ifm-color-content)', transition: 'all 0.3s ease-in-out' }}>
                    {title}
                </h4>
                <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)', transition: 'all 0.3s ease-in-out' }}>
                    {description}
                </p>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" style={{ color: 'var(--ifm-color-primary)' }} />
        </Link>
    );
}
