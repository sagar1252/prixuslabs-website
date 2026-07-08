import FadeIn from '../components/FadeIn';
import { TrendingUp, Briefcase, Layout, Zap, Layers, ShieldCheck, Handshake } from 'lucide-react';

const REASONS = [
  {
    icon: <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-[#D7E2EA] mb-2" />,
    title: 'We Build Business Growth Platforms, Not Just Websites',
    description:
      'We combine technology, design, and AI to create digital ecosystems that help businesses attract customers, automate operations, and scale efficiently.',
  },
  {
    icon: <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-[#D7E2EA] mb-2" />,
    title: 'Business-First Approach',
    description:
      'Every solution is designed around your business objectives, ensuring technology directly supports your growth.',
  },
  {
    icon: <Layout className="w-8 h-8 sm:w-10 sm:h-10 text-[#D7E2EA] mb-2" />,
    title: 'Premium User Experience',
    description:
      'We create modern, responsive, and visually engaging digital experiences that build trust and improve customer engagement.',
  },
  {
    icon: <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-[#D7E2EA] mb-2" />,
    title: 'AI-Powered Innovation',
    description:
      'Our intelligent AI assistants help businesses respond instantly, qualify leads, and provide customers with a seamless experience around the clock.',
  },
  {
    icon: <Layers className="w-8 h-8 sm:w-10 sm:h-10 text-[#D7E2EA] mb-2" />,
    title: 'Complete Business Ecosystem',
    description:
      'From website development and appointment booking to CRM, automation, and reputation management, we provide everything your business needs in one integrated platform.',
  },
  {
    icon: <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-[#D7E2EA] mb-2" />,
    title: 'Scalable & Future-Ready',
    description:
      'Our solutions are built to grow with your business, making it easy to add new features, services, and automation as your company expands.',
  },
  {
    icon: <Handshake className="w-8 h-8 sm:w-10 sm:h-10 text-[#D7E2EA] mb-2" />,
    title: 'Reliable Partnership',
    description:
      'We believe in building long-term relationships by providing continuous support, innovation, and technology solutions that evolve with your business.',
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 overflow-hidden relative">
      <FadeIn>
        <header>
          <h2
            className="text-[#D7E2EA] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
            style={{ fontSize: 'clamp(2rem, 8vw, 100px)' }}
          >
            Why Choose Prixuslabs
          </h2>
        </header>
      </FadeIn>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-16">
        {REASONS.map((reason, i) => (
          <FadeIn key={reason.title} delay={i * 0.1}>
            <article className="flex flex-col gap-4">
              {reason.icon}
              <h3
                className="text-[#D7E2EA] font-medium uppercase"
                style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)' }}
              >
                {reason.title}
              </h3>
              <p
                className="text-[#D7E2EA] font-light leading-relaxed"
                style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)', opacity: 0.8 }}
              >
                {reason.description}
              </p>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
