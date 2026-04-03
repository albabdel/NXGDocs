import React, { useEffect, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ExternalLink, Search } from 'lucide-react';
import { useProduct } from '@theme/Root';

/**
 * GC Surge Hero Component — gold theme, no Sanity releases dependency.
 */

interface Props {
  onOpenSearch?: () => void;
}

export default function NXGENSphereHero({ onOpenSearch }: Props): JSX.Element {
  const { colorMode } = useColorMode();
  const { productName } = useProduct();
  const isDark = colorMode === 'dark';
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Gold accent values
  const goldDark = '200, 148, 70';   // #C89446
  const goldLight = '181, 130, 55';   // #B58237

  // IoT Network Graph Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const particleColor = isDark ? goldDark : goldLight;
    const particleCount = isDark ? 50 : 35;
    const maxDist = 140;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    };

    class Particle {
      x: number; y: number; vx: number; vy: number; size: number; alpha: number;
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5 + 0.5;
        this.alpha = isDark ? Math.random() * 0.45 + 0.2 : Math.random() * 0.5 + 0.3;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
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

    const init = () => { resizeCanvas(); particles = Array.from({ length: particleCount }, () => new Particle()); };
    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    init();
    animate();
    return () => { window.removeEventListener('resize', resizeCanvas); cancelAnimationFrame(animationFrameId); };
  }, [isDark]);

  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 36 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as any } },
  };

  const orbVariants = {
    animate1: prefersReducedMotion ? {} : { x: [0, 60, -40, 0], y: [0, -50, 30, 0], scale: [1, 1.08, 0.95, 1], transition: { duration: 18, repeat: Infinity, ease: 'easeInOut' } },
    animate2: prefersReducedMotion ? {} : { x: [0, -70, 50, 0], y: [0, 40, -60, 0], scale: [1, 0.92, 1.1, 1], transition: { duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 } },
    animate3: prefersReducedMotion ? {} : { x: [0, 40, -20, 0], y: [0, -30, 50, 0], scale: [1, 1.05, 0.97, 1], transition: { duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 6 } },
  };

  const stats = [
    { value: '17', label: 'Guide Pages' },
    { value: 'SMTP', label: 'Email Alerts' },
    { value: 'FTP', label: 'FTP Support' },
    { value: 'API', label: 'REST API' },
  ];

  return (
    <div
      className="relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        minHeight: '90vh',
        background: isDark
          ? '#000000'
          : 'linear-gradient(160deg, #f8f9fa 0%, #ffffff 50%, #f8f9fa 100%)',
        borderBottom: isDark
          ? '1px solid rgba(200,148,70,0.15)'
          : '1px solid rgba(200,148,70,0.15)',
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/img/Background.jpg")', opacity: isDark ? 0.35 : 0.15, filter: isDark ? 'sepia(0.3) saturate(0.5)' : 'sepia(0.2) saturate(0.3)' }}
      />

      {/* Dark mode radial vignette */}
      {isDark && (
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.92) 100%)' }} />
      )}

      {/* Animated floating gold orbs */}
      <motion.div className="absolute rounded-full pointer-events-none" style={{ width: '600px', height: '600px', top: '-15%', left: '-12%', background: isDark ? 'radial-gradient(circle, rgba(200,148,70,0.09) 0%, transparent 65%)' : 'radial-gradient(circle, rgba(200,148,70,0.12) 0%, transparent 65%)', filter: 'blur(40px)' }} animate={orbVariants.animate1} />
      <motion.div className="absolute rounded-full pointer-events-none" style={{ width: '700px', height: '700px', bottom: '-20%', right: '-15%', background: isDark ? 'radial-gradient(circle, rgba(181,130,55,0.07) 0%, transparent 60%)' : 'radial-gradient(circle, rgba(181,130,55,0.10) 0%, transparent 60%)', filter: 'blur(50px)' }} animate={orbVariants.animate2} />
      <motion.div className="absolute rounded-full pointer-events-none" style={{ width: '350px', height: '350px', top: '30%', right: '10%', background: isDark ? 'radial-gradient(circle, rgba(200,148,70,0.05) 0%, transparent 60%)' : 'radial-gradient(circle, rgba(200,148,70,0.08) 0%, transparent 60%)', filter: 'blur(30px)' }} animate={orbVariants.animate3} />

      {/* Top accent bar */}
      {!isDark && (
        <div className="absolute top-0 left-0 right-0 h-[2px] z-20 pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 0%, #C89446 25%, #D4A574 50%, #C89446 75%, transparent 100%)' }} />
      )}

      {/* Network canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%', opacity: isDark ? 0.75 : 0.9 }} />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-52 pointer-events-none" style={{ background: isDark ? 'linear-gradient(to bottom, transparent, #000000)' : 'linear-gradient(to bottom, transparent, #f8f9fa)' }} />

      {/* Content */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center py-20">

        {/* Logo */}
        <motion.div variants={itemVariants} className="mb-10 group">
          <a href="https://nxgen.io" target="_blank" rel="noopener noreferrer" className="relative block">
            <div className="absolute -inset-12 bg-[#C89446]/30 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <img src="/img/gcsurge-logo.png" alt="GC Surge" className="w-36 md:w-44 lg:w-52 relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-300" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <div className={`mt-4 flex items-center justify-center gap-1.5 text-[11px] tracking-[0.4em] font-semibold uppercase opacity-70 group-hover:opacity-100 transition-opacity ${isDark ? 'text-[#D4A574]' : 'text-[#B58237]'}`}>
              <span>By NXGEN</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </a>
        </motion.div>

        {/* Badge chip */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border ${isDark ? 'bg-[#C89446]/10 border-[#C89446]/25 text-[#D4A574]' : 'bg-[#C89446]/10 border-[#C89446]/30 text-[#B58237]'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C89446] animate-pulse flex-shrink-0" />
            {productName} Documentation
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-5 leading-[1.05]">
          <span className={isDark ? 'text-white' : 'text-[#0F0F0F]'}>Cloud Surveillance</span>
          <br />
          <span style={{ backgroundImage: 'linear-gradient(135deg, #C89446 0%, #B58237 40%, #D4A574 70%, #C89446 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Reimagined.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p variants={itemVariants} className={`text-base md:text-lg font-light leading-relaxed max-w-xl mb-9 ${isDark ? 'text-gray-400' : 'text-[#5A5A5A]'}`}>
          The complete technical reference for {productName} — real-time monitoring, seamless device integration, and instant cloud alerts.
        </motion.p>

        {/* Hero search bar */}
        {onOpenSearch && (
          <motion.div variants={itemVariants} className="w-full max-w-lg mb-8">
            <HeroSearchBar isDark={isDark} onClick={onOpenSearch} prefersReducedMotion={!!prefersReducedMotion} />
          </motion.div>
        )}

        {/* CTA buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-3 mb-0">
          <Link
            to="/docs"
            className={`inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold no-underline transition-all duration-200 hover:-translate-y-0.5 group ${isDark ? 'bg-[#C89446] text-white hover:bg-[#B58237]' : 'bg-[#B58237] text-white hover:bg-[#A37028]'}`}
            style={{ boxShadow: isDark ? '0 4px 20px rgba(200,148,70,0.28)' : '0 4px 20px rgba(181,130,55,0.32)' }}
          >
            View Documentation
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/docs"
            className={`inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-medium no-underline border transition-all duration-200 hover:-translate-y-0.5 ${isDark ? 'bg-white/5 backdrop-blur-sm border-white/10 text-white hover:bg-white/10 hover:border-white/25' : 'bg-white/70 backdrop-blur-sm border-[#C89446]/30 text-[#B58237] hover:border-[#C89446]/60 shadow-md'}`}
          >
            Device Integrations
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div variants={itemVariants} className={`mt-10 pt-8 w-full max-w-lg flex items-center justify-center gap-6 sm:gap-10 ${isDark ? 'border-t border-white/[0.06]' : 'border-t border-[#C89446]/12'}`}>
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className={`text-xl font-bold tabular-nums ${isDark ? 'text-[#D4A574]' : 'text-[#B58237]'}`}>{value}</div>
              <div className={`text-xs mt-0.5 ${isDark ? 'text-gray-600' : 'text-[#999]'}`}>{label}</div>
            </div>
          ))}
        </motion.div>

      </motion.div>
    </div>
  );
}

function HeroSearchBar({ isDark, onClick, prefersReducedMotion }: { isDark: boolean; onClick: () => void; prefersReducedMotion: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
        padding: '14px 18px', borderRadius: '14px',
        border: `1px solid ${hovered ? (isDark ? 'rgba(200,148,70,0.5)' : 'rgba(181,130,55,0.55)') : (isDark ? 'rgba(200,148,70,0.2)' : 'rgba(181,130,55,0.28)')}`,
        background: isDark ? (hovered ? 'rgba(200,148,70,0.06)' : 'rgba(255,255,255,0.03)') : (hovered ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.65)'),
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        cursor: 'pointer', transition: prefersReducedMotion ? 'none' : 'all 0.2s ease', textAlign: 'left' as const,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Open search (Ctrl+K)"
    >
      <Search size={17} strokeWidth={2} style={{ color: '#C89446', flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: '14px', color: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.32)', userSelect: 'none' }}>
        Search documentation…
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
        {(['Ctrl', 'K'] as const).map(k => (
          <kbd key={k} style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 6px', fontSize: '11px', background: isDark ? 'rgba(200,148,70,0.08)' : 'rgba(181,130,55,0.08)', border: `1px solid ${isDark ? 'rgba(200,148,70,0.18)' : 'rgba(181,130,55,0.22)'}`, borderRadius: '5px', color: isDark ? 'rgba(212,165,116,0.7)' : '#A37028', lineHeight: 1.5, fontFamily: 'inherit' }}>{k}</kbd>
        ))}
      </span>
    </button>
  );
}
