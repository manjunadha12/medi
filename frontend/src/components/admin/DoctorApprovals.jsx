import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import api from '../../utils/api';
import {
  Search as SearchIcon, Filter, MoreVertical,
  ShieldCheck, CheckCircle, Shield,
  Trash2, Loader2, RefreshCw, BadgeCheck, FileText, ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import useStore from '../../store/useStore';

const DoctorApprovals = () => {
  const store = useStore();
  const theme = store.theme;
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPendingDoctors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/doctors');
      // Filter only unverified/pending doctors
      const pending = res.data.filter(d => !d.isVerified || d.verificationStatus !== 'Approved');
      setDoctors(pending);
    } catch (err) {
      toast.error('Failed to load pending applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPendingDoctors(); }, []);

  const handleVerify = async (id) => {
    try {
      await api.post(`/admin/doctor/${id}/verify`);
      toast.success('Identity Node Authorized: DOC ID Generated');
      fetchPendingDoctors();
    } catch (err) {
      toast.error('Verification protocol failed');
    }
  };

  const filtered = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.applicationNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`flex min-h-screen transition-colors duration-500 text-left ${theme === 'dark' ? 'bg-[#050505] text-zinc-300' : 'bg-[#F8FAFC] text-slate-600'} pb-24`}>
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />
        <main className="p-4 sm:p-6 lg:p-8 space-y-8 relative z-10 overflow-y-auto custom-scrollbar">

          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="text-left">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1">Security Registry</p>
              <h1 className={`text-3xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Specialist Approvals</h1>
              <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mt-1">Authorized Credential Verification Terminal</p>
            </div>
            <button
              onClick={fetchPendingDoctors}
              className={`border px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500'}`}
            >
              <RefreshCw size={14} /> Refresh Stream
            </button>
          </header>

          <div className={`border rounded-[28px] p-4 backdrop-blur-3xl flex flex-col md:flex-row gap-6 transition-all duration-500 max-w-2xl ${theme === 'dark' ? 'bg-zinc-950/80 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="relative flex-1">
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
              <input
                type="text"
                placeholder="SEARCH BY APPLICATION NUMBER (APPxxxx)..."
                className={`w-full pl-12 pr-6 py-3 border-none rounded-xl outline-none font-black text-[10px] tracking-widest transition-all ${theme === 'dark' ? 'bg-white/5 text-white placeholder:text-zinc-700 focus:bg-white/10' : 'bg-slate-50 text-slate-800 placeholder:text-slate-400'}`}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-20 gap-4 opacity-30">
                <Loader2 className="animate-spin text-blue-500" size={40} />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Scanning Application Nodes...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className={`p-20 text-center rounded-[48px] border-2 border-dashed ${theme === 'dark' ? 'bg-zinc-900/20 border-zinc-800' : 'bg-slate-50 border-slate-100'}`}>
                <ShieldCheck size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-black text-[11px] uppercase tracking-[0.3em] text-zinc-500">Registry Clear: No Pending Applications</p>
              </div>
            ) : filtered.map((doc, i) => (
              <div key={i} className={`p-8 rounded-[48px] border transition-all duration-500 flex flex-col lg:flex-row items-center gap-10 group relative ${theme === 'dark' ? 'bg-[#0A0A0B] border-white/5 hover:border-blue-500/30 shadow-2xl' : 'bg-white border-slate-100 shadow-lg'}`}>

                <div className="shrink-0">
                  <div className="w-24 h-24 rounded-[32px] bg-blue-600 flex items-center justify-center text-white text-4xl font-black uppercase">
                    {doc.name?.charAt(0)}
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-left space-y-1">
                    <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Identity node</p>
                    <h3 className={`text-xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{doc.name}</h3>
                    <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">{doc.applicationNumber}</p>
                  </div>

                  <div className="text-left space-y-1 md:border-x md:border-white/5 md:px-8">
                    <p className="text-[9px] font-black text-purple-500 uppercase tracking-widest mb-1">Credentials</p>
                    <p className={`text-sm font-black uppercase ${theme === 'dark' ? 'text-zinc-200' : 'text-slate-700'}`}>{doc.specialization || 'Clinical Generalist'}</p>
                    <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">{doc.hospitalName || 'Institutional Node Pending'}</p>
                  </div>

                  <div className="text-left space-y-2">
                    <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-1">Protocol status</p>
                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg w-fit">
                      <Shield size={10} className="text-amber-500" />
                      <span className="text-[8px] font-black uppercase text-amber-500 tracking-widest">{doc.verificationStatus || 'Awaiting Docs'}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex gap-3">
                   <button
                     onClick={() => navigate(`/admin/doctor/${doc.applicationNumber || doc.doctorId || doc._id}`)}
                     className={`px-6 py-3 border rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm ${
                       theme === 'dark' ? 'bg-white/5 border-white/10 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10' : 'bg-white border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50'
                     }`}
                   >
                     View Docs <FileText size={14} />
                   </button>
                   <button
                     onClick={() => handleVerify(doc.applicationNumber || doc.doctorId || doc._id)}
                     className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-500 transition-all flex items-center gap-2 active:scale-95 border-2 border-white/10"
                   >
                     Authorize <BadgeCheck size={14} />
                   </button>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};

export default DoctorApprovals;
