/**
 * Landing Page Renderer
 * 
 * Dynamic landing page component that takes Sanity landing page data
 * and renders it using pre-built React components.
 */
import React from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import LandingPageBackground from './LandingPageBackground';
import Link from '@docusaurus/Link';
import * as LucideIcons from 'lucide-react';
import releaseNotes from '../data/sanity-release-notes.generated.json';

const iconCache: Record<string, React.ComponentType<any>> = {};

function getIcon(iconName: string | undefined): React.ReactNode {
  if (!iconName) return null;
  if (!iconCache[iconName]) {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      iconCache[iconName] = IconComponent;
    }
  }
  const Icon = iconCache[iconName];
  return Icon ? <Icon className="w-5 h-5" /> : null;
}

function getIconLarge(iconName: string | undefined): React.ReactNode {
  if (!iconName) return null;
  if (!iconCache[iconName]) {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      iconCache[iconName] = IconComponent;
    }
  }
  const Icon = iconCache[iconName];
  return Icon ? <Icon className="w-6 h-6" /> : null;
}

function getIconXL(iconName: string | undefined): React.ReactNode {
  if (!iconName) return null;
  if (!iconCache[iconName]) {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      iconCache[iconName] = IconComponent;
    }
  }
  const Icon = iconCache[iconName];
  return Icon ? <Icon className="w-8 h-8" /> : null;
}

type Breadcrumb = { label: string; href?: string };
type HeroMetric = { label: string; value: string; icon?: string; color?: string };
type CTAButton = { label: string; href: string; variant?: 'primary' | 'secondary' | 'outline' };
type HeroSection = {
  badge?: { icon?: string; text?: string };
  headline: string;
  subheadline?: string;
  backgroundImage?: any;
  metrics?: HeroMetric[];
  ctaButtons?: CTAButton[];
};

type FeatureItem = { icon?: string; title: string; description?: string; color?: string; value?: string; link?: string };
type StepItem = { stepNumber: number; title: string; description?: string };
type StepPhase = { phaseNumber: number; title: string; description?: string; steps: StepItem[] };
type TabContentItem = { icon?: string; title: string; description?: string; status?: string; value?: string };
type TabItem = { id: string; label: string; icon?: string; content: { title?: string; description?: string; items?: TabContentItem[] } };
type ContentGridItem = { icon?: string; title: string; description?: string; link?: string; listItems?: string[] };
type HierarchyLevel = { level: string; title: string; description?: string; icon?: string; color?: string };
type HierarchyBenefit = { icon?: string; title: string; description?: string };

type SectionBase = { title?: string; description?: string; _type: string };
type VideoSection = SectionBase & {
  _type: 'landingSectionVideo';
  videoSource?: 'embed' | 'upload';
  videoUrl?: string;
  videoFile?: { url?: string; asset?: { _ref?: string } };
  videoFileUrl?: string;
  posterImage?: { url?: string; asset?: { _ref?: string } };
  posterImageUrl?: string;
  videoControls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  videoTitle?: string;
  videoDescription?: string;
};
type FeaturesSection = SectionBase & { _type: 'landingSectionFeatures'; columns?: number; features: FeatureItem[] };
type StepsSection = SectionBase & { _type: 'landingSectionSteps'; phases: StepPhase[] };
type CapabilitiesSection = SectionBase & { _type: 'landingSectionCapabilities'; capabilities: FeatureItem[] };
type HierarchySection = SectionBase & { _type: 'landingSectionHierarchy'; levels: HierarchyLevel[]; benefits?: HierarchyBenefit[] };
type TabsSection = SectionBase & { _type: 'landingSectionTabs'; tabs: TabItem[] };
type ReleasesSection = SectionBase & { _type: 'landingSectionReleases'; showCurrentSprint?: boolean; showCompleted?: boolean; showRoadmapLink?: boolean; releaseType?: 'customer' | 'internal' };
type ContentGridSection = SectionBase & { _type: 'landingSectionContentGrid'; columns?: number; items: ContentGridItem[] };
type CTASection = SectionBase & { _type: 'landingSectionCTA'; buttons?: { label: string; href: string; variant?: string }[] };
type CustomSection = SectionBase & { _type: 'landingSectionCustom'; customBody?: any[] };
type ReleaseNoteDoc = {
  title?: string;
  slug?: { current?: string } | string;
  sprintId?: string;
  version?: string;
  publishedAt?: string;
  changeType?: string[];
  status?: string;
};

type LandingPageData = {
  title: string;
  slug: { current: string };
  description?: string;
  layoutType?: string;
  showBackground?: boolean;
  breadcrumbs?: Breadcrumb[];
  hero?: HeroSection;
  sections?: (VideoSection | FeaturesSection | StepsSection | CapabilitiesSection | HierarchySection | TabsSection | ReleasesSection | ContentGridSection | CTASection | CustomSection)[];
  status: string;
};

function normalizeRouteSlug(value: unknown): string {
  const raw =
    typeof value === 'string'
      ? value
      : value && typeof value === 'object' && typeof (value as any).current === 'string'
        ? (value as any).current
        : '';
  return raw.trim().replace(/^\/+/, '').replace(/\/+$/, '');
}

function isInternalReleaseNote(note: ReleaseNoteDoc): boolean {
  const slug = normalizeRouteSlug(note.slug).toLowerCase();
  return slug.includes('internal');
}

function releasePathForNote(note: ReleaseNoteDoc, releaseType?: 'customer' | 'internal'): string {
  const normalizedSlug = normalizeRouteSlug(note.slug);
  if (!normalizedSlug) return releaseType === 'internal' ? '/internal-releases' : '/releases';
  if (normalizedSlug.includes('/')) return `/${normalizedSlug}`;
  const base = releaseType === 'internal' ? '/internal-releases' : '/releases';
  return `${base}/${normalizedSlug}`;
}

function formatReleaseDate(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(date);
}

function getSectionReleaseNotes(releaseType?: 'customer' | 'internal'): ReleaseNoteDoc[] {
  const all = (Array.isArray(releaseNotes) ? releaseNotes : [])
    .filter((note: any) => String(note?.status || '').toLowerCase() === 'published')
    .sort((a: any, b: any) => {
      const aTime = new Date(a?.publishedAt || 0).getTime();
      const bTime = new Date(b?.publishedAt || 0).getTime();
      return bTime - aTime;
    }) as ReleaseNoteDoc[];

  if (releaseType === 'internal') {
    const internal = all.filter(isInternalReleaseNote);
    return internal.length > 0 ? internal : all;
  }

  const customer = all.filter((note) => !isInternalReleaseNote(note));
  return customer.length > 0 ? customer : all;
}

function resolveImageLikeUrl(value: any): string {
  if (!value || typeof value !== 'object') return '';
  if (typeof value.url === 'string' && value.url) return value.url;
  if (typeof value.imageUrl === 'string' && value.imageUrl) return value.imageUrl;
  if (typeof value.gifUrl === 'string' && value.gifUrl) return value.gifUrl;
  if (typeof value.videoFileUrl === 'string' && value.videoFileUrl) return value.videoFileUrl;
  if (typeof value.posterImageUrl === 'string' && value.posterImageUrl) return value.posterImageUrl;
  return '';
}

function toEmbedUrl(videoUrl?: string): string {
  if (!videoUrl) return '';
  const value = videoUrl.trim();
  if (!value) return '';
  if (value.includes('youtube.com/embed/') || value.includes('player.vimeo.com/video/')) return value;

  if (value.includes('youtube.com/watch')) {
    const videoId = value.split('v=')[1]?.split('&')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : value;
  }

  if (value.includes('youtu.be/')) {
    const videoId = value.split('youtu.be/')[1]?.split('?')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : value;
  }

  if (value.includes('vimeo.com/')) {
    const match = value.match(/vimeo\.com\/(\d+)/i);
    const videoId = match?.[1];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : value;
  }

  return value;
}

function renderPortableSpan(
  span: any,
  markDefs: Array<{ _key?: string; _type?: string; href?: string; blank?: boolean; reference?: { slug?: { current?: string } } }>
): React.ReactNode {
  let content: React.ReactNode = String(span?.text || '');
  const marks = Array.isArray(span?.marks) ? span.marks : [];

  for (const mark of marks) {
    if (mark === 'strong') {
      content = <strong>{content}</strong>;
      continue;
    }
    if (mark === 'em') {
      content = <em>{content}</em>;
      continue;
    }
    if (mark === 'code') {
      content = <code className="px-1 py-0.5 rounded bg-[#111] text-[#E8B058]">{content}</code>;
      continue;
    }
    if (mark === 'underline') {
      content = <u>{content}</u>;
      continue;
    }
    if (mark === 'strike-through') {
      content = <s>{content}</s>;
      continue;
    }

    const def = markDefs.find((entry) => entry?._key === mark);
    if (!def) continue;
    if (def._type === 'link' && def.href) {
      const isExternal = /^https?:\/\//i.test(def.href);
      if (isExternal) {
        content = (
          <a href={def.href} target={def.blank ? '_blank' : undefined} rel={def.blank ? 'noopener noreferrer' : undefined} className="text-[#E8B058] underline hover:text-[#f4c97b]">
            {content}
          </a>
        );
      } else {
        content = (
          <Link to={def.href} className="text-[#E8B058] underline hover:text-[#f4c97b]">
            {content}
          </Link>
        );
      }
      continue;
    }
    if (def._type === 'internalLink') {
      const slug = def.reference?.slug?.current;
      if (slug) {
        content = (
          <Link to={`/${slug.replace(/^\/+/, '')}`} className="text-[#E8B058] underline hover:text-[#f4c97b]">
            {content}
          </Link>
        );
      }
    }
  }

  return content;
}

function renderPortableBlock(block: any, key: string): React.ReactNode {
  if (!block || block._type !== 'block') return null;
  const markDefs = Array.isArray(block.markDefs) ? block.markDefs : [];
  const children = (Array.isArray(block.children) ? block.children : []).map((child: any, idx: number) => (
    <React.Fragment key={`${key}-span-${idx}`}>
      {renderPortableSpan(child, markDefs)}
    </React.Fragment>
  ));

  if (block.style === 'h2') return <h2 key={key} className="text-2xl font-bold text-white mt-6 mb-3">{children}</h2>;
  if (block.style === 'h3') return <h3 key={key} className="text-xl font-semibold text-white mt-5 mb-2">{children}</h3>;
  if (block.style === 'h4') return <h4 key={key} className="text-lg font-semibold text-white mt-4 mb-2">{children}</h4>;
  if (block.style === 'blockquote') {
    return (
      <blockquote key={key} className="border-l-4 border-[#E8B058] pl-4 py-2 text-white/80 italic my-4">
        {children}
      </blockquote>
    );
  }
  return <p key={key} className="text-white/80 leading-relaxed mb-4">{children}</p>;
}

function renderCustomPortableText(blocks: any[]): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let listBuffer: { type: 'bullet' | 'number'; items: any[] } | null = null;

  const flushList = () => {
    if (!listBuffer) return;
    const ListTag = listBuffer.type === 'number' ? 'ol' : 'ul';
    nodes.push(
      <ListTag
        key={`list-${nodes.length}`}
        className={`mb-4 pl-6 text-white/80 ${listBuffer.type === 'number' ? 'list-decimal' : 'list-disc'}`}
        style={{ listStyleType: listBuffer.type === 'number' ? 'decimal' : 'disc', listStylePosition: 'outside' }}
      >
        {listBuffer.items.map((item, idx) => (
          <li key={`li-${idx}`} className="mb-2">
            {renderPortableBlock(item, `list-${nodes.length}-${idx}`)}
          </li>
        ))}
      </ListTag>
    );
    listBuffer = null;
  };

  blocks.forEach((block, idx) => {
    if (block?._type === 'block' && block?.listItem) {
      const listType: 'bullet' | 'number' = block.listItem === 'number' ? 'number' : 'bullet';
      if (!listBuffer || listBuffer.type !== listType) {
        flushList();
        listBuffer = { type: listType, items: [] };
      }
      listBuffer.items.push(block);
      return;
    }

    flushList();

    if (block?._type === 'block') {
      nodes.push(renderPortableBlock(block, `block-${idx}`));
      return;
    }

    if (block?._type === 'code') {
      nodes.push(
        <pre key={`code-${idx}`} className="mb-4 overflow-x-auto rounded-lg bg-[#111] border border-white/10 p-4 text-sm text-white/90">
          <code>{String(block?.code || '')}</code>
        </pre>
      );
      return;
    }

    if (block?._type === 'image') {
      const imageUrl = resolveImageLikeUrl(block);
      if (!imageUrl) return;

      const alt = String(block?.alt || '');
      const caption = String(block?.caption || '');
      const credit = String(block?.credit || '');
      const width = String(block?.width || '').trim();
      const imageStyles: React.CSSProperties = {
        display: 'block',
        maxWidth: '100%',
        height: 'auto',
      };
      if (width && width !== 'auto' && width !== 'full') {
        imageStyles.width = /^\d+$/.test(width) ? `${width}%` : width;
      } else if (width === 'full' || width === '100') {
        imageStyles.width = '100%';
      }
      if (block?.rounded) imageStyles.borderRadius = '12px';
      if (block?.shadow) imageStyles.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
      if (block?.withBorder) imageStyles.border = '1px solid rgba(255,255,255,0.15)';
      if (block?.withBackground) imageStyles.background = 'rgba(255,255,255,0.08)';

      const imageNode = <img src={imageUrl} alt={alt} title={String(block?.title || '') || undefined} style={imageStyles} />;
      const isExternalLink = typeof block?.linkUrl === 'string' && /^https?:\/\//i.test(block.linkUrl);
      const linkedImageNode =
        typeof block?.linkUrl === 'string' && block.linkUrl
          ? isExternalLink
            ? <a href={block.linkUrl} target={block?.openInNewTab ? '_blank' : undefined} rel={block?.openInNewTab ? 'noopener noreferrer' : undefined}>{imageNode}</a>
            : <Link to={block.linkUrl}>{imageNode}</Link>
          : imageNode;

      nodes.push(
        <figure key={`image-${idx}`} className="mb-6">
          {linkedImageNode}
          {(caption || credit) && (
            <figcaption className="mt-2 text-sm text-white/60">
              {[caption, credit ? `Credit: ${credit}` : ''].filter(Boolean).join(' | ')}
            </figcaption>
          )}
        </figure>
      );
      return;
    }

    if (block?._type === 'gif') {
      const gifUrl = resolveImageLikeUrl(block?.file) || resolveImageLikeUrl(block);
      if (!gifUrl) return;
      const alt = String(block?.alt || 'Animated GIF');
      const caption = String(block?.caption || '');
      nodes.push(
        <figure key={`gif-${idx}`} className="mb-6">
          <img src={gifUrl} alt={alt} style={{ display: 'block', maxWidth: '100%', height: 'auto' }} />
          {caption && <figcaption className="mt-2 text-sm text-white/60">{caption}</figcaption>}
        </figure>
      );
      return;
    }

    if (block?._type === 'videoEmbed' && block?.url) {
      nodes.push(
        <div key={`video-embed-${idx}`} className="mb-6 aspect-video overflow-hidden rounded-xl border border-white/10 bg-[#111]">
          <iframe
            className="w-full h-full"
            src={String(block.url)}
            title={String(block?.caption || 'Embedded video')}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
      return;
    }

    if (block?._type === 'divider') {
      nodes.push(<hr key={`divider-${idx}`} className="my-8 border-white/20" />);
      return;
    }

    if (block?._type === 'callout') {
      nodes.push(
        <div key={`callout-${idx}`} className="mb-4 rounded-xl border border-[#E8B058]/30 bg-[#E8B058]/10 p-4">
          {block?.title && <h4 className="text-white font-semibold mb-2">{block.title}</h4>}
          {Array.isArray(block?.body) && renderCustomPortableText(block.body)}
        </div>
      );
      return;
    }
  });

  flushList();
  return nodes;
}

function Breadcrumbs({ items }: { items?: Breadcrumb[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="backdrop-blur-sm" style={{ background: 'linear-gradient(to bottom, var(--ifm-background-color) 0%, var(--ifm-background-color) 60%, transparent 100%)', borderBottom: '1px solid rgba(var(--ifm-color-emphasis-300-rgb, 200,200,200), 0.3)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm flex-wrap">
          {items.map((item, idx) => (
            <React.Fragment key={idx}>
              {item.href ? (
                <Link to={item.href} className="text-slate-400 hover:text-white transition-colors no-underline">{item.label}</Link>
              ) : (
                <span className="text-[#E8B058] font-medium">{item.label}</span>
              )}
              {idx < items.length - 1 && <LucideIcons.ChevronRight className="w-4 h-4 text-slate-600" />}
            </React.Fragment>
          ))}
        </nav>
      </div>
    </div>
  );
}

function HeroSection({ hero }: { hero?: HeroSection }) {
  if (!hero) return null;
  const { badge, headline, subheadline, metrics, ctaButtons } = hero;
  const heroBackgroundUrl = resolveImageLikeUrl(hero.backgroundImage);
  const hasHeroBackground = Boolean(heroBackgroundUrl);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-20">
      <div className={hasHeroBackground ? 'relative overflow-hidden rounded-2xl border border-white/10 p-8 md:p-12' : 'text-center'}>
        {hasHeroBackground && (
          <>
            <img
              src={heroBackgroundUrl}
              alt={headline || 'Hero background'}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/75" />
          </>
        )}

        <div className={hasHeroBackground ? 'relative z-10 text-center' : undefined}>
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8B058]/10 border border-[#E8B058]/20 rounded-full mb-6">
              {badge.icon && getIcon(badge.icon)}
              {badge.text && <span className="text-sm font-medium text-[#E8B058]">{badge.text}</span>}
            </div>
          )}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">{headline}</h1>
          {subheadline && <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-8">{subheadline}</p>}
          {metrics && metrics.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              {metrics.map((metric, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: idx * 0.1 }} className="p-4 bg-white/5 rounded-xl border border-white/10 text-center" style={{ borderColor: metric.color ? `${metric.color}40` : undefined }}>
                  <div className="flex justify-center mb-2" style={{ color: metric.color || '#E8B058' }}>{getIcon(metric.icon)}</div>
                  <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                  <div className="text-xs text-white/70">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          )}
          {ctaButtons && ctaButtons.length > 0 && (
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {ctaButtons.map((btn, idx) => (
                <Link key={idx} to={btn.href} className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all no-underline ${btn.variant === 'outline' ? 'border border-[#E8B058] text-[#E8B058] hover:bg-[#E8B058]/10' : btn.variant === 'secondary' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-[#E8B058] text-black hover:bg-[#D4A047]'}`}>
                  {btn.label}<LucideIcons.ArrowRight className="w-4 h-4" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function VideoSection({ section }: { section: VideoSection }) {
  const {
    title,
    description,
    videoSource,
    videoUrl,
    videoFile,
    videoFileUrl,
    posterImage,
    posterImageUrl,
    videoControls = true,
    autoplay = false,
    muted = true,
    loop = false,
    videoTitle,
    videoDescription,
  } = section;

  const embedUrl = toEmbedUrl(videoUrl);
  const uploadedVideoUrl = videoFileUrl || resolveImageLikeUrl(videoFile);
  const uploadedPosterUrl = posterImageUrl || resolveImageLikeUrl(posterImage);
  const useUploadedVideo = videoSource === 'upload' || Boolean(uploadedVideoUrl);

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mb-32">
      {title && <div className="text-center mb-12"><h2 className="text-3xl font-bold text-white mb-4">{title}</h2>{description && <p className="text-lg text-white/70 max-w-2xl mx-auto">{description}</p>}</div>}
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-xl bg-[#202020] border border-white/10">
          <div className="aspect-video bg-[#1a1a1a] relative">
            {useUploadedVideo && uploadedVideoUrl ? (
              <video
                className="w-full h-full object-cover"
                src={uploadedVideoUrl}
                poster={uploadedPosterUrl || undefined}
                controls={videoControls}
                autoPlay={autoplay}
                muted={autoplay ? true : muted}
                loop={loop}
                playsInline
                preload="metadata"
              />
            ) : embedUrl ? (
              <iframe className="w-full h-full" src={embedUrl} title={videoTitle || title || 'Video'} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">No video source configured</div>
            )}
            <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-[#E8B058]/20 backdrop-blur-sm rounded-full border border-[#E8B058]/30 pointer-events-none">
              <LucideIcons.Video className="w-4 h-4 text-[#E8B058]" />
              <span className="text-xs font-medium text-[#E8B058]">{useUploadedVideo ? 'Uploaded Video' : 'Video Embed'}</span>
            </div>
          </div>
          {(videoTitle || videoDescription) && <div className="p-4">{videoTitle && <h4 className="font-semibold text-white mb-2">{videoTitle}</h4>}{videoDescription && <p className="text-sm text-white/70">{videoDescription}</p>}</div>}
        </div>
      </div>
    </motion.section>
  );
}

function FeaturesSection({ section }: { section: FeaturesSection }) {
  const { title, description, columns = 3, features } = section;
  const gridCols = columns === 4 ? 'lg:grid-cols-4' : columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mb-32">
      {title && <div className="text-center mb-12"><h2 className="text-3xl font-bold text-white mb-4">{title}</h2>{description && <p className="text-lg text-white/70 max-w-2xl mx-auto">{description}</p>}</div>}
      <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
        {features.map((feature, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: idx * 0.1 }} viewport={{ once: true }} className="p-6 bg-[#202020] rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all">
            {feature.icon && <div className="mb-4" style={{ color: feature.color || '#E8B058' }}>{getIconXL(feature.icon)}</div>}
            {feature.value && <div className="text-3xl font-bold text-white mb-2">{feature.value}</div>}
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            {feature.description && <p className="text-sm text-white/70">{feature.description}</p>}
            {feature.link && <Link to={feature.link} className="inline-flex items-center gap-2 text-[#E8B058] text-sm mt-4 no-underline hover:underline">Learn more <LucideIcons.ArrowRight className="w-4 h-4" /></Link>}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function StepsSection({ section }: { section: StepsSection }) {
  const { title, description, phases } = section;
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mb-32">
      {title && <div className="text-center mb-12"><h2 className="text-3xl font-bold text-white mb-4">{title}</h2>{description && <p className="text-lg text-white/70 max-w-2xl mx-auto">{description}</p>}</div>}
      {phases.map((phase, phaseIdx) => (
        <div key={phaseIdx} className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-[#E8B058]/20 border-2 border-[#E8B058]/40 flex items-center justify-center"><span className="text-2xl font-bold text-[#E8B058]">{phase.phaseNumber || phaseIdx + 1}</span></div>
            <div><h3 className="text-2xl font-bold text-white mb-2">{phase.title}</h3>{phase.description && <p className="text-white/70">{phase.description}</p>}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {phase.steps.map((step, stepIdx) => (
              <motion.div key={stepIdx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: stepIdx * 0.05 }} viewport={{ once: true }} className="p-6 bg-[#1a1a1a] rounded-lg border border-white/5 hover:border-[#E8B058]/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#E8B058]/20 border-2 border-[#E8B058]/40 flex items-center justify-center flex-shrink-0"><span className="text-sm font-bold text-[#E8B058]">{step.stepNumber || stepIdx + 1}</span></div>
                  <div><h4 className="text-base font-semibold text-white mb-2">{step.title}</h4>{step.description && <p className="text-sm text-white/70">{step.description}</p>}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </motion.section>
  );
}

function CapabilitiesSection({ section }: { section: CapabilitiesSection }) {
  const { title, description, capabilities } = section;
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mb-32">
      {title && <div className="text-center mb-12"><h2 className="text-3xl font-bold text-white mb-4">{title}</h2>{description && <p className="text-lg text-white/70 max-w-2xl mx-auto">{description}</p>}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {capabilities.map((cap, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: idx * 0.1 }} viewport={{ once: true }} className="p-6 bg-[#202020] rounded-xl border border-white/10 text-center">
            {cap.icon && <div className="p-3 rounded-lg inline-block mb-4" style={{ backgroundColor: cap.color ? `${cap.color}20` : '#E8B05820', color: cap.color || '#E8B058' }}>{getIconXL(cap.icon)}</div>}
            {cap.value && <div className="text-3xl font-bold text-white mb-2">{cap.value}</div>}
            <h3 className="text-lg font-semibold text-white mb-2">{cap.title}</h3>
            {cap.description && <p className="text-sm text-white/70">{cap.description}</p>}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function HierarchySection({ section }: { section: HierarchySection }) {
  const { title, description, levels, benefits } = section;
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mb-32">
      {title && <div className="text-center mb-12"><h2 className="text-3xl font-bold text-white mb-4">{title}</h2>{description && <p className="text-lg text-white/70 max-w-3xl mx-auto">{description}</p>}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E8B058]/10 to-[#E8B058]/5 rounded-2xl blur-3xl" />
          <div className="relative p-8 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-2xl">
            <div className="space-y-4">
              {levels.map((level, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-[#1a1a1a] rounded-lg border border-white/10">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg text-white font-bold" style={{ backgroundColor: level.color || '#E8B058' }}>{level.level}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">{level.icon && <div style={{ color: '#E8B058' }}>{getIcon(level.icon)}</div>}<h3 className="font-semibold text-white">{level.title}</h3></div>
                    {level.description && <p className="text-sm text-white/70">{level.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {benefits && benefits.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="text-center p-6 bg-[#202020] rounded-xl border border-white/10">
                {benefit.icon && <div className="p-3 bg-[#E8B058]/10 rounded-lg text-[#E8B058] inline-block mb-4">{getIconXL(benefit.icon)}</div>}
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                {benefit.description && <p className="text-sm text-white/70">{benefit.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}

function TabsSection({ section }: { section: TabsSection }) {
  const { title, description, tabs } = section;
  const [activeTab, setActiveTab] = React.useState(tabs[0]?.id || '');
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mb-32">
      {title && <div className="text-center mb-12"><h2 className="text-3xl font-bold text-white mb-4">{title}</h2>{description && <p className="text-lg text-white/70 max-w-2xl mx-auto">{description}</p>}</div>}
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
        <div className="flex border-b border-white/10 flex-wrap">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all ${activeTab === tab.id ? 'text-[#E8B058] border-b-2 border-[#E8B058] bg-[#E8B058]/5' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
              {tab.icon && getIcon(tab.icon)}{tab.label}
            </button>
          ))}
        </div>
        <div className="p-8">
          {tabs.filter(t => t.id === activeTab).map((tab) => (
            <div key={tab.id}>
              {tab.content.title && <h3 className="text-xl font-bold text-white mb-6">{tab.content.title}</h3>}
              {tab.content.description && <p className="text-white/70 mb-6">{tab.content.description}</p>}
              {tab.content.items && tab.content.items.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tab.content.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-[#202020] rounded-lg border border-white/10">
                      {item.icon && <div className="p-2 bg-[#E8B058]/10 rounded-lg text-[#E8B058]">{getIcon(item.icon)}</div>}
                      <div><h4 className="font-semibold text-white">{item.title}</h4>{item.description && <p className="text-sm text-white/70">{item.description}</p>}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function ReleasesSection({ section }: { section: ReleasesSection }) {
  const {
    title,
    description,
    showCurrentSprint = true,
    showCompleted = true,
    showRoadmapLink,
    releaseType,
  } = section;
  const notes = getSectionReleaseNotes(releaseType).slice(0, 8);
  const current = notes[0];
  const completed = notes.slice(showCurrentSprint ? 1 : 0);

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mb-32">
      {title && <div className="mb-8"><h2 className="text-3xl font-bold text-white mb-2">{title}</h2>{description && <p className="text-white/70">{description}</p>}</div>}
      {notes.length === 0 && (
        <div className="space-y-4">
          <div className="p-8 bg-[#202020] border border-white/10 rounded-xl">
            <p className="text-white/70">
              {releaseType === 'internal'
                ? 'No internal published release notes found yet in Sanity.'
                : 'No customer published release notes found yet in Sanity.'}
            </p>
          </div>
        </div>
      )}
      {notes.length > 0 && (
        <div className="space-y-6">
          {showCurrentSprint && current && (
            <div className="p-6 bg-[#202020] border border-[#E8B058]/30 rounded-xl">
              <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8B058]/10 border border-[#E8B058]/30 text-[#E8B058] text-xs font-semibold">
                  <LucideIcons.CalendarClock className="w-4 h-4" />
                  Current Sprint
                </div>
                <span className="text-sm text-white/60">{formatReleaseDate(current.publishedAt)}</span>
              </div>
              <Link to={releasePathForNote(current, releaseType)} className="no-underline">
                <h3 className="text-xl font-semibold text-white hover:text-[#E8B058] transition-colors">{current.title || 'Untitled release'}</h3>
              </Link>
              <div className="flex items-center gap-3 text-sm text-white/70 mt-2 flex-wrap">
                {current.version && <span>Version {current.version}</span>}
                {current.sprintId && <span>Sprint {current.sprintId}</span>}
              </div>
            </div>
          )}

          {showCompleted && completed.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completed.map((note, idx) => (
                <div key={idx} className="p-5 bg-[#202020] border border-white/10 rounded-xl hover:border-[#E8B058]/30 transition-all">
                  <Link to={releasePathForNote(note, releaseType)} className="no-underline">
                    <h4 className="text-base font-semibold text-white hover:text-[#E8B058] transition-colors">{note.title || 'Untitled release'}</h4>
                  </Link>
                  <div className="text-xs text-white/60 mt-2">
                    {[note.version ? `v${note.version}` : '', note.sprintId ? `Sprint ${note.sprintId}` : '', formatReleaseDate(note.publishedAt)]
                      .filter(Boolean)
                      .join(' - ')}
                  </div>
                  {Array.isArray(note.changeType) && note.changeType.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {note.changeType.slice(0, 3).map((type, typeIdx) => (
                        <span key={typeIdx} className="text-[11px] px-2 py-1 rounded bg-white/5 border border-white/10 text-white/70">
                          {type}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {showRoadmapLink && <div className="mt-8"><Link to="/roadmap" className="inline-flex items-center gap-2 text-[#E8B058] no-underline hover:underline">View Full Roadmap <LucideIcons.ArrowRight className="w-4 h-4" /></Link></div>}
    </motion.section>
  );
}

function ContentGridSection({ section }: { section: ContentGridSection }) {
  const { title, description, columns = 2, items } = section;
  const gridCols = columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mb-32">
      {title && <div className="text-center mb-12"><h2 className="text-3xl font-bold text-white mb-4">{title}</h2>{description && <p className="text-lg text-white/70 max-w-2xl mx-auto">{description}</p>}</div>}
      <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
        {items.map((item, idx) => (
          <Link key={idx} to={item.link || '#'} className="p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-xl hover:border-[#E8B058]/50 transition-all no-underline group">
            {item.icon && <div className="text-[#E8B058] mb-4 group-hover:scale-110 transition-transform">{getIconXL(item.icon)}</div>}
            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
            {item.description && <p className="text-sm text-white/70 mb-4">{item.description}</p>}
            {item.listItems && item.listItems.length > 0 && (
              <ul className="space-y-2">{item.listItems.map((listItem, listIdx) => (<li key={listIdx} className="flex items-start gap-2 text-sm text-white/80"><LucideIcons.CheckCircle className="w-4 h-4 text-[#E8B058] mt-0.5 flex-shrink-0" /><span>{listItem}</span></li>))}</ul>
            )}
          </Link>
        ))}
      </div>
    </motion.section>
  );
}

function CTASection({ section }: { section: CTASection }) {
  const { title, description, buttons } = section;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="mb-16">
      <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl border p-12 shadow-2xl" style={{ background: 'var(--ifm-background-surface-color)', borderColor: 'var(--ifm-color-emphasis-200)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#E8B058]/5 via-transparent to-[#E8B058]/5" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            {title && <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">{title}</h2>}
            {description && <p className="text-base md:text-lg text-white/70">{description}</p>}
          </div>
          {buttons && buttons.length > 0 && (
            <div className="flex items-center gap-4 flex-wrap">
              {buttons.map((btn, idx) => (
                <Link key={idx} to={btn.href} className={`group inline-flex items-center gap-2 px-8 py-3.5 font-semibold rounded-xl transition-all duration-200 no-underline ${btn.variant === 'secondary' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-[#E8B058] text-black hover:bg-[#D4A047]'}`}>
                  {btn.label}<LucideIcons.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function CustomSection({ section }: { section: CustomSection }) {
  const { title, customBody } = section;
  const blocks = Array.isArray(customBody) ? customBody : [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mb-32"
    >
      {title && (
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        </div>
      )}
      <div className="max-w-4xl mx-auto p-8 bg-[#202020] rounded-xl border border-white/10">
        {blocks.length === 0 && <p className="text-white/60">No custom content added yet.</p>}
        {renderCustomPortableText(blocks)}
      </div>
    </motion.section>
  );
}

function renderSection(section: any, idx: number) {
  switch (section._type) {
    case 'landingSectionVideo': return <VideoSection key={idx} section={section} />;
    case 'landingSectionFeatures': return <FeaturesSection key={idx} section={section} />;
    case 'landingSectionSteps': return <StepsSection key={idx} section={section} />;
    case 'landingSectionCapabilities': return <CapabilitiesSection key={idx} section={section} />;
    case 'landingSectionHierarchy': return <HierarchySection key={idx} section={section} />;
    case 'landingSectionTabs': return <TabsSection key={idx} section={section} />;
    case 'landingSectionReleases': return <ReleasesSection key={idx} section={section} />;
    case 'landingSectionContentGrid': return <ContentGridSection key={idx} section={section} />;
    case 'landingSectionCTA': return <CTASection key={idx} section={section} />;
    case 'landingSectionCustom': return <CustomSection key={idx} section={section} />;
    default: return null;
  }
}

export default function LandingPageRenderer({ pageData }: { pageData: LandingPageData }) {
  const { title, description, showBackground = true, breadcrumbs, hero, sections } = pageData;
  return (
    <Layout title={title} description={description}>
      {showBackground && <LandingPageBackground />}
      <main className="min-h-screen">
        <Breadcrumbs items={breadcrumbs} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <HeroSection hero={hero} />
          {sections && sections.map((section, idx) => renderSection(section, idx))}
        </div>
      </main>
    </Layout>
  );
}
