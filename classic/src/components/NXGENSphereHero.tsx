import React, { useEffect, useRef, useMemo, useState } from 'react';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ExternalLink, Sparkles, Search } from 'lucide-react';
import { useProduct } from '@theme/Root';
import releasesData from '../data/sanity-releases.generated.json';

/**
 * NXGEN Premium Hero Component
 *
 * Features:
 * - Background.jpg with refined radial vignette overlay
 * - IoT network graph particle animation (connected nodes with golden lines)
 * - Light/Dark mode support
 * - Badge chip, headline, subtext, quick nav, CTAs, stats row
 * - Dynamic latest release display from Sanity
 */

// Type for release data from Sanity
interface Release {
  _id: string;
  displayTitle: string;
  sprintId?: string;
  slug: { current: string };
  publishedAt: string;
  summary?: string;
  items: Array<{ _key: string; title: string }>;
}

interface Props {
  onOpenSearch?: () => void;
}

export default function NXGENSphereHero({ onOpenSearch }: Props): JSX.Element {
  const { colorMode } = useColorMode();
  const { productName, productId } = useProduct();
  const logoSrc = '/img/xo-logo.png';
  const isDark = colorMode === 'dark';
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // IoT Network Graph Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const goldDark = '232, 176, 88';
    const goldLight = '139, 90, 43';
    const particleColor = isDark ? goldDark : goldLight;
    const particleCount = isDark ? 50 : 35;
    const maxDist = 140;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5 + 0.5;
        this.alpha = isDark
          ? Math.random() * 0.45 + 0.2
          : Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${this.alpha})`;
        ctx.fill();
      }
    }

    const drawConnections = () => {
      if (!ctx) return;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * (isDark ? 0.18 : 0.14);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${particleColor}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    };

    const init = () => {
      resizeCanvas();
      particles = Array.from({ length: particleCount }, () => new Particle());
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawConnections();
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.14, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 36 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  // Floating orb animation variants
  const orbVariants = {
    animate1: prefersReducedMotion ? {} : {
      x: [0, 60, -40, 0],
      y: [0, -50, 30, 0],
      scale: [1, 1.08, 0.95, 1],
      transition: { duration: 18, repeat: Infinity, ease: 'easeInOut' },
    },
    animate2: prefersReducedMotion ? {} : {
      x: [0, -70, 50, 0],
      y: [0, 40, -60, 0],
      scale: [1, 0.92, 1.1, 1],
      transition: { duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 },
    },
    animate3: prefersReducedMotion ? {} : {
      x: [0, 40, -20, 0],
      y: [0, -30, 50, 0],
      scale: [1, 1.05, 0.97, 1],
      transition: { duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 6 },
    },
  };

  const stats = [
    { value: '10', label: 'Breakthroughs' },
    { value: '4', label: 'User Roles' },
    { value: '50+', label: 'Integrations' },
    { value: '24/7', label: 'Monitoring' },
  ];

  return (
    <div
      className="relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        minHeight: '90vh',
        background: isDark
          ? '#000000'
          : 'linear-gradient(160deg, #FFFBF5 0%, #FFF4E0 50%, #FFFBF5 100%)',
        borderBottom: isDark
          ? '1px solid rgba(255,255,255,0.05)'
          : '1px solid rgba(232,176,88,0.15)',
      }}
    >

      {/* 1. Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/img/Background.jpg")',
          opacity: isDark ? 0.5 : 0.22,
          filter: isDark ? 'none' : 'sepia(15%) saturate(110%)',
        }}
      />

      {/* 2. Dark mode: radial vignette overlay */}
      {isDark && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.92) 100%)',
          }}
        />
      )}

      {/* 3. Animated floating gold orbs (both modes) */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          top: '-15%',
          left: '-12%',
          background: isDark
            ? 'radial-gradient(circle, rgba(232,176,88,0.09) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(232,176,88,0.13) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
        animate={orbVariants.animate1}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '700px',
          height: '700px',
          bottom: '-20%',
          right: '-15%',
          background: isDark
            ? 'radial-gradient(circle, rgba(200,148,70,0.07) 0%, transparent 60%)'
            : 'radial-gradient(circle, rgba(200,148,70,0.10) 0%, transparent 60%)',
          filter: 'blur(50px)',
        }}
        animate={orbVariants.animate2}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '350px',
          height: '350px',
          top: '30%',
          right: '10%',
          background: isDark
            ? 'radial-gradient(circle, rgba(232,176,88,0.05) 0%, transparent 60%)'
            : 'radial-gradient(circle, rgba(232,176,88,0.08) 0%, transparent 60%)',
          filter: 'blur(30px)',
        }}
        animate={orbVariants.animate3}
      />

      {/* Top accent bar (light mode) */}
      {!isDark && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-20 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, #E8B058 25%, #C89446 50%, #E8B058 75%, transparent 100%)',
          }}
        />
      )}

      {/* 4. Network canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%', opacity: isDark ? 0.75 : 0.9 }}
      />

      {/* 5. Bottom fade blend */}
      <div
        className="absolute inset-x-0 bottom-0 h-52 pointer-events-none"
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, transparent, #000000)'
            : 'linear-gradient(to bottom, transparent, #FFFBF5)',
        }}
      />

      {/* 6. Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center py-20"
        style={{
          /* Subtle glass panel behind the content in dark mode */
          ...(isDark ? {
            background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(232,176,88,0.025) 0%, transparent 70%)',
          } : {}),
        }}
      >

        {/* Logo */}
        <motion.div variants={itemVariants} className="mb-7 group">
          <a
            href="https://nxgen.io"
            target="_blank"
            rel="noopener noreferrer"
            className="relative block"
          >
            <div className="absolute -inset-8 bg-[#E8B058]/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <img
              src={logoSrc}
              alt={productName}
              className="w-20 md:w-24 relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
              }}
            />
            <div
              className={`mt-3 flex items-center justify-center gap-1 text-[10px] tracking-[0.4em] font-semibold uppercase opacity-70 group-hover:opacity-100 transition-opacity ${
                isDark ? 'text-[#E8B058]' : 'text-[#996B1F]'
              }`}
            >
              <span>By NXGEN</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </div>
          </a>
        </motion.div>

        {/* Badge chip */}
        <motion.div variants={itemVariants} className="mb-6">
          <span
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border ${
              isDark
                ? 'bg-[#E8B058]/10 border-[#E8B058]/25 text-[#E8B058]'
                : 'bg-[#E8B058]/10 border-[#E8B058]/30 text-[#7A5518]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8B058] animate-pulse flex-shrink-0" />
            {productName} Documentation
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-5 leading-[1.05]"
        >
          <span className={isDark ? 'text-white' : 'text-[#0F0F0F]'}>
            Intelligent Monitoring
          </span>
          <br />
          <span
            style={{
              backgroundImage:
                'linear-gradient(135deg, #E8B058 0%, #C89446 40%, #D4A547 70%, #E8B058 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Reimagined.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          className={`text-base md:text-lg font-light leading-relaxed max-w-xl mb-9 ${
            isDark ? 'text-gray-400' : 'text-[#5A5A5A]'
          }`}
        >
          The complete technical reference for {productName} — unified security, IoT
          management, and real-time monitoring at scale.
        </motion.p>

        {/* What's New announcement chip */}
        <motion.div variants={itemVariants} className="mb-6">
          {(() => {
            // Get latest release dynamically from Sanity data
            const latestRelease = (releasesData as Release[])[0];
            const releaseLink = latestRelease ? `/releases/${latestRelease.slug.current}` : '/releases';
            const releaseText = latestRelease
              ? `${latestRelease.displayTitle} is live`
              : 'Latest updates available';

            return (
              <Link
                to={releaseLink}
                className="group inline-flex items-center gap-2.5 no-underline"
              >
                <span
                  className="relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-medium overflow-hidden"
                  style={{
                    background: isDark
                      ? 'rgba(232,176,88,0.06)'
                      : 'rgba(232,176,88,0.08)',
                    border: `1px solid ${isDark ? 'rgba(232,176,88,0.22)' : 'rgba(200,148,70,0.28)'}`,
                    color: isDark ? '#E8B058' : '#7A5518',
                  }}
                >
                  {/* Shimmer sweep */}
                  <motion.span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(105deg, transparent 35%, rgba(232,176,88,0.18) 50%, transparent 65%)',
                      backgroundSize: '200% 100%',
                    }}
                    animate={prefersReducedMotion ? {} : { backgroundPosition: ['200% 0', '-200% 0'] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
                  />

                  {/* "New" badge */}
                  <span
                    className="relative inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide"
                    style={{
                      background: isDark ? '#E8B058' : '#C89446',
                      color: '#000',
                    }}
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    New
                  </span>

                  <span className="relative">{releaseText}</span>

                  <ArrowRight
                    className="relative w-3 h-3 opacity-60 transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            );
          })()}
        </motion.div>

        {/* Hero search bar */}
        {onOpenSearch && (
          <motion.div variants={itemVariants} className="w-full max-w-lg mb-8">
            <HeroSearchBar isDark={isDark} onClick={onOpenSearch} prefersReducedMotion={!!prefersReducedMotion} />
          </motion.div>
        )}

        {/* CTA buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-3 mb-0"
        >
          <Link
            to="/getting-started"
            className={`hero-btn-primary inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold no-underline transition-all duration-200 hover:-translate-y-0.5 group ${
              isDark
                ? 'bg-[#E8B058] text-black hover:bg-[#D4A047]'
                : 'bg-[#C89446] text-white hover:bg-[#B58237]'
            }`}
            style={{
              boxShadow: isDark
                ? '0 4px 20px rgba(232,176,88,0.28)'
                : '0 4px 20px rgba(200,148,70,0.32)',
            }}
          >
            Get Started
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          <Link
            to="/integration-hub"
            className={`inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-medium no-underline border transition-all duration-200 hover:-translate-y-0.5 ${
              isDark
                ? 'hero-btn-secondary-dark bg-white/5 backdrop-blur-sm border-white/10 text-white hover:bg-white/10 hover:border-white/25'
                : 'hero-btn-secondary-light bg-white/70 backdrop-blur-sm border-[#E8B058]/30 text-[#5A3B10] hover:border-[#E8B058]/60 shadow-md'
            }`}
          >
            Integration Hub
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={itemVariants}
          className={`mt-10 pt-8 w-full max-w-lg flex items-center justify-center gap-6 sm:gap-10 ${
            isDark ? 'border-t border-white/[0.06]' : 'border-t border-[#E8B058]/12'
          }`}
        >
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div
                className={`text-xl font-bold tabular-nums ${
                  isDark ? 'text-[#E8B058]' : 'text-[#C89446]'
                }`}
              >
                {value}
              </div>
              <div
                className={`text-xs mt-0.5 ${
                  isDark ? 'text-gray-600' : 'text-[#999]'
                }`}
              >
                {label}
              </div>
            </div>
          ))}
        </motion.div>

      </motion.div>
    </div>
  );
}

// ── Hero Search Bar ────────────────────────────────────────────────────────────
function HeroSearchBar({
  isDark,
  onClick,
  prefersReducedMotion,
}: {
  isDark: boolean;
  onClick: () => void;
  prefersReducedMotion: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const base = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 18px',
    borderRadius: '14px',
    border: `1px solid ${
      hovered
        ? isDark ? 'rgba(232,176,88,0.5)' : 'rgba(200,148,70,0.55)'
        : isDark ? 'rgba(232,176,88,0.2)' : 'rgba(200,148,70,0.28)'
    }`,
    background: isDark
      ? hovered ? 'rgba(232,176,88,0.06)' : 'rgba(255,255,255,0.03)'
      : hovered ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.65)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: hovered
      ? isDark
        ? '0 0 0 1px rgba(0,0,0,0.4), 0 6px 32px rgba(0,0,0,0.3), 0 0 28px rgba(232,176,88,0.1)'
        : '0 4px 32px rgba(200,148,70,0.18), inset 0 1px 0 rgba(255,255,255,1)'
      : isDark
        ? '0 0 0 1px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)'
        : '0 2px 16px rgba(200,148,70,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
    cursor: 'pointer',
    transition: prefersReducedMotion ? 'none' : 'all 0.2s ease',
    textAlign: 'left' as const,
  };

  return (
    <button
      style={base}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Open search (Ctrl+K)"
    >
      {/* Icon */}
      <Search
        size={17}
        strokeWidth={2}
        style={{ color: '#C89446', flexShrink: 0 }}
      />

      {/* Placeholder text */}
      <span
        style={{
          flex: 1,
          fontSize: '14px',
          color: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.32)',
          letterSpacing: '0.01em',
          userSelect: 'none',
        }}
      >
        Search documentation, releases, roadmap…
      </span>

      {/* Keyboard shortcut */}
      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
        {(['Ctrl', 'K'] as const).map((k) => (
          <kbd
            key={k}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 6px',
              fontSize: '11px',
              fontFamily: 'inherit',
              background: isDark ? 'rgba(232,176,88,0.08)' : 'rgba(200,148,70,0.08)',
              border: `1px solid ${isDark ? 'rgba(232,176,88,0.18)' : 'rgba(200,148,70,0.22)'}`,
              borderRadius: '5px',
              color: isDark ? 'rgba(232,176,88,0.7)' : '#8B5E1F',
              lineHeight: 1.5,
            }}
          >
            {k}
          </kbd>
        ))}
      </span>
    </button>
  );
}
