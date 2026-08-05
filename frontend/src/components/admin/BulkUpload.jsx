import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Download, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useStore from '../../store/useStore';

const BulkUpload = () => {
  const { theme } = useStore();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    if (!file) return toast.error("Please select a CSV or Excel file");
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setFile(null);
      toast.success("Bulk records imported successfully");
    }, 2000);
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-500 text-left ${theme === 'dark' ? 'bg-[#050505] text-zinc-300' : 'bg-[#F8FAFC] text-slate-600'}`}>
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <header className="text-left">
              <h1 className={`text-3xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Bulk Data Management</h1>
              <p className="text-slate-500 font-medium">Import mass records for patients or staff using standardized templates</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className={`p-10 rounded-[40px] border shadow-sm flex flex-col items-center text-center justify-center space-y-6 group transition-all duration-500 ${theme === 'dark' ? 'bg-[#0E0E12]/90 border-white/5' : 'bg-white border-slate-100'}`}>
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border-2 border-dashed transition-all cursor-pointer ${theme === 'dark' ? 'bg-white/5 border-white/10 text-blue-400 group-hover:border-solid' : 'bg-blue-50 border-blue-200 text-blue-600 group-hover:border-solid'}`}>
                     <UploadCloud size={40}/>
                  </div>
                  <div className="text-center">
                    <h3 className={`text-xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Bulk Upload CSV</h3>
                    <p className="text-xs text-slate-400 font-medium mt-2 leading-relaxed">Select a formatted CSV or Excel file to start importing records.</p>
                  </div>

                  {file ? (
                    <div className={`w-full p-4 border rounded-2xl flex items-center justify-between transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                       <div className="flex items-center gap-3 overflow-hidden">
                          <FileText size={20} className="text-blue-600 shrink-0" />
                          <span className={`text-xs font-bold truncate ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-700'}`}>{file.name}</span>
                       </div>
                       <button onClick={() => setFile(null)} className="hover:scale-110 transition-transform"><X size={16} className="text-red-400"/></button>
                    </div>
                  ) : (
                    <label className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs shadow-xl shadow-blue-500/30 cursor-pointer text-center hover:bg-blue-700 transition-all uppercase tracking-widest active:scale-95">
                       CHOOSE FILE
                       <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} accept=".csv,.xlsx" />
                    </label>
                  )}

                  <button
                    disabled={!file || uploading}
                    onClick={handleUpload}
                    className={`w-full py-4 border-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${theme === 'dark' ? 'border-blue-600/50 text-blue-500 hover:bg-blue-600/10' : 'border-blue-600 text-blue-600 hover:bg-blue-50'} disabled:opacity-30`}
                  >
                     {uploading ? 'PROCESSING DATA...' : 'INITIATE BULK IMPORT'}
                  </button>
               </div>

               <div className={`p-10 rounded-[40px] border shadow-sm space-y-8 transition-all duration-500 ${theme === 'dark' ? 'bg-[#0E0E12]/90 border-white/5' : 'bg-white border-slate-100'}`}>
                  <h3 className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 border-b pb-4 ${theme === 'dark' ? 'text-white border-white/5' : 'text-slate-800 border-gray-50'}`}>
                     <Download size={20} className="text-blue-600" /> Standardization Templates
                  </h3>
                  <div className="space-y-4">
                     {[
                       { label: 'Patient Import Template', size: '12 KB' },
                       { label: 'Doctor Roster Template', size: '15 KB' },
                       { label: 'Inventory Master Template', size: '10 KB' },
                     ].map((t, i) => (
                        <div key={i} className={`p-5 rounded-3xl flex items-center justify-between group transition-all border border-transparent cursor-pointer ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 hover:border-blue-500/20' : 'bg-slate-50 hover:bg-white hover:shadow-lg hover:border-blue-100'}`}>
                           <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 shadow-sm transition-all ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}><FileText size={18}/></div>
                              <div className="text-left"><p className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-gray-800'}`}>{t.label}</p><p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{t.size} • XLSX</p></div>
                           </div>
                           <Download size={18} className="text-slate-300 group-hover:text-blue-600 transition-all" />
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

export default BulkUpload;
