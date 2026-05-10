import { motion } from 'motion/react';
import { 
  BarChart2, 
  TrendingUp, 
  Calendar, 
  Clock, 
  PieChart as PieChartIcon,
  Search,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const data = [
  { name: 'Week 1', focus: 12, target: 15 },
  { name: 'Week 2', focus: 18, target: 15 },
  { name: 'Week 3', focus: 15, target: 15 },
  { name: 'Week 4', focus: 22, target: 15 },
];

const subjectData = [
  { name: 'Math', value: 400 },
  { name: 'Science', value: 300 },
  { name: 'History', value: 200 },
  { name: 'English', value: 100 },
];

const COLORS = ['#7C3AED', '#2563EB', '#06B6D4', '#10B981'];

export default function Analytics() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#09090B]/80 backdrop-blur-md z-10 flex-shrink-0">
        <div>
          <h1 className="text-xl font-semibold italic font-display tracking-tight uppercase">Performance <span className="text-indigo-400">Node</span></h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black">Data-Driven Excellence</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-slate-800 transition-all">
            <Calendar size={14} className="text-slate-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Oct 2024</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-8 overflow-y-auto min-h-0">
        <div className="max-w-7xl mx-auto grid grid-cols-4 grid-rows-2 gap-4">
          {/* Main Focus Trend (2x2) */}
          <div className="col-span-2 row-span-2 bento-card p-8 flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-lg font-bold font-display uppercase tracking-tight">Focus Duration Vector</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Total session hours per week</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black text-indigo-400 italic">67.5h</p>
                <p className="text-[10px] text-green-400 flex items-center justify-end gap-1 font-bold uppercase tracking-widest">
                  <ArrowUpRight size={12} /> Efficient Rise
                </p>
              </div>
            </div>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ backgroundColor: '#15151A', border: '1px solid #1e293b', borderRadius: '12px' }}
                  />
                  <Bar dataKey="focus" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subject Entropy (1x2) */}
          <div className="col-span-1 row-span-2 bento-card p-8 flex flex-col items-center">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 mb-8 w-full">Subject Distribution</h2>
            <div className="flex-1 w-full min-h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={subjectData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {subjectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="w-full space-y-4 mt-6">
               {subjectData.map((sub, i) => (
                 <div key={i} className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{sub.name}</span>
                   </div>
                   <span className="text-[10px] font-mono text-slate-500">{((sub.value / 1000) * 100).toFixed(0)}%</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Efficiency Score (1x1) */}
          <div className="col-span-1 bg-[#15151A] rounded-[2rem] border border-slate-800 p-8 flex flex-col justify-between">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Peak Performance</h3>
             <div>
               <p className="text-5xl font-black text-cyan-400 italic">84</p>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Advanced Tier</p>
             </div>
             <p className="text-[11px] text-slate-500 leading-tight">Your calculus focus has improved by 20% this week.</p>
          </div>

          {/* Streak Matrix (1x1) */}
          <div className="col-span-1 bento-card p-8 flex flex-col">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Activity Heat</h3>
            <div className="grid grid-cols-7 gap-1.5 flex-1">
               {Array.from({ length: 28 }).map((_, i) => (
                 <div 
                  key={i} 
                  className={`aspect-square rounded-sm ${i % 3 === 0 ? 'bg-indigo-500 shadow-[0_0_5px_#6366f1]' : 'bg-slate-900 border border-slate-800/50'}`} 
                 />
               ))}
            </div>
            <div className="mt-4 text-[10px] text-indigo-400 font-black uppercase tracking-widest flex justify-between">
              <span>L28 Matrix</span>
              <span>12 🔥</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
