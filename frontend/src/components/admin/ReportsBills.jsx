import React from 'react';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import { FileText, CreditCard, Download, ExternalLink, TrendingUp, AlertTriangle, IndianRupee } from 'lucide-react';
import useStore from '../../store/useStore';

const ReportsBills = () => {
  const { theme } = useStore();
  const data = [
    { id: 'TXN1050', type: 'Consultation', patient: 'Manjunadha', amount: 700, date: '2024-10-25', status: 'Paid' },
    { id: 'TXN1051', type: 'Laboratory', patient: 'Sravani G', amount: 1500, date: '2024-10-25', status: 'Pending' },
    { id: 'TXN1052', type: 'Pharmacy', patient: 'Kavitha Devi', amount: 320, date: '2024-10-24', status: 'Paid' },
    { id: 'TXN1053', type: 'Surgery', patient: 'Rajesh Kumar', amount: 45000, date: '2024-10-24', status: 'Paid' },
  ];

  return (
    <div className={`flex min-h-screen transition-colors duration-500 text-left ${theme === 'dark' ? 'bg-[#050505] text-zinc-300' : 'bg-[#F8FAFC] text-slate-600'}`}>
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar relative z-10">
          <header className="text-left">
            <h1 className={`text-2xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Financial Reports & Billing</h1>
            <p className="text-slate-500 font-medium mt-1">Centralized hospital revenue and transaction monitoring</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`p-6 rounded-[32px] border shadow-sm transition-all duration-500 ${theme === 'dark' ? 'bg-[#0E0E12]/90 border-white/5' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Revenue (Oct)</p>
                  <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>₹1,24,500</h3>
                </div>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                <div className="bg-emerald-500 w-[75%] h-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
              </div>
              <p className="text-[9px] font-bold text-slate-500 mt-3 uppercase tracking-widest text-left">75% of monthly target achieved</p>
            </div>

            <div className={`p-6 rounded-[32px] border shadow-sm transition-all duration-500 ${theme === 'dark' ? 'bg-[#0E0E12]/90 border-white/5' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Payments</p>
                  <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>₹15,800</h3>
                </div>
              </div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-left">Across 12 different patient nodes</p>
            </div>

            <div className={`p-6 rounded-[32px] border shadow-sm transition-all duration-500 ${theme === 'dark' ? 'bg-[#0E0E12]/90 border-white/5' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Generated Invoices</p>
                  <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>156</h3>
                </div>
              </div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-left">Last 24 hours: +12 invoices synced</p>
            </div>
          </div>

          <div className={`rounded-[40px] border shadow-sm overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-[#0E0E12]/90 border-white/5' : 'bg-white border-slate-100'}`}>
            <div className={`p-6 border-b flex justify-between items-center ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50/50 border-slate-100'}`}>
              <h3 className={`font-black text-sm uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Recent Transactions</h3>
              <button className="text-blue-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-blue-400 transition-all">
                <Download size={14} /> Download Archive
              </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-white/5 text-zinc-500' : 'bg-slate-50/30 text-gray-400'}`}>
                    <tr>
                      <th className="px-8 py-5">Txn ID</th>
                      <th className="px-8 py-5">Category / Patient</th>
                      <th className="px-8 py-5 text-center">Amount</th>
                      <th className="px-8 py-5 text-center">Date</th>
                      <th className="px-8 py-5 text-center">Status</th>
                      <th className="px-8 py-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y text-sm font-bold ${theme === 'dark' ? 'divide-white/5 text-zinc-300' : 'divide-slate-50 text-slate-700'}`}>
                    {data.map((item) => (
                      <tr key={item.id} className={`transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50/50'}`}>
                        <td className="px-8 py-6 font-black text-blue-600">#{item.id}</td>
                        <td className="px-8 py-6 text-left">
                          <p className={theme === 'dark' ? 'text-white' : 'text-slate-800'}>{item.type}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-tight">{item.patient}</p>
                        </td>
                        <td className="px-8 py-6 text-center font-black">₹{item.amount.toLocaleString()}</td>
                        <td className="px-8 py-6 text-center text-xs text-slate-500 uppercase">{item.date}</td>
                        <td className="px-8 py-6 text-center">
                          <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                            item.status === 'Paid'
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : 'bg-red-500/10 text-red-500 border border-red-500/20'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className={`p-3 rounded-xl transition-all ${theme === 'dark' ? 'bg-white/5 text-zinc-500 hover:text-blue-400' : 'bg-white border border-slate-100 text-slate-300 hover:text-blue-600 shadow-sm'}`}>
                             <ExternalLink size={16} />
                          </button>
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

export default ReportsBills;
