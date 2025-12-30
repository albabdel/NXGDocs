import React from 'react';
import { Copy, Check } from 'lucide-react';
import clsx from 'clsx';

export interface CodeBlockProps {
    code: string;
    language?: string;
    title?: string;
    showLineNumbers?: boolean;
    copyButton?: boolean;
    className?: string;
}

export default function CodeBlock({
    code,
    language = 'text',
    title,
    showLineNumbers = false,
    copyButton = true,
    className,
}: CodeBlockProps) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    // Generate line numbers if needed
    const lines = code.split('\n');
    const lineNumbers = showLineNumbers
        ? lines.map((_, index) => index + 1)
        : [];

    return (
        <div className={clsx('my-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm', className)}>
            {/* Header with title and language */}
            {(title || language !== 'text') && (
                <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    {title && (
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {title}
                        </span>
                    )}
                    {language !== 'text' && (
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            {language}
                        </span>
                    )}
                </div>
            )}
            
            {/* Code block container */}
            <div className="relative group">
                {/* Copy button */}
                {copyButton && (
                    <button
                        onClick={handleCopy}
                        className={clsx(
                            'absolute top-3 right-3 z-10',
                            'p-2 rounded-md transition-all',
                            'bg-gray-700/90 dark:bg-gray-800/90 backdrop-blur-sm',
                            'hover:bg-gray-600 dark:hover:bg-gray-700',
                            'text-white border border-gray-600 dark:border-gray-600',
                            'opacity-0 group-hover:opacity-100',
                            'focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                            'transition-opacity'
                        )}
                        aria-label="Copy code to clipboard"
                        title={copied ? 'Copied!' : 'Copy code'}
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-400" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                    </button>
                )}

                {/* Code content */}
                <pre
                    className={clsx(
                        'p-4 overflow-x-auto bg-gray-50 dark:bg-gray-900',
                        'text-sm font-mono',
                        showLineNumbers && 'flex gap-4'
                    )}
                >
                    {/* Line numbers */}
                    {showLineNumbers && (
                        <div className="flex flex-col text-right select-none text-gray-400 dark:text-gray-600">
                            {lineNumbers.map((num) => (
                                <span key={num} className="leading-6">
                                    {num}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Code */}
                    <code className={clsx(
                        'text-gray-900 dark:text-gray-100',
                        'leading-6',
                        showLineNumbers && 'flex-1'
                    )}>
                        {code}
                    </code>
                </pre>
            </div>
        </div>
    );
}
