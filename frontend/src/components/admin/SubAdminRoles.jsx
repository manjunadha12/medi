import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import { Shield, Plus, MoreVertical, Edit2, Trash2, Key } from 'lucide-react';
import useStore from '../../store/useStore';

const SubAdminRoles = () => {
  const { theme } = useStore();
  const [admins] = useState([
    { id: 'SADM-01', name: 'Ravi Teja', role: 'Billing Admin', perms: ['billing', 'export'], status: 'Active' },
    { id: 'SADM-02', name: 'Lakshmi Devi', role: 'Staff Admin', perms: ['doctors', 'verification'], status: 'Active' },
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
                 <Shield size={28} className="text-blue-600" /> Sub-Administrative Access
              </h1>
              <p className="text-slate-500 font-medium mt-1">Delegate hospital management tasks with role-based permissions</p>
            </div>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 flex items-center gap-2 hover:bg-blue-700 transition-all active:scale-95">
               <Plus size={18} /> NEW SUB ADMIN
            </button>
          </header>

          <div className={`rounded-[40px] border shadow-sm overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-[#0E0E12]/90 border-white/5' : 'bg-white border-slate-100'}`}>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-white/5 text-zinc-500' : 'bg-slate-50/30 text-gray-400'}`}>
                      <tr className={theme === 'dark' ? 'border-b border-white/5' : 'border-b border-slate-100'}>
                         <th className="px-8 py-5">Sub Admin</th>
                         <th className="px-8 py-5 text-center">Role Assigned</th>
                         <th className="px-8 py-5 text-center">Permissions</th>
                         <th className="px-8 py-5 text-center">Status</th>
                         <th className="px-8 py-5 text-right">Action</th>
                      </tr>
                   </thead>
                   <tbody className={`divide-y text-sm font-bold ${theme === 'dark' ? 'divide-white/5 text-zinc-300' : 'divide-slate-50 text-gray-700'}`}>
                      {admins.map((s, i) => (
                         <tr key={i} className={`transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50/50'}`}>
                            <td className="px-8 py-6 text-left">
                               <p className={theme === 'dark' ? 'text-white' : 'text-slate-800'}>{s.name}</p>
                               <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mt-1">ID: {s.id}</p>
                            </td>
                            <td className={`px-8 py-6 text-center ${theme === 'dark' ? 'text-zinc-200' : 'text-slate-700'}`}>{s.role}</td>
                            <td className="px-8 py-6 text-center">
                               <div className="flex justify-center gap-2">
                                  {s.perms.map((p, j) => (
                                     <span key={j} className={`px-2 py-0.5 rounded text-[9px] uppercase font-black tracking-widest ${theme === 'dark' ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>{p}</span>
                                  ))}
                               </div>
                            </td>
                            <td className="px-8 py-6 text-center">
                               <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-green-100 text-green-600'}`}>{s.status}</span>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <div className="flex justify-end gap-2">
                                  <button className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-white/5 text-zinc-500 hover:text-blue-400' : 'bg-slate-50 text-slate-300 hover:text-blue-600'}`}><Edit2 size={18}/></button>
                                  <button className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-white/5 text-zinc-500 hover:text-red-400' : 'bg-slate-50 text-slate-300 hover:text-red-500'}`}><Trash2 size={18}/></button>
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

export default SubAdminRoles;
