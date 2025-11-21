import React, { useEffect, useRef } from 'react';
import { SectionId } from '../types';

const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true }); // Optimize for transparency
    if (!ctx) return;

    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      pulsateSpeed: number;
    }> = [];
    
    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // Optimization: Reduce particle count slightly for better performance on all devices
      const particleCount = Math.min(Math.floor(width * 0.1), 80); 
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.15,
          speedY: (Math.random() - 0.5) * 0.15,
          opacity: Math.random() * 0.5 + 0.1,
          pulsateSpeed: Math.random() * 0.02 + 0.005
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.05)'; // Very faint indigo
      ctx.lineWidth = 0.5;
      
      // Batch drawing for better performance
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        p.opacity += Math.sin(Date.now() * p.pulsateSpeed) * 0.005;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(0.8, p.opacity))})`;
        ctx.fill();

        // Optimized connection check: Only check neighbors within a closer range
        // and skip some iterations to reduce O(N^2) impact
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          
          // Simple box check first to avoid sqrt if possible
          if (Math.abs(dx) < 100 && Math.abs(dy) < 100) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
               ctx.beginPath();
               ctx.moveTo(p.x, p.y);
               ctx.lineTo(p2.x, p2.y);
               ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

const Hero: React.FC = () => {
  return (
    <section 
      id={SectionId.HERO} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 bg-chroma-dark"
    >
      {/* Base Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#05050A] via-[#0a0b14] to-[#05050A] z-0"></div>
      
      {/* Animated Blobs Layer - Reduced blur radius slightly for performance */}
      <div className="absolute inset-0 overflow-hidden z-0 opacity-30 will-change-transform">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-chroma-primary/20 rounded-full blur-[80px] animate-blob" style={{animationDelay: '0s'}}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-chroma-secondary/20 rounded-full blur-[80px] animate-blob" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-chroma-accent/20 rounded-full blur-[80px] animate-blob" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Particle System */}
      <ParticleField />

      {/* Floating Geometric Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Rotating Rings */}
        <div className="absolute top-[15%] right-[10%] w-64 h-64 rounded-full border border-white/5 animate-spin-slow will-change-transform" style={{animationDuration: '30s'}}></div>
        <div className="absolute top-[15%] right-[10%] w-64 h-64 rounded-full border border-dashed border-white/5 animate-spin-slow will-change-transform" style={{animationDuration: '40s', animationDirection: 'reverse'}}></div>
        
        {/* Floating Shapes */}
        <div className="absolute top-[20%] left-[15%] animate-float text-white/10" style={{animationDelay: '1s'}}>
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
             <rect x="2" y="2" width="20" height="20" rx="4" />
          </svg>
        </div>
        
        <div className="absolute bottom-[30%] left-[5%] animate-float text-chroma-primary/20" style={{animationDelay: '2.5s'}}>
           <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M12 2L2 22h20L12 2z" />
          </svg>
        </div>

        <div className="absolute top-[40%] right-[20%] animate-float text-chroma-secondary/20" style={{animationDelay: '0.5s'}}>
           <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <circle cx="12" cy="12" r="10" />
          </svg>
        </div>

        {/* 3D Perspective Grid Floor */}
        <div 
          className="absolute bottom-[-20%] left-[-50%] w-[200%] h-[600px] opacity-10 pointer-events-none"
          style={{
             backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)',
             backgroundSize: '50px 50px',
             transform: 'perspective(1000px) rotateX(60deg)',
             maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)'
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="inline-block mb-8 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md animate-float hover:bg-white/10 transition-colors cursor-default">
          <div className="flex items-center space-x-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-gray-200 text-sm md:text-base font-mono tracking-wide">MCA GRADUATE • JAVA PROFESSIONAL</span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-extrabold tracking-tight mb-8 leading-none">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            Venkata Sai
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-chroma-primary via-chroma-secondary to-chroma-accent drop-shadow-[0_0_40px_rgba(99,102,241,0.4)] pb-4 inline-block">
            Hanuman
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          Dynamic <span className="text-white font-medium">Java Developer</span> specializing in secure
          <span className="text-white font-medium"> Web Applications</span>, 
          <span className="text-white font-medium"> Data Structures</span>, and 
          <span className="text-white font-medium"> Biometric Auth Systems</span>.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button 
            onClick={() => document.getElementById(SectionId.PROJECTS)?.scrollIntoView({behavior: 'smooth'})}
            className="group relative px-10 py-5 bg-white text-chroma-dark font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(255,255,255,0.3)] text-lg"
          >
            <span className="relative z-10">View Projects</span>
            <div className="absolute inset-0 bg-gradient-to-r from-chroma-primary to-chroma-secondary opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </button>
          
          <button 
             onClick={() => document.getElementById(SectionId.CONTACT)?.scrollIntoView({behavior: 'smooth'})}
            className="px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 hover:border-white/30 backdrop-blur-sm text-lg hover:scale-105 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
          >
            Contact Me
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-gray-500 flex flex-col items-center gap-2 animate-float" style={{animationDuration: '3s'}}>
        <span className="text-xs uppercase tracking-widest opacity-50">Scroll</span>
        <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;