import React, { useRef, useEffect } from 'react';
import { SectionId } from '../types';
import { PROJECTS } from '../constants';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const ProjectCard: React.FC<{ project: typeof PROJECTS[0], index: number }> = ({ project, index }) => {
  // observerRef tracks when the element enters the viewport
  const { elementRef: observerRef, isVisible } = useIntersectionObserver({ threshold: 0.1 });
  
  // cardRef is used for the inner card interactions (mouse move shadow, hover lift)
  const cardRef = useRef<HTMLDivElement>(null);
  
  // parallaxRef targets the image inside for the scroll effect
  const parallaxRef = useRef<HTMLDivElement>(null);
  
  const animationFrameRef = useRef<number>(null);

  // Optimized Parallax Scroll Effect
  useEffect(() => {
    let ticking = false;

    const updateParallax = () => {
      // Check visibility relative to viewport using the wrapper (observerRef)
      if (!observerRef.current || !parallaxRef.current) {
        ticking = false;
        return;
      }
      
      const rect = observerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Check if visible in viewport with buffer
      if (rect.bottom > -100 && rect.top < viewportHeight + 100) {
        const cardCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;
        const distanceFromCenter = viewportCenter - cardCenter;
        
        const speed = 0.08; // Gentle parallax speed
        const yOffset = distanceFromCenter * speed;
        
        // Use transform3d for hardware acceleration
        parallaxRef.current.style.transform = `translate3d(0, ${yOffset}px, 0)`;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax(); // Initial position
    
    return () => window.removeEventListener('scroll', onScroll);
  }, [observerRef]);

  // Optimized Mouse Move Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Apply effect to the inner cardRef
    if (!cardRef.current) return;
    
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const deltaX = (x - centerX) / 25;
      const deltaY = (y - centerY) / 25;

      cardRef.current.style.boxShadow = `
        ${deltaX}px ${deltaY}px 20px 0px rgba(99, 102, 241, 0.2),
        ${-deltaX}px ${-deltaY}px 20px 0px rgba(236, 72, 153, 0.2)
      `;
    });
  };

  const handleMouseLeave = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (cardRef.current) {
      cardRef.current.style.boxShadow = '';
    }
  };

  return (
    // Outer Wrapper: Handles Entrance Animation & Staggering
    // Separation prevents transition-delay from affecting hover states
    <div 
      ref={observerRef}
      className={`relative w-full transition-all duration-700 ease-out will-change-transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ 
        transitionDelay: `${index * 150}ms`, // Sequential staggered entrance
      }}
    >
      {/* Inner Card: Handles Hover & Interactions */}
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative rounded-2xl overflow-hidden glass-panel transition-transform duration-300 ease-out hover:-translate-y-2"
      >
        {/* Image Container with Parallax */}
        <div className="h-56 overflow-hidden relative z-0">
          {/* Parallax Wrapper */}
          <div 
            ref={parallaxRef} 
            className="absolute inset-x-0 -top-[20%] h-[140%] w-full will-change-transform"
          >
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              loading="lazy"
            />
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 backdrop-blur-[2px]">
             <a href={project.link} className="px-6 py-2 bg-chroma-primary text-white rounded-full font-bold transform scale-90 group-hover:scale-100 transition-transform shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.8)]">
               View Details
             </a>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 relative z-10 bg-chroma-card/60 backdrop-blur-md border-t border-white/5">
          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-chroma-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-400 text-base mb-5 leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 group-hover:border-white/20 transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  return (
    <section id={SectionId.PROJECTS} className="py-32 bg-[#090a0f] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[20%] right-[10%] w-[30rem] h-[30rem] bg-chroma-primary/5 rounded-full blur-[100px] animate-pulse-slow"></div>
         <div className="absolute bottom-[10%] left-[10%] w-[20rem] h-[20rem] bg-chroma-secondary/5 rounded-full blur-[80px] animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-4 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 font-mono text-sm">ACADEMIC PROJECT</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white cursor-default transition-transform duration-500 hover:scale-[1.01] origin-center">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-chroma-secondary to-chroma-accent">Works</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Showcasing technical implementation of security and authentication principles.
          </p>
        </div>

        {/* Centered grid for single item */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center">
          {PROJECTS.map((project, index) => (
            <div key={project.id} className="md:col-start-1 md:col-end-3 lg:col-start-2 lg:col-end-3">
               <ProjectCard project={project} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;