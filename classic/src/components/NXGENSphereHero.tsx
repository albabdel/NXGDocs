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

    // Configuration
    const particleCount = 80;
    // Gold for Dark Mode, darker Bronze for Light Mode to be visible
    const particleColor = isDark ? '232, 176, 88' : '180, 130, 50';

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
        this.size = Math.random() * 2 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.2;
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
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className={`relative overflow-hidden min-h-[85vh] flex flex-col items-center justify-center border-b transition-colors duration-500 ${isDark ? 'bg-black border-white/5' : 'bg-white border-gray-200'}`}>

      {/* 1. Background Image Layer */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
        style={{
          backgroundImage: 'url("/img/Background.jpg")',
          opacity: isDark ? 1 : 0.15 // Lower opacity in light mode to keep text readable
        }}
      >
        {/* Adaptive Overlay for Text Readability */}
        <div className={`absolute inset-0 backdrop-blur-sm transition-colors duration-500 ${isDark ? 'bg-black/30' : 'bg-white/40'}`} />
      </div>

      {/* 2. "Fade to Bottom" Linear Gradient Blending */}
      {/* This creates the seamless transition to the page background */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 z-1 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, transparent, ${isDark ? '#000000' : '#ffffff'})`
        }}
      />

      {/* 3. Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-1 pointer-events-none opacity-60"
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
            />
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[#E8B058] text-[10px] md:text-xs tracking-[0.4em] font-bold uppercase opacity-80 group-hover:opacity-100 transition-opacity">
              <span>By NXGEN</span>
              <ExternalLink className="w-3 h-3 opacity-50" />
            </div>
          </a>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1 variants={itemVariants} className={`text-5xl md:text-7xl font-semibold tracking-tight mb-6 drop-shadow-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <span className={`bg-clip-text text-transparent bg-gradient-to-b ${isDark ? 'from-white via-white to-white/70' : 'from-gray-900 via-gray-800 to-gray-600'}`}>
            Intelligent Monitoring
          </span>
          <span className="block mt-2 text-3xl md:text-4xl font-light text-[#E8B058] italic">
            Reimagined.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.div variants={itemVariants} className="max-w-2xl mx-auto mb-10">
          <p className={`text-lg font-light leading-relaxed drop-shadow-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Experience the next generation of unified security and IoT management.
            <br className="hidden md:block" /> Powerful, intuitive, and designed for scale.
          </p>
        </motion.div>

        {/* Search Interface */}
        <motion.div variants={itemVariants} className="w-full max-w-2xl mb-10">
          <button
            onClick={onOpenSearch}
            className={`w-full flex items-center gap-4 p-1.5 pr-2 backdrop-blur-xl border rounded-full transition-all duration-300 shadow-xl group text-left ${isDark
              ? 'bg-black/40 border-white/10 hover:border-[#E8B058]/60'
              : 'bg-white/60 border-black/5 hover:border-[#E8B058] hover:bg-white/80'
              }`}
          >
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${isDark ? 'bg-white/10 text-[#E8B058]' : 'bg-[#E8B058]/10 text-[#E8B058]'}`}>
              <Search className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className={`text-base font-medium transition-colors ${isDark ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-black'}`}>How can we help?</span>
            </div>
            <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium ${isDark
              ? 'bg-white/5 border-white/5 text-gray-400'
              : 'bg-black/5 border-black/5 text-gray-500'
              }`}>
              <span>Shortcuts</span>
              <kbd className={`font-sans px-1.5 rounded ${isDark ? 'bg-white/10 text-gray-300' : 'bg-white text-gray-600 shadow-sm'}`}>⌘ K</kbd>
            </div>
          </button>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">

          <Link to="/getting-started" className="w-full sm:w-auto min-w-[200px] group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#E8B058] text-black font-bold rounded-2xl overflow-hidden transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 no-underline">
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>

          <Link to="/integration-hub" className={`w-full sm:w-auto min-w-[200px] group inline-flex items-center justify-center gap-2.5 px-8 py-4 backdrop-blur-md border font-medium rounded-2xl transition-all hover:-translate-y-0.5 no-underline ${isDark
            ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/30 text-white'
            : 'bg-black/5 hover:bg-black/10 border-black/5 hover:border-black/20 text-gray-900'
            }`}>
            <span>Integration Hub</span>
          </Link>

        </motion.div>

      </motion.div>

    </div>
  );
}
