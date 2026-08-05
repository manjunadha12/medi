import React, { useState, useEffect } from 'react';
import Navbar from '../common/Navbar';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { 
  Search as SearchIcon, Users, Send, Shield, AlertCircle, Plus, Edit2, Trash2,
  Download, Printer, ArrowLeft, CheckCircle, XCircle, FileText, 
  Activity, Clock, CheckSquare, RefreshCw, Star, Info
} from 'lucide-react';
import useStore from '../../store/useStore';

const Referral = () => {
  const { theme } = useStore();
  const [activeTab, setActiveTab] = useState('overview'); // overview, refer, specialists, history
  const [patients, setPatients] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, completed: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modal / Form States
  const [showDocModal, setShowDocModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [selectedReferral, setSelectedReferral] = useState(null); // For referral letter view

  // Form Initializations
  const [referralForm, setReferralForm] = useState({
    patientId: '',
    referredDoctorId: '',
    referralReason: '',
    diagnosis: '',
    notes: '',
    recommendations: '',
    priority: 'Normal'
  });

  const [docForm, setDocForm] = useState({
    name: '',
    specialization: '',
    hospitalName: '',
    contactNumber: '',
    email: '',
    address: '',
    availabilityStatus: 'Available'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [patientsRes, docsRes, referralsRes] = await Promise.all([
        api.get('/referrals/patients'),
        api.get('/referrals/doctors'),
        api.get('/referrals')
      ]);
      setPatients(patientsRes.data);
      setSpecialists(docsRes.data);
      setReferrals(referralsRes.data.referrals);
      setStats(referralsRes.data.stats);
    } catch (error) {
      console.error(error);
      toast.error('Failed to synchronize referral node database.');
    } finally {
      setLoading(false);
    }
  };

  // Create new patient referral
  const handleCreateReferral = async (e) => {
    e.preventDefault();
    if (!referralForm.patientId || !referralForm.referredDoctorId || !referralForm.referralReason) {
      toast.error('Please fill in all required telemetry fields.');
      return;
    }

    try {
      const res = await api.post('/referrals', referralForm);
      toast.success(`Referral ${res.data.referralId} generated successfully.`);
      setReferralForm({
        patientId: '',
        referredDoctorId: '',
        referralReason: '',
        diagnosis: '',
        notes: '',
        recommendations: '',
        priority: 'Normal'
      });
      fetchData();
      setActiveTab('overview');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Referral dispatch failed.');
    }
  };

  // Update referral status
  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/referrals/${id}`, { status });
      toast.success(`Referral state updated to ${status}`);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update referral state.');
    }
  };

  // Add or Edit Referral Specialist
  const handleSaveDoc = async (e) => {
    e.preventDefault();
    if (!docForm.name || !docForm.specialization || !docForm.hospitalName || !docForm.contactNumber || !docForm.email) {
      toast.error('Please complete all required fields.');
      return;
    }

    try {
      if (editingDoc) {
        await api.put(`/referrals/doctors/${editingDoc._id}`, docForm);
        toast.success('Specialist profile updated.');
      } else {
        await api.post('/referrals/doctors', docForm);
        toast.success('Specialist registered successfully.');
      }
      setDocForm({
        name: '',
        specialization: '',
        hospitalName: '',
        contactNumber: '',
        email: '',
        address: '',
        availabilityStatus: 'Available'
      });
      setEditingDoc(null);
      setShowDocModal(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save specialist.');
    }
  };

  // Delete Referral Specialist
  const handleDeleteDoc = async (id) => {
    if (!window.confirm('Deactivate specialist node from registry?')) return;
    try {
      await api.delete(`/referrals/doctors/${id}`);
      toast.success('Specialist registry purged.');
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to purge specialist.');
    }
  };

  const handleEditDocClick = (doc) => {
    setEditingDoc(doc);
    setDocForm({
      name: doc.name,
      specialization: doc.specialization,
      hospitalName: doc.hospitalName,
      contactNumber: doc.contactNumber,
      email: doc.email,
      address: doc.address || '',
      availabilityStatus: doc.availabilityStatus
    });
    setShowDocModal(true);
  };

  // Export history to CSV (Excel compatible)
  const handleExportCSV = () => {
    const headers = ['Referral ID', 'Patient ID', 'Patient Name', 'Referred Doctor', 'Priority', 'Status', 'Date Created', 'Reason'];
    const rows = filteredReferrals.map(r => [
      r.referralId,
      r.patientId,
      r.patientName,
      r.referredDoctorName,
      r.priority,
      r.status,
      new Date(r.createdAt).toLocaleDateString(),
      `"${r.referralReason?.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Referral_History_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Telemetry exported to Excel format.');
  };

  // Print Letter Trigger
  const triggerPrint = () => {
    window.print();
  };

  // Filter Logic
  const filteredReferrals = referrals.filter(r => {
    const matchesSearch = 
      r.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.referralId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.referredDoctorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.patientId?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || r.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="flex min-h-screen bg-[#050505] text-zinc-300 text-left neural-grid pb-24 relative overflow-x-hidden">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-10 custom-scrollbar relative z-10 print:p-0 print:m-0 print:bg-white print:text-black">
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-8 print:hidden">
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Care Coordination Hub</h1>
              <p className="text-blue-500 uppercase text-[10px] font-black tracking-widest mt-1">Unified referral link & specialist node routing</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setDocForm({
                    name: '',
                    specialization: '',
                    hospitalName: '',
                    contactNumber: '',
                    email: '',
                    address: '',
                    availabilityStatus: 'Available'
                  });
                  setEditingDoc(null);
                  setShowDocModal(true);
                }}
                className="px-5 py-3 rounded-2xl bg-zinc-900 border border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-white/20 transition-all flex items-center gap-2 active:scale-95"
              >
                <Plus size={14} /> Register Specialist
              </button>
              <button 
                onClick={() => setActiveTab('refer')}
                className="px-5 py-3 rounded-2xl bg-blue-600 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 hover:shadow-blue-500/35 transition-all flex items-center gap-2 active:scale-95"
              >
                <Send size={14} /> New Referral Link
              </button>
            </div>
          </header>

          {/* Print Letter Content (Hidden on Screen, Visible on Print) */}
          {selectedReferral && (
            <div id="print-area" className="hidden print:block p-10 bg-white text-black font-sans min-h-screen text-left">
              <div className="border-b-4 border-blue-600 pb-6 mb-8 flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-extrabold uppercase tracking-tight text-blue-600">MediConsult</h1>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Clinical Care Coordination Network</p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-bold">Referral ID: <span className="text-blue-600 font-extrabold">{selectedReferral.referralId}</span></p>
                  <p>Date Generated: {new Date(selectedReferral.createdAt).toLocaleDateString()}</p>
                  <p>Priority Level: <span className="font-extrabold text-red-600 uppercase">{selectedReferral.priority}</span></p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8 text-xs">
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h3 className="font-extrabold uppercase text-blue-600 tracking-wider mb-2 border-b border-gray-200 pb-1">Referring Clinic</h3>
                  <p className="font-bold text-gray-800">{selectedReferral.referringDoctorName}</p>
                  <p className="text-gray-500">Department Specialist Node</p>
                  <p className="text-gray-400 mt-2">MediConsult Diagnostic Center</p>
                </div>
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h3 className="font-extrabold uppercase text-blue-600 tracking-wider mb-2 border-b border-gray-200 pb-1">Referred Specialist</h3>
                  <p className="font-bold text-gray-800">{selectedReferral.referredDoctorName}</p>
                  <p className="text-gray-500">Target Specialist Node</p>
                  <p className="text-gray-400 mt-2">Hospital Registry Link</p>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-xs mb-8">
                <h3 className="font-extrabold uppercase text-blue-600 tracking-wider mb-3 border-b border-gray-200 pb-1">Patient Identity</h3>
                <div className="grid grid-cols-3 gap-4 font-bold text-gray-700">
                  <div>
                    <p className="text-gray-400 font-normal uppercase text-[9px]">Patient ID</p>
                    <p>{selectedReferral.patientId}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-normal uppercase text-[9px]">Full Name</p>
                    <p>{selectedReferral.patientName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-normal uppercase text-[9px]">Status</p>
                    <p className="text-blue-600 uppercase">{selectedReferral.status}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 text-xs text-gray-700 leading-relaxed mb-12">
                <div>
                  <h4 className="font-extrabold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-1">1. Diagnosis & Clinical Indicators</h4>
                  <p className="mt-2 text-gray-600 font-medium">{selectedReferral.diagnosis || 'No diagnosis logged'}</p>
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-1">2. Reason for Referral</h4>
                  <p className="mt-2 text-gray-600 font-medium">{selectedReferral.referralReason}</p>
                </div>
                {selectedReferral.notes && (
                  <div>
                    <h4 className="font-extrabold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-1">3. Clinical Notes</h4>
                    <p className="mt-2 text-gray-600 font-medium">{selectedReferral.notes}</p>
                  </div>
                )}
                {selectedReferral.recommendations && (
                  <div>
                    <h4 className="font-extrabold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-1">4. Action & Treatment Recommendations</h4>
                    <p className="mt-2 text-gray-600 font-medium">{selectedReferral.recommendations}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-end mt-16 text-xs border-t border-gray-100 pt-6">
                <div>
                  <p className="text-gray-400 uppercase text-[9px]">Verified Sign-Off</p>
                  <p className="font-black text-gray-800 mt-2">{selectedReferral.referringDoctorName}</p>
                  <p className="text-gray-400">Electronic Authorization Node</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 uppercase text-[9px]">Official stamp</p>
                  <div className="w-20 h-20 border border-dashed border-gray-300 rounded-xl mt-2 flex items-center justify-center text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                    MediConsult
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Tabs (Screen Only) */}
          <div className="flex border-b border-white/5 gap-6 print:hidden">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: Activity },
              { id: 'refer', label: 'Refer Patient Form', icon: Send },
              { id: 'specialists', label: 'Specialist Registry', icon: Users },
              { id: 'history', label: 'Referral Archives', icon: FileText }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 px-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 relative ${
                    isActive ? 'text-blue-500 font-black' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Icon size={14} /> {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full shadow-[0_0_8px_#2563eb]"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* loading state */}
          {loading ? (
            <div className="h-64 flex items-center justify-center print:hidden">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="print:hidden">
              {/* TAB: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                      { label: 'Total Referrals', count: stats.total, color: 'from-blue-600 to-indigo-600', shadow: 'shadow-blue-500/10', icon: Activity },
                      { label: 'Pending Node Sync', count: stats.pending, color: 'from-amber-600 to-orange-600', shadow: 'shadow-amber-500/10', icon: Clock },
                      { label: 'Accepted Links', count: stats.accepted, color: 'from-emerald-600 to-teal-600', shadow: 'shadow-emerald-500/10', icon: CheckSquare },
                      { label: 'Completed Care', count: stats.completed, color: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-400/10', icon: CheckCircle },
                      { label: 'Purged Links', count: stats.cancelled, color: 'from-red-600 to-pink-600', shadow: 'shadow-red-500/10', icon: XCircle }
                    ].map((card, idx) => {
                      const Icon = card.icon;
                      return (
                        <div key={idx} className={`bg-zinc-950/80 border border-white/5 rounded-[32px] p-6 relative overflow-hidden group shadow-xl ${card.shadow}`}>
                          <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-gradient-to-br ${card.color} opacity-[0.03] group-hover:scale-110 transition-all`}></div>
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{card.label}</span>
                            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400">
                              <Icon size={16} />
                            </div>
                          </div>
                          <h2 className="text-3xl font-black text-white mt-4">{card.count}</h2>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick Dashboard View */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Recent referrals */}
                    <div className="lg:col-span-8 bg-zinc-950/80 border border-white/5 rounded-[40px] p-6 space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-black uppercase tracking-[0.25em] text-white">Recent Referral Links</h3>
                          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mt-1">Real-time coordinator updates</p>
                        </div>
                        <button onClick={() => setActiveTab('history')} className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500 hover:text-blue-400 transition-all">View All Archives</button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                              <th className="pb-3">Ref ID</th>
                              <th className="pb-3">Patient</th>
                              <th className="pb-3">Referred To</th>
                              <th className="pb-3 text-center">Priority</th>
                              <th className="pb-3 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-xs font-bold text-zinc-300">
                            {filteredReferrals.slice(0, 5).map(r => (
                              <tr key={r._id} className="group hover:bg-white/[0.01]">
                                <td className="py-4 text-blue-500 font-black">{r.referralId}</td>
                                <td className="py-4 font-black">{r.patientName}</td>
                                <td className="py-4 text-zinc-400">{r.referredDoctorName}</td>
                                <td className="py-4 text-center">
                                  <span className={`px-3 py-1 rounded-full text-[9px] uppercase font-black tracking-wider ${
                                    r.priority === 'Emergency' ? 'bg-red-500/10 text-red-500' :
                                    r.priority === 'Urgent' ? 'bg-amber-500/10 text-amber-500' :
                                    'bg-blue-500/10 text-blue-400'
                                  }`}>
                                    {r.priority}
                                  </span>
                                </td>
                                <td className="py-4 text-center">
                                  <span className={`px-3 py-1 rounded-full text-[9px] uppercase font-black tracking-wider ${
                                    r.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400' :
                                    r.status === 'Completed' ? 'bg-blue-500/10 text-blue-400' :
                                    r.status === 'Cancelled' ? 'bg-red-500/10 text-red-500' :
                                    'bg-amber-500/10 text-amber-500'
                                  }`}>
                                    {r.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                            {filteredReferrals.length === 0 && (
                              <tr>
                                <td colSpan="5" className="text-center py-8 text-zinc-500 font-bold uppercase tracking-widest text-[9px]">No pending routing operations</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Specialist Statuses Panel */}
                    <div className="lg:col-span-4 bg-zinc-950/80 border border-white/5 rounded-[40px] p-6 space-y-6">
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.25em] text-white">Active Registry Nodes</h3>
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mt-1">Available external specialists</p>
                      </div>

                      <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                        {specialists.slice(0, 4).map(doc => (
                          <div key={doc._id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-black text-white">{doc.name}</p>
                              <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mt-0.5">{doc.specialization}</p>
                              <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{doc.hospitalName}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                              doc.availabilityStatus === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {doc.availabilityStatus}
                            </span>
                          </div>
                        ))}
                        {specialists.length === 0 && (
                          <p className="text-center text-zinc-600 uppercase tracking-widest font-black text-[9px] py-12">Registry Empty</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: REFER FORM */}
              {activeTab === 'refer' && (
                <div className="max-w-4xl mx-auto bg-zinc-950/80 border border-white/5 rounded-[48px] p-8 md:p-10 space-y-8 shadow-2xl">
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Generate Referral Link</h2>
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">Create care coordination authorization nodes</p>
                  </div>

                  <form onSubmit={handleCreateReferral} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block">Select Patient *</label>
                        <select
                          value={referralForm.patientId}
                          onChange={(e) => setReferralForm({ ...referralForm, patientId: e.target.value })}
                          className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl outline-none font-bold text-xs text-white focus:border-blue-500/30 transition-all cursor-pointer"
                          required
                        >
                          <option value="" className="bg-zinc-950 text-zinc-400">-- Choose Patient --</option>
                          {patients.map(p => (
                            <option key={p.patientId} value={p.patientId} className="bg-zinc-950 text-white">
                              {p.name} ({p.patientId})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block">Select Specialist Node *</label>
                        <select
                          value={referralForm.referredDoctorId}
                          onChange={(e) => setReferralForm({ ...referralForm, referredDoctorId: e.target.value })}
                          className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl outline-none font-bold text-xs text-white focus:border-blue-500/30 transition-all cursor-pointer"
                          required
                        >
                          <option value="" className="bg-zinc-950 text-zinc-400">-- Choose Specialist --</option>
                          {specialists.map(doc => (
                            <option key={doc.doctorId} value={doc.doctorId} className="bg-zinc-950 text-white">
                              {doc.name} - {doc.specialization} ({doc.hospitalName})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block">Referral Priority *</label>
                        <div className="flex gap-4">
                          {['Normal', 'Urgent', 'Emergency'].map(lvl => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => setReferralForm({ ...referralForm, priority: lvl })}
                              className={`flex-1 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                                referralForm.priority === lvl
                                  ? lvl === 'Emergency' ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-md shadow-red-500/5' :
                                    lvl === 'Urgent' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-md shadow-amber-500/5' :
                                    'bg-blue-500/10 border-blue-500/30 text-blue-500 shadow-md shadow-blue-500/5'
                                  : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300'
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block">Primary Diagnosis</label>
                        <input
                          type="text"
                          placeholder="e.g. Hypertension node detected"
                          value={referralForm.diagnosis}
                          onChange={(e) => setReferralForm({ ...referralForm, diagnosis: e.target.value })}
                          className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl outline-none font-bold text-xs text-white focus:border-blue-500/30 transition-all placeholder:text-zinc-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block">Reason for Referral *</label>
                      <textarea
                        rows="3"
                        placeholder="Detail the clinical reason for specialist coordination..."
                        value={referralForm.referralReason}
                        onChange={(e) => setReferralForm({ ...referralForm, referralReason: e.target.value })}
                        className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl outline-none font-bold text-xs text-white focus:border-blue-500/30 transition-all placeholder:text-zinc-600 resize-none"
                        required
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block">Clinical Notes</label>
                        <textarea
                          rows="3"
                          placeholder="General symptoms, patient history telemetry..."
                          value={referralForm.notes}
                          onChange={(e) => setReferralForm({ ...referralForm, notes: e.target.value })}
                          className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl outline-none font-bold text-xs text-white focus:border-blue-500/30 transition-all placeholder:text-zinc-600 resize-none"
                        ></textarea>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block">Care Recommendations</label>
                        <textarea
                          rows="3"
                          placeholder="Recommended treatments, laboratory diagnostics..."
                          value={referralForm.recommendations}
                          onChange={(e) => setReferralForm({ ...referralForm, recommendations: e.target.value })}
                          className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl outline-none font-bold text-xs text-white focus:border-blue-500/30 transition-all placeholder:text-zinc-600 resize-none"
                        ></textarea>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-6 flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => setActiveTab('overview')}
                        className="px-6 py-3.5 rounded-2xl bg-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all active:scale-95"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3.5 rounded-2xl bg-blue-600 text-[9px] font-black uppercase tracking-widest text-white hover:bg-blue-500 shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2 active:scale-95"
                      >
                        <Send size={12} /> Dispatch Referral Link
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB: SPECIALIST REGISTRY */}
              {activeTab === 'specialists' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <div>
                      <h2 className="text-xl font-black text-white uppercase tracking-tight">Specialist Node Registry</h2>
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">Directory of external clinical referral nodes</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {specialists.map(doc => (
                      <div key={doc._id} className="bg-zinc-950/80 border border-white/5 rounded-[36px] p-6 relative overflow-hidden group shadow-lg">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-600/10 rounded-full blur-2xl group-hover:scale-120 transition-all"></div>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest px-2 py-0.5 bg-blue-500/10 rounded-md">{doc.doctorId}</span>
                            <h3 className="text-sm font-black text-white mt-2">{doc.name}</h3>
                            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-wider mt-0.5">{doc.specialization}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                            doc.availabilityStatus === 'Available' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {doc.availabilityStatus}
                          </span>
                        </div>

                        <div className="mt-6 border-t border-white/5 pt-4 space-y-2 text-[10px] font-bold text-zinc-500">
                          <p className="flex justify-between">
                            <span className="uppercase tracking-widest text-[8px] font-black text-zinc-600">Hospital:</span>
                            <span className="text-zinc-300 font-extrabold">{doc.hospitalName}</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="uppercase tracking-widest text-[8px] font-black text-zinc-600">Phone:</span>
                            <span className="text-zinc-300 font-extrabold">{doc.contactNumber}</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="uppercase tracking-widest text-[8px] font-black text-zinc-600">Email:</span>
                            <span className="text-zinc-300 font-extrabold">{doc.email}</span>
                          </p>
                          {doc.address && (
                            <p className="flex justify-between">
                              <span className="uppercase tracking-widest text-[8px] font-black text-zinc-600">Address:</span>
                              <span className="text-zinc-400 font-bold truncate max-w-[150px]">{doc.address}</span>
                            </p>
                          )}
                        </div>

                        <div className="mt-6 flex gap-3 border-t border-white/5 pt-4">
                          <button
                            onClick={() => handleEditDocClick(doc)}
                            className="flex-1 py-2 rounded-xl bg-white/5 text-[8px] font-black uppercase tracking-widest text-zinc-400 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-1"
                          >
                            <Edit2 size={10} /> Edit Node
                          </button>
                          <button
                            onClick={() => handleDeleteDoc(doc._id)}
                            className="py-2 px-3 rounded-xl bg-red-500/5 hover:bg-red-500/20 text-red-400 transition-all flex items-center justify-center"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {specialists.length === 0 && (
                      <div className="col-span-full py-16 text-center bg-zinc-950/80 border border-white/5 border-dashed rounded-[40px]">
                        <Users size={40} className="text-zinc-600 mx-auto mb-4" />
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">No referral specialist nodes registered.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: HISTORY ARCHIVES */}
              {activeTab === 'history' && (
                <div className="bg-zinc-950/80 border border-white/5 rounded-[48px] p-6 space-y-6 shadow-2xl">
                  {/* Filter Terminal */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-3xl">
                    <div className="flex-1 flex gap-3 w-full md:w-auto relative">
                      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                      <input
                        type="text"
                        placeholder="Search by Patient, ID, Doctor name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-80 pl-11 pr-5 py-3.5 bg-[#050505] border border-white/5 rounded-2xl outline-none font-bold text-xs text-white focus:border-blue-500/30 transition-all placeholder:text-zinc-600"
                      />
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Status:</span>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-400 outline-none cursor-pointer"
                        >
                          <option value="All">All Statuses</option>
                          <option value="Pending">Pending</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Priority:</span>
                        <select
                          value={priorityFilter}
                          onChange={(e) => setPriorityFilter(e.target.value)}
                          className="px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-400 outline-none cursor-pointer"
                        >
                          <option value="All">All Priorities</option>
                          <option value="Normal">Normal</option>
                          <option value="Urgent">Urgent</option>
                          <option value="Emergency">Emergency</option>
                        </select>
                      </div>

                      <button
                        onClick={handleExportCSV}
                        className="p-3 bg-zinc-900 border border-white/5 hover:border-white/20 text-zinc-400 hover:text-white rounded-xl transition-all active:scale-95"
                        title="Export to Excel"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </div>

                  {/* History Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
                          <th className="pb-4">Ref ID</th>
                          <th className="pb-4">Patient Name</th>
                          <th className="pb-4">Referred specialist</th>
                          <th className="pb-4">Priority</th>
                          <th className="pb-4">Status</th>
                          <th className="pb-4">Date Dispatch</th>
                          <th className="pb-4 text-center">Telemetry Link</th>
                          <th className="pb-4 text-right">Care Options</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs font-bold text-zinc-300">
                        {filteredReferrals.map(r => (
                          <tr key={r._id} className="group hover:bg-white/[0.01] transition-all">
                            <td className="py-5 text-blue-500 font-black">{r.referralId}</td>
                            <td className="py-5 font-black">{r.patientName} <span className="text-[9px] font-bold text-zinc-500 block">{r.patientId}</span></td>
                            <td className="py-5">{r.referredDoctorName}</td>
                            <td className="py-5">
                              <span className={`px-3 py-1 rounded-full text-[9px] uppercase font-black tracking-wider ${
                                r.priority === 'Emergency' ? 'bg-red-500/10 text-red-500' :
                                r.priority === 'Urgent' ? 'bg-amber-500/10 text-amber-500' :
                                'bg-blue-500/10 text-blue-400'
                              }`}>
                                {r.priority}
                              </span>
                            </td>
                            <td className="py-5">
                              <span className={`px-3 py-1 rounded-full text-[9px] uppercase font-black tracking-wider ${
                                r.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400 font-black' :
                                r.status === 'Completed' ? 'bg-blue-500/10 text-blue-400 font-black' :
                                r.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 font-black' :
                                'bg-amber-500/10 text-amber-500 font-black'
                              }`}>
                                {r.status}
                              </span>
                            </td>
                            <td className="py-5 text-zinc-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                            <td className="py-5 text-center">
                              <button
                                onClick={() => setSelectedReferral(r)}
                                className="text-[9px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-all border border-blue-500/20 bg-blue-500/5 px-3 py-1.5 rounded-lg"
                              >
                                View Letter
                              </button>
                            </td>
                            <td className="py-5 text-right">
                              {r.status === 'Pending' && (
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => handleUpdateStatus(r._id, 'Accepted')}
                                    className="px-2 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[9px] uppercase font-black tracking-widest"
                                    title="Accept Referral Link"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(r._id, 'Cancelled')}
                                    className="px-2 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-[9px] uppercase font-black tracking-widest"
                                    title="Purge/Cancel Link"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                              {r.status === 'Accepted' && (
                                <button
                                  onClick={() => handleUpdateStatus(r._id, 'Completed')}
                                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[9px] uppercase font-black tracking-widest"
                                >
                                  Complete Node
                                </button>
                              )}
                              {['Completed', 'Cancelled'].includes(r.status) && (
                                <span className="text-[8px] uppercase tracking-widest text-zinc-600 font-black">History Locked</span>
                              )}
                            </td>
                          </tr>
                        ))}
                        {filteredReferrals.length === 0 && (
                          <tr>
                            <td colSpan="8" className="text-center py-12 text-zinc-500 font-bold uppercase tracking-widest text-[9px]">No historical referral records logged</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Specialist Modal Dialog (Add / Edit) */}
      {showDocModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[2000] p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-white/10 max-w-lg w-full rounded-[40px] p-8 space-y-6 shadow-2xl relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/15 rounded-full blur-3xl"></div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">{editingDoc ? 'Edit Specialist profile' : 'Register Referral Specialist'}</h3>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">Configure specialist node communication details</p>
            </div>

            <form onSubmit={handleSaveDoc} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Full Name *</label>
                <input
                  type="text"
                  value={docForm.name}
                  onChange={(e) => setDocForm({ ...docForm, name: e.target.value })}
                  placeholder="Dr. Naresh Trehan"
                  className="w-full px-5 py-3.5 bg-white/5 border border-white/5 rounded-2xl outline-none font-bold text-xs text-white focus:border-blue-500/30 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Specialization *</label>
                  <input
                    type="text"
                    value={docForm.specialization}
                    onChange={(e) => setDocForm({ ...docForm, specialization: e.target.value })}
                    placeholder="Cardiovascular Surgeon"
                    className="w-full px-5 py-3.5 bg-white/5 border border-white/5 rounded-2xl outline-none font-bold text-xs text-white focus:border-blue-500/30 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Hospital/Clinic Name *</label>
                  <input
                    type="text"
                    value={docForm.hospitalName}
                    onChange={(e) => setDocForm({ ...docForm, hospitalName: e.target.value })}
                    placeholder="Medanta Hospital"
                    className="w-full px-5 py-3.5 bg-white/5 border border-white/5 rounded-2xl outline-none font-bold text-xs text-white focus:border-blue-500/30 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Contact Number *</label>
                  <input
                    type="text"
                    value={docForm.contactNumber}
                    onChange={(e) => setDocForm({ ...docForm, contactNumber: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-5 py-3.5 bg-white/5 border border-white/5 rounded-2xl outline-none font-bold text-xs text-white focus:border-blue-500/30 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Email Address *</label>
                  <input
                    type="email"
                    value={docForm.email}
                    onChange={(e) => setDocForm({ ...docForm, email: e.target.value })}
                    placeholder="naresh.trehan@medanta.org"
                    className="w-full px-5 py-3.5 bg-white/5 border border-white/5 rounded-2xl outline-none font-bold text-xs text-white focus:border-blue-500/30 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Clinic Address</label>
                <input
                  type="text"
                  value={docForm.address}
                  onChange={(e) => setDocForm({ ...docForm, address: e.target.value })}
                  placeholder="Clinical Suite 4B, Sector 38, Gurugram"
                  className="w-full px-5 py-3.5 bg-white/5 border border-white/5 rounded-2xl outline-none font-bold text-xs text-white focus:border-blue-500/30 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Node Status</label>
                <select
                  value={docForm.availabilityStatus}
                  onChange={(e) => setDocForm({ ...docForm, availabilityStatus: e.target.value })}
                  className="w-full px-5 py-3.5 bg-white/5 border border-white/5 rounded-2xl outline-none font-bold text-xs text-white focus:border-blue-500/30 transition-all cursor-pointer"
                >
                  <option value="Available" className="bg-zinc-950 text-white">Available</option>
                  <option value="Unavailable" className="bg-zinc-950 text-white">Unavailable</option>
                </select>
              </div>

              <div className="flex gap-4 border-t border-white/5 pt-6 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowDocModal(false);
                    setEditingDoc(null);
                  }}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all active:scale-95"
                >
                  Close Registry
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                >
                  {editingDoc ? 'Confirm Changes' : 'Publish Node'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Referral Letter Modal Dialog */}
      {selectedReferral && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[2000] p-4 animate-in fade-in duration-200 print:hidden">
          <div className="bg-zinc-950 border border-white/10 max-w-4xl w-full rounded-[48px] p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden text-left flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Referral Letter Console</h3>
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">Diagnostic link letterhead output</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={triggerPrint}
                  className="px-4 py-2 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 shadow-md shadow-blue-500/10 flex items-center gap-1.5 active:scale-95"
                >
                  <Printer size={12} /> Print / Download PDF
                </button>
                <button
                  onClick={() => setSelectedReferral(null)}
                  className="px-4 py-2 bg-white/5 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-all active:scale-95"
                >
                  Close Panel
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-zinc-900/50 rounded-3xl border border-white/5 space-y-8">
              {/* Simulated Paper */}
              <div className="bg-white text-zinc-800 p-8 rounded-2xl shadow-xl space-y-6 font-sans">
                <div className="border-b-2 border-zinc-200 pb-4 mb-6 flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-extrabold uppercase text-blue-600 tracking-tight">MediConsult Diagnostics</h4>
                    <p className="text-[8px] text-zinc-400 font-extrabold uppercase tracking-widest mt-0.5">Clinical Authorization Link</p>
                  </div>
                  <div className="text-right text-[10px] text-zinc-500">
                    <p className="font-bold">ID: {selectedReferral.referralId}</p>
                    <p>Priority: <span className="text-red-500 font-bold uppercase">{selectedReferral.priority}</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[10px]">
                  <div>
                    <p className="font-black text-zinc-400 uppercase text-[8px] tracking-widest">From (Referring Specialist)</p>
                    <p className="font-bold text-zinc-800 mt-1">{selectedReferral.referringDoctorName}</p>
                    <p className="text-zinc-500">MediConsult Coordinator</p>
                  </div>
                  <div>
                    <p className="font-black text-zinc-400 uppercase text-[8px] tracking-widest">To (Target Specialist)</p>
                    <p className="font-bold text-zinc-800 mt-1">{selectedReferral.referredDoctorName}</p>
                    <p className="text-zinc-500">Referral Network Node</p>
                  </div>
                </div>

                <div className="border-t border-b border-zinc-100 py-3 text-[10px] text-zinc-700 font-medium grid grid-cols-2 gap-4">
                  <p><span className="font-bold text-zinc-400 uppercase text-[8px] tracking-wider block">Patient Details</span>{selectedReferral.patientName} ({selectedReferral.patientId})</p>
                  <p><span className="font-bold text-zinc-400 uppercase text-[8px] tracking-wider block">Date Generated</span>{new Date(selectedReferral.createdAt).toLocaleString()}</p>
                </div>

                <div className="space-y-4 text-[10px] text-zinc-600 leading-relaxed">
                  <div>
                    <p className="font-bold text-zinc-800 uppercase text-[8px] tracking-wider mb-1">Diagnosis Context:</p>
                    <p>{selectedReferral.diagnosis || 'No diagnosis logged'}</p>
                  </div>
                  <div>
                    <p className="font-bold text-zinc-800 uppercase text-[8px] tracking-wider mb-1">Reason for Referral:</p>
                    <p>{selectedReferral.referralReason}</p>
                  </div>
                  {selectedReferral.notes && (
                    <div>
                      <p className="font-bold text-zinc-800 uppercase text-[8px] tracking-wider mb-1">Referring Doctor Notes:</p>
                      <p>{selectedReferral.notes}</p>
                    </div>
                  )}
                  {selectedReferral.recommendations && (
                    <div>
                      <p className="font-bold text-zinc-800 uppercase text-[8px] tracking-wider mb-1">Recommendations & Special Directives:</p>
                      <p>{selectedReferral.recommendations}</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-100 pt-4 flex justify-between items-center text-[9px] text-zinc-400">
                  <p>Electronic Signature ID: auth_node_{selectedReferral._id.slice(-6)}</p>
                  <p>MediConsult Care Link Protocol</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Referral;
