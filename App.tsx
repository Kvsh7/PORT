import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Process from './components/Process';
import Projects from './components/Projects';
import GeminiChat from './components/GeminiChat';
import ScrollProgress from './components/ScrollProgress';
import { SectionId } from './types';

const App: React.FC = () => {
  return (
    <div className="bg-chroma-dark text-white min-h-screen relative font-sans selection:bg-chroma-primary selection:text-white">
      
      <ScrollProgress />
      <Navbar />
      
      <main>
        <Hero />
        <About />
        <Skills />
        <Process />
        <Projects />

        {/* Contact Section */}
        <section id={SectionId.CONTACT} className="py-24 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-t from-black via-chroma-card to-transparent z-0"></div>
           <div className="container mx-auto px-6 relative z-10">
             <div className="max-w-3xl mx-auto bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg p-10 rounded-3xl border border-white/10 text-center">
               <h2 className="text-3xl md:text-5xl font-bold mb-6 cursor-default hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-chroma-primary hover:to-chroma-secondary transition-all duration-500">Let's Build Something Amazing</h2>
               <p className="text-gray-300 mb-8 text-lg">
                 Have a project in mind? I'm available for opportunities.
                 <br />
                 Email: <span className="text-white font-bold">kvsh19997@gmail.com</span> | Phone: <span className="text-white font-bold">6300399838</span>
               </p>
               <a 
                 href="mailto:kvsh19997@gmail.com"
                 className="inline-block px-10 py-4 bg-white text-chroma-dark font-bold rounded-full hover:bg-chroma-primary hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]"
               >
                 Send an Email
               </a>
             </div>
           </div>
        </section>
      </main>

      <footer className="bg-black py-8 text-center border-t border-white/10">
        <div className="container mx-auto px-6">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Venkata Sai Hanuman. Built with React, Tailwind & Gemini API.
          </p>
        </div>
      </footer>

      <GeminiChat />
    </div>
  );
};

export default App;