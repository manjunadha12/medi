import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import { Star, Search, Filter, CheckCircle, XCircle, Flag, Eye, User as UserIcon } from 'lucide-react';
import useStore from '../../store/useStore';

const DoctorReviews = () => {
  const { theme } = useStore();
  const [reviews] = useState([
    { id: 'REV1001', doc: 'Dr. Arjun', pat: 'Manjunadha', rating: 5, comment: 'Excellent doctor, very patient and explains everything clearly.', status: 'Published', date: '2024-10-25' },
    { id: 'REV1002', doc: 'Dr. Priya', pat: 'Sravani G', rating: 4, comment: 'Good consultation, wait time was a bit high.', status: 'Pending', date: '2024-10-24' },
  ]);

  return (
    <div className={`flex min-h-screen transition-colors duration-500 text-left ${theme === 'dark' ? 'bg-[#050505] text-zinc-300' : 'bg-[#F8FAFC] text-slate-600'}`}>
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar relative z-10">

          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="text-left">
              <h1 className={`text-2xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Doctor Feedback & Reviews</h1>
              <p className="text-slate-500 font-medium mt-1">Moderate patient testimonials and maintain hospital standards</p>
            </div>
            <div className={`p-1 rounded-2xl border shadow-sm flex transition-all duration-500 ${theme === 'dark' ? 'bg-[#0A0A0F] border-white/5' : 'bg-white border-slate-100'}`}>
               <button className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm">All</button>
               <button className="px-6 py-2 text-slate-400 font-bold text-sm hover:bg-gray-50 rounded-xl transition-all">Pending</button>
               <button className="px-6 py-2 text-slate-400 font-bold text-sm hover:bg-gray-50 rounded-xl transition-all">Flagged</button>
            </div>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {[
               { label: 'Avg Rating', val: '4.7', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
               { label: 'Total Reviews', val: '1,250', icon: UserIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
               { label: 'Published', val: '1,120', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
               { label: 'Flagged', val: '12', icon: Flag, color: 'text-red-600', bg: 'bg-red-50' },
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

          <div className={`rounded-[40px] border shadow-sm overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-[#0E0E12]/90 border-white/5' : 'bg-white border-slate-100'}`}>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-white/5 text-zinc-500' : 'bg-slate-50/30 text-gray-400'}`}>
                      <tr className={theme === 'dark' ? 'border-b border-white/5' : 'border-b border-slate-100'}>
                         <th className="px-8 py-5">Review ID</th>
                         <th className="px-8 py-5">Doctor / Patient</th>
                         <th className="px-8 py-5">Rating & Feedback</th>
                         <th className="px-8 py-5 text-center">Status</th>
                         <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className={`divide-y text-sm font-bold ${theme === 'dark' ? 'divide-white/5 text-zinc-300' : 'divide-slate-50 text-gray-700'}`}>
                      {reviews.map((r) => (
                         <tr key={r.id} className={`transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50/50'}`}>
                            <td className="px-8 py-6 text-blue-600 font-black">#{r.id}</td>
                            <td className="px-8 py-6 text-left">
                               <p className={theme === 'dark' ? 'text-white' : 'text-slate-800'}>{r.doc}</p>
                               <p className="text-[10px] text-slate-400 font-black uppercase">BY {r.pat}</p>
                            </td>
                            <td className="px-8 py-6 max-w-md text-left">
                               <div className="flex gap-0.5 text-amber-400 mb-2">
                                  {[...Array(r.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor"/>)}
                               </div>
                               <p className={`text-xs italic font-medium leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>"{r.comment}"</p>
                            </td>
                            <td className="px-8 py-6 text-center">
                               <span className={`px-3 py-1 rounded-lg text-[10px] uppercase font-black tracking-widest ${
                                  r.status === 'Published'
                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                    : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                               }`}>{r.status}</span>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <div className="flex justify-end gap-2">
                                  <button className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-white/5 text-emerald-400 hover:bg-emerald-500/10' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}><CheckCircle size={18}/></button>
                                  <button className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-white/5 text-red-400 hover:bg-red-500/10' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}><Flag size={18}/></button>
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

export default DoctorReviews;
