import React, { useState, useEffect } from 'react';
import Navbar from '../common/Navbar';
import api from '../../utils/api';
import {
  History as HistoryIcon, Search as SearchIcon, Filter, Calendar, Clock,
  User, CheckCircle, XCircle, ChevronRight, Video, FileText, Loader2,
  Folder, ClipboardList, Activity, CreditCard, ChevronLeft, Brain
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';

const DoctorHistory = () => {
  const { theme, user } = useStore();
  const navigate = useNavigate();
  const [activeFolder, setActiveFolder] = useState(null); // null means root view (folders)
  const [history, setHistory] = useState([]);
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const [historyRes, diagnosisRes] = await Promise.all([
        api.get('/appointments/doctor-history'),
        api.get(`/clinical-diagnosis/history/doctor/${user.doctorId || user._id}`)
      ]);
      setHistory(historyRes.data || []);
      setDiagnosisData(diagnosisRes.data || []);
    } catch (err) {
      console.error("[HISTORY_SYNC_ERROR]:", err);
      toast.error("Failed to load clinical history archive");
    } finally {
      setLoading(false);
    }
  };

  const folders = [
    { id: 'diagnosis', label: 'Diagnosis Nodes', icon: ClipboardList, color: 'text-rose-500', bg: 'bg-rose-500/10', node: 'CLINICAL' },
    { id: 'op', label: 'OP History', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10', node: 'OP' },
    { id: 'operations', label: 'Procedures', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10', node: 'OPERATIONS' }
  ];

  const filteredData = activeFolder === 'diagnosis'
    ? diagnosisData.filter(d =>
        d.diagnosis?.toLowerCase().includes(search.toLowerCase()) ||
        d.patientName?.toLowerCase().includes(search.toLowerCase()) ||
        d.patientId?.toLowerCase().includes(search.toLowerCase())
      )
    : history.filter(item => {
        const matchesSearch = item.patientName.toLowerCase().includes(search.toLowerCase()) ||
                             item.patientId.toLowerCase().includes(search.toLowerCase()) ||
                             item.diagnosis?.toLowerCase().includes(search.toLowerCase());

        if (!activeFolder) return false;
        if (activeFolder === 'operations') return matchesSearch && (item.clinicalObservations || item.remarks);
        return matchesSearch; // Default 'op' folder shows all
      });

  return (
    <div className={`flex min-h-screen transition-colors duration-500 text-left pb-24 ${
      theme === 'dark' ? 'bg-[#050505] text-zinc-300' : 'bg-[#F8FAFC] text-slate-600'
    }`}>
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />

        <main className="p-8 lg:p-10 overflow-y-auto custom-scrollbar relative z-10">
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-left px-2">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setActiveFolder(null)}
                  className={`p-1.5 rounded-lg transition-all ${activeFolder ? 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' : 'opacity-0 pointer-events-none'}`}
                >
                  <ChevronLeft size={16} strokeWidth={3} />
                </button>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">
                  {activeFolder ? `Archive / ${folders.find(f => f.id === activeFolder)?.label}` : 'Historical Archive'}
                </p>
              </div>
              <h1 className={`text-3xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                {activeFolder ? folders.find(f => f.id === activeFolder)?.label : 'Clinical History'}
              </h1>
              <p className="text-zinc-500 uppercase text-[10px] font-black tracking-widest mt-1">Authorized technical summary of clinical assessments</p>
            </div>

            {activeFolder && (
              <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5 focus-within:border-blue-500/50' : 'bg-white border-slate-200 focus-within:border-blue-500/30 shadow-sm'}`}>
                <SearchIcon size={18} className="text-zinc-500" />
                <input
                  type="text"
                  placeholder="SEARCH ARCHIVE..."
                  className="bg-transparent border-none outline-none text-[10px] font-black w-full uppercase tracking-widest"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}
          </header>

          {loading ? (
            <div className="py-24 text-center flex flex-col items-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600/30 mb-4" />
              <p className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Accessing History Node...</p>
            </div>
          ) : !activeFolder ? (
            /* ROOT FOLDER VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setActiveFolder(folder.id)}
                  className={`group p-10 rounded-[56px] border transition-all duration-500 flex flex-col items-center text-center gap-8 relative overflow-hidden ${
                    theme === 'dark' ? 'bg-[#0A0A0B] border-white/5 hover:border-blue-500/30 hover:bg-white/5' : 'bg-white border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-200'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-blue-600/10 transition-all"></div>

                  <div className={`w-24 h-24 rounded-[40px] flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner ${
                    theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'
                  } ${folder.color}`}>
                    <Folder size={48} fill="currentColor" fillOpacity={0.1} />
                    <folder.icon size={28} className="absolute" strokeWidth={2.5} />
                  </div>

                  <div className="relative z-10 space-y-2">
                    <p className={`text-lg font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{folder.label}</p>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] opacity-60">Registry Node: {folder.node}</p>
                  </div>

                  <div className={`mt-4 px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] border transition-all ${
                    theme === 'dark' ? 'bg-white/5 border-white/5 text-zinc-500 group-hover:text-zinc-300' : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:text-blue-500'
                  }`}>
                    Open Directory
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* INSIDE FOLDER VIEW (FILES) */
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              {filteredData.length > 0 ? filteredData.map((item, i) => (
                <div key={i} className={`p-6 sm:p-8 rounded-[40px] border shadow-xl transition-all duration-500 group relative overflow-hidden ${theme === 'dark' ? 'bg-[#0A0A0A] border-blue-500/20 hover:border-blue-500/50' : 'bg-white border-blue-100 hover:border-blue-300 shadow-sm'}`}>
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-blue-600 text-2xl font-black border transition-all shrink-0 ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-blue-50 border-blue-100'}`}>
                        {(item.patientName || 'P').charAt(0)}
                      </div>
                      <div className="text-left">
                        <h3 className={`text-xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{item.patientName || item.doctorName}</h3>
                        <div className="flex items-center gap-3 mt-1">
                           <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest">{item.patientId}</p>
                           <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
                           <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${item.consultationType === 'Video' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-zinc-500/10 text-zinc-400'}`}>
                              {item.consultationType || 'Finalized Node'}
                           </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-2 text-left md:text-right">
                       <div className="flex items-center gap-2 text-zinc-500 font-black text-[10px] uppercase tracking-widest">
                          <Calendar size={12} /> {new Date(item.date || item.consultationDate).toLocaleDateString()}
                       </div>
                       {item.time && (
                         <div className="flex items-center gap-2 text-zinc-500 font-black text-[10px] uppercase tracking-widest">
                            <Clock size={12} /> {item.time}
                         </div>
                       )}
                       <span className={`mt-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          item.status === 'Completed' || item.status === 'Finalized' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                       }`}>
                          {item.status || 'Archived'}
                       </span>
                    </div>
                  </div>

                  <div className={`mt-8 p-6 rounded-3xl border text-left transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100 shadow-inner'}`}>
                     {activeFolder === 'diagnosis' ? (
                        <div className="space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div>
                                 <p className="text-[8px] font-black text-rose-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    <Brain size={10} /> Technical Diagnosis
                                 </p>
                                 <p className={`text-xs font-black uppercase ${theme === 'dark' ? 'text-zinc-200' : 'text-slate-800'}`}>
                                    {item.diagnosis}
                                 </p>
                              </div>
                              <div>
                                 <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    <FileText size={10} /> Report Summary
                                 </p>
                                 <p className={`text-xs font-medium italic leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                                    "{item.reportSummary || 'Standard assessment completed.'}"
                                 </p>
                              </div>
                           </div>
                           <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                              <div>
                                 <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Chief Complaint</p>
                                 <p className="text-[10px] font-bold text-zinc-400">{item.chiefComplaint || 'N/A'}</p>
                              </div>
                              <div>
                                 <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Treatment Plan</p>
                                 <p className="text-[10px] font-bold text-zinc-400">{item.treatmentPlan || 'Monitoring'}</p>
                              </div>
                           </div>
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div>
                              <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                 <FileText size={10} /> Clinical Outcome
                              </p>
                              <p className={`text-xs font-black uppercase ${theme === 'dark' ? 'text-zinc-200' : 'text-slate-800'}`}>
                                 {item.diagnosis || 'NO DIAGNOSIS RECORDED'}
                              </p>
                           </div>
                           <div>
                              <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                 <HistoryIcon size={10} /> Clinical Notes
                              </p>
                              <p className={`text-xs font-medium italic leading-relaxed line-clamp-2 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                                 "{item.notes || item.clinicalObservations || item.remarks || 'Routine consultation finalized.'}"
                              </p>
                           </div>
                        </div>
                     )}
                  </div>

                  <div className="mt-8 flex justify-end gap-3 border-t pt-6 border-white/5">
                     <button
                       onClick={() => navigate(`/doctor/patient/${item.patientId}`)}
                       className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${theme === 'dark' ? 'bg-white/5 text-blue-400 border border-white/5 hover:bg-blue-600 hover:text-white' : 'bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white'}`}
                     >
                        Deep Patient Archive <ChevronRight size={12} strokeWidth={3} />
                     </button>
                  </div>
                </div>
              )) : (
                <div className={`py-32 text-center rounded-[56px] border-2 border-dashed ${theme === 'dark' ? 'bg-[#0A0A0A] border-zinc-800' : 'bg-slate-50/50 border-slate-100'}`}>
                   <HistoryIcon size={64} className="text-zinc-800 mx-auto mb-6 opacity-20" />
                   <h3 className="text-lg font-black text-zinc-500 uppercase tracking-widest">Archive Node Empty</h3>
                   <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-2 px-4">No records found in this clinical segment.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DoctorHistory;
