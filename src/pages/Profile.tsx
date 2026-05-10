import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User as UserIcon, 
  Mail, 
  Camera, 
  Save, 
  Flame, 
  Target,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Profile() {
  const { user, updateUser, token } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    picture: user?.picture || ''
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#09090B]/80 backdrop-blur-md z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-semibold italic font-display tracking-tight uppercase">User <span className="text-indigo-400">Profile</span></h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black underline decoration-indigo-500/50 underline-offset-2">Identity & Metrics</p>
          </div>
        </div>
      </header>

      <div className="flex-1 p-8 overflow-y-auto min-h-0 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Main Profile Info */}
          <div className="md:col-span-8 space-y-6">
            <div className="bento-card p-8 flex flex-col items-center sm:flex-row sm:items-start gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <UserIcon size={120} className="text-indigo-500" />
              </div>
              
              <div className="relative group">
                <div className="w-32 h-32 rounded-3xl bg-slate-800 border-2 border-slate-700 overflow-hidden relative shadow-2xl">
                  <img 
                    src={formData.picture || `https://ui-avatars.com/api/?name=${formData.name}&background=6366f1&color=fff&size=128`} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="text-white" size={24} />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-4 w-full">
                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Name</label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-indigo-500/50 transition-all font-medium"
                          placeholder="Your Name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-indigo-500/50 transition-all font-medium"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Profile Picture URL</label>
                      <div className="relative">
                        <Camera className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                          type="text"
                          value={formData.picture}
                          onChange={(e) => setFormData({...formData, picture: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-indigo-500/50 transition-all font-medium"
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button 
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                      >
                        <Save size={18} />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h2 className="text-3xl font-black font-display tracking-tight text-white">{user?.name}</h2>
                        <p className="text-slate-400 font-medium flex items-center gap-2">
                          <Mail size={14} className="text-indigo-400/50" />
                          {user?.email}
                        </p>
                      </div>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-100 font-bold text-sm transition-all shadow-xl"
                      >
                        Edit Profile
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-8">
                       <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Rank</p>
                          <p className="text-sm font-bold text-indigo-400 italic">Advanced Learner</p>
                       </div>
                       <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Account Type</p>
                          <p className="text-sm font-bold text-purple-400 italic">Core Member</p>
                       </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bento-card p-8">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 italic">Bio-Cognitive Synthesis</h3>
               <div className="space-y-4">
                  <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-all">
                     <div className="relative z-10">
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium italic">
                          "Your focus consistency has improved by 14% this week. Optimal study windows detected between 08:00 and 11:30 AM."
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="md:col-span-4 space-y-6">
             <div className="bento-card p-8 flex flex-col items-center justify-center text-center bg-amber-500/5 border-amber-500/20">
                <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-4 shadow-inner shadow-amber-500/10">
                  <Flame size={32} />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-500/60 mb-1">Active Streak</h3>
                <p className="text-4xl font-black font-display italic text-amber-500">{user?.streak || 0} Days</p>
                <div className="w-full h-1 bg-amber-500/10 rounded-full mt-6">
                  <div className="h-full bg-amber-500 rounded-full shadow-[0_0_10px_#f59e0b]" style={{ width: '85%' }} />
                </div>
                <p className="text-[10px] font-bold text-amber-500/40 uppercase tracking-tighter mt-2">Top 5% of global users</p>
             </div>

             <div className="bento-card p-8 flex flex-col items-center justify-center text-center bg-emerald-500/5 border-emerald-500/20">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-4 shadow-inner shadow-emerald-500/10">
                  <Target size={32} />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mb-1">Productivity Score</h3>
                <p className="text-4xl font-black font-display italic text-emerald-500">{user?.productivity_score || 0}%</p>
                <div className="mt-6 flex gap-1 w-full">
                  {[1,2,3,4,5,6,7].map(i => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 6 ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-slate-800'}`} />
                  ))}
                </div>
                <p className="text-[10px] font-bold text-emerald-500/40 uppercase tracking-tighter mt-4">Peak Cognitive Load: 92%</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
