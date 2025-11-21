import React, { useEffect, useRef } from 'react';

const ScrollProgress: React.FC = () => {
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const updateScrollProgress = () => {
      if (!progressBarRef.current) return;
      
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollHeight > 0) {
        const percentage = (currentScroll / scrollHeight) * 100;
        // Direct DOM manipulation avoids React render cycle for high-frequency updates
        progressBarRef.current.style.width = `${percentage}%`;
      }
      
      animationFrameId = null; // Reset flag
    };

    const onScroll = () => {
       if (!animationFrameId) {
         animationFrameId = requestAnimationFrame(updateScrollProgress);
       }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initial update
    requestAnimationFrame(updateScrollProgress);

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[4px] z-[60] bg-transparent pointer-events-none">
      <div 
        ref={progressBarRef}
        className="h-full bg-gradient-to-r from-chroma-primary via-chroma-secondary to-chroma-accent shadow-[0_2px_10px_rgba(236,72,153,0.5)]"
        style={{ width: '0%', willChange: 'width' }}
      />
    </div>
  );
};

export default ScrollProgress;