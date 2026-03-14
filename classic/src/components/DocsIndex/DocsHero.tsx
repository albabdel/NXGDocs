import React, { useEffect, useRef } from 'react';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import { motion, useReducedMotion } from 'framer-motion';
import { Search, Home, Clock } from 'lucide-react';

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
    <div
      className="relative overflow-hidden"
      style={{
        minHeight: '55vh',
        background: isDark
          ? '#000000'
          : 'linear-gradient(160deg, #FFFBF5 0%, #FFF4E0 50%, #FFFBF5 100%)',
        borderBottom: isDark
          ? '1px solid rgba(255,255,255,0.05)'
          : '1px solid rgba(232,176,88,0.15)',
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%', opacity: isDark ? 0.6 : 0.8 }}
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
          <span
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border ${
              isDark
                ? 'bg-[#E8B058]/10 border-[#E8B058]/25 text-[#E8B058]'
                : 'bg-[#E8B058]/10 border-[#E8B058]/30 text-[#7A5518]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8B058] animate-pulse flex-shrink-0" />
            Documentation Center
          </span>
          <Link
            to="/"
            className={`inline-flex items-center gap-1.5 text-xs font-medium no-underline transition-colors ${
              isDark ? 'text-white/50 hover:text-white/80' : 'text-[#5A3B10]/60 hover:text-[#5A3B10]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Return to Home
          </Link>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-[1.05]"
        >
          <span className={isDark ? 'text-white' : 'text-[#0F0F0F]'}>
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
            GCXONE Platform
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className={`text-base md:text-lg font-light leading-relaxed max-w-xl mb-8 ${
            isDark ? 'text-gray-400' : 'text-[#5A5A5A]'
          }`}
        >
          Comprehensive technical documentation for the NXGEN GCXONE platform.
          Guides, API references, integrations, and troubleshooting resources.
        </motion.p>

        <motion.div variants={itemVariants} className="w-full max-w-lg mb-6">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-xl border transition-all duration-200 text-left"
            style={{
              background: isDark
                ? 'rgba(255,255,255,0.03)'
                : 'rgba(255,255,255,0.7)',
              borderColor: isDark
                ? 'rgba(232,176,88,0.2)'
                : 'rgba(200,148,70,0.25)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: isDark
                ? 'inset 0 1px 0 rgba(255,255,255,0.03)'
                : 'inset 0 1px 0 rgba(255,255,255,0.8)',
            }}
          >
            <Search className="w-5 h-5 flex-shrink-0" style={{ color: '#C89446' }} />
            <span
              className="flex-1 text-sm"
              style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}
            >
              Search documentation...
            </span>
            <span className="flex items-center gap-1 flex-shrink-0">
              {(['Ctrl', 'K'] as const).map((k) => (
                <kbd
                  key={k}
                  className="px-2 py-0.5 text-[10px] font-medium rounded"
                  style={{
                    background: isDark
                      ? 'rgba(232,176,88,0.08)'
                      : 'rgba(200,148,70,0.08)',
                    border: `1px solid ${isDark ? 'rgba(232,176,88,0.18)' : 'rgba(200,148,70,0.2)'}`,
                    color: isDark ? 'rgba(232,176,88,0.7)' : '#8B5E1F',
                  }}
                >
                  {k}
                </kbd>
              ))}
            </span>
          </button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className={`flex items-center justify-center gap-6 text-xs ${
            isDark ? 'text-white/40' : 'text-[#5A3B10]/50'
          }`}
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
