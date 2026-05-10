import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-6 border-white/5 hover:border-purple-500/30 transition-colors"
  >
    <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4">
      <Icon className="text-purple-400" size={24} />
    </div>
    <h3 className="text-xl font-bold mb-2 font-display">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </motion.div>
);

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-purple-400 mb-8"
        >
          <Sparkles size={16} />
          <span>New: AI-Powered Exam Predictor</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black font-display mb-8 tracking-tight"
        >
          Master Your Studies <br />
          <span className="gradient-text">With Pure Intelligence.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed"
        >
          The all-in-one workspace for students. AI-generated study plans, real-time analytics, 
          and smart focus tools designed to get you the grades you deserve.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link 
            to="/auth" 
            className="px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg neon-glow"
          >
            Get Started Free <ArrowRight size={20} />
          </Link>
          <button className="glass-button px-8 py-4 !rounded-2xl">
            Watch Demo
          </button>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-white/5 bg-white/2">
        <div className="container mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Active Students", value: "50K+" },
            { label: "Study Hours", value: "1.2M" },
            { label: "AI Plans Generated", value: "200K" },
            { label: "Avg Grade Increase", value: "22%" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-black text-white mb-1 font-display">{stat.value}</p>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 font-display">Why Choose StudyAI?</h2>
          <p className="text-slate-400">Everything you need to excel, powered by cutting-edge AI.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Brain} 
            title="AI Smart Scheduling" 
            desc="Generates dynamic study plans that adapt to your pace and exam deadlines instantly."
          />
          <FeatureCard 
            icon={TrendingUp} 
            title="Real-time Analytics" 
            desc="Track focus hours, subject mastery, and productivity scores with beautiful charts."
          />
          <FeatureCard 
            icon={Clock} 
            title="Pomodoro Engine" 
            desc="Smart timers with customizable sessions and AI-suggested break activities."
          />
        </div>
      </section>
    </div>
  );
}
