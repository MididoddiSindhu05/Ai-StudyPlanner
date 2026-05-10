import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AIPlanner from './pages/AIPlanner';
import Analytics from './pages/Analytics';
import Pomodoro from './pages/Pomodoro';
import ChatAssistant from './pages/ChatAssistant';
import Profile from './pages/Profile';
import Sidebar from './components/layout/Sidebar';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

export default function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-950 text-slate-50">
        {token && <Sidebar />}
        <main className={`flex-1 ${token ? 'md:ml-64' : ''}`}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/ai-planner" element={
              <ProtectedRoute><AIPlanner /></ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute><Analytics /></ProtectedRoute>
            } />
            <Route path="/pomodoro" element={
              <ProtectedRoute><Pomodoro /></ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute><ChatAssistant /></ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
