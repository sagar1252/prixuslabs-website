import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import ServicesSection from '../sections/ServicesSection';
import WhyChooseUsSection from '../sections/WhyChooseUsSection';
import ContactSection from '../sections/ContactSection';
import FloatingBot from '../components/FloatingBot';
import FloatingSocials from '../components/FloatingSocials';

function HomePage() {
  return (
    <div className="font-kanit bg-[#0C0C0C]" style={{ overflowX: 'clip' }}>
      <HeroSection />
      {/* <MarqueeSection /> */}
      <AboutSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <ContactSection />
      <FloatingBot />
      <FloatingSocials />
      {/* <ProjectsSection /> */}
    </div>
  );
}

export default HomePage;
