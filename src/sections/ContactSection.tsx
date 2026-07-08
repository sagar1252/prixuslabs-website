import FadeIn from '../components/FadeIn';
import BookingWidget from '../components/BookingWidget';

export default function ContactSection() {
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
          <BookingWidget />
        </FadeIn>
      </div>
    </section>
  );
}
