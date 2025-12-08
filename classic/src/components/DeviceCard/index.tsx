import React from 'react';
import Link from '@docusaurus/Link';
import { Camera, CheckCircle } from 'lucide-react';

export default function DeviceCard({
    name,
    description,
    icon,
    features = [],
    link
}: {
    name: string;
    description: string;
    icon?: React.ReactNode;
    features?: string[];
    link: string;
}) {
    return (
        <Link
            to={link}
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:shadow-lg no-underline group"
        >
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 rounded-lg flex-shrink-0">
                    {icon || <Camera className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {description}
                    </p>
                    {features.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {features.map((feature, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                >
                                    <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                                    {feature}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
