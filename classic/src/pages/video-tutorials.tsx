import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {
    PlayCircle,
    Home,
    ChevronRight,
    X,
    Play,
    Clock,
    Youtube,
} from 'lucide-react';
import styles from './index.module.css';
import videoStyles from './video-tutorials.module.css';

type VideoCategory = 'Getting Started' | 'Features' | 'Advanced';

type Video = {
    id: string;
    title: string;
    category: VideoCategory;
    duration: string;
};

const videos: Video[] = [
    { id: 'I7dccOLTOsk', title: 'First-Time Login Setup', category: 'Getting Started', duration: '5:32' },
    { id: 'ER-tnAvGXow', title: 'Platform Overview', category: 'Getting Started', duration: '12:45' },
    { id: 'p--04PIIO-M', title: 'Platform Walkthrough', category: 'Features', duration: '18:20' },
    { id: 'AxHOF8cV88Q', title: 'Dashboard Deep Dive', category: 'Features', duration: '15:10' },
    { id: 'H2WhN1p3x9E', title: 'Tower Management', category: 'Advanced', duration: '8:45' },
];

const categories: VideoCategory[] = ['Getting Started', 'Features', 'Advanced'];

const categoryConfig: Record<VideoCategory, { color: string }> = {
    'Getting Started': { color: 'text-green-400' },
    'Features': { color: 'text-blue-400' },
    'Advanced': { color: 'text-purple-400' },
};

export default function VideoTutorials() {
    const [activeCategory, setActiveCategory] = useState<VideoCategory | 'All'>('All');
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    const filteredVideos = useMemo(() => {
        if (activeCategory === 'All') return videos;
        return videos.filter(video => video.category === activeCategory);
    }, [activeCategory]);

    const categoryStats = useMemo(() => {
        const stats: Record<string, number> = { All: videos.length };
        videos.forEach(v => {
            stats[v.category] = (stats[v.category] || 0) + 1;
        });
        return stats;
    }, []);

    const getYouTubeThumbnail = (videoId: string) => {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    };

    return (
        <Layout title="Video Tutorials" description="Learn with video tutorials">
            <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        <Link to="/" className="flex items-center gap-1 hover:text-[#E8B058] transition-colors no-underline">
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </Link>
                        <ChevronRight className="w-4 h-4 opacity-50" />
                        <span style={{ color: 'var(--ifm-color-content)' }}>Video Tutorials</span>
                    </nav>
                </div>

                <div className="max-w-7xl mx-auto px-6 pb-24">
                    <div className="text-center mb-12">
                        <span className={styles.sectionBadge}>Learning</span>
                        <h1 className="text-4xl font-bold mt-4 mb-4" style={{ color: 'var(--ifm-color-content)' }}>
                            Video Tutorials
                        </h1>
                        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                            Master the platform with step-by-step video guides for all skill levels.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mb-12">
                        {(['All', ...categories] as const).map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                    activeCategory === category
                                        ? 'bg-[#E8B058] text-black'
                                        : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                                }`}
                            >
                                {category}
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                    activeCategory === category
                                        ? 'bg-black/20'
                                        : 'bg-white/10'
                                }`}>
                                    {categoryStats[category] || 0}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="mb-6 text-sm text-white/50 text-center">
                        Showing {filteredVideos.length} of {videos.length} tutorials
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVideos.map((video, index) => (
                            <div
                                key={video.id}
                                className={`${videoStyles.videoCard} group cursor-pointer`}
                                onClick={() => setSelectedVideo(video)}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className={videoStyles.thumbnailContainer}>
                                    <img
                                        src={getYouTubeThumbnail(video.id)}
                                        alt={video.title}
                                        className={videoStyles.thumbnail}
                                        loading="lazy"
                                    />
                                    <div className={videoStyles.playOverlay}>
                                        <Play className="w-12 h-12 text-white" />
                                    </div>
                                    <div className={videoStyles.durationBadge}>
                                        <Clock className="w-3 h-3" />
                                        {video.duration}
                                    </div>
                                </div>
                                <div className={videoStyles.videoContent}>
                                    <div className={`text-xs font-medium ${categoryConfig[video.category].color} mb-2`}>
                                        {video.category}
                                    </div>
                                    <h3 className={videoStyles.videoTitle}>
                                        {video.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 p-8 rounded-2xl border border-white/10 bg-[#1a1a1a] text-center">
                        <Youtube className="w-12 h-12 text-[#E8B058] mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Want More Tutorials?</h2>
                        <p className="text-white/60 mb-6 max-w-lg mx-auto">
                            Subscribe to our YouTube channel for the latest video updates and tutorials.
                        </p>
                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold rounded-xl transition-colors no-underline"
                        >
                            <Youtube className="w-5 h-5" />
                            Visit YouTube Channel
                        </a>
                    </div>
                </div>

                {selectedVideo && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
                        <div
                            className="relative bg-[#0a0a0a] rounded-2xl max-w-5xl w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <div>
                                    <h2 className="text-xl font-bold text-white">{selectedVideo.title}</h2>
                                    <p className="text-sm text-white/60">{selectedVideo.category} · {selectedVideo.duration}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedVideo(null)}
                                    className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="relative aspect-video">
                                <iframe
                                    src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`}
                                    title={selectedVideo.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute inset-0 w-full h-full"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </Layout>
    );
}
