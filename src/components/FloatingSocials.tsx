import { useState, useEffect } from 'react';
import { MessageSquare, Calendar, X } from 'lucide-react';
import BookingWidget from './BookingWidget';

export default function FloatingSocials() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <>
      <div className="fixed right-0 top-1/2 -translate-y-1/2 flex flex-col items-end gap-3 z-40 p-2">
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
        <button 
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center justify-start w-14 h-14 bg-[#0C0C0C] text-white rounded-l-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:w-44 transition-all duration-300 overflow-hidden relative cursor-pointer"
          aria-label="Book Appointment"
        >
          <div className="min-w-[3.5rem] h-14 flex items-center justify-center z-10">
            <Calendar className="w-6 h-6" />
          </div>
          <span className="whitespace-nowrap font-bold text-sm tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-14">
            Appointment
          </span>
        </button>
      </div>

      {/* Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl max-h-full overflow-y-auto rounded-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-[#0C0C0C] rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <BookingWidget />
          </div>
        </div>
      )}
    </>
  );
}
