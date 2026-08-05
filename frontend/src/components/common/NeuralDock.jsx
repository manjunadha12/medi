import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Activity, Pill, MessageSquare, MessageCircle,
  FileText, Video, User as UserIcon, Calculator,
  Clock, Heart, Shield, Users, Stethoscope, Ticket, CreditCard, Layout, Clipboard,
  MoreHorizontal, X, Sparkles, Settings, Brain, FileUp, Monitor, History as HistoryIcon, Search as SearchIcon, ShieldCheck, ClipboardList
} from 'lucide-react';
import useStore from '../../store/useStore';

const NeuralDock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, theme } = useStore();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const menuItems = {
    patient: [
      { label: 'Home', icon: Home, path: '/patient/dashboard', color: 'bg-blue-500' },
      { label: 'AI Analysis', icon: Brain, path: '/patient/ai-analysis', color: 'bg-purple-600' },
      { label: 'Supplements', icon: Pill, path: '/patient/medicine-search', color: 'bg-emerald-500' },
      { label: 'AI Chat', icon: MessageSquare, path: '/patient/ai-chat', color: 'bg-indigo-600' },
      { label: 'Neural Messages', icon: MessageCircle, path: '/patient/chat', color: 'bg-blue-600' },
      { label: 'Neural Registry', icon: UserIcon, path: '/patient/find-doctor', color: 'bg-teal-600' },
      { label: 'Specialist Search', icon: SearchIcon, path: '/patient/doctor-search', color: 'bg-teal-500' },
      { label: 'Reports', icon: FileText, path: '/patient/reports/upload', color: 'bg-blue-600' },
      { label: 'Consult', icon: Video, path: '/patient/video-consult', color: 'bg-cyan-500' },
      { label: 'Cost', icon: Calculator, path: '/patient/cost-estimator', color: 'bg-amber-500' },
      { label: 'Tracker', icon: Clock, path: '/patient/medicine', color: 'bg-rose-500' },
      { label: 'Vitals', icon: Activity, path: '/patient/health', color: 'bg-blue-400' },
      { label: 'Prescriptions', icon: Clipboard, path: '/patient/prescriptions', color: 'bg-indigo-500' },
      { label: 'History', icon: HistoryIcon, path: '/patient/history', color: 'bg-slate-600' },
    ],
    doctor: [
      { label: 'Dashboard', icon: Layout, path: '/doc-dashboard', color: 'bg-blue-500' },
      { label: 'Patient Queue', icon: Clock, path: '/doctor/queue', color: 'bg-amber-500' },
      { label: 'Video Consult', icon: Video, path: '/doctor/video-consult', color: 'bg-cyan-500' },
      { label: 'AI Swarm', icon: Brain, path: '/doctor/ai-report', color: 'bg-purple-600' },
      { label: 'AI Chat', icon: MessageSquare, path: '/doctor/ai-chat', color: 'bg-indigo-600' },
      { label: 'Neural Messages', icon: MessageCircle, path: '/doctor/chat', color: 'bg-blue-600' },
      { label: 'Rx Write', icon: FileUp, path: '/doctor/prescription', color: 'bg-indigo-600' },
      { label: 'History', icon: HistoryIcon, path: '/doctor/history', color: 'bg-slate-600' },
      { label: 'Rx List', icon: Clipboard, path: '/doctor/prescriptions', color: 'bg-blue-600' },
      { label: 'Referrals', icon: Users, path: '/doctor/referral', color: 'bg-rose-500' },
      { label: 'Analytics', icon: Activity, path: '/doctor/analytics', color: 'bg-emerald-500' },
    ],
    admin: [
      { label: 'Dashboard', icon: Home, path: '/admin-dashboard', color: 'bg-blue-500' },
      { label: 'Doctors', icon: Stethoscope, path: '/admin/doctors', color: 'bg-teal-600' },
      { label: 'Dr Approval', icon: ShieldCheck, path: '/admin/approvals', color: 'bg-emerald-600' },
      { label: 'Patients', icon: Users, path: '/admin/patients', color: 'bg-indigo-600' },
      { label: 'OP Tokens', icon: Clock, path: '/admin/op-tokens', color: 'bg-amber-500' },
      { label: 'Departments', icon: Layout, path: '/admin/departments', color: 'bg-indigo-500' },
      { label: 'Emergency', icon: Shield, path: '/admin/emergency', color: 'bg-red-600' },
      { label: 'AI Monitor', icon: Monitor, path: '/admin/ai-monitoring', color: 'bg-purple-600' },
      { label: 'Billing', icon: CreditCard, path: '/admin/billing', color: 'bg-rose-500' },
      { label: 'Audit Logs', icon: FileText, path: '/admin/audit-logs', color: 'bg-slate-600' },
      { label: 'Settings', icon: Settings, path: '/admin/system-settings', color: 'bg-blue-600' },
    ]
  };

  const roleItems = (user && menuItems[user.role]) ? menuItems[user.role] : menuItems.patient;

  const getScale = (index) => {
    if (window.innerWidth < 640) return 1; // Disable magnification on mobile for better usability
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 1.5;
    if (distance === 1) return 1.25;
    if (distance === 2) return 1.1;
    return 1;
  };

  const getMargin = (index) => {
    if (window.innerWidth < 640) return '2px';
    if (hoveredIndex === null) return '4px';
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return '12px';
    if (distance === 1) return '8px';
    return '4px';
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[2000] print:hidden w-fit max-w-[95%] sm:max-w-none">
      <div className={`flex items-end gap-1 px-3 sm:px-4 py-3 sm:py-4 backdrop-blur-3xl border rounded-[32px] sm:rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-x-auto scrollbar-hide ${
        theme === 'dark' ? 'bg-zinc-950/90 border-white/10' : 'bg-white/90 border-slate-200 shadow-slate-300/50'
      }`}>
        {roleItems.map((item, i) => {
          const isActive = location.pathname === item.path;
          const scale = getScale(i);
          const margin = getMargin(i);
          const baseWidth = window.innerWidth < 640 ? 38 : 44;
          const baseHeight = window.innerWidth < 640 ? 48 : 56;

          return (
            <div
              key={i}
              className="relative flex flex-col items-center shrink-0 transition-all duration-300 ease-out"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => navigate(item.path)}
              style={{
                width: `${baseWidth * scale}px`,
                marginLeft: margin,
                marginRight: margin,
              }}
            >
              {/* Tooltip */}
              <div className={`absolute -top-14 px-3 py-1.5 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-white whitespace-nowrap pointer-events-none transition-all duration-300 ${hoveredIndex === i ? 'opacity-100 -translate-y-2' : 'opacity-0 translate-y-0'}`}>
                {item.label}
              </div>

              {/* Icon Container */}
              <div
                className={`w-full rounded-[18px] sm:rounded-[24px] flex items-center justify-center transition-all duration-300 relative overflow-hidden border ${
                  isActive
                    ? 'border-blue-400 bg-blue-500/20 shadow-[0_0_25px_rgba(37,99,235,0.4)]'
                    : 'border-white/5 bg-white/5 hover:border-white/20'
                }`}
                style={{
                  height: `${baseHeight * scale}px`,
                }}
              >
                {/* Background Color Overlay */}
                <div className={`absolute inset-0 ${item.color} transition-opacity duration-300 ${isActive ? 'opacity-40' : 'opacity-10 group-hover:opacity-30'}`}></div>

                {/* Icon */}
                <item.icon
                  size={window.innerWidth < 640 ? 18 : 20}
                  className={`relative z-10 transition-all duration-300 ${isActive ? 'text-white' : 'text-zinc-400'}`}
                  style={{ transform: `scale(${scale * 0.9})` }}
                />

                {/* Active Indicator Dot */}
                {isActive && (
                  <div className="absolute bottom-1.5 sm:bottom-2 w-1 sm:h-1.5 h-1 sm:w-1.5 rounded-full bg-white shadow-[0_0_12px_#fff]"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NeuralDock;
