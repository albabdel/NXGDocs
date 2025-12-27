import React, { useEffect, useRef } from 'react';
import Link from '@docusaurus/Link';

/**
 * NXGEN Sphere Background - Three.js Version
 * 
 * This is an OPTIONAL advanced version using Three.js for ultra-realistic 3D
 * Only use this if you want the most photorealistic sphere effect
 * 
 * Installation required:
 * npm install three
 * 
 * If you prefer the pure CSS version (recommended for most cases), 
 * use NXGENSphereHero.jsx instead
 */

export default function NXGENSphereHeroThreeJS() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Dynamically import Three.js to avoid SSR issues
    let THREE;
    let scene, camera, renderer, sphere, grid;
    let animationId;

    const initThreeJS = async () => {
      // Dynamic import for Docusaurus compatibility
      THREE = (await import('three')).default;

      if (!canvasRef.current || !containerRef.current) return;

      // Scene setup
      scene = new THREE.Scene();
      
      // Camera
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
      camera.position.z = 800;

      // Renderer
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Create sphere
      const geometry = new THREE.SphereGeometry(250, 64, 64);
      
      // Sphere material with realistic shading
      const material = new THREE.MeshPhongMaterial({
        color: 0x1a1a1a,
        emissive: 0x0a0a0a,
        specular: 0x444444,
        shininess: 30,
        transparent: true,
        opacity: 0.95,
      });
      
      sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      // Grid wireframe overlay
      const gridGeometry = new THREE.SphereGeometry(252, 32, 32);
      const gridMaterial = new THREE.MeshBasicMaterial({
        color: 0xC89446,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      });
      grid = new THREE.Mesh(gridGeometry, gridMaterial);
      scene.add(grid);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 1);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
      keyLight.position.set(-100, 100, 100);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xC89446, 0.3);
      fillLight.position.set(100, -50, -100);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xC89446, 0.5);
      rimLight.position.set(0, 50, -200);
      scene.add(rimLight);

      // Particle system (stars)
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 1000;
      const posArray = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 2000;
      }

      particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(posArray, 3)
      );

      const particlesMaterial = new THREE.PointsMaterial({
        size: 2,
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
      });

      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);

      // Animation loop
      const animate = () => {
        animationId = requestAnimationFrame(animate);

        // Rotate sphere slowly
        sphere.rotation.y += 0.001;
        
        // Rotate grid opposite direction
        grid.rotation.y -= 0.002;
        grid.rotation.x += 0.0005;

        // Subtle particle movement
        particlesMesh.rotation.y += 0.0002;

        renderer.render(scene, camera);
      };

      animate();

      // Handle resize
      const handleResize = () => {
        if (!containerRef.current) return;
        
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    };

    initThreeJS();

    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #0A0A0A 50%, #1A1A1A 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      
      {/* Three.js Canvas */}
      <canvas 
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />
      
      {/* Content overlay (same as CSS version) */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        {/* XO Logo */}
        <div className="xo-logo">
          <div className="xo-inner">XO</div>
        </div>
        
        <div className="by-nxgen">BY NXGEN</div>
        
        <div className="sphere-tagline">
          Proactive Monitoring Operating System
        </div>
        
        {/* CTA Button */}
        <Link to="/getting-started" className="sphere-cta">
          <div className="cta-icon">🔥</div>
          <span>I'm Genie. Ready to scale with GCXONE?</span>
          <div className="cta-arrow">→</div>
        </Link>
        
        {/* Explore By Section */}
        <div className="explore-by-section">
          <div className="explore-label">EXPLORE BY</div>
          <div className="explore-buttons">
            <Link to="/explore/breakthroughs" className="explore-button">
              <div className="explore-icon">💡</div>
              <div className="explore-label-text">Breakthroughs</div>
            </Link>
            <Link to="/explore/job-functions" className="explore-button">
              <div className="explore-icon">👥</div>
              <div className="explore-label-text">Job Functions</div>
            </Link>
            <Link to="/explore/core-benefits" className="explore-button">
              <div className="explore-icon">⚡</div>
              <div className="explore-label-text">Core Benefits</div>
            </Link>
            <Link to="/explore/solution-kits" className="explore-button">
              <div className="explore-icon">📦</div>
              <div className="explore-label-text">Solution Kits</div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-value">60K+</div>
          <div className="stat-label">Cameras & Sensors</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">20K+</div>
          <div className="stat-label">Monitored Sites</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">1.5M+</div>
          <div className="stat-label">Events per 24 hours</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">1M+</div>
          <div className="stat-label">False Alarm Filtered</div>
        </div>
      </div>
    </div>
  );
}
