import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import { Lock, Shield, Eye, Search as SearchIcon, Filter, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import useStore from '../../store/useStore';

const UserAccessControl = () => {
  const { theme } = useStore();
  const [users] = useState([
    { id: 'ADM1001', name: 'Manjunadha', role: 'Admin', status: 'Active', lastLogin: '10 mins ago' },
    { id: 'DOC1001', name: 'Dr. Arjun', role: 'Doctor', status: 'Active', lastLogin: '1 hour ago' },
    { id: 'PAT1005', name: 'Sravani G', role: 'Patient', status: 'Active', lastLogin: 'Yesterday' },
  ]);

  return (
    <div className={`flex min-h-screen transition-colors duration-500 text-left ${theme === 'dark' ? 'bg-[#050505] text-zinc-300' : 'bg-[#F8FAFC] text-slate-600'}`}>
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar relative z-10">

          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="text-left">
              <h1 className={`text-2xl font-black uppercase tracking-tight flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                 <Shield size={28} className="text-blue-600" /> User Access Control
              </h1>
              <p className="text-slate-500 font-medium mt-1">Manage user credentials, roles, and platform permissions</p>
            </div>
            <button className={`px-8 py-3 rounded-2xl font-black text-sm shadow-xl transition-all active:scale-95 ${theme === 'dark' ? 'bg-white text-slate-900 hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-black'}`}>
               NEW ACCESS ROLE
            </button>
          </header>

          <div className={`p-4 rounded-3xl border shadow-sm flex flex-col md:flex-row gap-4 transition-all duration-500 ${theme === 'dark' ? 'bg-[#0E0E12]/90 border-white/5' : 'bg-white border-slate-100'}`}>
            <div className="relative flex-1">
               <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input type="text" placeholder="Search by name, ID or role..." className={`w-full pl-12 pr-4 py-3 border rounded-2xl outline-none font-bold text-sm transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-800'}`} />
            </div>
            <button className={`px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white' : 'bg-slate-50 border border-slate-100 text-slate-500 hover:bg-slate-100'}`}>
               <Filter size={18} /> Filter Status
            </button>
          </div>

          <div className={`rounded-[40px] border shadow-sm overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-[#0E0E12]/90 border-white/5' : 'bg-white border-slate-100'}`}>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-white/5 text-zinc-500' : 'bg-slate-50/30 text-gray-400'}`}>
                      <tr className={theme === 'dark' ? 'border-b border-white/5' : 'border-b border-slate-100'}>
                         <th className="px-8 py-5">User ID</th>
                         <th className="px-8 py-5">Full Name</th>
                         <th className="px-8 py-5">Access Level</th>
                         <th className="px-8 py-5">Status</th>
                         <th className="px-8 py-5">Last Activity</th>
                         <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className={`divide-y text-sm font-bold ${theme === 'dark' ? 'divide-white/5 text-zinc-300' : 'divide-slate-50 text-gray-700'}`}>
                      {users.map((u, i) => (
                         <tr key={i} className={`transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50/50'}`}>
                            <td className="px-8 py-6 text-blue-600 font-black">#{u.id}</td>
                            <td className={`px-8 py-6 text-left ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{u.name}</td>
                            <td className="px-8 py-6 text-left">
                               <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-white/5 text-zinc-400' : 'bg-slate-100 text-slate-500'}`}>{u.role}</span>
                            </td>
                            <td className="px-8 py-6 text-left">
                               <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                  <CheckCircle size={14}/> {u.status}
                               </span>
                            </td>
                            <td className="px-8 py-6 text-left text-slate-400 text-xs font-medium uppercase tracking-tight">{u.lastLogin}</td>
                            <td className="px-8 py-6 text-right">
                               <div className="flex justify-end gap-2">
                                  <button className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-white/5 text-zinc-500 hover:text-blue-400' : 'bg-slate-50 text-slate-300 hover:text-blue-600'}`} title="Reset Password"><Lock size={18}/></button>
                                  <button className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-white/5 text-zinc-500 hover:text-red-400' : 'bg-slate-50 text-slate-300 hover:text-red-500'}`} title="Disable Account"><XCircle size={18}/></button>
                                  <button className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-white/5 text-zinc-500 hover:text-white' : 'bg-slate-50 text-slate-300 hover:text-slate-600'}`}><MoreVertical size={18}/></button>
                               </div>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default UserAccessControl;
