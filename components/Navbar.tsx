import React, { useState, useEffect, useRef } from 'react';
import { SectionId } from '../types';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>(SectionId.HERO);
  // Use a ref to prevent excessive state updates/renders during scroll
  const activeSectionRef = useRef<SectionId>(SectionId.HERO);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Navbar background appearance logic
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);

      // 2. Scroll Spy Logic
      const sections = Object.values(SectionId);
      let current = SectionId.HERO;

      // We determine the active section by checking which one covers the 
      // upper-middle part of the screen (where the user is usually looking).
      // Adding 200px offset roughly accounts for the header and some visual buffer.
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          // Check if scroll position is within the bounds of this section
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            current = section;
            break; // Found the active section
          }
        }
      }
      
      // Edge Case: If user is at the very bottom of the page, highlight Contact
      // This handles cases where the last section is short and doesn't reach the 'scrollPosition' threshold
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
          current = SectionId.CONTACT;
      }

      // Only update state if the active section has actually changed
      if (activeSectionRef.current !== current) {
        setActiveSection(current);
        activeSectionRef.current = current;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run once on mount to set initial active state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: SectionId) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'glass-panel py-4 shadow-lg' : 'bg-transparent py-8'
    }`}>
      <div className="container mx-auto px-8 flex justify-between items-center">
        <div 
          className="text-3xl md:text-4xl font-bold font-mono tracking-tighter cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={() => scrollTo(SectionId.HERO)}
        >
          <span className="text-chroma-secondary">&lt;</span>
          <span className="text-white">Venkata</span>
          <span className="text-chroma-primary">.Dev</span>
          <span className="text-chroma-secondary">/&gt;</span>
        </div>
        
        <div className="hidden md:flex space-x-10">
          {Object.values(SectionId).map((id) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`capitalize text-base font-medium transition-colors relative group ${
                activeSection === id 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {id}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-chroma-accent transition-all duration-300 ${
                activeSection === id ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => scrollTo(SectionId.CONTACT)}
          className="bg-gradient-to-r from-chroma-primary to-chroma-secondary text-white px-7 py-3 rounded-full text-base font-bold hover:opacity-90 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)]"
        >
          Hire Me
        </button>
      </div>
    </nav>
  );
};

export default Navbar;