import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SectionId } from '../types';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

// --- Background Particle System ---

const ProcessParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      speedY: number;
      opacity: number;
      oscillation: number;
      oscillationSpeed: number;
    }> = [];

    let animationFrameId: number;

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        initParticles();
      }
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor(canvas.width * 0.05), 60);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          speedY: -(Math.random() * 0.3 + 0.1), // Gentle upward float
          opacity: Math.random() * 0.3 + 0.05,
          oscillation: Math.random() * Math.PI * 2,
          oscillationSpeed: Math.random() * 0.02 + 0.01
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.y += p.speedY;
        p.oscillation += p.oscillationSpeed;
        const xOffset = Math.sin(p.oscillation) * 1; // Subtle side-to-side drift
        
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(p.x + xOffset, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-40" />;
};

// --- Enhanced Visual Diagram Components ---

const DesignMorph = () => {
  const [shapeState, setShapeState] = useState(0); // 0: square, 1: circle, 2: diamond

  const toggleShape = () => setShapeState((prev) => (prev + 1) % 3);

  const getShapeClass = () => {
    switch(shapeState) {
      case 0: return 'rounded-xl rotate-0 scale-100';
      case 1: return 'rounded-full rotate-180 scale-90';
      case 2: return 'rounded-sm rotate-45 scale-75';
      default: return 'rounded-xl';
    }
  };

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center cursor-pointer group/morph perspective-[500px]"
      onClick={toggleShape}
    >
      {/* Orbiting Blobs - Dynamic Speed */}
      <div className="absolute w-32 h-32 border-2 border-dashed border-pink-500/20 rounded-full animate-[spin_10s_linear_infinite] group-hover/morph:animate-[spin_3s_linear_infinite] transition-all duration-500"></div>
      <div className="absolute w-24 h-24 border border-purple-500/30 rounded-full animate-blob mix-blend-screen filter blur-xl opacity-50 group-hover/morph:opacity-80 transition-opacity"></div>
      
      {/* Morphing Shape */}
      <div 
        className={`relative z-10 w-20 h-20 bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 shadow-[0_0_30px_rgba(236,72,153,0.5)] flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${getShapeClass()} group-hover/morph:shadow-[0_0_50px_rgba(236,72,153,0.8)]`}
      >
        <div className="text-white font-mono text-sm font-bold tracking-widest mix-blend-overlay">
          {shapeState === 0 ? 'UI' : shapeState === 1 ? 'UX' : 'DX'}
        </div>
        
        {/* Internal Glitch/Shine */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-0 group-hover/morph:opacity-100 transition-opacity duration-300 rounded-[inherit]"></div>
      </div>
      
      <div className="absolute bottom-4 text-[10px] text-white/40 opacity-0 group-hover/morph:opacity-100 transition-opacity transform translate-y-2 group-hover/morph:translate-y-0 duration-300">
        Click to Morph
      </div>
    </div>
  );
};

const ArchitectureStack = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center group/stack cursor-pointer"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      style={{ perspective: '1000px' }}
    >
      <div 
        className="relative w-28 h-28 transition-transform duration-700 ease-out"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: isExpanded ? 'rotateX(60deg) rotateY(0deg) rotateZ(-45deg)' : 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)'
        }}
      >
        
        {/* Database Layer (Bottom) */}
        <div 
          className="absolute inset-0 bg-blue-900/90 border border-blue-500/50 rounded-xl backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-500 ease-out"
          style={{ 
            transform: isExpanded ? 'translateZ(-60px)' : 'translateZ(0)',
            boxShadow: isExpanded ? '0 20px 40px rgba(0,0,0,0.5)' : 'none'
          }}
        >
           <span className="text-blue-300 text-xs font-mono font-bold opacity-70">DATA</span>
        </div>
        
        {/* API Layer (Middle) */}
        <div 
          className="absolute inset-0 bg-indigo-900/90 border border-indigo-500/50 rounded-xl backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-500 ease-out delay-75"
          style={{ 
            transform: isExpanded ? 'translateZ(0px)' : 'translateZ(0)',
          }}
        >
           <span className="text-indigo-300 text-xs font-mono font-bold opacity-80">API</span>
        </div>
        
        {/* Client Layer (Top) */}
        <div 
          className="absolute inset-0 bg-cyan-900/90 border border-cyan-400/50 rounded-xl backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-500 ease-out delay-150 overflow-hidden"
          style={{ 
            transform: isExpanded ? 'translateZ(60px)' : 'translateZ(0)',
          }}
        >
          <div className="font-mono text-sm text-cyan-300 font-bold">&lt;APP/&gt;</div>
          
          {/* Scanning Beam Effect */}
          <div 
            className={`absolute top-0 bottom-0 w-10 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 transition-transform duration-1000 ease-in-out ${isExpanded ? 'translate-x-[200%]' : '-translate-x-[200%]'}`}
          ></div>
        </div>

        {/* Connectivity Lines (Visible only when expanded) */}
        <div 
          className={`absolute inset-0 border-l-2 border-dashed border-white/20 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}
          style={{ transform: 'translateX(50%) translateZ(-30px) rotateY(90deg)', height: '120px', top: '-10px' }}
        ></div>

      </div>
    </div>
  );
};

const PhysicsWave = () => {
  const [bars, setBars] = useState([40, 60, 30, 80, 50, 70, 40]);
  const [hovered, setHovered] = useState(false);
  
  const randomize = () => {
    setBars(bars.map(() => Math.floor(Math.random() * 70) + 20));
  };

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl cursor-none group/wave"
      onMouseEnter={() => { setHovered(true); randomize(); }}
      onMouseLeave={() => setHovered(false)}
      onClick={randomize}
    >
      <div className="flex items-end space-x-2 h-32 px-4">
        {bars.map((height, i) => (
          <div 
            key={i}
            className={`w-4 rounded-t-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${hovered ? 'bg-gradient-to-t from-indigo-600 via-purple-500 to-white' : 'bg-white/20'}`}
            style={{ 
              height: `${hovered ? height : height * 0.5}%`,
              transitionDelay: `${i * 50}ms`,
              boxShadow: hovered ? '0 0 15px rgba(167, 139, 250, 0.5)' : 'none'
            }}
          />
        ))}
      </div>
      
      {/* Custom Cursor Effect */}
      <div 
        className="absolute w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none transition-opacity duration-300 opacity-0 group-hover/wave:opacity-100 mix-blend-overlay"
      ></div>
      
      <div className="absolute bottom-4 text-[10px] text-indigo-300 opacity-0 group-hover/wave:opacity-100 transition-opacity">
        Interactive EQ
      </div>
    </div>
  );
};

const NeuralNet = () => {
  const [activePath, setActivePath] = useState(false);

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center cursor-pointer group/neural overflow-hidden"
      onMouseEnter={() => setActivePath(true)}
      onMouseLeave={() => setActivePath(false)}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/30 to-transparent scale-150"></div>

      <svg viewBox="0 0 100 100" className="w-full h-full absolute p-4">
        {/* Nodes Defs */}
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
            markerWidth="4" markerHeight="4"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Static Connections */}
        <path d="M20,50 C30,20 70,20 80,50" stroke="#374151" fill="none" strokeWidth="1" />
        <path d="M20,50 C30,80 70,80 80,50" stroke="#374151" fill="none" strokeWidth="1" />
        <path d="M20,50 L80,50" stroke="#374151" fill="none" strokeWidth="1" />
        
        {/* Active Connection Animations */}
        <path 
          d="M20,50 C30,20 70,20 80,50" 
          stroke="#f59e0b" 
          fill="none" 
          strokeWidth="2" 
          strokeDasharray="100"
          strokeDashoffset={activePath ? "0" : "100"}
          className="transition-all duration-1000 ease-out"
          markerEnd="url(#arrow)"
        />
        <path 
          d="M20,50 C30,80 70,80 80,50" 
          stroke="#f59e0b" 
          fill="none" 
          strokeWidth="2" 
          strokeDasharray="100"
          strokeDashoffset={activePath ? "0" : "100"}
          className="transition-all duration-1000 ease-out delay-100"
        />
        <path 
          d="M20,50 L80,50" 
          stroke="#fbbf24" 
          fill="none" 
          strokeWidth="2" 
          strokeDasharray="60"
          strokeDashoffset={activePath ? "0" : "60"}
          className="transition-all duration-700 ease-linear delay-200"
        />
      </svg>

      {/* Left Node */}
      <div className="absolute left-[15%] top-[50%] -translate-y-1/2 w-4 h-4 bg-gray-700 border border-gray-500 rounded-full group-hover/neural:bg-amber-500 group-hover/neural:border-amber-300 transition-colors duration-300 shadow-lg z-10"></div>
      
      {/* Right Node */}
      <div className="absolute right-[15%] top-[50%] -translate-y-1/2 w-4 h-4 bg-gray-700 border border-gray-500 rounded-full group-hover/neural:bg-amber-500 group-hover/neural:border-amber-300 transition-colors duration-300 delay-300 shadow-lg z-10"></div>
      
      {/* Center Node Pulse */}
      <div className={`absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-amber-500/30 flex items-center justify-center transition-all duration-500 z-20 ${activePath ? 'scale-125 bg-amber-500/10 shadow-[0_0_20px_#f59e0b]' : 'scale-100'}`}>
        <div className={`w-3 h-3 bg-amber-500 rounded-full ${activePath ? 'animate-ping' : ''}`}></div>
      </div>
      
      <div className={`absolute w-2 h-2 bg-white rounded-full blur-[2px] transition-all duration-1000 ${activePath ? 'left-[80%] top-[50%] opacity-0' : 'left-[20%] top-[50%] opacity-100'}`}></div>
    </div>
  );
};

// --- Main Component Components ---

const ProcessCard: React.FC<{ 
  step: any; 
  index: number; 
  isVisible: boolean 
}> = ({ step, index, isVisible }) => {
  return (
    <div 
      className={`group relative w-full h-full transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Liquid Background Blobs (Absolute) */}
      <div className="absolute -inset-1 bg-gradient-to-r from-gray-700/50 to-black/50 rounded-[2.2rem] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>
      
      {/* Glass Container */}
      <div className="relative h-full liquid-glass rounded-[2rem] p-8 overflow-hidden transition-all duration-500 group-hover:-translate-y-2 flex flex-col">
        
        {/* Internal Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-white/0 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        
        {/* Ambient Color Glow */}
        <div className={`absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br ${step.glowColor} rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`}></div>

        {/* Content Grid */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header: Icon + Title */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                {step.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                {step.title}
              </h3>
            </div>
            <span className="text-5xl font-bold text-white/5 font-mono select-none group-hover:text-white/10 transition-colors">0{index + 1}</span>
          </div>

          {/* Description */}
          <div className="mb-8 flex-grow">
             <p className="text-gray-400 leading-relaxed text-sm md:text-base border-l-2 border-white/10 pl-4 group-hover:border-white/30 transition-colors">
               {step.description}
             </p>
          </div>

          {/* Interactive Diagram Area */}
          <div className="relative h-48 w-full rounded-2xl bg-[#0c0d12] border border-white/5 overflow-hidden group-hover:border-white/20 transition-colors duration-500 shadow-inner">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
             {step.visual}
          </div>
          
          {/* Bottom Tech Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {step.tags.map((tag: string) => (
              <span key={tag} className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/5 group-hover:bg-white/10 transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Process: React.FC = () => {
  const { elementRef, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  const steps = useMemo(() => [
    {
      id: 1,
      title: "Liquid Strategy",
      description: "Dissolving complex requirements into fluid, intuitive user flows. Click to morph the shape concept.",
      color: "from-pink-500 to-rose-500",
      glowColor: "from-pink-500 to-purple-500",
      icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
      tags: ["Figma", "System Design", "UX Research"],
      visual: <DesignMorph />
    },
    {
      id: 2,
      title: "Crystal Code",
      description: "Building crystalline structures. Hover to explode the stack and inspect the architectural layers.",
      color: "from-cyan-500 to-blue-600",
      glowColor: "from-cyan-400 to-blue-900",
      icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
      tags: ["React 19", "TypeScript", "Atomic Design"],
      visual: <ArchitectureStack />
    },
    {
      id: 3,
      title: "Kinetic Physics",
      description: "Breathing life into interfaces. Hover to trigger the interactive frequency response and sound wave simulation.",
      color: "from-indigo-500 to-purple-600",
      glowColor: "from-indigo-500 to-violet-900",
      icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
      tags: ["Framer Motion", "CSS Modules", "WebGL"],
      visual: <PhysicsWave />
    },
    {
      id: 4,
      title: "Neural Integration",
      description: "Connecting to the hive mind. Hover to activate the neural pathways and visualize data transmission.",
      color: "from-amber-400 to-orange-500",
      glowColor: "from-orange-500 to-red-900",
      icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      tags: ["Gemini API", "Function Calling", "RAG"],
      visual: <NeuralNet />
    }
  ], []);

  return (
    <section id={SectionId.PROCESS} className="py-32 bg-chroma-dark relative overflow-hidden">
      
      {/* Global Background Ambience - Enhanced with more dynamic blobs */}
      <div className="absolute inset-0 pointer-events-none">
         {/* Top-Left Purple/Pink */}
         <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-purple-900/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob opacity-40"></div>
         
         {/* Bottom-Right Blue */}
         <div className="absolute bottom-[-10%] right-[-10%] w-[45rem] h-[45rem] bg-blue-900/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000 opacity-40"></div>
         
         {/* Center-Left Subtle Pink */}
         <div className="absolute bottom-[10%] left-[10%] w-[35rem] h-[35rem] bg-pink-900/10 rounded-full mix-blend-screen filter blur-[90px] animate-blob animation-delay-4000 opacity-30"></div>
         
         {/* Top-Right Pulse */}
         <div className="absolute top-[20%] right-[20%] w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full mix-blend-overlay filter blur-[80px] animate-pulse-slow opacity-20"></div>
      </div>

      {/* Rising Bubble Particles */}
      <ProcessParticles />

      <div className="container mx-auto px-6 relative z-10" ref={elementRef}>
        
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-4 px-4 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 font-mono text-sm">BEHIND THE SCENES</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white cursor-default hover:tracking-wide transition-all duration-500">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 hover:from-pink-400 hover:via-purple-400 hover:to-indigo-400 transition-all duration-500">Creative</span> Process
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            A journey from abstract thought to concrete digital reality, powered by modern liquid design principles.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <ProcessCard 
              key={step.id} 
              step={step} 
              index={index} 
              isVisible={isVisible}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Process;