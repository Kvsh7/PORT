
import React, { useState, useEffect, useRef } from 'react';
import { SectionId } from '../types';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

// --- Scientific Calculator Component ---
const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [memory, setMemory] = useState<number>(0);
  const [lastWasResult, setLastWasResult] = useState(false);
  const [error, setError] = useState(false);

  // Helper to safely evaluate the expression
  const safeEvaluate = (expr: string): number | null => {
    try {
      const evalExpr = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/log/g, 'Math.log10')
        .replace(/ln/g, 'Math.log')
        .replace(/√/g, 'Math.sqrt')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/\^/g, '**');

      // eslint-disable-next-line no-new-func
      const result = new Function('return ' + evalExpr)();
      if (!isFinite(result) || isNaN(result)) return null;
      return result;
    } catch (e) {
      return null;
    }
  };

  const handlePress = (val: string) => {
    if (error) {
      setDisplay(val);
      setExpression(val);
      setError(false);
      return;
    }

    if (lastWasResult && !['+', '-', '*', '/', '%', '^'].includes(val)) {
      setDisplay(val);
      setExpression(val);
      setLastWasResult(false);
      return;
    }
    
    if (lastWasResult) setLastWasResult(false);
    
    // Prevent multiple leading zeros
    if (display === '0' && !['.', '+', '-', '*', '/', '%', '^', ')'].includes(val)) {
      setDisplay(val);
      setExpression(val);
    } else {
      setDisplay(prev => prev + val);
      setExpression(prev => prev + val);
    }
  };

  const calculate = () => {
    const result = safeEvaluate(expression);
    if (result !== null) {
      // Precision handling to avoid 0.1 + 0.2 = 0.30000000004
      const formatted = String(Math.round(result * 1000000000) / 1000000000); 
      setDisplay(formatted);
      setExpression(formatted);
      setLastWasResult(true);
      return result;
    } else {
      setDisplay('Error');
      setError(true);
      setLastWasResult(true);
      return null;
    }
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
    setError(false);
  };

  // Memory Functions
  const memoryClear = () => setMemory(0);
  const memoryRecall = () => {
    if (lastWasResult) {
      setDisplay(String(memory));
      setExpression(String(memory));
    } else {
      handlePress(String(memory));
    }
  };
  const memoryAdd = () => {
    const res = safeEvaluate(expression); // Evaluate current expression first
    if (res !== null) setMemory(prev => prev + res);
    setLastWasResult(true);
  };
  const memorySub = () => {
    const res = safeEvaluate(expression);
    if (res !== null) setMemory(prev => prev - res);
    setLastWasResult(true);
  };

  const buttons = [
    // Row 1: Memory & Clear
    { label: 'MC', type: 'mem', action: memoryClear },
    { label: 'MR', type: 'mem', action: memoryRecall },
    { label: 'M+', type: 'mem', action: memoryAdd },
    { label: 'M-', type: 'mem', action: memorySub },
    { label: 'C', type: 'func', action: clear },

    // Row 2: Trig & Logs
    { label: 'sin', type: 'sci', action: () => handlePress('sin(') },
    { label: 'cos', type: 'sci', action: () => handlePress('cos(') },
    { label: 'tan', type: 'sci', action: () => handlePress('tan(') },
    { label: 'log', type: 'sci', action: () => handlePress('log(') },
    { label: 'ln', type: 'sci', action: () => handlePress('ln(') },

    // Row 3: Sci Ops
    { label: '(', type: 'sci', action: () => handlePress('(') },
    { label: ')', type: 'sci', action: () => handlePress(')') },
    { label: '^', type: 'sci', action: () => handlePress('^') },
    { label: '√', type: 'sci', action: () => handlePress('√(') },
    { label: '÷', type: 'op', action: () => handlePress('/') },

    // Row 4
    { label: '7', type: 'num', action: () => handlePress('7') },
    { label: '8', type: 'num', action: () => handlePress('8') },
    { label: '9', type: 'num', action: () => handlePress('9') },
    { label: '×', type: 'op', action: () => handlePress('*') },
    { label: 'π', type: 'sci', action: () => handlePress('π') },

    // Row 5
    { label: '4', type: 'num', action: () => handlePress('4') },
    { label: '5', type: 'num', action: () => handlePress('5') },
    { label: '6', type: 'num', action: () => handlePress('6') },
    { label: '-', type: 'op', action: () => handlePress('-') },
    { label: 'e', type: 'sci', action: () => handlePress('e') },

    // Row 6
    { label: '1', type: 'num', action: () => handlePress('1') },
    { label: '2', type: 'num', action: () => handlePress('2') },
    { label: '3', type: 'num', action: () => handlePress('3') },
    { label: '+', type: 'op', action: () => handlePress('+') },
    { label: '.', type: 'num', action: () => handlePress('.') },

    // Row 7
    { label: '0', type: 'num', col: 2, action: () => handlePress('0') },
    { label: '=', type: 'eq', col: 3, action: calculate },
  ];

  return (
    <div className="h-full flex flex-col p-4 max-w-xl mx-auto">
       {/* Display */}
       <div className="bg-black/40 rounded-2xl p-6 mb-4 text-right flex flex-col justify-end h-32 border border-white/5 shadow-inner relative overflow-hidden">
         {memory !== 0 && (
            <span className="absolute top-4 left-4 text-xs font-bold text-chroma-primary bg-chroma-primary/10 px-2 py-1 rounded">M</span>
         )}
         <span className="text-gray-500 text-sm h-6 overflow-hidden whitespace-nowrap">{expression}</span>
         <span className="text-4xl font-mono text-white tracking-widest overflow-hidden text-ellipsis whitespace-nowrap">{display}</span>
       </div>
       
       {/* Keypad */}
       <div className="grid grid-cols-5 gap-2 md:gap-3 flex-grow content-start">
         {buttons.map((btn, i) => (
           <button
             key={i}
             onClick={btn.action}
             className={`
               rounded-xl text-base md:text-lg font-bold transition-all duration-200 active:scale-95 py-3 md:py-4
               ${btn.col === 2 ? 'col-span-2' : ''}
               ${btn.col === 3 ? 'col-span-3' : ''}
               ${btn.type === 'num' ? 'bg-white/5 hover:bg-white/10 text-gray-200' : ''}
               ${btn.type === 'op' ? 'bg-chroma-primary/20 hover:bg-chroma-primary/40 text-chroma-primary border border-chroma-primary/30' : ''}
               ${btn.type === 'sci' ? 'bg-chroma-secondary/10 hover:bg-chroma-secondary/30 text-chroma-secondary text-sm md:text-base' : ''}
               ${btn.type === 'func' ? 'bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30' : ''}
               ${btn.type === 'mem' ? 'bg-gray-700/50 hover:bg-gray-600 text-gray-300 text-xs md:text-sm' : ''}
               ${btn.type === 'eq' ? 'bg-gradient-to-r from-chroma-primary to-chroma-secondary text-white shadow-lg' : ''}
             `}
           >
             {btn.label}
           </button>
         ))}
       </div>
    </div>
  );
};

// --- Pomodoro Timer Component ---
const Pomodoro: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    let interval: number;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound notification here potentially
    }

    const totalTime = mode === 'work' ? 25 * 60 : 5 * 60;
    setProgress((timeLeft / totalTime) * 100);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
    setProgress(100);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
    setProgress(100);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Circular Progress Props
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 relative">
      {/* Mode Toggle */}
      <div className="flex space-x-2 mb-8 bg-white/5 p-1 rounded-full">
        <button 
          onClick={() => switchMode('work')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'work' ? 'bg-chroma-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          Focus
        </button>
        <button 
          onClick={() => switchMode('break')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'break' ? 'bg-green-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          Break
        </button>
      </div>

      {/* Timer Visual */}
      <div className="relative mb-8 group">
        <svg width="300" height="300" className="transform -rotate-90">
          <circle
            cx="150"
            cy="150"
            r={radius}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="150"
            cy="150"
            r={radius}
            stroke={mode === 'work' ? '#6366f1' : '#22c55e'}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-mono font-bold text-white tracking-wider">{formatTime(timeLeft)}</span>
          <span className="text-gray-400 text-sm mt-2 uppercase tracking-widest">{isActive ? 'Running' : 'Paused'}</span>
        </div>
        
        {/* Glow effect behind */}
        <div className={`absolute inset-0 rounded-full blur-[60px] opacity-20 -z-10 transition-colors duration-500 ${mode === 'work' ? 'bg-chroma-primary' : 'bg-green-500'}`}></div>
      </div>

      {/* Controls */}
      <div className="flex space-x-6">
        <button 
          onClick={toggleTimer}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg ${isActive ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'}`}
        >
          {isActive ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
          ) : (
            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
        <button 
          onClick={resetTimer}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>
    </div>
  );
};

// --- Todo List Component ---
const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<{id: number, text: string, completed: boolean, priority: 'high' | 'normal'}[]>([
    { id: 1, text: 'Review Java Data Structures', completed: false, priority: 'high' },
    { id: 2, text: 'Update Portfolio UI', completed: true, priority: 'normal' },
  ]);
  const [input, setInput] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'normal'>('normal');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTasks([{ id: Date.now(), text: input, completed: false, priority: newPriority }, ...tasks]);
    setInput('');
    setNewPriority('normal');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="h-full flex flex-col p-6">
      <form onSubmit={addTask} className="mb-6 relative flex gap-2">
        <div className="relative flex-grow">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new task..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-chroma-primary transition-colors pr-12"
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 p-1.5 bg-chroma-primary rounded-lg text-white hover:bg-chroma-secondary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          </button>
        </div>
        
        {/* Priority Selector */}
        <div className="relative">
          <select 
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as 'high' | 'normal')}
            className={`appearance-none h-full pl-4 pr-8 rounded-xl border border-white/10 text-sm font-bold focus:outline-none transition-colors cursor-pointer ${
              newPriority === 'high' 
                ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                : 'bg-white/5 text-gray-400'
            }`}
          >
            <option value="normal" className="bg-gray-900 text-gray-300">Normal</option>
            <option value="high" className="bg-gray-900 text-red-400">High Priority</option>
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
          </div>
        </div>
      </form>

      {/* Filters */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${filter === f ? 'bg-white text-chroma-dark' : 'bg-white/5 text-gray-400 hover:text-white'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-grow overflow-y-auto space-y-3 pr-2 scrollbar-thin">
        {filteredTasks.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-40 text-gray-500">
             <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
             <p>No tasks found</p>
           </div>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id}
              className={`group flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${task.completed ? 'bg-green-500/5 border-green-500/20' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
            >
              <div className="flex items-center space-x-3 overflow-hidden flex-grow">
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-500 hover:border-white'}`}
                >
                  {task.completed && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                </button>
                <div className="flex flex-col truncate">
                  <span className={`truncate text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>{task.text}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pl-2">
                 {/* Priority Badge */}
                 <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                    task.priority === 'high' 
                      ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {task.priority}
                 </span>

                <button 
                  onClick={() => deleteTask(task.id)}
                  className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- Markdown Editor Component ---
const MarkdownEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState("# Welcome to Markdown\n\nType specific symbols to format your text:\n\n- Use **asterisks** for bold\n- Use *single asterisks* for italics\n- Use `backticks` for code\n\n> This is a blockquote.");

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('md-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const newText = text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end);
    
    setMarkdown(newText);
    
    // Restore focus and selection
    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const parseMarkdown = (text: string) => {
      // Basic sanitization and parsing for the preview
      let html = text
          // Headers
          .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-white mb-4 border-b border-white/10 pb-2">$1</h1>')
          .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-white mb-3">$1</h2>')
          .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-white mb-2">$1</h3>')
          // Bold
          .replace(/\*\*(.*)\*\*/gim, '<strong class="text-chroma-secondary font-bold">$1</strong>')
          // Italic
          .replace(/\*(.*)\*/gim, '<em class="text-chroma-accent italic">$1</em>')
          // Inline Code
          .replace(/`([^`]+)`/gim, '<code class="bg-white/10 text-pink-300 px-1.5 py-0.5 rounded font-mono text-sm">$1</code>')
          // Blockquote
          .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-chroma-primary pl-4 py-1 my-4 text-gray-400 italic bg-white/5 rounded-r">$1</blockquote>')
          // List
          .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc text-gray-300 mb-1">$1</li>')
          // Line breaks
          .replace(/\n/gim, '<br />');
          
      return { __html: html };
  };

  return (
      <div className="h-full flex flex-col p-4 text-white">
          {/* Toolbar */}
          <div className="flex space-x-2 mb-4 bg-white/5 p-2 rounded-xl border border-white/10">
              <button onClick={() => insertText('**', '**')} className="p-2 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white font-bold" title="Bold">B</button>
              <button onClick={() => insertText('*', '*')} className="p-2 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white italic" title="Italic">I</button>
              <button onClick={() => insertText('# ')} className="p-2 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white font-bold" title="Header">H1</button>
              <button onClick={() => insertText('- ')} className="p-2 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white" title="List">• List</button>
              <button onClick={() => insertText('`', '`')} className="p-2 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white font-mono" title="Code">{'<>'}</button>
          </div>
          
          <div className="flex-grow flex flex-col md:flex-row gap-4 h-full overflow-hidden">
              {/* Editor */}
              <textarea
                  id="md-textarea"
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  className="flex-1 bg-black/30 border border-white/10 rounded-xl p-4 text-gray-300 font-mono text-sm focus:outline-none focus:border-chroma-primary resize-none placeholder-gray-600"
                  placeholder="Type markdown here..."
              />
              {/* Preview */}
              <div 
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 overflow-y-auto"
                  dangerouslySetInnerHTML={parseMarkdown(markdown)}
              />
          </div>
      </div>
  );
};


// --- Main Apps Container ---

const Apps: React.FC = () => {
  const { elementRef, isVisible } = useIntersectionObserver({ threshold: 0.1 });
  const [activeTab, setActiveTab] = useState<'calculator' | 'pomodoro' | 'todo' | 'markdown'>('calculator');

  return (
    <section id={SectionId.APPS} className="py-24 bg-gradient-to-b from-[#090a0f] to-chroma-dark relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-chroma-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10" ref={elementRef}>
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-chroma-secondary to-chroma-accent">Playground</span></h2>
          <p className="text-gray-400">Explore functional React mini-apps designed for productivity.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto min-h-[600px]">
          
          {/* Navigation/Sidebar */}
          <div className="lg:w-1/4 flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
            {[
              { id: 'calculator', label: 'Calculator', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
              { id: 'pomodoro', label: 'Focus Timer', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              { id: 'todo', label: 'Smart Tasks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
              { id: 'markdown', label: 'Markdown', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM6 17V7l4 4 4-4v10' }
            ].map((app) => (
              <button
                key={app.id}
                onClick={() => setActiveTab(app.id as any)}
                className={`flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 min-w-[180px] lg:w-full text-left group ${
                  activeTab === app.id 
                    ? 'bg-gradient-to-r from-chroma-primary/20 to-chroma-secondary/20 border border-chroma-primary/50 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
                    : 'bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeTab === app.id ? 'bg-white text-chroma-primary' : 'bg-black/30 group-hover:bg-white/10'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={app.icon} /></svg>
                </div>
                <span className="font-bold">{app.label}</span>
              </button>
            ))}
          </div>

          {/* App Display Area */}
          <div className="lg:w-3/4 liquid-glass rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl bg-black/40 backdrop-blur-xl">
             {/* Dynamic Content */}
             <div className="h-full w-full p-2">
               {activeTab === 'calculator' && <Calculator />}
               {activeTab === 'pomodoro' && <Pomodoro />}
               {activeTab === 'todo' && <TodoApp />}
               {activeTab === 'markdown' && <MarkdownEditor />}
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Apps;
