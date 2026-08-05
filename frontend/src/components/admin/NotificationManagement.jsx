import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import { Bell, Send, Users, AlertCircle, History as HistoryIcon, Filter, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useStore from '../../store/useStore';

const NotificationManagement = () => {
  const { theme } = useStore();
  const [loading, setLoading] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Notification broadcasted successfully");
    }, 1500);
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-500 text-left ${theme === 'dark' ? 'bg-[#050505] text-zinc-300' : 'bg-[#F8FAFC] text-slate-600'}`}>
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar relative z-10">

          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="text-left">
              <h1 className={`text-2xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Notification Center</h1>
              <p className="text-slate-500 font-medium mt-1">Broadcast alerts and system updates to patients and staff</p>
            </div>
            <button className={`border px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}>
               <HistoryIcon size={16} /> VIEW HISTORY
            </button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

             <div className={`p-8 rounded-[40px] border shadow-sm space-y-8 transition-all duration-500 ${theme === 'dark' ? 'bg-[#0E0E12]/90 border-white/5' : 'bg-white border-slate-100'}`}>
                <h3 className={`font-black flex items-center gap-2 border-b pb-4 ${theme === 'dark' ? 'text-white border-white/5' : 'text-slate-800 border-gray-50'}`}>
                   <Send size={20} className="text-blue-600" /> New Broadcast
                </h3>
                <form onSubmit={handleSend} className="space-y-6">
                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Recipients</label>
                      <select className={`w-full p-4 border rounded-2xl font-bold text-sm outline-none transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-gray-700'}`}>
                         <option>All Users</option>
                         <option>Doctors Only</option>
                         <option>Patients Only</option>
                         <option>Specific User ID</option>
                      </select>
                   </div>
                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Notification Title</label>
                      <input type="text" placeholder="e.g. System Maintenance" className={`w-full p-4 border rounded-2xl font-bold text-sm outline-none transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/10 text-white' : 'bg-slate-50 border-slate-100'}`} required />
                   </div>
                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Message Content</label>
                      <textarea placeholder="Write your message here..." className={`w-full p-4 border rounded-2xl font-medium text-sm min-h-[120px] outline-none transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/10 text-white' : 'bg-slate-50 border-slate-100'}`} required></textarea>
                   </div>
                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Priority</label>
                      <div className="flex gap-4">
                         {['Normal', 'High', 'Urgent'].map(p => (
                            <button key={p} type="button" className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${p === 'Urgent' ? 'border-red-500/20 text-red-500 bg-red-500/5' : theme === 'dark' ? 'border-white/5 text-zinc-500 hover:bg-white/5' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}>
                               {p}
                            </button>
                         ))}
                      </div>
                   </div>
                   <button
                     disabled={loading}
                     className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 hover:bg-blue-700 transition-all active:scale-95 disabled:bg-gray-300"
                   >
                     {loading ? 'SENDING...' : <><Send size={18}/> SEND NOTIFICATION</>}
                   </button>
                </form>
             </div>

             <div className="lg:col-span-2 space-y-6">
                <div className={`rounded-[40px] border shadow-sm overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-[#0E0E12]/90 border-white/5' : 'bg-white border-slate-100'}`}>
                   <div className={`p-6 border-b ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50/50 border-slate-50'}`}>
                      <h3 className="font-black text-xs text-slate-400 uppercase tracking-widest text-left">Recent System Notifications</h3>
                   </div>
                   <div className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-50'}`}>
                      {[
                        { title: 'Server Upgrade', msg: 'System will be down for 10 mins at midnight.', target: 'All Users', time: '2 hours ago', type: 'System' },
                        { title: 'New Doctor Joined', msg: 'Dr. Sarah has joined the Cardiology department.', target: 'All Users', time: '5 hours ago', type: 'Staff' },
                      ].map((n, i) => (
                         <div key={i} className={`p-6 flex items-start gap-4 transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50/50'}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${theme === 'dark' ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                               <Bell size={18} />
                            </div>
                            <div className="flex-1 text-left">
                               <div className="flex justify-between items-center mb-1">
                                  <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{n.title}</h4>
                                  <span className="text-[10px] font-black text-slate-400 uppercase">{n.time}</span>
                               </div>
                               <p className={`text-xs font-medium mb-3 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>{n.msg}</p>
                               <div className="flex gap-2">
                                  <span className={`px-2 py-0.5 text-[10px] font-black rounded uppercase ${theme === 'dark' ? 'bg-white/5 text-zinc-500' : 'bg-slate-100 text-slate-400'}`}>FOR: {n.target}</span>
                                  <span className={`px-2 py-0.5 text-[10px] font-black rounded uppercase ${theme === 'dark' ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 text-blue-400'}`}>{n.type}</span>
                               </div>
                            </div>
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

export default NotificationManagement;
