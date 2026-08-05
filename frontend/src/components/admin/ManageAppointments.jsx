import React from 'react';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import { Calendar, Search as SearchIcon, Filter, CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react';
import useStore from '../../store/useStore';
import { toast } from 'react-hot-toast';

const ManageAppointments = () => {
  const { theme } = useStore();
  const appointments = [
    { id: 'APP101', patient: 'Manjunadha', doctor: 'Dr. Arjun Kumar', date: '2024-10-25', time: '10:00 AM', status: 'Completed' },
    { id: 'APP102', patient: 'Sravani G', doctor: 'Dr. Priya Sharma', date: '2024-10-26', time: '11:30 AM', status: 'Pending' },
    { id: 'APP103', patient: 'Rajesh Kumar', doctor: 'Dr. Arjun Kumar', date: '2024-10-26', time: '02:00 PM', status: 'Pending' },
    { id: 'APP104', patient: 'Kavitha Devi', doctor: 'Dr. Sneha Rao', date: '2024-10-25', time: '04:30 PM', status: 'Cancelled' },
  ];

  return (
    <div className={`flex min-h-screen transition-colors duration-500 text-left ${theme === 'dark' ? 'bg-[#050505] text-zinc-300' : 'bg-[#F8FAFC] text-slate-600'}`}>
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar relative z-10">
          <header className="mb-8">
            <h1 className={`text-3xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Hospital Appointments</h1>
            <p className="text-zinc-500 font-medium mt-1">Monitoring all active and past consultations</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Today', value: '45', color: 'bg-blue-600' },
              { label: 'Pending', value: '12', color: 'bg-amber-500' },
              { label: 'Completed', value: '28', color: 'bg-emerald-500' },
              { label: 'Cancelled', value: '5', color: 'bg-red-500' },
            ].map((stat, i) => (
              <div key={i} className={`p-6 rounded-[32px] border shadow-sm transition-all duration-500 ${theme === 'dark' ? 'bg-[#0E0E12]/90 border-white/5' : 'bg-white border-slate-100'}`}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="flex items-center justify-between">
                  <h2 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{stat.value}</h2>
                  <div className={`w-2.5 h-2.5 rounded-full ${stat.color}`}></div>
                </div>
              </div>
            ))}
          </div>

          <div className={`rounded-[40px] border shadow-sm overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-[#0E0E12]/90 border-white/5' : 'bg-white border-slate-100'}`}>
            <div className={`p-6 border-b flex flex-col md:flex-row gap-4 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50/50 border-slate-100'}`}>
              <div className="relative flex-1">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className={`w-full pl-10 pr-4 py-2 border rounded-xl text-xs font-bold outline-none transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-700'}`}
                />
              </div>
              <div className="flex gap-2">
                <input type="date" className={`border rounded-xl px-4 py-2 text-xs font-bold outline-none transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-700'}`} />
                <button className={`px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                  <Filter size={14} /> Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-white/5 text-zinc-500' : 'bg-slate-50/30 text-gray-400'}`}>
                  <tr>
                    <th className="px-8 py-5">Appointment ID</th>
                    <th className="px-8 py-5">Patient / Doctor</th>
                    <th className="px-8 py-5">Date & Time</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-sm font-bold ${theme === 'dark' ? 'divide-white/5 text-zinc-300' : 'divide-slate-50 text-slate-700'}`}>
                  {appointments.map((app) => (
                    <tr key={app.id} className={`transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50/50'}`}>
                      <td className="px-8 py-6 font-black text-blue-600">#{app.id}</td>
                      <td className="px-8 py-6 text-left">
                        <p className={theme === 'dark' ? 'text-white' : 'text-slate-800'}>{app.patient}</p>
                        <p className="text-[10px] text-slate-400 uppercase">with {app.doctor}</p>
                      </td>
                      <td className="px-8 py-6 text-left">
                        <div className="flex items-center gap-1.5"><Calendar size={12} className="text-slate-300"/> {app.date}</div>
                        <div className="flex items-center gap-1.5 text-slate-400 mt-1 uppercase text-[9px]"><Clock size={10}/> {app.time}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 w-fit border ${
                          app.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                          app.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                          'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                          {app.status === 'Completed' && <CheckCircle size={10} />}
                          {app.status === 'Pending' && <Clock size={10} />}
                          {app.status === 'Cancelled' && <XCircle size={10} />}
                          {app.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => toast.success("Appointment parameters accessed")}
                          className="text-blue-500 font-black text-[10px] uppercase hover:underline flex items-center gap-1 ml-auto"
                        >Manage <ChevronRight size={12}/></button>
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

export default ManageAppointments;
