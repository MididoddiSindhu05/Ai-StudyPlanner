import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Calendar, 
  BarChart2, 
  Clock, 
  MessageSquare, 
  Settings, 
  LogOut,
  GraduationCap,
  User as UserIcon
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300
      ${isActive 
        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.05)]' 
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'}
    `}
  >
    <Icon size={18} />
    <span className="text-sm font-medium">{label}</span>
  </NavLink>
);

export default function Sidebar() {
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0F0F12] border-r border-slate-800 p-6 flex flex-col z-50 transition-all duration-300 transform md:translate-x-0 -translate-x-full">
      <div className="flex items-center gap-3 mb-10 px-2 group cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
          <GraduationCap className="text-white" size={24} />
        </div>
        <span className="font-bold text-xl tracking-tight text-white">StudyAI</span>
      </div>

      <nav className="flex-1 space-y-1">
        <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <SidebarItem to="/ai-planner" icon={Calendar} label="Planner" />
        <SidebarItem to="/analytics" icon={BarChart2} label="Analytics" />
        <SidebarItem to="/pomodoro" icon={Clock} label="Focus Mode" />
        <SidebarItem to="/chat" icon={MessageSquare} label="AI Assistant" />
        <SidebarItem to="/profile" icon={UserIcon} label="Profile" />
      </nav>

      <div className="mt-auto space-y-4 pt-6 border-t border-slate-800">
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 mb-4">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">QUICK TIP</p>
          <p className="text-sm text-slate-300 font-medium">"Prioritize weak subjects early for better retention."</p>
        </div>

        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 px-2 cursor-pointer group hover:bg-white/5 p-2 rounded-xl transition-all"
        >
          <img 
            src={user?.picture || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=6366f1&color=fff`} 
            alt="Avatar" 
            className="w-10 h-10 rounded-lg border border-slate-700 group-hover:border-indigo-500 transition-colors"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-100 truncate">{user?.name}</p>
            <p className="text-[10px] text-amber-500 font-black uppercase tracking-tighter">🔥 {user?.streak || 12} DAY STREAK</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-500 hover:text-slate-100 hover:bg-white/5 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
