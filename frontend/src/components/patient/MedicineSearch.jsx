import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../common/Navbar';
import NeuralDock from '../common/NeuralDock';
import useStore from '../../store/useStore';
import api from '../../utils/api';
import {
  Search as SearchIcon, Pill, Info, AlertTriangle,
  MessageSquare, Save, Download, Share2, Loader2,
  ChevronRight, Thermometer, FlaskConical, Stethoscope, Activity,
  CheckCircle, Shield, Layout, Zap, Database
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const MedicineSearch = () => {
  const { theme } = useStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [medicine, setMedicine] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const { data } = await api.get(`/ai/medicine-suggestions?query=${query}`);
        setSuggestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (overrideQuery = null) => {
    const finalQuery = overrideQuery || query;
    if (!finalQuery.trim()) return toast.error("Identity Required");

    setLoading(true);
    setMedicine(null);
    setShowSuggestions(false);
    try {
      const { data } = await api.post('/ai/analyze-medicine', { medicineName: finalQuery });

      let processedData = data;
      if (typeof data === 'string') {
        try {
          processedData = JSON.parse(data);
        } catch (e) {
          throw new Error("Complex Parse Error");
        }
      }

      if (processedData.error) {
        toast.error(processedData.message || "AI node busy. Retrying...");
        setLoading(false);
        return;
      }

      setMedicine({
        ...processedData,
        sideEffects: Array.isArray(processedData.sideEffects) ? processedData.sideEffects : [],
        precautions: Array.isArray(processedData.precautions) ? processedData.precautions : []
      });

      setQuery(processedData.name || finalQuery);
      toast.success("Pharmacology Sync Complete");
    } catch (error) {
      console.error("Search Error:", error);
      toast.error("AI node timeout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const InfoRow = ({ label, value, icon: Icon, color }) => (
    <div className={`p-5 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
      <div className="flex items-center gap-3 mb-2 text-left">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm ${color}`}>
          <Icon size={16} />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      </div>
      <p className={`text-sm font-bold leading-relaxed text-left ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{value || 'N/A'}</p>
    </div>
  );

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-[#050505] text-slate-300' : 'bg-[#F8FAFC] text-slate-600'} text-left`}>
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />

        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 pb-32 text-left">
          <header className="mb-10">
            <h1 className={`text-3xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Medicine Assistant</h1>
            <p className="text-zinc-500 uppercase text-[10px] font-black tracking-widest mt-1 text-left">Neural Pharmacology Interface Active</p>
          </header>

          <div className="max-w-3xl mx-auto relative mb-12" ref={suggestionRef}>
            <div className={`p-2 rounded-[32px] border shadow-2xl transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-slate-100'}`}>
              <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-4 px-6 text-left">
                  <SearchIcon className="text-blue-500" size={24} />
                  <input
                    type="text"
                    value={query}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
                    placeholder="ENTER MEDICINE NAME..."
                    className="w-full py-6 bg-transparent outline-none font-black text-sm tracking-widest uppercase"
                  />
                </div>
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-10 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-700 transition-all flex items-center gap-3">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Initialize Scan"}
                </button>
              </form>
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className={`absolute top-full left-0 right-0 mt-4 rounded-[32px] border shadow-2xl z-[120] overflow-hidden ${theme === 'dark' ? 'bg-[#121212] border-white/5' : 'bg-white border-slate-100'}`}>
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => { setQuery(s.name); handleSearch(s.name); }} className={`w-full text-left px-8 py-5 flex items-center gap-4 transition-all border-b last:border-b-0 hover:bg-blue-500/5`}>
                    <Pill size={16} className="text-blue-500" />
                    <div className="text-left">
                      <p className="text-xs font-black uppercase tracking-widest">{s.name} <span className="text-[10px] text-zinc-500">({s.brandName})</span></p>
                      <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter mt-0.5">{s.commonUses}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {!medicine && !loading ? (
             <div className="py-20 text-center opacity-20 font-black uppercase tracking-[0.5em]">Input Pending</div>
          ) : loading ? (
             <div className="py-24 text-center animate-pulse"><FlaskConical size={64} className="mx-auto text-blue-500 mb-6" /><p className="text-blue-500 font-black uppercase tracking-[0.4em]">Synthesizing Profile...</p></div>
          ) : (
            <div className="space-y-10 animate-in fade-in duration-700 max-w-6xl mx-auto text-left">
              <div className={`p-10 rounded-[56px] border shadow-2xl relative overflow-hidden transition-all ${theme === 'dark' ? 'bg-[#0A0A0B] border-white/5' : 'bg-white border-slate-100'}`}>
                 <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>

                 <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10 relative z-10 text-left">
                    <div>
                       <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-500/20">{medicine.category || "General"}</span>
                       <h2 className={`text-4xl font-black uppercase tracking-tighter mt-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{medicine.name}</h2>
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Generic: {medicine.genericName || "N/A"}</p>
                    </div>
                 </div>

                 <div className={`p-8 rounded-[32px] border mb-10 shadow-inner text-left ${theme === 'dark' ? 'bg-[#0A0A0B] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                    <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2 text-left"><Info size={14} /> Clinical Profile</h3>
                    <p className={`text-sm leading-relaxed font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{medicine.aiExplanation}</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoRow label="Used For" value={medicine.usedFor} icon={Layout} color="text-blue-500" />
                    <InfoRow label="Mechanism" value={medicine.howItWorks} icon={Zap} color="text-purple-500" />
                    <InfoRow label="Dosage Node" value={medicine.dosage} icon={FlaskConical} color="text-emerald-500" />
                    <InfoRow label="Pregnancy" value={medicine.pregnancySafety} icon={Shield} color="text-rose-500" />
                    <InfoRow label="Manufacturer" value={medicine.manufacturer} icon={Database} color="text-amber-500" />
                    <InfoRow label="Storage" value={medicine.storage} icon={Thermometer} color="text-cyan-500" />
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-left">
                 <div className={`p-8 rounded-[48px] border shadow-2xl transition-all ${theme === 'dark' ? 'bg-[#0A0A0B] border-white/5' : 'bg-white border-slate-100'}`}>
                    <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-2 text-left"><AlertTriangle size={16} /> Side Effects</h3>
                    <div className="space-y-4">
                       {medicine.sideEffects.length > 0 ? medicine.sideEffects.map((s, i) => (
                         <div key={i} className="flex items-center gap-4 p-4 bg-red-500/5 rounded-2xl border border-red-500/10 text-xs font-black uppercase text-red-600/80 text-left">{s}</div>
                       )) : <p className="text-xs font-bold text-slate-400">None logged</p>}
                    </div>
                 </div>
                 <div className={`p-8 rounded-[48px] border shadow-2xl transition-all ${theme === 'dark' ? 'bg-[#0A0A0B] border-white/5' : 'bg-white border-slate-100'}`}>
                    <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-2 text-left"><Shield size={16} /> Precautions</h3>
                    <div className="space-y-4">
                       {medicine.precautions.length > 0 ? medicine.precautions.map((p, i) => (
                         <div key={i} className="flex items-center gap-4 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 text-xs font-bold uppercase text-slate-500 text-left">{p}</div>
                       )) : <p className="text-xs font-bold text-slate-400">Standard protocol apply</p>}
                    </div>
                 </div>
              </div>

              <button onClick={() => setMedicine(null)} className="mt-12 w-full py-5 border border-slate-200 dark:border-white/10 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] text-zinc-500 hover:text-blue-500 transition-all">New Molecular Scan</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MedicineSearch;
