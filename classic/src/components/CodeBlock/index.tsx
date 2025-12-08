import React from 'react';
import { Copy, Check } from 'lucide-react';
import clsx from 'clsx';

export default function CodeBlock({
    code,
    language = 'text',
    title,
    showLineNumbers = false,
}: {
    code: string;
    language?: string;
    title?: string;
    showLineNumbers?: boolean;
}) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            {title && (
                <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">{language}</span>
                </div>
            )}
            <div className="relative">
                <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                    aria-label="Copy code"
                >
                    {copied ? (
                        <Check className="w-4 h-4 text-green-400" />
                    ) : (
                        <Copy className="w-4 h-4" />
                    )}
                </button>
                <pre className={clsx(
                    'p-4 overflow-x-auto bg-gray-50 dark:bg-gray-900',
                    showLineNumbers && 'pl-12'
                )}>
                    <code className="text-sm font-mono text-gray-900 dark:text-gray-100">
                        {code}
                    </code>
                </pre>
            </div>
        </div>
    );
}
