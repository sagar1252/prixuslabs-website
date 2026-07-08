import { useState } from 'react';
import FadeIn from '../components/FadeIn';
import { Calendar, Clock, Video, ChevronLeft, ChevronRight, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ContactSection() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Calendar Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

  // Mock available slots for the right panel
  const availableSlots = ["10:00 am", "11:30 am", "01:00 pm", "02:30 pm", "03:30 pm", "04:00 pm", "04:30 pm", "05:00 pm"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(year, month, day);
    // Don't allow past dates
    if (newDate < new Date(new Date().setHours(0,0,0,0))) return;
    setSelectedDate(newDate);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const formattedDate = selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) : '';
    const bookingSlot = `${formattedDate} at ${selectedTime}`;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, bookingSlot })
      });

      if (response.ok) {
        setStatus('success');
        setStep(3);
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="bg-[#f8fafc] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        <FadeIn className="text-center mb-12">
          <h2 className="text-[#0C0C0C] font-black uppercase tracking-tight" style={{ fontSize: 'clamp(2rem, 5vw, 50px)' }}>
            Schedule a Session
          </h2>
          <p className="text-gray-500 font-medium mt-3 text-lg">Pick a time that works for you.</p>
        </FadeIn>

        <FadeIn delay={0.2} className="w-full">
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col md:flex-row overflow-hidden min-h-[600px]">
            
            {/* Left Panel: Meeting Details */}
            <div className="w-full md:w-[35%] lg:w-[30%] bg-white p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col">
              <div className="w-16 h-16 bg-[#0C0C0C] rounded-full flex items-center justify-center mb-6">
                <img src="/logo.png" alt="Logo" className="h-8 invert brightness-0" />
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Prixuslabs</p>
              <h3 className="text-2xl font-black text-[#0C0C0C] mb-8 leading-tight">Strategy Session</h3>
              
              <div className="flex flex-col gap-5 mt-auto md:mt-0">
                <div className="flex items-center gap-4 text-gray-600 font-medium">
                  <Clock className="w-5 h-5" />
                  <span>30 min</span>
                </div>
                <div className="flex items-center gap-4 text-gray-600 font-medium">
                  <Video className="w-5 h-5" />
                  <span>Google Meet</span>
                </div>
                <div className="flex items-center gap-4 text-[#25D366] font-medium">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-gray-600">9022989386 (WhatsApp)</span>
                </div>
                {selectedDate && selectedTime && (
                  <div className="flex items-center gap-4 text-[#0C0C0C] font-bold mt-4 p-4 bg-gray-50 rounded-xl">
                    <Calendar className="w-5 h-5" />
                    <div className="flex flex-col">
                      <span>{selectedTime}</span>
                      <span className="text-sm text-gray-500 font-medium">
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Middle & Right Panels: Dynamic Content based on Step */}
            <div className="w-full md:w-[65%] lg:w-[70%] flex flex-col lg:flex-row bg-white relative">
              
              {/* STEP 1: Date & Time Picker */}
              {step === 1 && (
                <>
                  {/* Center Panel: Calendar */}
                  <div className={`w-full ${selectedDate ? 'lg:w-[60%]' : 'lg:w-full'} p-8 md:p-10 transition-all duration-300`}>
                    <h4 className="text-center font-bold text-[#0C0C0C] uppercase tracking-widest mb-8 text-lg">
                      Select Date
                    </h4>
                    
                    <div className="flex items-center justify-between mb-8 px-4">
                      <button onClick={handlePrevMonth} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="font-bold text-[#0C0C0C] text-lg">
                        {monthNames[month]} {year}
                      </span>
                      <button onClick={handleNextMonth} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-y-4 mb-4">
                      {dayNames.map(day => (
                        <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                          {day}
                        </div>
                      ))}
                      
                      {/* Empty cells for first day offset */}
                      {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                      
                      {/* Days */}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateObj = new Date(year, month, day);
                        const isPast = dateObj < new Date(new Date().setHours(0,0,0,0));
                        const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === month && selectedDate?.getFullYear() === year;
                        
                        return (
                          <div key={day} className="flex justify-center">
                            <button
                              onClick={() => handleDateClick(day)}
                              disabled={isPast}
                              className={`
                                w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all
                                ${isPast ? 'text-gray-300 cursor-not-allowed' : 'text-[#0C0C0C] hover:bg-gray-100 cursor-pointer'}
                                ${isSelected ? '!bg-[#0C0C0C] !text-white' : ''}
                              `}
                            >
                              {day}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Panel: Time Slots */}
                  {selectedDate && (
                    <div className="w-full lg:w-[40%] bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-100 p-8 md:p-10 overflow-y-auto max-h-[600px] animate-in fade-in slide-in-from-right-4 duration-300">
                      <p className="text-center font-bold text-[#0C0C0C] mb-6">
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'short' })}
                      </p>
                      <div className="flex flex-col gap-3">
                        {availableSlots.map(time => (
                          <button
                            key={time}
                            onClick={() => handleTimeClick(time)}
                            className="w-full py-4 border border-[#0C0C0C]/20 rounded-xl text-[#0C0C0C] font-bold hover:border-[#0C0C0C] hover:border-2 transition-all"
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: Details Form */}
              {step === 2 && (
                <div className="w-full p-8 md:p-12 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => setStep(1)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <ChevronLeft className="w-5 h-5 text-[#0C0C0C]" />
                    </button>
                    <h4 className="text-2xl font-black text-[#0C0C0C]">Enter Details</h4>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-sm font-bold text-gray-700 uppercase tracking-wider">Name *</label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-[#0C0C0C] focus:outline-none focus:border-[#0C0C0C] transition-colors"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex-1 flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-bold text-gray-700 uppercase tracking-wider">Email *</label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-[#0C0C0C] focus:outline-none focus:border-[#0C0C0C] transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <label htmlFor="phone" className="text-sm font-bold text-gray-700 uppercase tracking-wider">Phone</label>
                        <input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-[#0C0C0C] focus:outline-none focus:border-[#0C0C0C] transition-colors"
                          placeholder="+91 9022989386"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="message" className="text-sm font-bold text-gray-700 uppercase tracking-wider">Please share anything that will help prepare for our meeting.</label>
                      <textarea
                        id="message"
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-[#0C0C0C] focus:outline-none focus:border-[#0C0C0C] transition-colors resize-none"
                      />
                    </div>

                    {status === 'error' && (
                      <p className="text-red-500 font-bold text-sm">
                        Failed to schedule appointment. Please try again or call us directly.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full mt-4 bg-[#0C0C0C] text-white font-black uppercase tracking-widest py-5 rounded-xl hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {status === 'loading' ? 'Scheduling...' : 'Confirm Booking'}
                    </button>
                  </form>
                </div>
              )}

              {/* STEP 3: Success State */}
              {step === 3 && (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-12 animate-in zoom-in-95 duration-500 min-h-[500px]">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-black text-[#0C0C0C] mb-4">You are scheduled!</h3>
                  <p className="text-lg text-gray-600 font-medium max-w-md">
                    A calendar invitation has been sent to your email address. We look forward to speaking with you!
                  </p>
                  <button 
                    onClick={() => {
                      setStep(1);
                      setSelectedDate(null);
                      setSelectedTime(null);
                      setStatus('idle');
                    }}
                    className="mt-8 px-8 py-4 border-2 border-[#0C0C0C] text-[#0C0C0C] font-bold rounded-xl hover:bg-[#0C0C0C] hover:text-white transition-all uppercase tracking-wider"
                  >
                    Schedule Another
                  </button>
                </div>
              )}

            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
