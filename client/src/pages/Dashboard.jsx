import React from 'react';
import { useAuth } from '../store/auth';
import ManagerDashboard from './ManagerDashboard';
import OwnerDashboard from './OwnerDashboard';
import SuperAdminDashboard from './SuperAdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  const role = user?.role;

  if (role === "SUPER_ADMIN") {
    return <SuperAdminDashboard />;
  }

  if (role === "MANAGER") {
    return <ManagerDashboard />;
  }

  if (role === "OWNER") {
    return <OwnerDashboard />;
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] font-['Inter']">
        <div className="text-center space-y-8 animate-in fade-in duration-1000 max-w-xl mx-auto p-12 bg-white rounded-[4rem] border border-gray-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)]">
            <div className="w-24 h-24 bg-gray-900 rounded-[2.5rem] flex items-center justify-center text-3xl font-black text-white mx-auto shadow-2xl group cursor-wait hover:rounded-full transition-all duration-700">
               {user?.name?.[0] || 'U'}
            </div>
            <div className="space-y-4">
               <h1 className="text-4xl font-black text-[var(--color-secondary)] tracking-tighter">Strategic Welcome, <span className="text-indigo-600 italic underline decoration-indigo-100 underline-offset-8">{user?.name}</span></h1>
               <p className="text-[var(--text-muted)] font-medium leading-relaxed uppercase text-[10px] tracking-[0.3em] opacity-40">Your authentication node is verified and active. Use the navigation nexus to initialize operational protocols.</p>
            </div>
            <div className="pt-4 flex justify-center gap-2">
               {[1,2,3].map(i => <div key={i} className="w-2 h-2 bg-gray-100 rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />)}
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
