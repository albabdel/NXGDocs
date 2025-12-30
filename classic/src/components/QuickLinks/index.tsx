import React from 'react';
import { Link2 } from 'lucide-react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

export interface QuickLink {
    title: string;
    anchor: string;
    description?: string;
}

export interface QuickLinksProps {
    links: QuickLink[];
    title?: string;
    className?: string;
}

export default function QuickLinks({
    links,
    title = 'Quick Links',
    className,
}: QuickLinksProps) {
    if (!links || links.length === 0) {
        return null;
    }

    const handleClick = (anchor: string, e: React.MouseEvent) => {
        e.preventDefault();
        const target = document.querySelector(anchor);
        if (target) {
            const offset = 80; // Account for sticky header
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });

            // Update URL without jumping
            window.history.pushState(null, '', anchor);
        }
    };

    return (
        <div
            className={clsx(
                'my-6 p-4 rounded-lg border border-gray-200 dark:border-gray-700',
                'bg-gray-50 dark:bg-gray-800/50',
                className
            )}
        >
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-primary-500" />
                {title}
            </h3>
            <nav className="space-y-2" aria-label="Quick navigation links">
                {links.map((link, index) => (
                    <a
                        key={index}
                        href={link.anchor}
                        onClick={(e) => handleClick(link.anchor, e)}
                        className={clsx(
                            'block px-3 py-2 rounded-md text-sm',
                            'text-gray-700 dark:text-gray-300',
                            'hover:bg-primary-50 dark:hover:bg-primary-900/20',
                            'hover:text-primary-700 dark:hover:text-primary-400',
                            'transition-colors',
                            'border-l-2 border-transparent hover:border-primary-500'
                        )}
                    >
                        <div className="font-medium">{link.title}</div>
                        {link.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {link.description}
                            </div>
                        )}
                    </a>
                ))}
            </nav>
        </div>
    );
}

