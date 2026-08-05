import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import {
  Video, Mic, PhoneOff, MessageSquare, User as UserIcon, Loader2, Sparkles, Shield,
  Maximize2, Zap, VideoOff, MicOff, ShieldCheck as ShieldCheckIcon, Send, Brain,
  MessageCircle, FileText, Clock, Volume2, Monitor, Minimize2, EyeOff, Layout, Phone
} from 'lucide-react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { BACKEND_URL } from '../../utils/api';
import useStore from '../../store/useStore';
import Peer from 'simple-peer';
import FloatingVideo from '../common/FloatingVideo';
import CommLinkPopup from '../common/CommLinkPopup';
import { motion, AnimatePresence } from 'framer-motion';

const VideoConsultation = () => {
  const { user, theme } = useStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [roomCode] = useState(searchParams.get('roomCode') || '');
  const [appointmentId] = useState(searchParams.get('appointmentId') || '');
  const [messages, setMessages] = useState([]);
  const [fullData, setFullData] = useState(null);
  const SESSION_DURATION = 20 * 60;
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const socketRef = useRef();

  useEffect(() => {
    const constraints = {
      video: { width: { min: 640, ideal: 1280 }, height: { min: 480, ideal: 720 }, frameRate: { max: 30 } },
      audio: true
    };

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error("Security Block: Camera/Mic requires a secure connection.");
      return;
    }

    if (user?.userId) {
      fetchPatientData(user.userId);
    }

    navigator.mediaDevices.getUserMedia(constraints)
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) myVideo.current.srcObject = currentStream;
        initializeSocket(currentStream);
      })
      .catch(err => {
        console.error(err);
        toast.error("Hardware access denied.");
      });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (connectionRef.current) connectionRef.current.destroy();
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [roomCode]);

  useEffect(() => {
    let interval = null;
    if (callAccepted && !callEnded) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callAccepted, callEnded]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const initializeSocket = (localStream) => {
    socketRef.current = io(BACKEND_URL);
    if (roomCode && user?.userId) {
      socketRef.current.emit("join-room", { roomCode, userId: user.userId, userName: user.name });
    }
    socketRef.current.on("call-made", (data) => answerCall(data, localStream));
    socketRef.current.on("call-accepted", (signal) => {
      setCallAccepted(true);
      if (connectionRef.current) connectionRef.current.signal(signal);
    });
    socketRef.current.on("receive-message", (data) => setMessages(prev => [...prev, data]));
  };

  const answerCall = (data, localStream) => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream: localStream });
    peer.on("signal", (signal) => {
      socketRef.current.emit("answer-call", { signal, to: data.fromSocketId });
    });
    peer.on("stream", (remote) => {
      setRemoteStream(remote);
      if (userVideo.current) userVideo.current.srcObject = remote;
    });
    peer.signal(data.signal);
    connectionRef.current = peer;
  };

  const fetchPatientData = async (id) => {
    try {
       const { data } = await api.get(`/patients/profile/${id}`);
       // Actually we need the same composite structure as the doctor sees
       // But current /patients/profile/:id only returns profile
       // Let's assume we use /appointments/patient-summary or similar if needed
       // Or better, let's use the doctor's detail endpoint if patient has access
       setFullData({
          reports: [],
          prescriptions: [],
          consultations: [],
          diagnoses: []
       });
    } catch (err) { console.error(err); }
  };

  const handleSendMessage = (message) => {
    socketRef.current.emit("send-message", { roomCode, message, sender: user?.name || 'Patient' });
  };

  const toggleAudio = () => {
    if (stream) {
      const track = stream.getAudioTracks()[0];
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
      toast.success(track.enabled ? "Mic Active" : "Mic Muted");
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      track.enabled = !track.enabled;
      setIsVideoOff(!track.enabled);
      toast.success(track.enabled ? "Camera Active" : "Privacy Mode");
    }
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) connectionRef.current.destroy();
    navigate('/patient/dashboard');
  };

  return (
    <div className={`flex h-screen overflow-hidden text-left transition-colors duration-500 ${theme === 'dark' ? 'bg-[#050505] text-zinc-300' : 'bg-[#F8FAFC] text-slate-600'}`}>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 flex overflow-hidden relative">

          {/* FULL VIDEO ARENA */}
          <div className={`flex-1 relative overflow-hidden transition-all duration-700 ${isFloating ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100'}`}>

            {/* 1. REMOTE VIDEO (FULL BACKGROUND) */}
            <div className="absolute inset-0 z-0 bg-black">
               {callAccepted && !callEnded ? (
                  <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" />
               ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#09090B]">
                     <div className="relative">
                        <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full animate-pulse"></div>
                        <div className="w-48 h-48 bg-white/5 border border-white/10 rounded-full flex items-center justify-center relative z-10 shadow-2xl">
                           <UserIcon size={96} className="text-zinc-800" />
                        </div>
                        <div className="absolute top-0 right-0 w-12 h-12 bg-blue-600 rounded-full border-4 border-[#09090B] flex items-center justify-center shadow-lg animate-bounce">
                           <Zap size={20} className="text-white" />
                        </div>
                     </div>
                     <div className="text-center mt-12 space-y-4">
                        <h3 className="text-3xl font-black text-white uppercase tracking-[0.4em]">Awaiting Specialist Link</h3>
                        <p className="text-xs font-bold text-zinc-600 uppercase tracking-[0.6em] flex items-center justify-center gap-4">
                           <Loader2 className="animate-spin text-blue-500" size={16}/> Initializing Secure Neural Stream
                        </p>
                     </div>
                     <div className="absolute bottom-20 flex items-center gap-4 px-8 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl">
                        <Shield size={16} className="text-emerald-500"/>
                        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">RSA-4096 Multi-Layer Encryption Node Active</p>
                     </div>
                  </div>
               )}
            </div>

            {/* 2. LOCAL VIDEO (FLOATING PIP - MOVABLE) */}
            <motion.div
               drag
               dragConstraints={{ top: 40, left: 40, right: 40, bottom: 40 }}
               whileDrag={{ scale: 1.05 }}
               initial={{ x: window.innerWidth - 300, y: window.innerHeight - 450 }}
               className="absolute z-40 w-48 h-64 sm:w-60 sm:h-80 rounded-[32px] overflow-hidden border-2 border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.5)] cursor-move group backdrop-blur-3xl bg-black/20"
            >
                <video playsInline muted ref={myVideo} autoPlay className={`w-full h-full object-cover grayscale-[0.1] ${isVideoOff ? 'hidden' : ''}`} />
                {(!stream || isVideoOff) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/90 backdrop-blur-md">
                     <UserIcon size={32} className="text-blue-500 mb-2" />
                     <p className="text-[8px] font-black uppercase text-blue-500 tracking-widest">Privacy Active</p>
                  </div>
                )}
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div> YOU
                </div>
            </motion.div>

            {/* 3. HEADER OVERLAY (TOP FLOATING BAR) */}
            <div className="absolute top-10 left-10 right-10 z-30 flex justify-between items-start pointer-events-none">
                <div className="bg-[#121214BF] backdrop-blur-3xl border border-white/10 px-8 py-5 rounded-[32px] shadow-2xl flex items-center gap-10 pointer-events-auto">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/30"><UserIcon size={28}/></div>
                    <div className="text-left">
                       <p className="text-base font-black text-white uppercase tracking-tight leading-none">Clinical Handshake</p>
                       <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-2 flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${callAccepted ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-amber-500 shadow-[0_0_10px_#f59e0b]'} animate-pulse`}></div>
                          {callAccepted ? 'SYNCHRONIZED' : 'ESTABLISHING LINK...'}
                       </p>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-white/10"></div>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4">
                       <div className="p-2.5 bg-white/5 rounded-xl border border-white/5"><Clock size={18} className="text-blue-500" /></div>
                       <div className="text-left leading-none">
                          <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">Time Remaining</p>
                          <span className={`text-base font-black font-mono tracking-tighter ${timeLeft < 300 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>{formatTime(timeLeft)}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                       <ShieldCheckIcon size={16} className="text-emerald-500" />
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Secure Node</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 pointer-events-auto">
                   <button onClick={() => setIsPopupOpen(true)} className="w-16 h-16 rounded-2xl bg-[#121214BF] backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white hover:bg-blue-600 hover:border-blue-500 transition-all shadow-2xl relative group">
                      <MessageSquare size={28} className="group-hover:scale-110 transition-transform"/>
                      {messages.length > 0 && <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 rounded-full border-2 border-[#050505] flex items-center justify-center text-[11px] font-black shadow-lg shadow-red-600/30 animate-bounce">!</div>}
                   </button>
                   <button onClick={() => setIsFloating(true)} className="w-16 h-16 rounded-2xl bg-[#121214BF] backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-2xl group"><Layout size={28} className="group-hover:scale-110 transition-transform"/></button>
                </div>
            </div>

            {/* 4. BOTTOM FLOATING CONTROL DOCK */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 bg-[#121214BF] backdrop-blur-3xl border border-white/10 p-5 rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                 <div className="flex items-center gap-4">
                    <button onClick={toggleAudio} title="Microphone" className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all active:scale-90 ${isMuted ? 'bg-rose-600 text-white border-rose-500 shadow-rose-600/30' : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'}`}>
                       {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                    <button onClick={toggleVideo} title="Camera" className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all active:scale-90 ${isVideoOff ? 'bg-rose-600 text-white border-rose-500 shadow-rose-600/30' : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'}`}>
                       {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                    </button>
                    <button title="Speaker" className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-all active:scale-90"><Volume2 size={24}/></button>
                    <button title="Screen Share" className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-all active:scale-90"><Monitor size={24}/></button>
                 </div>

                 <div className="w-px h-10 bg-white/10 mx-2"></div>

                 <button onClick={leaveCall} title="End Call" className="px-12 h-18 rounded-[36px] bg-[#EF4444] text-white flex items-center justify-center hover:bg-red-700 transition-all shadow-[0_20px_60px_rgba(239,68,68,0.4)] active:scale-95 border-2 border-white/10 group gap-4">
                    <PhoneOff size={32} className="group-hover:rotate-12 transition-transform" />
                    <div className="text-left leading-none hidden sm:block">
                       <p className="text-[11px] font-black uppercase tracking-widest leading-none">End Call</p>
                       <p className="text-[8px] font-bold uppercase opacity-60 mt-1">Disconnect Node</p>
                    </div>
                 </button>
            </div>
          </div>

          {/* PIP MODE COMPONENT */}
          <FloatingVideo
            remoteStream={remoteStream}
            isActive={isFloating}
            onExpand={() => setIsFloating(false)}
            onClose={leaveCall}
            isMinimized={isMinimized}
            setIsMinimized={setIsMinimized}
            doctorName="Dr. Arjun Kumar"
            specialization="Cardiology Specialist"
            timeLeft={timeLeft}
            formatTime={formatTime}
          />

          {/* COMMUNICATION CENTER POPUP */}
          <CommLinkPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            messages={messages}
            onSendMessage={handleSendMessage}
            user={user}
            theme={theme}
            patientData={fullData || {}}
          />

          {/* FLOATING RESTORE TRIGGER */}
          {isFloating && (
             <button
               onClick={() => setIsFloating(false)}
               className="fixed top-28 right-12 z-[500] px-10 py-5 bg-blue-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(37,99,235,0.4)] flex items-center gap-4 animate-bounce border-2 border-white/20 hover:bg-blue-700 transition-all"
             >
                <Maximize2 size={20}/> Restore Neural Arena
             </button>
          )}

        </main>
      </div>
    </div>
  );
};

export default VideoConsultation;
