import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import { FileText, Search as SearchIcon, Filter, Download, Calendar, Activity, History as HistoryIcon } from 'lucide-react';
import useStore from '../../store/useStore';
import { toast } from 'react-hot-toast';

const AuditLogs = () => {
  const { theme } = useStore();
  const [activeTab, setActiveTab] = useState('system'); // 'system' or 'clinical'
  const [logs] = useState([
    { id: 'LOG1050', user: 'ADM1001', role: 'Admin', action: 'Verified Doctor DOC1002', time: '10:00 AM', date: '25 Oct 2024', status: 'Success' },
    { id: 'LOG1051', user: 'DOC1002', role: 'Doctor', action: 'Generated Prescription for PAT1005', time: '10:15 AM', date: '25 Oct 2024', status: 'Success' },
    { id: 'LOG1052', user: 'PAT1005', role: 'Patient', action: 'Uploaded Lab Report', time: '10:20 AM', date: '25 Oct 2024', status: 'Success' },
    { id: 'LOG1053', user: 'ADM1001', role: 'Admin', action: 'Changed Hospital Working Hours', time: 'Yesterday', date: '24 Oct 2024', status: 'Modified' },
  ]);

  const [clinicalLogs] = useState([
    { id: 'SESS-101', pat: 'Manjunadha', doc: 'Dr. Arjun', type: 'Video', dur: '12m', date: '25 Oct 2024', status: 'Completed' },
    { id: 'SESS-102', pat: 'Sravani G', doc: 'Dr. Priya', type: 'Video', dur: '08m', date: '25 Oct 2024', status: 'Completed' },
    { id: 'SESS-103', pat: 'Rajesh K', doc: 'Dr. Sneha', type: 'In-person', dur: '20m', date: '24 Oct 2024', status: 'Completed' },
  ]);

  return (
    <div className={`flex min-h-screen transition-colors duration-500 text-left ${theme === 'dark' ? 'bg-[#050505] text-zinc-300' : 'bg-[#F8FAFC] text-slate-600'}`}>
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">

          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-left">
            <div>
              <h1 className={`text-2xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>System Audit Logs</h1>
              <p className="text-slate-500 font-medium mt-1">Traceable record of all administrative and clinical actions</p>
            </div>
            <div className="flex gap-4">
               <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                  <button onClick={() => setActiveTab('system')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'system' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>System Events</button>
                  <button onClick={() => setActiveTab('clinical')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'clinical' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>Clinical Sessions</button>
               </div>
               <button
                 onClick={() => toast.success("Audit archive exported to CSV")}
                 className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${theme === 'dark' ? 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
               >
                  <Download size={18} /> (CSV)
               </button>
            </div>
          </header>

          <div className={`rounded-[40px] border border-blue-500/20 shadow-sm overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-[#0E0E12]/90' : 'bg-white'}`}>
             <div className={`p-6 border-b flex flex-col md:flex-row gap-4 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50/50 border-slate-100'}`}>
                <div className="relative flex-1">
                   <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                   <input type="text" placeholder={`Search ${activeTab === 'system' ? 'user or action' : 'patient or doctor'}...`} className={`w-full pl-10 pr-4 py-2 border rounded-xl text-xs font-bold outline-none transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-700'}`}/>
                </div>
                <button className={`px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                   <Filter size={14}/> Date: Today
                </button>
             </div>
             <div className="overflow-x-auto">
                {activeTab === 'system' ? (
                   <table className="w-full text-left">
                      <thead className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-white/5 text-zinc-500' : 'bg-slate-50/30 text-gray-400'}`}>
                         <tr>
                            <th className="px-8 py-5">Log ID</th>
                            <th className="px-8 py-5">User (Role)</th>
                            <th className="px-8 py-5">Action Performed</th>
                            <th className="px-8 py-5">Timestamp</th>
                            <th className="px-8 py-5 text-right">Status</th>
                         </tr>
                      </thead>
                      <tbody className={`divide-y text-sm font-bold ${theme === 'dark' ? 'divide-white/5 text-zinc-300' : 'divide-slate-50 text-slate-700'}`}>
                         {logs.map((log) => (
                            <tr key={log.id} className={`transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50/50'}`}>
                               <td className="px-8 py-6 text-slate-400">#{log.id}</td>
                               <td className="px-8 py-6 text-left">
                                  <p className={theme === 'dark' ? 'text-white' : 'text-slate-800'}>{log.user}</p>
                                  <p className="text-[9px] text-blue-400 uppercase">{log.role}</p>
                               </td>
                               <td className={`px-8 py-6 font-medium text-left ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>{log.action}</td>
                               <td className="px-8 py-6 text-left">
                                  <div className="flex items-center gap-1.5"><Calendar size={12} className="text-slate-300"/> {log.date}</div>
                                  <div className="flex items-center gap-1.5 text-slate-400 mt-1 uppercase text-[9px]"><Activity size={10}/> {log.time}</div>
                               </td>
                               <td className="px-8 py-6 text-right">
                                  <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                     log.status === 'Success'
                                       ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                       : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                  }`}>{log.status}</span>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                ) : (
                   <table className="w-full text-left">
                      <thead className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-white/5 text-zinc-500' : 'bg-slate-50/30 text-gray-400'}`}>
                         <tr>
                            <th className="px-8 py-5">Session ID</th>
                            <th className="px-8 py-5">Patient Node</th>
                            <th className="px-8 py-5">Assigned Specialist</th>
                            <th className="px-8 py-5">Type / Duration</th>
                            <th className="px-8 py-5 text-right">Status</th>
                         </tr>
                      </thead>
                      <tbody className={`divide-y text-sm font-bold ${theme === 'dark' ? 'divide-white/5 text-zinc-300' : 'divide-slate-50 text-gray-700'}`}>
                         {clinicalLogs.map((log) => (
                            <tr key={log.id} className={`transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50/50'}`}>
                               <td className="px-8 py-6 text-slate-400">#{log.id}</td>
                               <td className="px-8 py-6 text-left">
                                  <p className={theme === 'dark' ? 'text-white' : 'text-slate-800'}>{log.pat}</p>
                                  <p className="text-[9px] text-zinc-500 uppercase">Registry Verified</p>
                               </td>
                               <td className="px-8 py-6 text-left">
                                  <p className={theme === 'dark' ? 'text-zinc-200' : 'text-slate-800'}>{log.doc}</p>
                                  <p className="text-[9px] text-blue-400 uppercase font-black">Licensed Operator</p>
                               </td>
                               <td className="px-8 py-6 text-left">
                                  <div className="flex items-center gap-2">
                                     <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${log.type === 'Video' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-zinc-500/10 text-zinc-400'}`}>{log.type}</span>
                                     <span className="text-[10px] font-black text-slate-500 uppercase">{log.dur}</span>
                                  </div>
                                  <p className="text-[9px] text-slate-400 mt-1 uppercase">{log.date}</p>
                               </td>
                               <td className="px-8 py-6 text-right">
                                  <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{log.status}</span>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                )}
             </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AuditLogs;
