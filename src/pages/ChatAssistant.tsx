import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles,
  BookOpen,
  Brain,
  MessageSquare
} from 'lucide-react';
import { getAIChatResponse } from '../services/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your AI Study Assistant. I help synthesize complex topics and optimize your academic trajectory. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const response = await getAIChatResponse(userMsg, "User is a student focusing on general productivity.");
      setMessages(prev => [...prev, { role: 'assistant', content: response || "I'm sorry, I couldn't process that." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to AI service." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#09090B]/80 backdrop-blur-md z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500 rounded-lg text-white shadow-lg shadow-indigo-500/20">
            <MessageSquare size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold italic font-display tracking-tight uppercase">AI <span className="text-indigo-400">Assistant</span></h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black underline decoration-indigo-500/50 underline-offset-2">Cognitive Enhancement Layer</p>
          </div>
        </div>
        <div className="hidden md:flex gap-4">
           <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 border border-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-all">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Sync</span>
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
           </div>
        </div>
      </header>

      <div className="flex-1 p-8 overflow-hidden min-h-0 flex gap-4 max-w-7xl mx-auto w-full">
        {/* Main Chat (8 cols) */}
        <div className="flex-1 bento-card flex flex-col overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Brain size={250} className="text-indigo-500" />
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-indigo-500/10"
          >
            {messages.map((msg, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  flex gap-5 max-w-[85%] md:max-w-[70%]
                  ${msg.role === 'user' ? 'flex-row-reverse' : ''}
                `}>
                  <div className={`
                    w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center border
                    ${msg.role === 'assistant' ? 'bg-[#0F0F12] border-indigo-500/30 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-400'}
                  `}>
                    {msg.role === 'assistant' ? <Bot size={24} /> : <User size={24} />}
                  </div>
                  <div className={`
                    p-6 rounded-[2rem] leading-relaxed text-[15px] font-medium
                    ${msg.role === 'assistant' 
                      ? 'bg-slate-900 shadow-xl border border-slate-800 text-slate-200' 
                      : 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/10'}
                  `}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-5 max-w-[70%] items-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#0F0F12] border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                    <Bot size={24} />
                  </div>
                  <div className="flex gap-1.5 p-5 bg-slate-900 rounded-[2rem] border border-slate-800">
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-indigo-500 rounded-full" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-indigo-500 rounded-full" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-indigo-500 rounded-full" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 border-t border-slate-800 bg-[#15151A]/50 backdrop-blur-xl">
            <form onSubmit={handleSend} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter prompt for study synthesis..."
                className="w-full bg-[#0F0F12] border border-slate-800 rounded-3xl py-5 pl-8 pr-16 outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700 text-white font-medium"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-indigo-500 text-white rounded-2xl hover:bg-indigo-400 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Info Panel (Sidebar inside content) */}
        <div className="hidden lg:flex flex-col gap-4 w-72">
           <div className="bento-card p-6 flex flex-col justify-between h-48 bg-indigo-900/10 border-indigo-500/20">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 italic mb-2">Contextual Memory</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-bold italic">
                AI is currently optimizing your "Calculus" and "Physics" study blocks based on today's goals.
              </p>
              <div className="mt-4 flex gap-1">
                <div className="h-1 bg-indigo-500 rounded-full flex-1" />
                <div className="h-1 bg-indigo-500/30 rounded-full flex-1" />
              </div>
           </div>

           <div className="bento-card p-6 flex-1">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 italic">Prompt Nodes</h3>
              <div className="space-y-3">
                 {[
                   'Synthesize Chapter 4',
                   'Explain Thermodynamics',
                   'Flashcards for Bio',
                   'Solve Integrals'
                 ].map((t, i) => (
                   <button 
                    key={i} 
                    onClick={() => setInput(t)}
                    className="w-full text-left p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-[10px] uppercase font-black tracking-wider text-slate-500 hover:text-indigo-400 transition-all"
                   >
                     {t}
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
