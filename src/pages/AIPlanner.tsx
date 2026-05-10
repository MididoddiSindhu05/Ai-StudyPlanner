import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Calendar, 
  Plus, 
  Trash2, 
  Brain, 
  CheckCircle2, 
  BookOpen,
  ArrowRight,
  RefreshCw,
  Loader2,
  Target,
  Wand2,
  ListPlus
} from 'lucide-react';
import { getAIStudyPlan, synthesizeGoal } from '../services/gemini';
import { taskService } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

export default function AIPlanner() {
  const user = useAuthStore(state => state.user);
  const [subjects, setSubjects] = useState<string[]>(['Mathematics', 'Physics']);
  const [goals, setGoals] = useState<string[]>(['Catch up on mechanics', 'Understand limits']);
  const [newSubject, setNewSubject] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [plan, setPlan] = useState<any>(null);
  const [editablePlan, setEditablePlan] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Goal Synthesis state
  const [broadGoalInput, setBroadGoalInput] = useState('');
  const [synthesizedTasks, setSynthesizedTasks] = useState<any[]>([]);
  const [synthesizing, setSynthesizing] = useState(false);
  const [addingTask, setAddingTask] = useState<number | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    const generatedPlan = await getAIStudyPlan(subjects, goals, {});
    setPlan(generatedPlan);
    setEditablePlan(generatedPlan);
    setLoading(false);
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      setPlan(editablePlan);
    } else {
      setEditablePlan(JSON.parse(JSON.stringify(plan)));
    }
    setIsEditing(!isEditing);
  };

  const updateSlot = (dayIndex: number, slotIndex: number, field: string, value: string) => {
    const newPlan = { ...editablePlan };
    newPlan.schedule[dayIndex].slots[slotIndex][field] = value;
    setEditablePlan(newPlan);
  };

  const addSlot = (dayIndex: number) => {
    const newPlan = { ...editablePlan };
    newPlan.schedule[dayIndex].slots.push({
      time: '00:00 - 00:00',
      subject: 'New Subject',
      activity: 'New Activity'
    });
    setEditablePlan(newPlan);
  };

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    const newPlan = { ...editablePlan };
    newPlan.schedule[dayIndex].slots = newPlan.schedule[dayIndex].slots.filter((_: any, i: number) => i !== slotIndex);
    setEditablePlan(newPlan);
  };

  const handleSynthesizeAction = async () => {
    if (!broadGoalInput.trim()) return;
    setSynthesizing(true);
    const tasks = await synthesizeGoal(broadGoalInput);
    setSynthesizedTasks(tasks);
    setSynthesizing(false);
  };

  const addToMainList = async (task: any, index: number) => {
    if (!user) return;
    setAddingTask(index);
    try {
      await taskService.create({
        ...task,
        userId: user.id,
        status: 'Todo'
      });
      // Remove from synthesized list after success
      setSynthesizedTasks(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Failed to add task:', err);
    } finally {
      setAddingTask(null);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#09090B]/80 backdrop-blur-md z-10 flex-shrink-0">
        <div>
          <h1 className="text-xl font-semibold italic font-display tracking-tight uppercase">Smart <span className="text-indigo-400">Planner</span></h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black">AI Orchestrated Schedules</p>
        </div>
      </header>
      
      <div className="flex-1 p-8 overflow-y-auto space-y-8 min-h-0">
        {!plan ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Subjects Card */}
            <div className="bento-card p-10 flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                  <BookOpen size={24} />
                </div>
                <h2 className="text-xl font-bold tracking-tight">Academic Domain</h2>
              </div>
              
              <div className="space-y-6 flex-1">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && newSubject && (setSubjects([...subjects, newSubject]), setNewSubject(''))}
                    placeholder="Add subject (e.g. Physics)"
                    className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl px-5 py-4 text-sm outline-none focus:border-indigo-500/50 transition-all font-medium"
                  />
                  <button 
                    onClick={() => newSubject && (setSubjects([...subjects, newSubject]), setNewSubject(''))}
                    className="p-4 bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/20"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {subjects.map((sub, i) => (
                      <motion.span 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        key={sub} 
                        className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full text-xs font-bold uppercase tracking-widest text-slate-300 group"
                      >
                        {sub}
                        <button onClick={() => setSubjects(subjects.filter((_, idx) => idx !== i))} className="hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={12} />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Goals Card */}
            <div className="bento-card p-10 flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
                  <Target size={24} />
                </div>
                <h2 className="text-xl font-bold tracking-tight">Milestone Objectives</h2>
              </div>
              
              <div className="space-y-6 flex-1">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && newGoal && (setGoals([...goals, newGoal]), setNewGoal(''))}
                    placeholder="Add goal (e.g. Ace finals)"
                    className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl px-5 py-4 text-sm outline-none focus:border-purple-500/50 transition-all font-medium"
                  />
                  <button 
                    onClick={() => newGoal && (setGoals([...goals, newGoal]), setNewGoal(''))}
                    className="p-4 bg-purple-500 text-white rounded-xl hover:bg-purple-400 transition-all shadow-lg shadow-purple-500/20"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {goals.map((goal, i) => (
                      <motion.span 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        key={goal} 
                        className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full text-xs font-bold uppercase tracking-widest text-slate-300 group"
                      >
                        {goal}
                        <button onClick={() => setGoals(goals.filter((_, idx) => idx !== i))} className="hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={12} />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading || subjects.length === 0}
                className="w-full mt-10 bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-500/10 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Architecting Knowledge Node...</span>
                  </div>
                ) : (
                  <>Synthesize Study Architecture <Brain size={20} /></>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Goal Synthesis Section */}
            <div className="bento-card p-8 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border-indigo-500/20">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                      <Wand2 size={20} />
                    </div>
                    <h3 className="text-lg font-black italic uppercase tracking-tight text-white">Goal <span className="text-indigo-400">Synthesis</span></h3>
                  </div>
                  <p className="text-xs text-slate-400">Input a broad academic or skill goal and our AI will fracture it into technical, executable segments.</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={broadGoalInput}
                      onChange={(e) => setBroadGoalInput(e.target.value)}
                      placeholder="e.g. Master the fundamentals of Linear Algebra..."
                      className="flex-1 bg-[#0F0F12] border border-slate-800 rounded-xl px-5 py-3 text-sm outline-none focus:border-indigo-500/50 transition-all font-medium text-white"
                    />
                    <button 
                      onClick={handleSynthesizeAction}
                      disabled={synthesizing || !broadGoalInput}
                      className="px-6 bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-50"
                    >
                      {synthesizing ? <Loader2 size={18} className="animate-spin" /> : <Brain size={18} />}
                      <span className="text-xs font-black uppercase tracking-widest">Synthesize</span>
                    </button>
                  </div>
                </div>

                <div className="lg:w-1/2">
                  <AnimatePresence mode="wait">
                    {synthesizedTasks.length > 0 ? (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-3"
                      >
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Synthesized Task Vectors</p>
                        <div className="grid grid-cols-1 gap-2">
                          {synthesizedTasks.map((task, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-800 rounded-xl group hover:border-indigo-500/30 transition-all">
                              <div>
                                <p className="text-xs font-bold text-slate-200">{task.title}</p>
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{task.subject} • {task.priority}</p>
                              </div>
                              <button 
                                onClick={() => addToMainList(task, idx)}
                                disabled={addingTask === idx}
                                className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                title="Add to Study List"
                              >
                                {addingTask === idx ? <Loader2 size={16} className="animate-spin" /> : <ListPlus size={16} />}
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl p-8 opacity-50">
                        <Sparkles size={32} className="text-slate-700 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Awaiting Input Stream</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                {isEditing ? (
                  <input 
                    value={editablePlan.title}
                    onChange={(e) => setEditablePlan({...editablePlan, title: e.target.value})}
                    className="text-2xl font-black italic tracking-tighter bg-transparent border-b border-indigo-500/50 outline-none w-full"
                  />
                ) : (
                  <h2 className="text-2xl font-black italic tracking-tighter">{plan.title}</h2>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleToggleEdit}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${isEditing ? 'text-green-400 hover:text-green-300' : 'text-indigo-400 hover:text-indigo-300'}`}
                >
                  {isEditing ? <CheckCircle2 size={14} /> : <Wand2 size={14} />}
                  {isEditing ? 'Confirm Architecture' : 'Modify Core'}
                </button>
                <button 
                  onClick={() => { setPlan(null); setEditablePlan(null); setIsEditing(false); }}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                >
                  <RefreshCw size={14} /> Refine Model
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-6">
                {(isEditing ? editablePlan : plan).schedule.map((dayPlan: any, i: number) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="bento-card p-8 group"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-black italic text-indigo-400 flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                        {dayPlan.day}
                      </h3>
                      {isEditing && (
                        <button 
                          onClick={() => addSlot(i)}
                          className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500/20 transition-all"
                          title="Add Segment"
                        >
                          <Plus size={16} />
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      {dayPlan.slots.map((slot: any, si: number) => (
                        <div key={si} className="flex items-center gap-6 p-5 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all relative">
                          {isEditing ? (
                            <div className="flex-1 grid grid-cols-12 gap-4">
                              <input 
                                value={slot.time}
                                onChange={(e) => updateSlot(i, si, 'time', e.target.value)}
                                className="col-span-3 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-[10px] font-mono font-black text-center text-slate-300"
                              />
                              <div className="col-span-8 space-y-2">
                                <input 
                                  value={slot.subject}
                                  onChange={(e) => updateSlot(i, si, 'subject', e.target.value)}
                                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-white"
                                />
                                <input 
                                  value={slot.activity}
                                  onChange={(e) => updateSlot(i, si, 'activity', e.target.value)}
                                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-400"
                                />
                              </div>
                              <button 
                                onClick={() => removeSlot(i, si)}
                                className="col-span-1 p-2 text-slate-600 hover:text-red-400 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="p-2 bg-slate-800 rounded-lg text-slate-500 font-mono text-[10px] uppercase font-black tracking-widest min-w-[100px] text-center border border-slate-700">
                                {slot.time}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-slate-100">{slot.subject}</h4>
                                <p className="text-xs text-slate-500">{slot.activity}</p>
                              </div>
                              <CheckCircle2 size={20} className="text-slate-800 hover:text-indigo-500 transition-colors cursor-pointer" />
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                <div className="bento-card p-10 bg-indigo-900/10 border-indigo-500/20">
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 flex items-center gap-3">
                    <Sparkles size={18} />
                    Intelligence Node
                  </h3>
                  
                  {isEditing ? (
                    <textarea 
                      value={editablePlan.description}
                      onChange={(e) => setEditablePlan({...editablePlan, description: e.target.value})}
                      className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl p-4 text-xs text-slate-300 font-bold italic mb-8 h-40 outline-none"
                    />
                  ) : (
                    <p className="text-sm text-slate-400 mb-8 leading-relaxed font-bold italic">
                      "{plan.description}"
                    </p>
                  )}

                  <div className="space-y-6">
                    {(isEditing ? editablePlan : plan).recommendations.map((rec: string, i: number) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-5 h-5 rounded-full bg-indigo-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <ArrowRight size={12} className="text-indigo-400" />
                        </div>
                        {isEditing ? (
                          <input 
                             value={rec}
                             onChange={(e) => {
                               const newPlan = {...editablePlan};
                               newPlan.recommendations[i] = e.target.value;
                               setEditablePlan(newPlan);
                             }}
                             className="flex-1 bg-transparent border-b border-slate-800 text-xs font-bold text-slate-300 focus:border-indigo-500/50 outline-none"
                          />
                        ) : (
                          <p className="text-xs font-bold text-slate-300 leading-relaxed">{rec}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3 mt-10">
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Export Architecture</p>
                      <button 
                        onClick={() => {
                          const firstSession = plan.schedule[0]?.slots[0];
                          if (!firstSession) return;
                          
                          const title = encodeURIComponent(`Study: ${firstSession.subject} - ${firstSession.activity}`);
                          const details = encodeURIComponent(`AI Generated Study Session\n\nPlan: ${plan.title}\n\nGenerated by StudyAI`);
                          
                          // Simplified Google Calendar link for the first session as a demo
                          // In a real app, we might loop through all or provide a .ics file
                          const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
                          window.open(url, '_blank');
                        }}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-500/20"
                      >
                        Add to Google Calendar
                      </button>
                      <button 
                        onClick={() => {
                          const firstSession = plan.schedule[0]?.slots[0];
                          if (!firstSession) return;
                          
                          const title = encodeURIComponent(`Study: ${firstSession.subject}`);
                          const body = encodeURIComponent(firstSession.activity);
                          
                          const url = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&body=${body}`;
                          window.open(url, '_blank');
                        }}
                        className="w-full py-4 bg-slate-800/50 hover:bg-slate-800 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border border-slate-700 flex items-center justify-center gap-2"
                      >
                        Add to Outlook
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
