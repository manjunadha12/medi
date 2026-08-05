import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import { Download, FileText, Table, PieChart, IndianRupee, Users, Stethoscope } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useStore from '../../store/useStore';

const DataExport = () => {
  const { theme } = useStore();
  const [loading, setLoading] = useState(false);

  const handleExport = (type) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(`${type} generated and download started`);
    }, 2000);
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-500 text-left ${theme === 'dark' ? 'bg-[#050505] text-zinc-300' : 'bg-[#F8FAFC] text-slate-600'}`}>
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <header className="text-left">
              <h1 className={`text-3xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Analytics & Data Export</h1>
              <p className="text-slate-500 font-medium mt-1">Generate comprehensive reports in PDF, Excel or CSV formats</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[
                 { label: 'Patient Master Record', desc: 'All registered patients with medical history', icon: Users, color: 'text-blue-500' },
                 { label: 'Doctor Performance', desc: 'Rating, OP count and consultation analytics', icon: Stethoscope, color: 'text-emerald-500' },
                 { label: 'Financial Audit', desc: 'Revenue, billing and pending payments', icon: IndianRupee, color: 'text-blue-500' },
                 { label: 'AI Swarm Usage', desc: 'Report analysis logs and success rates', icon: PieChart, color: 'text-purple-500' },
                 { label: 'Appointment Logs', desc: 'Monthly consultation schedule and cancellations', icon: FileText, color: 'text-indigo-500' },
               ].map((item, i) => (
                  <div key={i} className={`p-8 rounded-[40px] border shadow-sm flex flex-col justify-between group transition-all duration-500 ${theme === 'dark' ? 'bg-[#0E0E12]/90 border-white/5 hover:border-blue-500/20' : 'bg-white border-slate-100 hover:border-blue-200'}`}>
                     <div className="flex items-start justify-between mb-6">
                        <div className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/5 ' + item.color : 'bg-slate-50 ' + item.color}`}>
                           <item.icon size={28}/>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => handleExport(item.label + ' (PDF)')} className={`p-3 rounded-2xl transition-all ${theme === 'dark' ? 'bg-white/5 text-zinc-500 hover:text-blue-400' : 'bg-slate-50 text-slate-400 hover:text-blue-600'}`}><FileText size={20}/></button>
                           <button onClick={() => handleExport(item.label + ' (Excel)')} className={`p-3 rounded-2xl transition-all ${theme === 'dark' ? 'bg-white/5 text-zinc-500 hover:text-emerald-400' : 'bg-slate-50 text-slate-400 hover:text-emerald-600'}`}><Table size={20}/></button>
                        </div>
                     </div>
                     <div className="text-left">
                        <h3 className={`font-black text-lg uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{item.label}</h3>
                        <p className="text-xs text-slate-400 font-medium mt-2 leading-relaxed">{item.desc}</p>
                     </div>

                     <button
                       onClick={() => handleExport(item.label)}
                       className={`mt-8 w-full py-4 border-2 border-dashed rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${theme === 'dark' ? 'border-white/5 text-zinc-500 hover:border-blue-500/50 hover:text-blue-400' : 'border-slate-100 text-slate-400 hover:border-blue-400 hover:text-blue-600'}`}
                     >
                        GENERATE REPORT
                     </button>
                  </div>
               ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DataExport;
