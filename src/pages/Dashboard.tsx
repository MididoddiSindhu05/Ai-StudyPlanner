import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Flame, 
  Target, 
  CheckCircle2, 
  Plus, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Brain,
  RotateCcw
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useAuthStore } from '../store/useAuthStore';
import { getAIRecommendation } from '../services/gemini';
import { taskService } from '../services/api';

const StatCard = ({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) => (
  <div className="glass-card p-6 flex items-center gap-4">
    <div className={`p-3 rounded-2xl ${color} bg-opacity-20`}>
      <Icon className={color.replace('bg-', 'text-')} size={24} />
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium">{label}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  </div>
);

const chartData = [
  { name: 'Mon', hours: 4 },
  { name: 'Tue', hours: 6 },
  { name: 'Wed', hours: 3 },
  { name: 'Thu', hours: 8 },
  { name: 'Fri', hours: 5 },
  { name: 'Sat', hours: 2 },
  { name: 'Sun', hours: 4 },
];

export default function Dashboard() {
  const user = useAuthStore(state => state.user);
  const [aiTips, setAiTips] = useState<string[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', subject: '', priority: 'Medium' });

  useEffect(() => {
    const fetchAI = async () => {
      const tips = await getAIRecommendation([]);
      setAiTips(tips);
    };
    const fetchTasks = async () => {
      try {
        const res = await taskService.getAll();
        setTasks(res.data);
      } catch (err) {
        setTasks([
          { title: 'Advanced Calculus', subject: 'Calculus', time: '09:00 - 10:30', status: 'Todo', color: 'bg-cyan-500' },
          { title: 'AI Ethics Essay', subject: 'Ethics', time: '11:00 - 12:30', status: 'InProgress', color: 'bg-purple-500' },
          { title: 'Neural Networks', subject: 'CS', time: '14:00 - 15:30', status: 'Todo', color: 'bg-indigo-500' },
        ]);
      }
    };
    fetchAI();
    fetchTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.subject) return;

    try {
      const res = await taskService.create({ 
        ...newTask, 
        userId: user?.id,
        status: 'Todo'
      });
      setTasks([res.data, ...tasks]);
      setIsTaskModalOpen(false);
      setNewTask({ title: '', subject: '', priority: 'Medium' });
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      <AnimatePresence>
        {isTaskModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTaskModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bento-card p-8 w-full max-w-md relative z-10 bg-[#15151A] border border-slate-800"
            >
              <h2 className="text-xl font-black italic mb-6 text-white uppercase tracking-tight">New <span className="text-indigo-400">Task</span></h2>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Work Description</label>
                  <input 
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-indigo-500/50 transition-all text-white"
                    placeholder="e.g. Finish Research Paper"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Academic Subject</label>
                  <input 
                    type="text"
                    required
                    value={newTask.subject}
                    onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-indigo-500/50 transition-all text-white"
                    placeholder="e.g. History"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Priority Vector</label>
                  <select 
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-indigo-500/50 transition-all text-white"
                  >
                    <option value="Low">Low Trace</option>
                    <option value="Medium">Medium Core</option>
                    <option value="High">High Velocity</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-indigo-500/20 mt-4"
                >
                  Confirm Entry
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#09090B]/80 backdrop-blur-md z-10 flex-shrink-0">
        <div>
          <h1 className="text-xl font-semibold">Good morning, {user?.name?.split(' ')[0] || 'Student'}</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} • Exams in 14 days
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">
            <span className="text-[10px] font-black tracking-widest">🔥 {user?.streak || 12} DAY STREAK</span>
          </div>
          <button 
            onClick={() => setIsTaskModalOpen(true)}
            className="p-2 text-slate-400 hover:text-white transition-all bg-white/5 border border-white/5 rounded-lg"
          >
            <Plus size={20} />
          </button>
        </div>
      </header>

      {/* Bento Grid */}
      <section className="flex-1 p-8 grid grid-cols-4 grid-rows-3 gap-4 overflow-y-auto min-h-0">
        
        {/* Performance Graph (2x2) */}
        <div className="col-span-2 row-span-2 bento-card p-6 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-medium">Study Performance</h2>
              <p className="text-sm text-slate-500">Average 6.4h / day this week</p>
            </div>
            <select className="bg-slate-800 border-none text-[10px] uppercase font-black tracking-widest rounded-md px-2 py-1 outline-none cursor-pointer"> 
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="flex-1 min-h-[200px]">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#15151A', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                  <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-slate-500 uppercase tracking-tighter font-black">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Schedule (1x2) */}
        <div className="col-span-1 row-span-2 bento-card p-6 flex flex-col">
          <h2 className="text-lg font-medium mb-6">Today's Schedule</h2>
          <div className="space-y-6 flex-1">
            {tasks.map((task, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer">
                <div className={`w-1 ${task.priority === 'High' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : task.priority === 'Medium' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'} h-10 rounded-full group-hover:scale-y-110 transition-transform`}></div>
                <div>
                  <p className="text-sm font-bold text-slate-200">{task.title}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{task.subject} • {task.priority || 'Medium'} Priority</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 w-full py-4 bg-slate-800/50 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-colors">
            Full Planner
          </button>
        </div>

        {/* Efficiency Score (1x1) */}
        <div className="col-span-1 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-[2rem] border border-indigo-500/20 p-6 flex flex-col items-center justify-center text-center">
          <p className="text-[10px] text-indigo-300 uppercase tracking-[0.2em] font-black mb-1">Efficiency</p>
          <span className="text-6xl font-black text-white italic">94</span>
          <p className="text-[10px] text-indigo-400 font-bold mt-2">+12% from last week</p>
        </div>

        {/* AI Insight (1x1) */}
        <div className="col-span-1 bento-card p-6 flex flex-col">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/20">
            <Brain size={20} />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            <span className="text-indigo-400 font-bold">AI Insight:</span> You're most focused between 10 AM and 1 PM. Shift harder subjects here.
          </p>
        </div>

        {/* Exam Countdown (1x1) */}
        <div className="col-span-1 bento-card p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
           <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl"></div>
           <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Final Exams</h3>
           <p className="text-3xl font-black text-rose-500 tracking-tighter">14 Days</p>
           <p className="text-[10px] text-slate-600 mt-2 italic font-medium px-4">"The expert in anything was once a beginner."</p>
        </div>

        {/* Focus Timer Mini (2x1) */}
        <div className="col-span-2 bento-card p-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-indigo-500 shadow-indigo-500" strokeDasharray="263.8" strokeDashoffset="65.9" />
              </svg>
              <span className="absolute text-xl font-display font-black tracking-tighter italic">18:42</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-200">Current: Physics Lab</p>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Session 2 of 4</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-4 bg-indigo-500 hover:bg-indigo-400 rounded-full shadow-lg shadow-indigo-500/20 text-white transition-all">
              <Zap size={20} fill="white" />
            </button>
            <button className="p-4 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        {/* Goal Progress (1x1) */}
        <div className="col-span-1 bento-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Term Goal</span>
              <span className="text-xs font-black text-cyan-400">78%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full w-[78%] rounded-full shadow-[0_0_8px_#22d3ee]"></div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">On track to complete all modules 3 days before exam.</p>
        </div>

      </section>
    </div>
  );
}
