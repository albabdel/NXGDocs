import React from 'react';
import Link from '@docusaurus/Link';
import { ArrowRight } from 'lucide-react';
import { useColorMode } from '@docusaurus/theme-common';

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
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    return (
        <Link
            to={href}
            className="flex items-center p-4 rounded-xl border no-underline group transition-all duration-200"
            style={{
                background: isDark ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.65)',
                backdropFilter: 'blur(10px) saturate(130%)',
                WebkitBackdropFilter: 'blur(10px) saturate(130%)',
                borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.12)',
                boxShadow: isDark
                    ? 'inset 0 1px 0 rgba(59,130,246,0.06)'
                    : 'inset 0 1px 0 rgba(59,130,246,0.1), 0 1px 4px rgba(0,0,0,0.04)',
            }}
        >
            <div
                className="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 mr-4 transition-all duration-200"
                style={{
                    background: 'rgba(59,130,246,0.1)',
                    color: 'var(--ifm-color-primary)',
                }}
            >
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-0.5 truncate" style={{ color: 'var(--ifm-color-content)' }}>
                    {title}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                    {description}
                </p>
            </div>
            <ArrowRight
                className="w-4 h-4 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-3"
                style={{ color: 'var(--ifm-color-primary)', opacity: 0.6 }}
            />
        </Link>
    );
}
