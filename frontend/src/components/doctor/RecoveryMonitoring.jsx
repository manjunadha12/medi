import React, { useState, useEffect } from 'react';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Thermometer, Droplets, Wind, AlertTriangle, ArrowUpRight, Search as SearchIcon, Loader2, User as UserIcon, RefreshCw, Brain, ShieldCheck as ShieldCheckIcon } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import useStore from '../../store/useStore';

const RecoveryMonitoring = () => {
  const { theme } = useStore();
  const [patientId, setPatientId] = useState('');
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPatientData = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/doctor/patient/${id}`);

      if (!data || !data.user) {
        throw new Error("Patient archive sync failed");
      }

      // Calculation of trends - Mocked for visualization
      const mockTrends = [
        { day: 'Mon', pain: 6, score: 65 },
        { day: 'Tue', pain: 5, score: 70 },
        { day: 'Wed', pain: 3, score: 78 },
        { day: 'Thu', pain: 4, score: 75 },
        { day: 'Fri', pain: 2, score: 85 },
      ];

      setPatient({
        ...data.user,
        recoveryScore: 85,
        trends: mockTrends
      });
      toast.success("Recovery matrix synchronized");
    } catch (error) {
      console.error("Sync error:", error);
      toast.error(error.response?.data?.message || error.message || "Invalid Patient ID");
      setPatient(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPatientData(patientId);
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-[#050505] text-slate-300' : 'bg-[#F3F4F6] text-slate-600'} text-left`}>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="p-8 lg:p-10 overflow-y-auto custom-scrollbar">
          <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className={`text-3xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Recovery Monitoring</h1>
              <p className="text-slate-400 uppercase text-[10px] font-black tracking-widest mt-1">AI-Assisted Neural Tracking</p>
            </div>

            <form onSubmit={handleSearch} className={`flex gap-3 p-2 rounded-2xl border shadow-sm transition-all duration-500 ${theme === 'dark' ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-gray-100'}`}>
               <div className="relative">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="ENTER PATIENT ID"
                    className={`pl-10 pr-4 py-2 border rounded-xl text-[10px] font-black tracking-widest outline-none transition-all w-48 ${theme === 'dark' ? 'bg-zinc-900 border-white/5 text-blue-400 focus:border-blue-500/30' : 'bg-gray-50 border-gray-100 text-blue-600 focus:border-blue-500/30'}`}
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value.toUpperCase())}
                  />
               </div>
               <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-30"
               >
                 {loading ? <Loader2 className="animate-spin" size={14} /> : "SYNC NODE"}
               </button>
            </form>
          </header>

          {patient ? (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 bg-blue-600 p-8 rounded-[48px] text-white shadow-2xl shadow-blue-600/30 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all"></div>
                  <p className="text-blue-100 text-[10px] mb-2 uppercase font-black tracking-[0.2em] relative z-10">Recovery Score</p>
                  <div className="flex items-end gap-2 relative z-10">
                    <h2 className="text-6xl font-black tracking-tighter">{patient.recoveryScore}%</h2>
                    <ArrowUpRight className="w-10 h-10 text-emerald-300 mb-2 animate-bounce" />
                  </div>
                  <p className="text-xs text-blue-100/80 mt-6 leading-relaxed font-medium uppercase tracking-wide relative z-10">
                    Patient is recovering <span className="text-white font-black">12% faster</span> than established establishment averages.
                  </p>
                </div>

                {[
                  { label: 'Pain Vector', value: '2/10', icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50' },
                  { label: 'Oxygen Saturation', value: '98%', icon: Wind, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                  { label: 'Core Temperature', value: '98.4 °F', icon: Thermometer, color: 'text-blue-500', bg: 'bg-blue-50' },
                ].map((stat, i) => (
                  <div key={i} className={`p-8 rounded-[40px] border shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-all duration-500 ${theme === 'dark' ? 'bg-[#0A0A0A] border-white/5 shadow-black/60' : 'bg-white border-gray-100'}`}>
                    <div className={`w-14 h-14 ${theme === 'dark' ? 'bg-white/5' : stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                      <stat.icon size={28} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className={`text-3xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className={`lg:col-span-2 p-10 rounded-[56px] border shadow-sm transition-all duration-500 ${theme === 'dark' ? 'bg-[#0A0A0A] border-white/5 shadow-black/60' : 'bg-white border-gray-100'}`}>
                  <div className="flex items-center justify-between mb-10">
                    <h3 className={`font-black text-lg uppercase tracking-tight flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                       <Activity className="text-blue-600" size={20} /> Neural Trend Synthesis
                    </h3>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={patient.trends || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#F1F5F9'} />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94A3B8'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94A3B8'}} />
                        <Tooltip contentStyle={{borderRadius: '24px', border: 'none', backgroundColor: theme === 'dark' ? '#0a0a0a' : '#fff', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                        <Line type="monotone" dataKey="score" stroke="#1A56DB" strokeWidth={5} dot={{ r: 8, fill: '#1A56DB', strokeWidth: 4, stroke: theme === 'dark' ? '#0a0a0a' : '#fff' }} name="Recovery %" />
                        <Line type="monotone" dataKey="pain" stroke="#DC2626" strokeWidth={5} dot={{ r: 8, fill: '#DC2626', strokeWidth: 4, stroke: theme === 'dark' ? '#0a0a0a' : '#fff' }} name="Pain Level" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className={`p-8 rounded-[48px] border shadow-sm transition-all duration-500 ${theme === 'dark' ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-gray-100'}`}>
                    <h3 className={`font-black text-xs uppercase tracking-widest mb-6 border-b pb-4 ${theme === 'dark' ? 'text-white border-white/5' : 'text-gray-800 border-gray-50'}`}>Neural Compliance</h3>
                    <div className="space-y-5">
                      {[
                        { name: 'Metformin', status: 'Taken', time: '09:00 AM' },
                        { name: 'Aspirin', status: 'Missed', time: '02:00 PM' },
                        { name: 'Multivitamin', status: 'Taken', time: '08:00 PM' },
                      ].map((m, i) => (
                        <div key={i} className="flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                             <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${m.status === 'Taken' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                                <Activity size={14} />
                             </div>
                             <span className={`text-xs font-black uppercase tracking-tight ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>{m.name}</span>
                          </div>
                          <span className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest ${
                            m.status === 'Taken' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                          }`}>
                            {m.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#0A0A0A] p-8 rounded-[48px] shadow-2xl relative overflow-hidden group border border-white/5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-600/20 transition-all duration-700"></div>
                    <h3 className="font-black text-white text-[10px] uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                      <Brain size={18} className="text-blue-500" /> AI Diagnostic Node
                    </h3>
                    <div className="p-6 bg-white/5 border border-white/5 rounded-[32px] space-y-4 relative z-10">
                       <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-wide italic">
                         "Sudden fluctuation in recovery vector identified on cycle Thursday correlates with a missed dosage of Aspirin node. Advise clinical synchronization."
                       </p>
                       <div className="h-px bg-white/5"></div>
                       <button className="w-full py-3 bg-blue-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-all active:scale-95">Verify Anomaly</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-1000">
               <div className="relative">
                  <div className={`w-32 h-32 rounded-[48px] shadow-2xl flex items-center justify-center border relative z-10 transition-all duration-500 ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-slate-100'}`}>
                     <RefreshCw size={48} className="text-slate-200" />
                  </div>
                  <div className="absolute -inset-10 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
               </div>
               <div>
                  <h4 className={`text-2xl font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-zinc-700' : 'text-gray-300'}`}>Monitoring Node Offline</h4>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-4 max-w-[300px] leading-relaxed mx-auto">Input Patient ID to establish real-time diagnostic synchronization.</p>
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RecoveryMonitoring;
