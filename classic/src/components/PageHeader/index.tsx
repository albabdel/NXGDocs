import React from 'react';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

// Header Theme Toggle Component
function HeaderThemeToggle() {
    const { colorMode, setColorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    // Listen for theme changes from other components
    useEffect(() => {
        const handleThemeChange = (event: CustomEvent) => {
            if (event.detail?.theme && event.detail.theme !== colorMode) {
                setColorMode(event.detail.theme);
            }
        };

        window.addEventListener('themeChange', handleThemeChange as EventListener);
        return () => {
            window.removeEventListener('themeChange', handleThemeChange as EventListener);
        };
    }, [colorMode, setColorMode]);

    const toggleColorMode = () => {
        const newMode = isDark ? 'light' : 'dark';
        setColorMode(newMode);
        // Dispatch event for other components to listen to
        window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: newMode } }));
    };

    return (
        <button
            onClick={toggleColorMode}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            className="flex items-center justify-center p-2 rounded-lg border border-[#E8B058]/30 hover:border-[#E8B058]/60 hover:bg-[#E8B058]/10 transition-all"
            style={{ height: '29px' }}
        >
            <div className={`w-11 rounded-full relative transition-colors ${isDark ? 'bg-gray-800' : 'bg-gray-300'}`} style={{ height: '20px' }}>
                <div className={`absolute top-0.5 left-0.5 w-5 rounded-full transition-transform flex items-center justify-center ${isDark ? 'translate-x-5 bg-[#E8B058]' : 'bg-white translate-x-0'}`} style={{ height: '18px' }}>
                    {isDark ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-black">
                            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13ZM12.14,19.73A8.14,8.14,0,0,1,6.34,5.23v.26A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                        </svg>
                    ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                            <path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M12,4c0.55,0,1-0.45,1-1V2c0-0.55-0.45-1-1-1 s-1,0.45-1,1v1C11,3.55,11.45,4,12,4z M12,22c-0.55,0-1-0.45-1-1v-1c0-0.55,0.45-1,1-1 s1,0.45,1,1v1C13,21.55,12.55,22,12,22z M4.22,5.64c0.39,0.39,1.03,0.39,1.41,0L6.7,4.57c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0L4.22,4.22C3.83,4.61,3.83,5.25,4.22,5.64z M17.3,19.43c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L17.3,19.43z M4,12 c0-0.55-0.45-1-1-1H2c-0.55,0-1,0.45-1,1s0.45,1,1,1h1C3.55,13,4,12.55,4,12z M22,11h-1c-0.55,0-1,0.45-1,1 s0.45,1,1,1h1c0.55,0,1-0.45,1-1S22.55,11,22,11z M6.7,19.43l-1.06,1.06c-0.39,0.39-1.03,0.39-1.41,0 c-0.39-0.39-0.39-1.03,0-1.41l1.06-1.06c0.39-0.39,1.03-0.39,1.41,0C7.09,18.39,7.09,19.04,6.7,19.43z M19.78,5.64 c0.39-0.39,0.39-1.03,0-1.41l-1.06-1.06c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 C18.75,6.03,19.39,6.03,19.78,5.64z" />
                        </svg>
                    )}
                </div>
            </div>
        </button>
    );
}

interface PageHeaderProps {
    breadcrumbs?: Array<{ label: string; href?: string }>;
    showThemeToggle?: boolean;
}

export default function PageHeader({ breadcrumbs, showThemeToggle = false }: PageHeaderProps) {
    const defaultBreadcrumbs = breadcrumbs || [
        { label: 'Home', href: '/' },
        { label: 'GCXONE' }
    ];

    return (
        <div className="relative z-50 flex items-center justify-between border-b" style={{ 
            backgroundColor: 'var(--ifm-background-color)', 
            paddingLeft: '26px',
            paddingRight: '26px',
            paddingTop: '1rem',
            paddingBottom: '1rem',
            borderBottomStyle: 'solid',
            borderBottomWidth: '1px',
            borderColor: 'var(--ifm-color-emphasis-200)',
            boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.15)',
            minHeight: '60px'
        }}>
            {/* Breadcrumb Trail */}
            <motion.nav
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 text-sm flex-wrap"
            >
                {defaultBreadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <span style={{ color: 'var(--ifm-color-emphasis-500)' }}>›</span>}
                        {crumb.href ? (
                            <Link 
                                to={crumb.href} 
                                className="hover:text-[#E8B058] transition-colors no-underline flex items-center gap-1" 
                                style={{ color: 'var(--ifm-color-content-secondary)' }}
                            >
                                {index === 0 && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                    </svg>
                                )}
                                {crumb.label}
                            </Link>
                        ) : (
                            <span className={index === defaultBreadcrumbs.length - 1 ? "text-[#E8B058] font-semibold" : ""} style={{ color: index === defaultBreadcrumbs.length - 1 ? undefined : 'var(--ifm-color-content-secondary)' }}>
                                {crumb.label}
                            </span>
                        )}
                    </React.Fragment>
                ))}
            </motion.nav>

            {/* Theme Toggle */}
            {showThemeToggle && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center"
                >
                    <HeaderThemeToggle />
                </motion.div>
            )}
        </div>
    );
}

