import React, { useEffect, useRef } from 'react';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import { motion, useReducedMotion } from 'framer-motion';
import { Search, Home, Clock } from 'lucide-react';
import { useProduct } from '@theme/Root';

interface DocsHeroProps {
  onOpenSearch: () => void;
  lastUpdated: string;
  totalArticles: number;
  totalCategories: number;
}

export default function DocsHero({
  onOpenSearch,
  lastUpdated,
  totalArticles,
  totalCategories,
}: DocsHeroProps) {
  const { colorMode } = useColorMode();
  const { productName } = useProduct();
  const isDark = colorMode === 'dark';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
    }
    let particles: Particle[] = [];

    const goldDark = '232, 176, 88';
    const particleColor = isDark ? goldDark : '139, 90, 43';
    const particleCount = isDark ? 35 : 25;
    const maxDist = 120;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.offsetHeight || 400;
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
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.size = Math.random() * 1.5 + 0.5;
        this.alpha = isDark ? Math.random() * 0.35 + 0.15 : Math.random() * 0.4 + 0.2;
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
            const alpha = (1 - dist / maxDist) * (isDark ? 0.12 : 0.1);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${particleColor}, ${alpha})`;
            ctx.lineWidth = 0.5;
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
  }, [isDark, prefersReducedMotion]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const formatLastUpdated = (dateStr: string): string => {
    const updated = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - updated.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="docs-hero">
      <canvas
        ref={canvasRef}
        className="docs-hero-canvas absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      />

      {isDark && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(0,0,0,0.4) 65%, rgba(0,0,0,0.85) 100%)',
          }}
        />
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center text-center py-16 md:py-20"
      >
        <motion.div variants={itemVariants} className="mb-4 flex items-center gap-4">
          <span className="docs-hero-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8B058] animate-pulse flex-shrink-0" />
            Documentation Center
          </span>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium no-underline transition-colors text-muted-dark hover:text-muted-light"
          >
            <Home className="w-3.5 h-3.5" />
            Return to Home
          </Link>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-[1.05]"
        >
          <span className="text-[#0F0F0F] dark:text-white">
            Your Gateway to
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
            {productName} Platform
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="hero-description text-base md:text-lg font-light leading-relaxed max-w-xl mb-8"
        >
          Comprehensive technical documentation for the NXGEN {productName} platform.
          Guides, API references, integrations, and troubleshooting resources.
        </motion.p>

        <motion.div variants={itemVariants} className="w-full max-w-lg mb-6">
          <button
            onClick={onOpenSearch}
            className="docs-hero-search text-left"
          >
            <Search className="w-5 h-5 flex-shrink-0" style={{ color: '#C89446' }} />
            <span className="docs-hero-search-placeholder flex-1 text-sm">
              Search documentation...
            </span>
            <span className="flex items-center gap-1 flex-shrink-0">
              {(['Ctrl', 'K'] as const).map((k) => (
                <kbd key={k} className="kbd-shortcut">
                  {k}
                </kbd>
              ))}
            </span>
          </button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-6 text-xs text-muted-light"
        >
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Updated {formatLastUpdated(lastUpdated)}
          </span>
          <span>{totalArticles} articles</span>
          <span>{totalCategories} categories</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
