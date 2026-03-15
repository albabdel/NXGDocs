import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { SearchAnalyticsDashboard } from '@site/src/components/SearchAnalytics';

function AdminSearchAnalytics(): React.JSX.Element {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const adminKey = (typeof import.meta !== 'undefined' && (import.meta as any).env)
            ? (import.meta as any).env.VITE_ADMIN_KEY
            : null;
        if (!adminKey) {
            setIsAuthorized(true);
            return;
        }
        const storedKey = localStorage.getItem('admin_key');
        setIsAuthorized(storedKey === adminKey);
    }, []);

    if (isAuthorized === null) {
        return (
            <Layout title="Search Analytics" description="Admin search analytics dashboard">
                <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: '#E8B058' }} />
                        <p style={{ color: 'var(--ifm-color-content-secondary)' }}>Loading...</p>
                    </div>
                </main>
            </Layout>
        );
    }

    if (!isAuthorized) {
        return (
            <Layout title="Access Denied" description="Admin access required">
                <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
                    <div className="text-center max-w-md mx-auto px-6">
                        <div className="rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                            <svg className="w-8 h-8" style={{ color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m12-6a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--ifm-color-content)' }}>Access Denied</h1>
                        <p className="mb-6" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                            You need admin privileges to view this page. Please set the correct admin key in localStorage.
                        </p>
                        <a
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold no-underline"
                            style={{
                                background: 'linear-gradient(135deg, #E8B058 0%, #D4A047 100%)',
                                color: '#000',
                            }}
                        >
                            Return Home
                        </a>
                    </div>
                </main>
            </Layout>
        );
    }

    return (
        <Layout title="Search Analytics" description="Admin search analytics dashboard for monitoring search performance">
            <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <SearchAnalyticsDashboard />
                </div>
            </main>
        </Layout>
    );
}

export default AdminSearchAnalytics;
