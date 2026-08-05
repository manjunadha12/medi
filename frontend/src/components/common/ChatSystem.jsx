import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import {
  Search as SearchIcon, MessageCircle, MoreVertical, Phone, Video, Send,
  Paperclip, Mic, Image as ImageIcon, FileText, X, ChevronLeft,
  Check, CheckCheck, Smile, Star, Pin, Trash2, Reply, Forward,
  Clock, User as UserIcon, Stethoscope, Loader2, Pill, Activity, Shield, Info, Download, Camera, Brain
} from 'lucide-react';
import useStore from '../../store/useStore';
import api, { BACKEND_URL } from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';

const ChatSystem = () => {
  const { user, theme } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [socket, setSocket] = useState(null);
  const [typing, setTyping] = useState(false);
  const [receiverTyping, setReceiverTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Initialize Socket
  useEffect(() => {
    const newSocket = io(BACKEND_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('register-user', user?.userId || user?._id);
    });

    newSocket.on('new-chat-message', (message) => {
      if (activeConversation && message.conversationId === activeConversation._id) {
        setMessages(prev => [...prev, message]);
        // Auto scroll if near bottom
        scrollToBottom();
      }
      fetchConversations(); // Refresh list to update last message
    });

    newSocket.on('user-typing', ({ conversationId, isTyping }) => {
      if (activeConversation && conversationId === activeConversation._id) {
        setReceiverTyping(isTyping);
      }
    });

    return () => newSocket.close();
  }, [user, activeConversation]);

  useEffect(() => {
    fetchConversations();
    // Handle starting a chat from an external link (e.g. appointment list)
    if (location.state?.startChat) {
      handleStartChat(location.state.targetUserId, location.state.appointmentId);
    }
  }, []);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation._id);
      if (window.innerWidth < 1024) setSidebarOpen(false);
    }
  }, [activeConversation]);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/chat/conversations');
      setConversations(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load conversations");
    }
  };

  const fetchMessages = async (id) => {
    try {
      const res = await api.get(`/chat/messages/${id}`);
      setMessages(res.data);
      scrollToBottom();
      // Mark as read
      await api.put(`/chat/read/${id}`);
    } catch (err) {
      toast.error("Failed to load messages");
    }
  };

  const handleStartChat = async (targetUserId, appointmentId) => {
    try {
      const res = await api.post('/chat/start', { targetUserId, appointmentId });
      setActiveConversation(res.data);
      fetchConversations();
    } catch (err) {
      toast.error("Error establishing link");
    }
  };

  const handleDeleteConversation = async (conv) => {
    const isPotential = conv._id.startsWith('temp_');
    const id = isPotential ? conv.appointmentId : conv._id;

    if (!window.confirm("Disconnect this neural link? This node will be purged from your active registry.")) return;

    try {
      if (isPotential) {
        // For potential chats, we "dismiss" the appointment from chat view
        await api.put(`/chat/dismiss-potential/${id}`);
      } else {
        // For real conversations, we delete the conversation record
        await api.delete(`/chat/conversation/${id}`);
      }

      if (activeConversation?._id === conv._id) setActiveConversation(null);
      toast.success("Node Purged");
      fetchConversations();
    } catch (err) {
      toast.error("Failed to purge node");
    }
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || !activeConversation) return;

    const myMongoId = user?._id?.toString();
    const myHumanId = user?.userId?.toString();
    const receiver = activeConversation.participants.find(p =>
      p.userId?.toString() !== myMongoId && p.humanId?.toString() !== myHumanId
    );

    const messageData = {
      conversationId: activeConversation._id,
      text: input,
      type: 'text',
      receiverId: receiver.userId
    };

    try {
      setSending(true);
      const res = await api.post('/chat/send', messageData);
      setMessages(prev => [...prev, res.data]);
      setInput('');
      scrollToBottom();

      // Emit via socket
      socket.emit('chat-message', { ...res.data, receiverId: receiver.userId });
      fetchConversations();
    } catch (err) {
      toast.error("Message delivery failed");
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const getPartner = (conv) => {
    if (!conv) return {};
    const myMongoId = user?._id?.toString();
    const myHumanId = user?.userId?.toString();
    return conv.participants.find(p =>
      p.userId?.toString() !== myMongoId && p.humanId?.toString() !== myHumanId
    ) || conv.participants[0] || {};
  };

  const filteredConversations = conversations.filter(c => {
    const partner = getPartner(c);
    return partner.name?.toLowerCase().includes(search.toLowerCase()) ||
           partner.humanId?.toLowerCase().includes(search.toLowerCase());
  });

  const handleSelectConversation = async (conv) => {
    setActiveConversation(conv); // Always set as active so we can show the "Locked" UI

    if (conv.isLocked) {
      if (user.role === 'doctor') {
        const confirmAccept = window.confirm("Establish bidirectional link with this patient node?");
        if (confirmAccept) {
          try {
            await api.put(`/appointments/accept/${conv.appointmentId}`);
            toast.success("Clinical Link Authorized");
            fetchConversations();
          } catch (err) {
            toast.error("Authorization failed");
          }
        }
      }
      return;
    }

    if (conv.isPotential) {
      const partner = getPartner(conv);
      handleStartChat(partner.userId || partner.humanId, conv.appointmentId);
    }
  };

  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-[#050505] text-zinc-300' : 'bg-[#F8FAFC] text-slate-600'}`}>
      <Navbar />

      <div className="flex-1 flex overflow-hidden relative">

        {/* SIDEBAR */}
        <div className={`fixed inset-y-0 left-0 z-40 w-full sm:w-80 lg:relative lg:translate-x-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${theme === 'dark' ? 'bg-zinc-950 border-r border-white/5' : 'bg-white border-r border-slate-200'} flex flex-col pt-16 lg:pt-0`}>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Neural Messages</h2>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-white/5 rounded-xl"><X size={20}/></button>
            </div>

            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5 focus-within:border-blue-500/50' : 'bg-slate-50 border-slate-100 focus-within:border-blue-500/50'}`}>
              <SearchIcon size={18} className="text-zinc-500" />
              <input
                type="text"
                placeholder="SEARCH REGISTRY..."
                className="bg-transparent border-none outline-none text-xs font-bold w-full uppercase tracking-widest placeholder:text-zinc-600"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1">
            {loading ? (
               <div className="flex flex-col items-center py-20 gap-4 opacity-30">
                  <Loader2 className="animate-spin" size={32} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Loading Nodes...</p>
               </div>
            ) : filteredConversations.length > 0 ? filteredConversations.map(conv => {
              const partner = getPartner(conv);
              const isActive = activeConversation?._id === conv._id;
              return (
                <div
                  key={conv._id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`p-4 rounded-[28px] cursor-pointer transition-all flex items-center gap-4 group relative ${isActive ? (theme === 'dark' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/30' : 'bg-blue-50 text-blue-700') : (theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50')} ${conv.isLocked ? 'opacity-60' : ''}`}
                >
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-lg font-black uppercase ${isActive ? 'border-white/20 bg-white/10' : conv.isLocked ? 'border-zinc-700 bg-zinc-900/50 text-zinc-600' : conv.isPotential ? 'border-amber-500/30 bg-amber-500/5 text-amber-500' : 'border-white/5 bg-zinc-900 text-blue-500'}`}>
                      {conv.isLocked ? <Shield size={20} /> : partner.name?.charAt(0)}
                    </div>
                    {!conv.isPotential && !conv.isLocked && <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${theme === 'dark' ? 'border-zinc-950' : 'border-white'} bg-emerald-500 shadow-lg`}></div>}
                  </div>
                  <div className="flex-1 overflow-hidden text-left">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className={`font-black text-xs uppercase tracking-tight truncate ${isActive ? 'text-white' : (theme === 'dark' ? 'text-zinc-200' : 'text-slate-800')}`}>{partner.name}</p>
                      <span className={`text-[8px] font-black uppercase ${isActive ? 'text-blue-100' : 'text-zinc-500'}`}>
                        {conv.lastMessage?.timestamp ? new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className={`text-[10px] font-bold truncate uppercase tracking-tighter ${isActive ? 'text-blue-50' : (conv.isLocked ? 'text-zinc-600' : conv.isPotential ? 'text-amber-500/70' : 'text-zinc-500')}`}>
                      {partner.humanId} • {conv.lastMessage?.text || 'Node Link Synchronized'}
                    </p>
                  </div>

                  {/* Delete Option */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(conv);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 rounded-full text-zinc-600 hover:text-red-500 transition-all shrink-0"
                    title="Dismiss Link"
                  >
                    <Trash2 size={14} />
                  </button>

                  {conv.unreadCount?.[user?.userId || user?._id] > 0 && (
                    <div className="absolute right-4 bottom-4 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      {conv.unreadCount[user?.userId || user?._id]}
                    </div>
                  )}
                </div>
              )
            }) : (
              <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4">
                 <MessageCircle size={48} />
                 <p className="text-[10px] font-black uppercase tracking-widest px-10 leading-relaxed">
                   {search ? `No node matching "${search}" in your authorized registry.` : "No active neural links found in registry."}
                 </p>
                 {search && (
                   <button
                     onClick={() => navigate('/patient/find-doctor')}
                     className="mt-4 px-6 py-2 bg-blue-600/20 text-blue-400 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all opacity-100"
                   >
                     Establish New Link
                   </button>
                 )}
              </div>
            )}
          </div>
        </div>

        {/* CHAT MAIN WINDOW */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-center bg-no-repeat bg-contain">
          {activeConversation ? (
            <>
              {/* HEADER */}
              <div className={`p-4 sm:p-6 border-b flex items-center justify-between z-30 transition-all ${theme === 'dark' ? 'bg-[#0A0A0A]/90 backdrop-blur-3xl border-white/5' : 'bg-white/90 backdrop-blur-3xl border-slate-200'}`}>
                <div className="flex items-center gap-4 text-left">
                  <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-zinc-500 hover:text-white transition-all"><ChevronLeft size={24}/></button>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-black shrink-0 shadow-inner">
                    {activeConversation.isLocked ? <Shield size={20} /> : getPartner(activeConversation).name?.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className={`text-sm sm:text-base font-black uppercase tracking-tight truncate ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                      {getPartner(activeConversation).name}
                    </h3>
                    <p className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${activeConversation.isLocked ? 'text-amber-500' : 'text-emerald-500'}`}>
                       <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${activeConversation.isLocked ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                       {activeConversation.isLocked ? 'PROTOCOL: AWAITING AUTHORIZATION' : (receiverTyping ? 'OPERATOR TYPING...' : `ID: ${getPartner(activeConversation).humanId || 'Active'} • Online`)}
                    </p>
                  </div>
                </div>

                {!activeConversation.isLocked && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button onClick={() => navigate(user.role === 'patient' ? '/patient/video-consult' : '/doctor/video-consult')} className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all shadow-sm flex items-center gap-2 ${theme === 'dark' ? 'bg-white/5 border border-white/10 text-zinc-400 hover:text-blue-400' : 'bg-slate-50 border border-slate-100 text-slate-500 hover:text-blue-600'}`}>
                      <Phone size={18} />
                    </button>
                    <button onClick={() => navigate(user.role === 'patient' ? '/patient/video-consult' : '/doctor/video-consult')} className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all shadow-sm flex items-center gap-2 ${theme === 'dark' ? 'bg-white/5 border border-white/10 text-zinc-400 hover:text-blue-400' : 'bg-slate-50 border border-slate-100 text-slate-500 hover:text-blue-600'}`}>
                      <Video size={18} />
                    </button>
                  </div>
                )}
              </div>

              {activeConversation.isLocked ? (
                <div className="flex-1 flex flex-col items-center justify-center p-10 gap-8 animate-in fade-in duration-700 bg-[#050505] neural-grid">
                   <div className="w-24 h-24 rounded-[32px] border border-amber-500/20 bg-amber-500/5 flex items-center justify-center shadow-2xl relative">
                      <div className="absolute inset-0 bg-amber-500/10 blur-2xl animate-pulse"></div>
                      <Shield size={40} className="text-amber-500 relative z-10" />
                   </div>
                   <div className="text-center space-y-4 max-w-sm">
                      <h2 className="text-xl font-black uppercase text-white tracking-tighter">Clinical Sync Pending</h2>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                        {user.role === 'doctor'
                          ? "This link is currently locked. Tap 'Accept Node' in the registry sidebar to establish the bidirectional stream."
                          : "Your specialist has not yet authorized this neural link. Access will be granted once the appointment node is accepted."}
                      </p>
                   </div>
                   {user.role === 'doctor' && (
                     <button
                       onClick={() => handleSelectConversation(activeConversation)}
                       className="px-8 py-4 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-emerald-500 transition-all active:scale-95"
                     >
                       Authorize Link Now
                     </button>
                   )}
                </div>
              ) : (
                <>
                  {/* MESSAGES */}
                  <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 custom-scrollbar scroll-smooth">
                    {messages.map((msg, i) => {
                      const isMe = msg.senderId === (user?.userId || user?._id);
                      const showDate = i === 0 || new Date(msg.createdAt).toDateString() !== new Date(messages[i-1].createdAt).toDateString();

                      return (
                        <React.Fragment key={msg._id}>
                          {showDate && (
                            <div className="flex justify-center my-10">
                              <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'bg-white/5 text-zinc-500 border border-white/5' : 'bg-slate-100 text-slate-400'}`}>
                                {new Date(msg.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              </span>
                            </div>
                          )}

                          <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`flex gap-4 max-w-[85%] sm:max-w-[70%] items-end ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                              {!isMe && (
                                <div className={`w-8 h-8 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-blue-500 font-black text-[10px] shrink-0 shadow-lg hidden sm:flex`}>
                                   {getPartner(activeConversation).name?.charAt(0)}
                                </div>
                              )}
                              <div className="space-y-2">
                                 <div className={`p-5 sm:p-6 rounded-[32px] shadow-2xl relative overflow-hidden transition-all hover:scale-[1.01] ${
                                   isMe
                                     ? 'bg-blue-600 text-white rounded-br-none border border-blue-400/20'
                                     : (theme === 'dark' ? 'bg-zinc-950 border border-white/5 text-zinc-300 rounded-bl-none' : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none')
                                 }`}>
                                   {/* Message Content */}
                                   <p className="text-xs sm:text-sm font-bold leading-relaxed text-left">{msg.text}</p>

                                   {/* Status Indicators */}
                                   <div className={`mt-2 flex items-center justify-end gap-1.5 text-[8px] font-black uppercase tracking-widest ${isMe ? 'text-blue-100/60' : 'text-zinc-500'}`}>
                                     {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                     {isMe && (
                                       msg.status === 'read' ? <CheckCheck size={10} className="text-blue-100" /> : <Check size={10} />
                                     )}
                                   </div>
                                 </div>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* INPUT AREA */}
                  <div className={`p-4 sm:p-8 pt-0 z-40 bg-gradient-to-t ${theme === 'dark' ? 'from-[#050505] via-[#050505]/95' : 'from-[#F8FAFC] via-[#F8FAFC]/95'} to-transparent`}>
                    <div className="max-w-6xl mx-auto flex flex-col gap-4">

                      {/* Doctor Quick Tools */}
                      {user.role === 'doctor' && (
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                           {[
                             { label: 'Prescription', icon: Pill, color: 'text-blue-400', path: '/doctor/prescription' },
                             { label: 'Lab Report', icon: FileText, color: 'text-purple-400' },
                             { label: 'Follow-up', icon: Clock, color: 'text-amber-400' },
                           ].map((tool, i) => (
                             <button key={i} className="shrink-0 px-4 py-2 bg-white/5 border border-white/5 rounded-full flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-white/20 transition-all">
                                <tool.icon size={12} className={tool.color} /> {tool.label}
                             </button>
                           ))}
                        </div>
                      )}

                      <form onSubmit={handleSend} className={`p-3 rounded-[32px] shadow-2xl border flex items-center gap-3 transition-all duration-500 ${theme === 'dark' ? 'bg-[#0A0A0A] border-white/5 focus-within:border-blue-500/50' : 'bg-white border-slate-200 focus-within:border-blue-600/30'}`}>
                        <div className="flex gap-1 sm:gap-2">
                           <button type="button" className={`p-3 rounded-2xl transition-all ${theme === 'dark' ? 'text-zinc-500 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-50'}`}><Paperclip size={20}/></button>
                           <button type="button" className={`p-3 rounded-2xl transition-all ${theme === 'dark' ? 'text-zinc-500 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-50'}`}><Smile size={20}/></button>
                           <button type="button" className={`p-3 rounded-2xl transition-all hidden sm:block ${theme === 'dark' ? 'text-zinc-500 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-50'}`}><Camera size={20}/></button>
                        </div>

                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder={user.role === 'doctor' ? "PROVIDE CLINICAL INSTRUCTION..." : "DESCRIBE BIOMETRIC ANOMALY..."}
                          className={`flex-1 bg-transparent border-none outline-none py-4 px-2 text-xs sm:text-sm font-bold placeholder:opacity-50 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}
                        />

                        <div className="flex items-center gap-2 px-2">
                           {!input.trim() ? (
                             <button type="button" className="w-14 h-14 rounded-[24px] bg-white/5 border border-white/5 text-zinc-500 flex items-center justify-center hover:text-blue-500 transition-all"><Mic size={22}/></button>
                           ) : (
                             <button
                               type="submit"
                               disabled={sending}
                               className="w-14 h-14 rounded-[24px] bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-xl shadow-blue-500/30 transition-all active:scale-90"
                             >
                               {sending ? <Loader2 className="animate-spin" size={20}/> : <Send size={20}/>}
                             </button>
                           )}
                        </div>
                      </form>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 gap-8 animate-in fade-in duration-700">
               <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-[56px] border flex items-center justify-center shadow-2xl relative ${theme === 'dark' ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-slate-100'}`}>
                  <div className="absolute inset-0 bg-blue-600/10 blur-3xl animate-pulse"></div>
                  <MessageCircle size={64} className="text-blue-500 relative z-10" />
               </div>
               <div className="text-center space-y-4 max-w-sm">
                  <h2 className={`text-2xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Select a Neural Stream</h2>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                     Establish a bidirectional clinical link with your assigned specialist to begin synchronization.
                  </p>
               </div>
               <button onClick={() => setSidebarOpen(true)} className="lg:hidden px-8 py-4 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl">Open Registry</button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
      `}</style>
    </div>
  );
};

export default ChatSystem;
