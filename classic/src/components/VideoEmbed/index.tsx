import React from 'react';
import clsx from 'clsx';

export default function VideoEmbed({
    url,
    title,
    aspectRatio = '16/9',
    autoplay = false,
    controls = true,
}: {
    url: string;
    title?: string;
    aspectRatio?: '16/9' | '4/3' | '1/1';
    autoplay?: boolean;
    controls?: boolean;
}) {
    const getAspectRatioClass = () => {
        switch (aspectRatio) {
            case '4/3':
                return 'aspect-[4/3]';
            case '1/1':
                return 'aspect-square';
            default:
                return 'aspect-video';
        }
    };

    // Check if it's a YouTube URL
    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');

    // Extract YouTube video ID
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const embedUrl = isYouTube
        ? `https://www.youtube.com/embed/${getYouTubeId(url)}?autoplay=${autoplay ? 1 : 0}&controls=${controls ? 1 : 0}`
        : url;

    return (
        <div className="my-6">
            {title && (
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">{title}</h4>
            )}
            <div className={clsx(
                'relative w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800',
                getAspectRatioClass()
            )}>
                <iframe
                    src={embedUrl}
                    title={title || 'Embedded video'}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    );
}
