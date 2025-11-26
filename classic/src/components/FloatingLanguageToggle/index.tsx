import React from 'react';
import { useHistory, useLocation } from '@docusaurus/router';
import styles from './styles.module.css';

// Manual language mapping for each feature
const LANGUAGE_MAP = {
    // BulkImport
    '/features/BulkImport/content': '/features/BulkImport/content-german',
    '/features/BulkImport/content-german': '/features/BulkImport/content',

    // Add more features as they get German translations
    // '/features/CustomView/content': '/features/CustomView/content-german',
    // '/features/CustomView/content-german': '/features/CustomView/content',
};

export default function FloatingLanguageToggle(): React.JSX.Element {
    const history = useHistory();
    const location = useLocation();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Determine current language based on path
    const isGerman = location.pathname.includes('-german');

    const toggleLanguage = () => {
        const currentPath = location.pathname;

        // Check if we have a translation for this page
        const targetPath = LANGUAGE_MAP[currentPath];

        if (targetPath) {
            // Navigate to the translated version
            history.push(targetPath);
        } else {
            // Fallback: try to toggle -german suffix
            if (isGerman) {
                // Remove -german suffix
                const englishPath = currentPath.replace('-german', '');
                history.push(englishPath);
            } else {
                // Add -german suffix before the extension
                const germanPath = currentPath.replace('/content', '/content-german');
                history.push(germanPath);
            }
        }
    };

    // Don't render until mounted to prevent hydration mismatch
    if (!mounted) {
        return null;
    }

    return (
        <button
            className={styles.floatingToggle}
            onClick={toggleLanguage}
            aria-label={`Switch to ${isGerman ? 'English' : 'Deutsch'}`}
            title={`Switch to ${isGerman ? 'English' : 'Deutsch'}`}
        >
            <div className={styles.toggleTrack}>
                <div className={`${styles.toggleThumb} ${isGerman ? styles.toggleThumbGerman : ''}`}>
                    {isGerman ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="5" width="18" height="4.67" fill="#000000" />
                            <rect x="3" y="9.67" width="18" height="4.67" fill="#DD0000" />
                            <rect x="3" y="14.33" width="18" height="4.67" fill="#FFCE00" />
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="6" width="7" height="6" fill="#012169" />
                            <path d="M3 6 L10 12 M10 6 L3 12" stroke="white" strokeWidth="1.5" />
                            <path d="M3 6 L10 12 M10 6 L3 12" stroke="#C8102E" strokeWidth="0.8" />
                            <rect x="3" y="12" width="18" height="2.67" fill="white" />
                            <rect x="3" y="12" width="18" height="2.67" fill="#C8102E" />
                            <rect x="10" y="6" width="2.67" height="12" fill="white" />
                            <rect x="10" y="6" width="2.67" height="12" fill="#C8102E" />
                        </svg>
                    )}
                </div>
            </div>
        </button>
    );
}
