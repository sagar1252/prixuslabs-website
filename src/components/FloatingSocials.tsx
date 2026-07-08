import { MessageSquare, Calendar } from 'lucide-react';

export default function FloatingSocials() {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50 p-2">
      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/919022989386" 
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-start w-14 h-14 bg-[#25D366] text-white rounded-l-2xl shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:w-40 transition-all duration-300 overflow-hidden relative"
        aria-label="WhatsApp"
      >
        <div className="min-w-[3.5rem] h-14 flex items-center justify-center z-10">
          <MessageSquare className="w-6 h-6" />
        </div>
        <span className="whitespace-nowrap font-bold text-sm tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-14">
          WhatsApp
        </span>
      </a>
      
      {/* Appointment Button */}
      <a 
        href="#contact" 
        className="group flex items-center justify-start w-14 h-14 bg-[#0C0C0C] text-white rounded-l-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:w-44 transition-all duration-300 overflow-hidden relative"
        aria-label="Book Appointment"
      >
        <div className="min-w-[3.5rem] h-14 flex items-center justify-center z-10">
          <Calendar className="w-6 h-6" />
        </div>
        <span className="whitespace-nowrap font-bold text-sm tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-14">
          Appointment
        </span>
      </a>
    </div>
  );
}
