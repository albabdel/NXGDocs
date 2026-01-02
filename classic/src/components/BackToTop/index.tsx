import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';
import BrowserOnly from '@docusaurus/BrowserOnly';

/**
 * BackToTop Component
 * 
 * A floating button that appears after scrolling down,
 * allowing users to quickly return to the top of the page.
 */
function BackToTopInner(): React.ReactElement | null {
    const [isVisible, setIsVisible] = useState(false);
    const [isDark, setIsDark] = useState(true);

    // Read theme from document (similar to ThemeToggle)
    const getCurrentTheme = useCallback(() => {
        if (typeof document === 'undefined') return 'dark';
        const docTheme = document.documentElement.getAttribute('data-theme');
        return docTheme || 'dark';
    }, []);

    // Update theme state when it changes
    useEffect(() => {
        const updateTheme = () => {
            setIsDark(getCurrentTheme() === 'dark');
        };
        
        updateTheme();

        // Watch for attribute changes on document element
        const observer = new MutationObserver(() => {
            updateTheme();
        });
        
        observer.observe(document.documentElement, { 
            attributes: true, 
            attributeFilter: ['data-theme'] 
        });

        return () => {
            observer.disconnect();
        };
    }, [getCurrentTheme]);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="back-to-top-button"
            aria-label="Back to top"
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                zIndex: 1000,
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: isDark
                    ? '0 4px 20px rgba(200, 148, 70, 0.3), 0 0 30px rgba(200, 148, 70, 0.1)'
                    : '0 4px 20px rgba(0, 0, 0, 0.15)',
                background: isDark
                    ? 'linear-gradient(135deg, #C89446 0%, #E8B058 100%)'
                    : 'linear-gradient(135deg, #C89446 0%, #D4A574 100%)',
                color: isDark ? '#000' : '#fff',
                animation: 'fadeInUp 0.3s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                e.currentTarget.style.boxShadow = isDark
                    ? '0 8px 30px rgba(200, 148, 70, 0.5), 0 0 40px rgba(200, 148, 70, 0.2)'
                    : '0 8px 30px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = isDark
                    ? '0 4px 20px rgba(200, 148, 70, 0.3), 0 0 30px rgba(200, 148, 70, 0.1)'
                    : '0 4px 20px rgba(0, 0, 0, 0.15)';
            }}
        >
            <ArrowUp size={24} strokeWidth={2.5} />
        </button>
    );
}

export default function BackToTop(): React.ReactElement | null {
    return (
        <BrowserOnly fallback={null}>
            {() => <BackToTopInner />}
        </BrowserOnly>
    );
}
