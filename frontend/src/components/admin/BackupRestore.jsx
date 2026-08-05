import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import api from '../../utils/api';
import { Database, Download, RotateCcw, Shield, History as HistoryIcon, Clock, FileText, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useStore from '../../store/useStore';

const BackupRestore = () => {
  const { theme } = useStore();
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([
    { date: '2024-05-28 10:00 AM', size: '156MB', status: 'Success' },
    { date: '2024-05-27 10:00 AM', size: '154MB', status: 'Success' },
    { date: '2024-05-26 10:00 AM', size: '152MB', status: 'Success' },
  ]);

  const handleBackup = async () => {
    setLoading(true);
    try {
      await api.post('/admin/backup');
      toast.success("Backup successfully synchronized to cloud replicas.");
      const newEntry = { date: new Date().toLocaleString(), size: '158MB', status: 'Success' };
      setHistory([newEntry, ...history]);
    } catch (err) {
      toast.error("Cloud synchronization timeout. Retry in 60s.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-500 text-left ${theme === 'dark' ? 'bg-[#050505] text-zinc-300' : 'bg-[#F8FAFC] text-slate-600'}`}>
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar relative z-10">
          <header className="mb-12 text-left">
            <h1 className={`text-4xl font-black tracking-tighter uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Backup & Recovery</h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-1">Registry Redundancy Management</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 space-y-8">
               <div className={`p-10 rounded-[56px] border shadow-xl relative overflow-hidden group transition-all duration-500 ${theme === 'dark' ? 'bg-[#0E0E12]/90 border-white/5' : 'bg-white border-slate-100'}`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-500/10 transition-all duration-700"></div>
                  <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center text-blue-600 mb-8 border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 shadow-inner' : 'bg-blue-50 border-blue-100 shadow-inner'}`}>
                     <Database size={32} />
                  </div>
                  <div className="text-left space-y-4">
                    <h2 className={`text-2xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Initialize Backup</h2>
                    <p className="text-slate-500 text-xs font-bold leading-relaxed uppercase tracking-widest">Create a complete snapshot of the clinical database, patient reports, and neural logs.</p>
                    <div className="pt-6">
                      <button
                        onClick={handleBackup}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-blue-700"
                      >
                         {loading ? <Loader2 size={18} className="animate-spin" /> : <RotateCcw size={18} />}
                         Deploy Snapshot Sequence
                      </button>
                    </div>
                  </div>
                  <div className="mt-10 pt-8 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                       <Shield size={14}/> ALL REPLICAS SYNCED
                    </div>
                  </div>
               </div>

               <div className={`p-8 rounded-[48px] shadow-2xl relative overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-[#0A0A0F] border border-white/5' : 'bg-slate-900 text-white'}`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-2 text-blue-400"><Clock size={14}/> Auto-Sync Node</h3>
                  <p className={`text-xs font-medium leading-relaxed ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>System performs daily snapshots at <span className={`${theme === 'dark' ? 'text-zinc-300' : 'text-white'} font-black`}>02:00 AM</span>. Last verify: 02:00:04 AM Today.</p>
               </div>
            </div>

            <div className="lg:col-span-7">
               <div className={`rounded-[56px] border shadow-xl overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-[#0E0E12]/90 border-white/5' : 'bg-white border-slate-100'}`}>
                  <div className={`p-10 border-b flex items-center justify-between ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-50'}`}>
                     <h3 className={`text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}><HistoryIcon size={16}/> Snapshot Archive</h3>
                     <span className="text-[9px] font-black text-slate-400 uppercase">3 Nodes Active</span>
                  </div>
                  <div className="p-4 space-y-4">
                     {history.map((h, i) => (
                       <div key={i} className={`p-6 rounded-[32px] border flex items-center justify-between group cursor-pointer transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-blue-500/20' : 'bg-slate-50/50 border-slate-100 hover:bg-white hover:border-blue-200'}`}>
                          <div className="flex items-center gap-5">
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-zinc-900 border border-white/10 text-zinc-500 group-hover:text-blue-400' : 'bg-white border border-slate-100 text-slate-400 group-hover:text-blue-500 shadow-sm'}`}>
                                <FileText size={22} />
                             </div>
                             <div className="text-left">
                                <p className={`text-sm font-black uppercase tracking-tight ${theme === 'dark' ? 'text-zinc-200' : 'text-slate-800'}`}>{h.date}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Size: {h.size} • Verified: {h.status}</p>
                             </div>
                          </div>
                          <button className={`p-3 border rounded-xl transition-all active:scale-90 shadow-sm ${theme === 'dark' ? 'bg-white/5 border-white/10 text-zinc-500 hover:text-blue-400' : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600'}`}>
                             <Download size={18} />
                          </button>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BackupRestore;
