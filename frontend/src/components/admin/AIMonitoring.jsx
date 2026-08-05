import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import { Monitor, Brain, Zap, AlertCircle, CheckCircle, Search, Filter, Cpu } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useStore from '../../store/useStore';

const AIMonitoring = () => {
  const { theme } = useStore();
  const usageData = [
    { name: '08:00', load: 45 },
    { name: '10:00', load: 85 },
    { name: '12:00', load: 60 },
    { name: '14:00', load: 95 },
    { name: '16:00', load: 70 },
  ];

  return (
    <div className={`flex min-h-screen transition-colors duration-500 text-left ${theme === 'dark' ? 'bg-[#050505] text-zinc-300' : 'bg-[#F8FAFC] text-slate-600'}`}>
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar relative z-10">

          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="text-left">
              <h1 className={`text-2xl font-black uppercase tracking-tight flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                 <Monitor size={28} className="text-purple-600" /> AI Swarm Monitoring
              </h1>
              <p className="text-slate-500 font-medium mt-1">Real-time oversight of diagnostic and management agents</p>
            </div>
            <div className="bg-purple-600 text-white px-6 py-2 rounded-xl font-black text-[10px] tracking-widest animate-pulse">
               SYSTEM ACTIVE
            </div>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {[
               { label: 'Total Analyses', val: '4,852', icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50' },
               { label: 'Success Rate', val: '99.4%', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
               { label: 'Avg Latency', val: '1.2s', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50' },
               { label: 'Failed Tasks', val: '12', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
             ].map((stat, i) => (
                <div key={i} className={`p-5 rounded-3xl border transition-all duration-500 ${theme === 'dark' ? 'bg-[#0E0E12]/90 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/5' : stat.bg} ${stat.color}`}>
                         <stat.icon size={24}/>
                      </div>
                      <div className="text-left">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                         <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{stat.val}</h3>
                      </div>
                   </div>
                </div>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className={`lg:col-span-2 p-8 rounded-[40px] shadow-xl transition-all duration-500 ${theme === 'dark' ? 'bg-[#0E1015] border border-white/5' : 'bg-[#0F172A] text-white'}`}>
                <div className="flex items-center justify-between mb-8">
                   <div className="text-left">
                      <h2 className="text-lg font-black uppercase tracking-tight text-white">Swarm GPU Load</h2>
                      <p className="text-xs text-slate-400 font-medium">Processing distribution across distributed clusters</p>
                   </div>
                   <Cpu size={24} className="text-blue-500" />
                </div>
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={usageData}>
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Tooltip contentStyle={{backgroundColor: '#1E293B', border: 'none', borderRadius: '12px', fontSize: '12px', color: '#fff'}} />
                        <Area type="monotone" dataKey="load" stroke="#8B5CF6" strokeWidth={4} fillOpacity={1} fill="#8B5CF620" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>

             <div className={`p-8 rounded-[40px] border shadow-sm space-y-6 transition-all duration-500 ${theme === 'dark' ? 'bg-[#0E0E12]/90 border-white/5' : 'bg-white border-slate-100'}`}>
                <h3 className={`text-sm font-black uppercase tracking-widest text-left ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Most Used Agents</h3>
                <div className="space-y-4">
                   {[
                     { name: 'Report Analyzer', usage: '42%' },
                     { name: 'Doctor Suggester', usage: '28%' },
                     { name: 'Cost Estimator', usage: '18%' },
                     { name: 'Chat Support', usage: '12%' },
                   ].map((a, i) => (
                      <div key={i} className="space-y-2 text-left">
                         <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                            <span className={theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}>{a.name}</span>
                            <span className="text-blue-500">{a.usage}</span>
                         </div>
                         <div className={`w-full h-2 rounded-full overflow-hidden transition-all ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>
                            <div className="bg-blue-600 h-full shadow-[0_0_8px_rgba(37,99,235,0.4)]" style={{width: a.usage}}></div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AIMonitoring;
