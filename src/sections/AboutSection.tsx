import FadeIn from '../components/FadeIn';
import ContactButton from '../components/ContactButton';

const IMG_BASE =
  'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7';

export default function AboutSection() {
  return (
    <section id="about" className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden">
      {/* Decorative corner images */}
      <FadeIn
        delay={0.1}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px]"
      >
        <img src={`${IMG_BASE}/moon_icon.11395d36.png`} alt="Moon icon" className="w-full h-auto" />
      </FadeIn>

      <FadeIn
        delay={0.25}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px]"
      >
        <img src={`${IMG_BASE}/p59_1.4659672e.png`} alt="3D object" className="w-full h-auto" />
      </FadeIn>

      <FadeIn
        delay={0.15}
        x={80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px]"
      >
        <img src={`${IMG_BASE}/lego_icon-1.703bb594.png`} alt="Lego icon" className="w-full h-auto" />
      </FadeIn>

      <FadeIn
        delay={0.3}
        x={80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px]"
      >
        <img src={`${IMG_BASE}/Group_134-1.2e04f3ce.png`} alt="3D group" className="w-full h-auto" />
      </FadeIn>

      {/* Content */}
      <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn delay={0} y={40}>
          <header>
            <h2
              className="hero-heading font-black uppercase leading-none tracking-tight text-center"
              style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
            >
              About Us
            </h2>
          </header>
        </FadeIn>

        <article className="flex flex-col items-center gap-6 sm:gap-8 max-w-[800px] text-[#D7E2EA] font-medium text-center leading-relaxed" style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}>
          <FadeIn delay={0.1} y={20}>
            <p className="text-xl sm:text-2xl font-bold mb-2">Engineering Next-Gen Digital Solutions Powered by AI</p>
          </FadeIn>
          <FadeIn delay={0.2} y={20}>
            <p>We transform businesses with intelligent, scalable digital ecosystems. From premium web development to AI customer assistants, CRM, and automation—we build platforms that drive growth and streamline operations.</p>
          </FadeIn>
          <FadeIn delay={0.3} y={20}>
            <p>More than just a tech vendor, we are your long-term innovation partner, ensuring your business stays ahead in today's competitive digital landscape.</p>
          </FadeIn>
          
          <div className="mt-4">
            <ContactButton />
          </div>
        </article>
      </div>
    </section>
  );
}
