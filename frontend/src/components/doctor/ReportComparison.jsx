import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import {
  ArrowLeftRight, FileText, ChevronDown,
  TrendingUp, TrendingDown, Minus, Info
} from 'lucide-react';

const ReportComparison = () => {
  const [report1, setReport1] = useState('Report_Aug_2024.pdf');
  const [report2, setReport2] = useState('Report_Oct_2024.pdf');

  const comparisonData = [
    { label: 'WBC Count', v1: '9,500', v2: '14,000', unit: '/mcL', trend: 'up', status: 'Worsened' },
    { label: 'Hemoglobin', v1: '14.2', v2: '13.8', unit: 'g/dL', trend: 'down', status: 'Stable' },
    { label: 'Blood Sugar', v1: '110', v2: '160', unit: 'mg/dL', trend: 'up', status: 'Critical' },
    { label: 'CRP Level', v1: '5', v2: '12', unit: 'mg/L', trend: 'up', status: 'Worsened' },
    { label: 'Platelets', v1: '2.5L', v2: '2.4L', unit: '/mcL', trend: 'down', status: 'Stable' },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] text-zinc-300 text-left neural-grid pb-24">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />
        <main className="p-8 space-y-8 text-left relative z-10">
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">Report Comparison</h1>
              <p className="text-zinc-500 font-medium mt-1">Compare laboratory values between historical and new reports</p>
            </div>
            <button className="bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-300 shadow-sm hover:bg-white/10 transition-all">
              <ArrowLeftRight size={16} className="inline mr-2" /> Select New Reports
            </button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-zinc-950/80 p-6 rounded-3xl border border-white/5 shadow-sm flex items-center justify-between backdrop-blur-3xl noise-overlay">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 text-blue-400 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase">Old Report</p>
                  <p className="font-bold text-white">{report1}</p>
                </div>
              </div>
              <ChevronDown className="text-zinc-500" />
            </div>
            <div className="bg-zinc-950/80 p-6 rounded-3xl border border-white/5 shadow-sm flex items-center justify-between backdrop-blur-3xl noise-overlay">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 text-emerald-400 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase">New Report</p>
                  <p className="font-bold text-white">{report2}</p>
                </div>
              </div>
              <ChevronDown className="text-zinc-500" />
            </div>
          </div>

          <div className="bg-zinc-950/80 rounded-3xl border border-white/5 shadow-sm overflow-hidden backdrop-blur-3xl noise-overlay">
            <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <h2 className="font-black text-xs text-zinc-400 uppercase tracking-widest">Parameter Comparison</h2>
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-400"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Improved</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-400"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Critical Change</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-zinc-500 text-[10px] font-black uppercase border-b border-white/5 bg-white/5">
                  <tr>
                    <th className="px-8 py-4">Clinical Parameter</th>
                    <th className="px-8 py-4">Previous Value</th>
                    <th className="px-8 py-4">Current Value</th>
                    <th className="px-8 py-4">Change Trend</th>
                    <th className="px-8 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-bold text-sm text-zinc-300">
                  {comparisonData.map((d, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-all">
                      <td className="px-8 py-6">{d.label}</td>
                      <td className="px-8 py-6 text-zinc-500">{d.v1} <span className="text-[10px]">{d.unit}</span></td>
                      <td className="px-8 py-6 text-white">{d.v2} <span className="text-[10px]">{d.unit}</span></td>
                      <td className="px-8 py-6">
                        <div className={`flex items-center gap-2 ${d.trend === 'up' ? 'text-red-400' : 'text-green-400'}`}>
                          {d.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          <span className="text-xs">{d.trend === 'up' ? 'Increased' : 'Decreased'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className={`px-3 py-1 rounded-lg text-[10px] uppercase font-black ${
                          d.status === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          d.status === 'Worsened' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-green-500/10 text-green-400 border border-green-500/20'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-8 bg-blue-600 rounded-[40px] shadow-xl text-white flex items-center justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/15 transition-all"></div>
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center italic font-black text-xl shadow-inner">AI</div>
              <div>
                <h3 className="font-black text-lg uppercase tracking-tight">Automated Swarm Analysis Summary</h3>
                <p className="text-sm text-blue-100 font-medium mt-1">"WBC increased from 9,500 to 14,000, indicating possible infection progression. Urgent clinical review recommended."</p>
              </div>
            </div>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:scale-105 transition-all shadow-md active:scale-95 shrink-0 relative z-10">VIEW RECOMMENDATIONS</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportComparison;
