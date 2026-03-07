import React from 'react';

interface GradientTextProps {
    children: React.ReactNode;
    className?: string;
}

export default function GradientText({ children, className = '' }: GradientTextProps): React.JSX.Element {
    return (
        <span
            className={className}
            style={{
                background: 'linear-gradient(135deg, #E8B058 0%, #F5C978 50%, #E8B058 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
            }}
        >
            {children}
        </span>
    );
}
