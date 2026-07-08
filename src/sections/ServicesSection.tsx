import FadeIn from '../components/FadeIn';
import { Globe, Bot, CalendarDays, Users, Target, Cpu, Star, BarChart3, Newspaper } from 'lucide-react';

const SERVICES = [
  {
    number: '01',
    icon: <Globe className="w-10 h-10 sm:w-12 sm:h-12 text-[#0C0C0C]" />,
    name: 'Premium Website Development',
    description:
      'Your website is your digital identity. We design and develop modern, responsive, and high-performance websites that create exceptional first impressions while converting visitors into customers. Every website is optimized for speed, usability, SEO, and business growth.',
  },
  {
    number: '02',
    icon: <Bot className="w-10 h-10 sm:w-12 sm:h-12 text-[#0C0C0C]" />,
    name: 'AI Customer Assistant',
    description:
      'Deliver instant customer support 24/7 with an intelligent AI assistant that answers questions, guides visitors, recommends services, qualifies leads, and improves customer engagement—without increasing your workload.',
  },
  {
    number: '03',
    icon: <CalendarDays className="w-10 h-10 sm:w-12 sm:h-12 text-[#0C0C0C]" />,
    name: 'Appointment Booking System',
    description:
      'Simplify scheduling with an automated appointment system that allows customers to book consultations, meetings, or site visits directly through your website. Reduce manual coordination while improving customer convenience.',
  },
  {
    number: '04',
    icon: <Users className="w-10 h-10 sm:w-12 sm:h-12 text-[#0C0C0C]" />,
    name: 'Dedicated CRM Platform',
    description:
      'Manage every customer interaction from one centralized dashboard. Track leads, monitor appointments, organize customer information, manage follow-ups, and gain valuable insights that help your business make better decisions.',
  },
  {
    number: '05',
    icon: <Target className="w-10 h-10 sm:w-12 sm:h-12 text-[#0C0C0C]" />,
    name: 'Lead Management System',
    description:
      'Never lose a potential customer again. Our lead management system captures, organizes, and tracks every inquiry, ensuring faster responses, better follow-ups, and improved conversion opportunities.',
  },
  {
    number: '06',
    icon: <Cpu className="w-10 h-10 sm:w-12 sm:h-12 text-[#0C0C0C]" />,
    name: 'Business Automation',
    description:
      'Automate repetitive business processes such as lead routing, notifications, follow-ups, internal workflows, and customer communication. Save time, improve efficiency, and focus on growing your business instead of managing routine tasks.',
  },
  {
    number: '07',
    icon: <Star className="w-10 h-10 sm:w-12 sm:h-12 text-[#0C0C0C]" />,
    name: 'Google Review & Reputation Management',
    description:
      'Strengthen your online reputation with intelligent review collection solutions. Help satisfied customers leave Google reviews effortlessly through QR-based review systems, improving trust, credibility, and local search visibility.',
  },
  {
    number: '08',
    icon: <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-[#0C0C0C]" />,
    name: 'Business Analytics Dashboard',
    description:
      'Transform business data into actionable insights. Monitor website performance, lead generation, appointments, customer engagement, and overall business growth through a centralized analytics dashboard.',
  },
  {
    number: '09',
    icon: <Newspaper className="w-10 h-10 sm:w-12 sm:h-12 text-[#0C0C0C]" />,
    name: 'Autonomous SEO Growth Agent',
    description:
      'Scale your content marketing effortlessly. We deploy intelligent AI agents that continuously discover trending topics, research high-value keywords, and autonomously write, optimize, and publish SEO-driven articles to your website to generate organic traffic and qualified business leads.',
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32">
      <FadeIn>
        <header>
          <h2
            className="text-[#0C0C0C] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Services
          </h2>
        </header>
      </FadeIn>

      <div className="max-w-5xl mx-auto">
        {SERVICES.map((service, i) => (
          <FadeIn key={service.number} delay={i * 0.1}>
            <article
              className="flex items-start gap-4 sm:gap-8 md:gap-10 py-8 sm:py-10 md:py-12"
              style={{ borderBottom: '1px solid rgba(12, 12, 12, 0.15)' }}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8">
                <span
                  className="font-black text-[#0C0C0C] leading-none flex-shrink-0"
                  style={{ fontSize: 'clamp(2.5rem, 8vw, 100px)' }}
                >
                  {service.number}
                </span>
                <div className="mt-2 sm:mt-4">
                  {service.icon}
                </div>
              </div>
              
              <div className="flex flex-col justify-center gap-3 w-full">
                <h3
                  className="text-[#0C0C0C] font-medium uppercase"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                >
                  {service.name}
                </h3>
                <p
                  className="text-[#0C0C0C] font-light leading-relaxed max-w-2xl"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)', opacity: 0.6 }}
                >
                  {service.description}
                </p>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
