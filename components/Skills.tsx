import React, { useState, useEffect } from 'react';
import { SectionId } from '../types';
import { SKILLS } from '../constants';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';

const Skills: React.FC = () => {
  const { elementRef, isVisible } = useIntersectionObserver();
  const [chartData, setChartData] = useState(SKILLS.map(s => ({ ...s, level: 0 })));

  useEffect(() => {
    if (isVisible) {
      // Delay slightly to allow the fade-in reveal to start first
      const timer = setTimeout(() => {
        setChartData(SKILLS);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <section id={SectionId.SKILLS} className="py-20 bg-chroma-dark relative">
      <div className="container mx-auto px-6" ref={elementRef}>
        <div className={`reveal ${isVisible ? 'active' : ''}`}>
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center group cursor-default">
            <span className="border-b-4 border-chroma-primary transition-all duration-500 group-hover:border-chroma-secondary group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 group-hover:tracking-wide">
              Technical Proficiency
            </span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Chart Area */}
            <div className="h-[400px] w-full glass-panel p-6 rounded-2xl border border-white/5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={120} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    interval={0}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F1016', borderColor: '#333', color: '#fff' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar 
                    dataKey="level" 
                    radius={[0, 4, 4, 0]} 
                    barSize={20}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  >
                     {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#ec4899'} />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Text Content */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white transition-colors duration-300 hover:text-chroma-primary cursor-default w-fit">Core Competencies</h3>
              <p className="text-gray-400 leading-relaxed">
                Proficient in <span className="text-white">Java</span> and skilled in building robust applications. 
                I possess a strong understanding of Object-Oriented Programming, Data Structures, and modern Web Technologies. 
                My training at Besant Technologies has equipped me with the practical skills to tackle complex development challenges.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-chroma-primary transition-colors">
                  <h4 className="text-chroma-primary font-bold mb-2">Programming</h4>
                  <p className="text-sm text-gray-400">Core Java, OOP, Data Structures, Exception Handling</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-chroma-secondary transition-colors">
                  <h4 className="text-chroma-secondary font-bold mb-2">Web Dev</h4>
                  <p className="text-sm text-gray-400">HTML, CSS, JavaScript, RESTful APIs</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-chroma-accent transition-colors">
                  <h4 className="text-chroma-accent font-bold mb-2">Database</h4>
                  <p className="text-sm text-gray-400">SQL, Database Connectivity, Collections</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-white transition-colors">
                  <h4 className="text-white font-bold mb-2">Certifications</h4>
                  <p className="text-sm text-gray-400">Microsoft Azure Fundamentals, HTML (Udemy)</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;