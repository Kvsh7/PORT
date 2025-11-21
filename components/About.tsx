import React from 'react';
import { SectionId } from '../types';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const About: React.FC = () => {
  const { elementRef, isVisible } = useIntersectionObserver({ threshold: 0.3 });

  const stats = [
    { 
      value: "MCA", 
      label: "Graduate 2024", 
      color: "text-chroma-secondary", 
      border: "group-hover:border-chroma-secondary/50", 
      shadow: "group-hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]", 
      delay: 200 
    },
    { 
      value: "7.96", 
      label: "CGPA", 
      color: "text-chroma-accent", 
      border: "group-hover:border-chroma-accent/50", 
      shadow: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]", 
      delay: 400 
    },
    { 
      value: "Azure", 
      label: "Certified", 
      color: "text-chroma-primary", 
      border: "group-hover:border-chroma-primary/50", 
      shadow: "group-hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]", 
      delay: 600 
    }
  ];

  return (
    <section id={SectionId.ABOUT} className="py-24 bg-[#07080c] relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none opacity-20"></div>

      <div className="container mx-auto px-6 relative z-10" ref={elementRef}>
        <div className="max-w-4xl mx-auto text-center">
          
          <h2 
            className={`text-3xl md:text-5xl font-bold mb-8 transition-all duration-1000 ease-out transform cursor-default hover:tracking-widest hover:text-white hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            About The Creator
          </h2>
          
          <p 
            className={`text-xl text-gray-300 leading-relaxed mb-12 transition-all duration-1000 delay-100 ease-out transform ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            I am a dynamic and results-driven <span className="text-white font-bold">Java Professional</span> from Rajam. 
            With a Master of Computer Applications from Dr. B.R. Ambedkar University and hands-on training from Besant Technologies, 
            I excel in <span className="text-white font-bold">problem-solving</span> and <span className="text-white font-bold">teamwork</span>. 
            My organized approach and strong communication skills ensure I deliver high-quality code and meet critical deadlines.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 perspective-[1000px]">
             {stats.map((stat, idx) => (
               <div 
                 key={idx}
                 style={{ transitionDelay: `${stat.delay}ms` }}
                 className={`group flex-1 min-w-[140px] max-w-[200px] px-6 py-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md 
                   hover:bg-white/10 ${stat.border} ${stat.shadow}
                   transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
                   transform hover:-translate-y-3 hover:scale-105 cursor-default
                   ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-24 scale-75'}
                 `}
               >
                  <div className={`text-4xl font-bold ${stat.color} mb-2 transition-transform duration-300 group-hover:scale-110`}>{stat.value}</div>
                  <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold group-hover:text-white transition-colors">{stat.label}</div>
               </div>
             ))}
          </div>
          
          <div className={`mt-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
             <p className="text-gray-500 text-sm uppercase tracking-wide mb-4">Interests</p>
             <div className="flex flex-wrap justify-center gap-4">
                {['Artificial Intelligence', 'Cricket', 'Music', 'Tech Articles'].map((interest) => (
                  <span key={interest} className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-gray-300 text-sm hover:bg-white/10 transition-colors">
                    {interest}
                  </span>
                ))}
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;