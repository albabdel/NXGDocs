import React from 'react';
import { ArrowRight, FileText } from 'lucide-react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

export interface RelatedArticle {
    title: string;
    url: string;
    description?: string;
}

export default function RelatedArticles({
    articles,
    title = 'Related Articles',
    maxItems = 3,
}: {
    articles: RelatedArticle[];
    title?: string;
    maxItems?: number;
}) {
    if (!articles || articles.length === 0) {
        return null;
    }

    const displayedArticles = articles.slice(0, maxItems);

    return (
        <div className="my-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary-500" />
                {title}
            </h3>
            <div className="space-y-3">
                {displayedArticles.map((article, index) => (
                    <Link
                        key={index}
                        to={article.url}
                        className={clsx(
                            'block p-4 rounded-md',
                            'bg-white dark:bg-gray-900',
                            'border border-gray-200 dark:border-gray-700',
                            'hover:border-primary-300 dark:hover:border-primary-600',
                            'hover:shadow-md transition-all',
                            'group'
                        )}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    {article.title}
                                </h4>
                                {article.description && (
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        {article.description}
                                    </p>
                                )}
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 ml-4 flex-shrink-0 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

