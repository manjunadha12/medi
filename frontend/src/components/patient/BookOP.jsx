import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import NeuralDock from '../common/NeuralDock';
import useStore from '../../store/useStore';
import api from '../../utils/api';
import { Calendar, Clock, CreditCard, ChevronRight, User as UserIcon, MapPin, Loader2, Sparkles, ShieldCheck as ShieldCheckIcon, Ticket } from 'lucide-react';
import { toast } from 'react-hot-toast';

const BookOP = () => {
  const { user, theme } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(location.state?.doctor || null);

  const [appointment, setAppointment] = useState({
    date: new Date().toISOString().split('T')[0],
    timeSlot: '09:00 AM',
    paymentMethod: 'Razorpay'
  });

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) return toast.error("Specialist node required");

    setLoading(true);
    try {
      const { data } = await api.post('/appointments/book', {
        patientId: user.userId,
        doctorId: selectedDoctor.id,
        date: appointment.date,
        time: appointment.timeSlot,
        department: selectedDoctor.specialization,
        fee: selectedDoctor.fee,
        paymentMethod: appointment.paymentMethod,
        problemDescription: "Routine Checkup" // Added fallback
      });

      if (appointment.paymentMethod === 'Razorpay' && data.razorpayOrderId) {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_id',
          amount: selectedDoctor.fee * 100,
          currency: "INR",
          name: "Medi Consult",
          description: `Consultation with ${selectedDoctor.name}`,
          order_id: data.razorpayOrderId,
          handler: async (response) => {
            try {
              await api.post('/appointments/verify-razorpay', {
                ...response,
                appointmentId: data.appointment.appointmentId
              });
              toast.success("Payment Verified & Slot Synchronized!");
              navigate('/patient/dashboard');
            } catch (err) {
              toast.error("Payment verification failed");
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: { color: "#2563eb" },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.success("Clinical Slot Synchronized!");
        navigate('/patient/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Node synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedDoctor) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-[#F8FAFC] text-slate-800'}`}>
        <div className="text-center space-y-6">
           <UserIcon size={64} className="mx-auto opacity-20" />
           <p className="font-black uppercase tracking-widest text-xs">No Specialist Node Selected</p>
           <button onClick={() => navigate('/patient/find-doctor')} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Back to Registry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-[#050505] text-slate-300' : 'bg-[#F8FAFC] text-slate-600'} text-left`}>
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />
        <main className="p-8 lg:p-10 pb-32 overflow-y-auto custom-scrollbar">
          <header className="mb-10 text-left">
            <h1 className={`text-3xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Slot Synchronization</h1>
            <p className="text-zinc-500 uppercase text-[10px] font-black tracking-widest mt-1">Reserve Neural Time Window</p>
          </header>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* SPECIALIST NODE */}
            <div className="lg:col-span-4 space-y-8">
               <div className={`p-8 rounded-[48px] border shadow-2xl relative overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-slate-100'}`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                  <div className="flex flex-col items-center text-center mb-8 relative z-10">
                    <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center text-white text-4xl font-black shadow-2xl mb-6">
                      {selectedDoctor.name.charAt(0)}
                    </div>
                    <h3 className={`text-xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{selectedDoctor.name}</h3>
                    <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{selectedDoctor.specialization}</p>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-white/5">
                     <div className="flex items-center gap-4 text-left">
                        <MapPin size={16} className="text-rose-500 shrink-0" />
                        <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500">{selectedDoctor.hospital}, {selectedDoctor.city}</p>
                     </div>
                     <div className="flex items-center gap-4 text-left">
                        <CreditCard size={16} className="text-blue-500 shrink-0" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Fee: <span className={theme === 'dark' ? 'text-white' : 'text-slate-800'}>₹{selectedDoctor.fee}</span></p>
                     </div>
                  </div>
               </div>

               <div className={`p-8 rounded-[40px] border flex gap-5 text-left transition-all ${theme === 'dark' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-50 border-emerald-100'}`}>
                  <ShieldCheckIcon className="text-emerald-500 shrink-0" size={24} />
                  <p className="text-[10px] font-bold text-emerald-600 leading-relaxed uppercase tracking-wide">
                     Your clinical connection is end-to-end encrypted using RSA-4096 protocols.
                  </p>
               </div>
            </div>

            {/* BOOKING FORM */}
            <div className="lg:col-span-8">
              <form onSubmit={handleBooking} className={`p-10 rounded-[56px] border shadow-2xl transition-all duration-500 ${theme === 'dark' ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-slate-100'}`}>
                 <div className="space-y-10">

                    {/* Date Sync */}
                    <div className="space-y-6 text-left">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 flex items-center gap-3">
                          <Calendar size={16} /> Select Date Node
                       </h3>
                       <input
                         type="date"
                         required
                         min={new Date().toISOString().split('T')[0]}
                         className={`w-full p-6 rounded-3xl font-black text-sm outline-none transition-all ${theme === 'dark' ? 'bg-zinc-900 border border-white/5 text-white focus:border-blue-500' : 'bg-slate-50 border border-slate-100 text-slate-800 shadow-inner'}`}
                         value={appointment.date}
                         onChange={(e) => setAppointment({...appointment, date: e.target.value})}
                       />
                    </div>

                    {/* Time Loop */}
                    <div className="space-y-6 text-left">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 flex items-center gap-3">
                          <Clock size={16} /> Temporal Window
                       </h3>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setAppointment({...appointment, timeSlot: slot})}
                              className={`py-4 rounded-2xl text-[10px] font-black uppercase transition-all border ${
                                appointment.timeSlot === slot
                                ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/20'
                                : (theme === 'dark' ? 'bg-zinc-900 border-white/5 text-zinc-500 hover:text-white' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100')
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                       </div>
                    </div>

                    {/* Payment Hub */}
                    <div className="space-y-6 text-left">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-3">
                          <CreditCard size={16} /> Liability Settlement
                       </h3>
                       <div className="flex gap-4">
                          {['UPI', 'Card', 'PayPal', 'Wallet'].map(method => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setAppointment({...appointment, paymentMethod: method})}
                              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase transition-all border ${
                                appointment.paymentMethod === method
                                ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-500/20'
                                : (theme === 'dark' ? 'bg-zinc-900 border-white/5 text-zinc-500 hover:text-white' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100')
                              }`}
                            >
                              {method}
                            </button>
                          ))}
                       </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-6 rounded-[32px] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-blue-600/40 hover:bg-blue-700 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30 mt-8"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <Ticket size={20} />}
                      {appointment.paymentMethod === 'Razorpay' ? 'Initialize Pay & Book' : 'Initialize Booking Sequence'}
                    </button>
                 </div>
              </form>
            </div>
          </div>
        </main>
        <NeuralDock />
      </div>
    </div>
  );
};

export default BookOP;
