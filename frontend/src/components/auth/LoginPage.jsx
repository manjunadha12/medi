import React, { useState, useEffect } from 'react';
import logoImg from '../../logo.png';
import { useNavigate, Link } from 'react-router-dom';
import api, { BACKEND_URL } from '../../utils/api';
import useStore from '../../store/useStore';
import { toast } from 'react-hot-toast';
import {
  Shield, Users, User as UserIcon, BarChart3, ArrowRight, Mail, Lock, Eye,
  EyeOff, UserPlus, Sparkles, ShieldCheck as ShieldCheckIcon, CheckCircle2, Heart, Activity,
  Globe, Headphones, Plus, ChevronRight, Stethoscope, Clipboard, Brain, Dna, Loader2
} from 'lucide-react';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider } from '../../utils/firebase';
import axios from 'axios';

const LoginPage = () => {
  const { setUser } = useStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('patient'); // 'patient' or 'staff'
  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirectProcessing, setRedirectProcessing] = useState(true);
  const [backendStatus, setBackendStatus] = useState('checking');

  // 1. Connection Heartbeat (Robust Check)
  useEffect(() => {
    const checkNode = async () => {
      try {
        const target = BACKEND_URL.endsWith('/') ? BACKEND_URL : `${BACKEND_URL}/`;
        await axios.get(target, { timeout: 8000 });
        setBackendStatus('online');
      } catch (err) {
        if (err.response) setBackendStatus('online');
        else setBackendStatus('offline');
      }
    };
    checkNode();
    const interval = setInterval(checkNode, 30000);
    return () => clearInterval(interval);
  }, []);

  // 2. Handle Google Redirect Result on Page Load
  useEffect(() => {
    const initAuth = async () => {
      // Emergency Timeout: If redirect processing takes too long, release the UI
      const emergencyTimeout = setTimeout(() => {
        if (redirectProcessing) {
          console.warn("[AUTH] Redirect Result timed out. Releasing UI node.");
          setRedirectProcessing(false);
        }
      }, 10000);

      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('[AUTH] Redirect Result Found. Synchronizing Identity...');
          const idToken = await result.user.getIdToken();
          const savedRole = localStorage.getItem('pending_google_role') || 'patient';
          await processGoogleLogin(idToken, savedRole);
        } else {
          setRedirectProcessing(false);
        }
      } catch (error) {
        console.error("Redirect Result Error:", error);
        if (error.code !== 'auth/cancelled-login-redirect') {
           toast.error(`Sync Recovery Failed: ${error.message}`);
        }
        setRedirectProcessing(false);
      } finally {
        clearTimeout(emergencyTimeout);
      }
    };
    initAuth();
  }, []);

  const processGoogleLogin = async (idToken, intendedRole) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/google', {
        idToken,
        role: intendedRole
      });

      if (data.success) {
        localStorage.setItem('mediconsult_token', data.token);
        setUser({
          name: data.name || 'Authorized User',
          role: data.role || 'patient',
          userId: data.userId || 'ID-PENDING',
          _id: data._id
        });

        toast.success(`Access Granted: Welcome, ${data.name}`);
        localStorage.removeItem('pending_google_role');

        const target = data.role === 'doctor' ? '/doc-dashboard' : (data.role === 'admin' ? '/admin-dashboard' : '/patient/dashboard');
        navigate(target, { replace: true });
      }
    } catch (error) {
      console.error("Google Server Sync Error:", error);
      toast.error(error.response?.data?.message || "Backend synchronization failed.");
      setRedirectProcessing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginId.trim() || !password.trim()) return toast.error('Enter credentials');

    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', {
        loginId,
        password,
        tab: activeTab // Send selected tab to backend for role verification
      });
      if (data.success) {
        localStorage.setItem('mediconsult_token', data.token);
        setUser({ name: data.name, role: data.role, userId: data.userId, _id: data._id });
        toast.success(`Welcome back, ${data.name}`);
        const target = data.role === 'doctor' ? '/doc-dashboard' : (data.role === 'admin' ? '/admin-dashboard' : '/patient/dashboard');
        navigate(target, { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Access Denied: Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (backendStatus !== 'online') {
       return toast.error("Backend node offline. Synchronize link first.");
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const role = activeTab === 'patient' ? 'patient' : 'doctor';

    setLoading(true);
    localStorage.setItem('pending_google_role', role);

    try {
      if (isMobile) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken();
        await processGoogleLogin(idToken, role);
      }
    } catch (error) {
      console.error("Google Auth Node Error:", error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  // Render Full Screen Loader while handling redirect
  if (redirectProcessing && !loading) {
    return (
      <div className="min-h-screen bg-[#000] flex flex-col items-center justify-center space-y-6">
         <div className="relative">
            <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full animate-pulse"></div>
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" strokeWidth={3} />
         </div>
         <p className="text-zinc-500 font-black uppercase tracking-[0.5em] text-[10px]">Verifying Neural Handshake...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#000] font-sans overflow-hidden relative">

      {/* GLOBAL BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1576091160550-2173db999c1d?q=80&w=2000&auto=format&fit=crop" alt="Hand Sync" className="w-full h-full object-cover opacity-60 mix-blend-screen scale-105" />
          <div className="absolute top-[40%] md:top-[50%] left-[50%] md:left-[55%] -translate-x-1/2 -translate-y-1/2 z-10">
             <div className="relative flex items-center justify-center">
                <div className="absolute w-20 h-20 bg-blue-500/40 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
                <Plus size={48} strokeWidth={4} className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]" />
             </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black md:bg-gradient-to-r md:from-black/60 md:to-transparent"></div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row relative z-20">
         {/* LEFT SECTION - Branding */}
         <div className="hidden md:flex flex-[1.3] p-12 lg:p-20 flex flex-col h-full w-full text-left">
             <div className="flex items-center gap-3 mb-16">
               <div className="w-12 h-12 bg-blue-600/30 border border-blue-500/50 rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"><ShieldCheckIcon size={24} /></div>
               <div className="text-left">
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">MEDI <span className="text-blue-500">CONSULT</span></h2>
                  <div className="flex items-center gap-2 mt-1">
                     <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${backendStatus === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : (backendStatus === 'offline' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-amber-500')}`}></div>
                     <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">
                        {backendStatus === 'online' ? 'Neural Link Active' : (backendStatus === 'offline' ? 'Neural Link Offline' : 'Syncing Node...')}
                     </p>
                  </div>
               </div>
             </div>

             <div className="max-w-lg space-y-10">
               <div className="space-y-6">
                 <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter uppercase">Connecting <span className="text-blue-500">Care</span>,<br /> Changing <span className="text-blue-500">Lives</span></h1>
                 <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
                 <p className="text-base font-medium text-zinc-400 max-w-sm leading-relaxed">Bridging the gap between patients and doctors with secure technology and better outcomes.</p>
               </div>
             </div>

             <div className="mt-auto">
               <div className="inline-flex items-center gap-4 p-5 px-6 bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10">
                  <div className="w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-500"><Shield size={18} /></div>
                  <div className="text-left">
                     <p className="text-[11px] font-black text-blue-400 uppercase tracking-widest">HIPAA Compliant</p>
                     <p className="text-[10px] font-bold text-zinc-500 uppercase leading-none mt-1">Your privacy and security are our top priority.</p>
                  </div>
               </div>
             </div>
         </div>

         {/* RIGHT SECTION - Login Card */}
         <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
           <div className="max-w-[420px] w-full bg-white p-8 lg:p-12 rounded-[24px] shadow-2xl flex flex-col items-center relative">

              <div className="absolute top-6 right-8 md:hidden">
                 <div className={`w-3 h-3 rounded-full animate-pulse ${backendStatus === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : (backendStatus === 'offline' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-amber-500')}`}></div>
              </div>

              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-8 border border-blue-100 shadow-inner"><Plus size={32} strokeWidth={4} /></div>
              <div className="text-center mb-10">
                 <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Welcome Back</h2>
                 <p className="text-[9px] font-black text-slate-400 mt-3 uppercase tracking-widest">Clinical Synchronization Node</p>
              </div>
              <div className="w-full flex bg-slate-50 border border-slate-100 p-1 rounded-xl mb-10">
                 <button onClick={() => setActiveTab('patient')} className={`flex-1 py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'patient' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-400 hover:text-slate-600'}`}>Patient</button>
                 <button onClick={() => setActiveTab('staff')} className={`flex-1 py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'staff' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-400 hover:text-slate-600'}`}>Operator</button>
              </div>
              <form onSubmit={handleLogin} className="w-full space-y-6">
                 <div className="space-y-1.5 text-left"><label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Identity Code</label><div className="relative group"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-blue-600 transition-colors" /><input type="text" value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder={activeTab === 'patient' ? "Email / ID" : "DOC / ADM ID"} className="w-full pl-11 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300" required /></div></div>
                 <div className="space-y-1.5 text-left"><div className="flex justify-between items-center px-1"><label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Encryption Key</label><Link to="/forgot-password" title="Recover key" className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:underline">Lost key?</Link></div><div className="relative group"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-blue-600 transition-colors" /><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300" required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
                 <button type="submit" disabled={loading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50">{loading ? 'Processing Node...' : <>Sign In <ArrowRight size={18} /></>}</button>
                 <div className="relative my-8 flex items-center justify-center"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div><span className="relative px-3 bg-white text-[9px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap">or continue with</span></div>
                 <button type="button" onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-900 hover:bg-slate-50 transition-all active:scale-[0.98]"><img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" /> Continue with Google</button>
              </form>
              <p className="mt-10 text-[11px] font-bold text-slate-400 uppercase tracking-widest">New to Medi Consult? <Link to="/register" className="text-blue-600 font-black hover:underline ml-1">Create Account</Link></p>
           </div>
         </div>
      </div>

      {/* FOOTER STATS */}
      <div className="bg-zinc-950/50 backdrop-blur-xl border-t border-white/5 py-8 px-6 lg:px-20 z-30 relative">
         <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
               { icon: ShieldCheckIcon, label: '256-bit', sub: 'Data Encryption', color: 'text-blue-500', bg: 'bg-blue-500/10' },
               { icon: Users, label: '10K+', sub: 'Happy Users', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
               { icon: Globe, label: '500+', sub: 'Hospitals', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
               { icon: Headphones, label: '24/7', sub: 'Support', color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
            ].map((s, i) => (
               <div key={i} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color} shrink-0 shadow-sm border border-white/5`}><s.icon size={20} /></div>
                  <div className="text-left"><p className="text-base font-black text-white leading-none">{s.label}</p><p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1.5">{s.sub}</p></div>
               </div>
            ))}
         </div>
      </div>

    </div>
  );
};

export default LoginPage;
