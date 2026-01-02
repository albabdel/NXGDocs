import React, { useEffect, useRef } from 'react';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import { motion } from 'framer-motion';
import { Search, ArrowRight, ExternalLink } from 'lucide-react';

/**
 * NXGEN Premium Hero Component
 * 
 * Features:
 * - Custom Background Image (Background.jpg) with Linear Fade Blending
 * - Canvas-based Particle Animation (Adaptive Color)
 * - Light/Dark Mode Support
 * - Restored identity (XO Logo linked to nxgen.io)
 */

interface Props {
  onOpenSearch?: () => void;
}

export default function NXGENSphereHero({ onOpenSearch }: Props): JSX.Element {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle Animation System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Configuration - Different behavior for light/dark modes
    const particleCount = isDark ? 80 : 60;
    // Gold for Dark Mode, Deep bronze/amber for Light Mode with higher visibility
    const particleColor = isDark ? '232, 176, 88' : '139, 90, 43';
    // Larger particles in light mode for visibility
    const baseSize = isDark ? 0.5 : 1.2;
    const sizeRange = isDark ? 2 : 2.5;
    // Higher base alpha in light mode
    const baseAlpha = isDark ? 0.2 : 0.4;
    const alphaRange = isDark ? 0.5 : 0.5;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * sizeRange + baseSize;
        this.alpha = Math.random() * alphaRange + baseAlpha;
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

    const init = () => {
      resizeCanvas();
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]); // Re-run when mode changes to update color

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
    }
  };

  return (
    <div className={`relative overflow-hidden min-h-[85vh] flex flex-col items-center justify-center border-b transition-colors duration-500 ${isDark ? 'bg-black border-white/5' : 'border-[#E8B058]/20'}`}
      style={{
        background: isDark 
          ? '#000000' 
          : 'linear-gradient(135deg, #FFFBF5 0%, #FFF8EE 25%, #FFFDF9 50%, #FEF9F0 75%, #FFFBF5 100%)'
      }}
    >

      {/* 1. Background Image Layer - Different treatment for light mode */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
        style={{
          backgroundImage: 'url("/img/Background.jpg")',
          opacity: isDark ? 0.8 : 0.15,
          filter: isDark ? 'none' : 'sepia(20%) saturate(120%)'
        }}
      >
        {/* Adaptive Overlay for Text Readability */}
        <div className={`absolute inset-0 transition-colors duration-500 ${isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-gradient-to-b from-white/40 via-transparent to-white/60'}`} />
      </div>

      {/* Light Mode: Decorative geometric shapes */}
      {!isDark && (
        <>
          {/* Top-left decorative circle */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30 pointer-events-none z-0"
            style={{
              background: 'radial-gradient(circle, rgba(232, 176, 88, 0.3) 0%, transparent 70%)'
            }}
          />
          {/* Bottom-right decorative circle */}
          <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full opacity-25 pointer-events-none z-0"
            style={{
              background: 'radial-gradient(circle, rgba(232, 176, 88, 0.25) 0%, transparent 70%)'
            }}
          />
          {/* Subtle diagonal lines pattern */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #8B5A2B 0, #8B5A2B 1px, transparent 1px, transparent 60px)',
              backgroundSize: '60px 60px'
            }}
          />
          {/* Golden accent line at top */}
          <div className="absolute top-0 left-0 right-0 h-1 z-20"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #E8B058 20%, #C89446 50%, #E8B058 80%, transparent 100%)'
            }}
          />
        </>
      )}

      {/* 2. "Fade to Bottom" Linear Gradient Blending */}
      {/* This creates the seamless transition to the page background */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 z-1 pointer-events-none"
        style={{
          background: isDark 
            ? 'linear-gradient(to bottom, transparent, #000000)'
            : 'linear-gradient(to bottom, transparent 0%, rgba(255,251,245,0.5) 50%, #FFFBF5 100%)'
        }}
      />

      {/* 3. Particle Canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 z-1 pointer-events-none ${isDark ? 'opacity-60' : 'opacity-80'}`}
      />

      {/* 4. Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center text-center"
      >

        {/* Identity (XO Logo) */}
        <motion.div variants={itemVariants} className="mb-8 group">
          <a
            href="https://nxgen.io"
            target="_blank"
            rel="noopener noreferrer"
            className="relative block"
          >
            <div className="absolute -inset-8 bg-[#E8B058]/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <img
              src="/img/xo-logo.png"
              alt="GCXONE"
              className="w-24 md:w-32 relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src.includes('xo-logo.png')) {
                  target.src = '/img/Xo.png';
                } else if (target.src.includes('Xo.png')) {
                  target.src = '/img/XoLogo.png';
                } else {
                  target.style.display = 'none';
                }
              }}
            />
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[#E8B058] text-[10px] md:text-xs tracking-[0.4em] font-bold uppercase opacity-80 group-hover:opacity-100 transition-opacity">
              <span>By NXGEN</span>
              <ExternalLink className="w-3 h-3 opacity-50" />
            </div>
          </a>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1 variants={itemVariants} className={`text-5xl md:text-7xl font-semibold tracking-tight mb-6 ${isDark ? 'drop-shadow-2xl' : ''}`}>
          <span className={`bg-clip-text text-transparent bg-gradient-to-b ${isDark ? 'from-white via-white to-white/70' : 'from-[#1A1A1A] via-[#2D2D2D] to-[#4A4A4A]'}`}>
            Intelligent Monitoring
          </span>
          <span className={`block mt-2 text-3xl md:text-4xl font-light italic ${isDark ? 'text-[#E8B058]' : 'text-[#996B1F]'}`}
            style={!isDark ? { textShadow: '0 1px 2px rgba(0,0,0,0.05)' } : {}}
          >
            Reimagined.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.div variants={itemVariants} className="max-w-2xl mx-auto mb-10">
          <p className={`text-lg font-light leading-relaxed ${isDark ? 'text-gray-300 drop-shadow-sm' : 'text-[#4A4A4A]'}`}>
            Experience the next generation of unified security and IoT management.
            <br className="hidden md:block" /> Powerful, intuitive, and designed for scale.
          </p>
        </motion.div>

        {/* Search Interface */}
        <motion.div variants={itemVariants} className="w-full max-w-2xl mb-10">
          <button
            onClick={onOpenSearch}
            className={`w-full flex items-center gap-4 p-1.5 pr-2 border rounded-full transition-all duration-300 group text-left ${isDark
              ? 'bg-black/40 backdrop-blur-xl border-white/10 hover:border-[#E8B058]/60 shadow-xl'
              : 'bg-white border-[#E8B058]/20 hover:border-[#E8B058]/60 shadow-lg hover:shadow-xl'
              }`}
            style={!isDark ? { boxShadow: '0 4px 20px rgba(139, 90, 43, 0.08), 0 2px 8px rgba(0,0,0,0.04)' } : {}}
          >
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${isDark ? 'bg-white/10 text-[#E8B058]' : 'bg-[#E8B058] text-white'}`}>
              <Search className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className={`text-base font-medium transition-colors ${isDark ? 'text-gray-300 group-hover:text-white' : 'text-[#4A4A4A] group-hover:text-[#1A1A1A]'}`}>How can we help?</span>
            </div>
            <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium ${isDark
              ? 'bg-white/5 border-white/5 text-gray-400'
              : 'bg-[#FFFBF5] border-[#E8B058]/20 text-[#8B5A2B]'
              }`}>
              <span>Shortcuts</span>
              <kbd className={`font-sans px-1.5 rounded ${isDark ? 'bg-white/10 text-gray-300' : 'bg-white text-[#8B5A2B] shadow-sm border border-[#E8B058]/20'}`}>⌘ K</kbd>
            </div>
          </button>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">

          <Link to="/getting-started" 
            className={`w-full sm:w-auto min-w-[200px] group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 font-bold rounded-2xl transition-all duration-300 no-underline hover:scale-[1.02] ${isDark ? 'bg-[#E8B058] text-black shadow-lg hover:shadow-xl' : 'bg-[#C89446] text-white shadow-lg hover:shadow-xl'}`}
            style={!isDark ? { boxShadow: '0 4px 14px rgba(200, 148, 70, 0.35)' } : {}}
          >
            <span className="relative z-10 flex items-center gap-2 transition-all duration-300 group-hover:gap-3">
              Get Started
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>

          <Link to="/integration-hub" className={`w-full sm:w-auto min-w-[200px] group inline-flex items-center justify-center gap-2.5 px-8 py-4 border font-medium rounded-2xl transition-all hover:-translate-y-0.5 no-underline ${isDark
            ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/30 text-white backdrop-blur-md'
            : 'bg-white hover:bg-[#FFFBF5] border-[#E8B058]/30 hover:border-[#E8B058] text-[#8B5A2B] shadow-md hover:shadow-lg'
            }`}>
            <span>Integration Hub</span>
          </Link>

        </motion.div>

      </motion.div>

    </div>
  );
}
