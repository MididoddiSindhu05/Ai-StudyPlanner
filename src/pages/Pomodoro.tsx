import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Briefcase, 
  Settings, 
  Plus, 
  CheckCircle2,
  Trash2,
  Zap
} from 'lucide-react';

export default function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'Focus' | 'ShortBreak' | 'LongBreak'>('Focus');
  const [sessions, setSessions] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (mode === 'Focus') {
      setSessions(s => s + 1);
    }
    resetTimer();
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'Focus') setTimeLeft(25 * 60);
    else if (mode === 'ShortBreak') setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = timeLeft / (mode === 'Focus' ? 25 * 60 : mode === 'ShortBreak' ? 5 * 60 : 15 * 60);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#09090B]/80 backdrop-blur-md z-10 flex-shrink-0">
        <div>
          <h1 className="text-xl font-semibold italic font-display tracking-tight uppercase text-white">Focus <span className="text-indigo-400">Core</span></h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black">Temporal Optimization</p>
        </div>
      </header>

      <div className="flex-1 p-8 grid grid-cols-12 gap-4 overflow-y-auto min-h-0">
        {/* Main Timer */}
        <div className="col-span-12 lg:col-span-8 bento-card p-12 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[500px]">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-transparent opacity-50" />
          
          <div className="relative z-10 space-y-12 w-full max-w-md">
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => { setMode('Focus'); setTimeLeft(25 * 60); setIsActive(false); }}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'Focus' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800 text-slate-500 hover:text-slate-300'}`}
              >
                Deep Work
              </button>
              <button 
                onClick={() => { setMode('ShortBreak'); setTimeLeft(5 * 60); setIsActive(false); }}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'ShortBreak' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-slate-800 text-slate-500 hover:text-slate-300'}`}
              >
                Neural Break
              </button>
            </div>

            <div className="relative group mx-auto">
              <svg className="w-80 h-80 transform -rotate-90">
                <circle cx="160" cy="160" r="140" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-900" />
                <motion.circle 
                   cx="160" cy="160" r="140" stroke="currentColor" strokeWidth="8" fill="transparent" 
                   className={mode === 'Focus' ? 'text-indigo-500' : 'text-cyan-400'}
                   strokeDasharray="879.6"
                   animate={{ strokeDashoffset: 879.6 * (1 - progress) }}
                   strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[6rem] font-black font-display tracking-tighter italic leading-none text-white drop-shadow-2xl">
                  {formatTime(timeLeft)}
                </span>
                <p className="text-xs font-black uppercase tracking-[0.5em] text-slate-500 mt-4 italic">Active Focus State</p>
              </div>
            </div>

            <div className="flex justify-center gap-6">
              <button 
                onClick={() => setIsActive(!isActive)}
                className={`p-6 rounded-3xl transition-all hover:scale-110 active:scale-95 ${isActive ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/30'}`}
              >
                {isActive ? <Pause size={32} /> : <Play size={32} fill="white" />}
              </button>
              <button 
                onClick={resetTimer}
                className="p-6 bg-slate-800/80 rounded-3xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all border border-slate-700"
              >
                <RotateCcw size={32} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="bento-card p-8 flex flex-col justify-between h-40">
             <div className="flex justify-between items-center text-left">
               <div>
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Session Progress</h3>
                 <p className="text-xl font-bold text-slate-200 mt-1">Goal: 4 Cycles</p>
               </div>
               <span className="text-xs font-bold text-indigo-400">{(sessions/4*100).toFixed(0)}%</span>
             </div>
             <div className="space-y-4">
               <div className="flex gap-2">
                  {[1,2,3,4].map(s => (
                    <div key={s} className={`h-2 flex-1 rounded-full ${s <= sessions ? 'bg-indigo-500 shadow-[0_0_5px_#6366f1]' : 'bg-slate-800'}`} />
                  ))}
               </div>
               <p className="text-[10px] font-bold text-slate-500 text-center uppercase tracking-tighter">Cycle Status: {sessions} of 4 complete</p>
             </div>
          </div>

          <div className="bento-card p-8">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 italic">Ambient Engine</h3>
             <div className="space-y-3">
               {['White Noise', 'Rainfall', 'Deep Forest', 'Lo-Fi Pulse'].map((sound, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-indigo-500/30 transition-all cursor-pointer group">
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-100 uppercase tracking-wider">{sound}</span>
                    <div className="w-8 h-4 bg-slate-800 rounded-full relative">
                      <div className={`absolute top-1 left-1 w-2 h-2 rounded-full transition-all ${i === 0 ? 'left-5 bg-indigo-500 shadow-[0_0_5px_#6366f1]' : 'bg-slate-600'}`} />
                    </div>
                 </div>
               ))}
             </div>
          </div>

          <div className="bento-card p-8 flex-1 flex flex-col justify-center text-left">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 italic">Core Insights</h3>
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Biological rhythm: Peak efficiency</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Next: Neural Networks (Calculus)</p>
                </div>
             </div>
             <p className="text-[11px] text-slate-600 italic mt-8">"Success is the sum of small focus efforts."</p>
          </div>
        </div>

      </div>
    </div>
  );
}
