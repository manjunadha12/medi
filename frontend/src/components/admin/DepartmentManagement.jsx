import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import { Box, Plus, Search, MoreVertical, Edit2, Trash2, Activity, Users } from 'lucide-react';
import useStore from '../../store/useStore';
import { toast } from 'react-hot-toast';

const DepartmentManagement = () => {
  const { theme } = useStore();
  const [depts] = useState([
    { id: 'D01', name: 'Cardiology', code: 'CARD', doctors: 12, op: 45, status: 'Active' },
    { id: 'D02', name: 'Neurology', code: 'NEUR', doctors: 8, op: 30, status: 'Active' },
    { id: 'D03', name: 'Dermatology', code: 'DERM', doctors: 5, op: 15, status: 'Active' },
    { id: 'D04', name: 'ENT', code: 'ENT0', doctors: 6, op: 22, status: 'Active' },
  ]);

  return (
    <div className={`flex min-h-screen transition-colors duration-500 text-left ${theme === 'dark' ? 'bg-[#050505] text-zinc-300' : 'bg-[#F8FAFC] text-slate-600'}`}>
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar relative z-10">

          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="text-left">
              <h1 className={`text-2xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Department Management</h1>
              <p className="text-slate-500 font-medium mt-1">Organize medical divisions and staff distribution</p>
            </div>
            <button
              onClick={() => toast.success("New department node creation initialized")}
              className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 flex items-center gap-2 hover:bg-blue-700 transition-all active:scale-95"
            >
               <Plus size={18} /> NEW DEPARTMENT
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {depts.map((d, i) => (
                <div key={i} className={`p-6 rounded-[32px] border shadow-sm relative overflow-hidden group transition-all duration-500 ${theme === 'dark' ? 'bg-[#0E0E12]/90 border-white/5 hover:border-blue-500/20' : 'bg-white border-slate-100 hover:border-blue-200'}`}>
                   <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/5 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                         <Box size={24}/>
                      </div>
                      <button className="text-slate-300 hover:text-blue-600 transition-colors">
                         <MoreVertical size={18}/>
                      </button>
                   </div>
                   <h3 className={`font-black text-lg uppercase tracking-tight text-left ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{d.name}</h3>
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest text-left">{d.code}</p>

                   <div className={`mt-6 flex justify-between items-center border-t pt-4 ${theme === 'dark' ? 'border-white/5' : 'border-slate-50'}`}>
                      <div className="flex items-center gap-1.5 text-slate-400 font-black text-[10px]">
                         <Users size={12}/> {d.doctors} DOCTORS
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-500 font-black text-[10px]">
                         <Activity size={12}/> {d.op} OP TODAY
                      </div>
                   </div>
                   <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 opacity-0 group-hover:opacity-100 transition-all"></div>
                </div>
             ))}
          </div>

        </main>
      </div>
    </div>
  );
};

export default DepartmentManagement;
