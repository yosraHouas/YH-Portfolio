import { Github, Linkedin, Mail, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTypewriter } from '../hooks/useTypewriter';
import bgImage from '../assets/bg.jpg';
import profileImage from '../assets/imgprofile.png';

export default function Hero() {
  const { t } = useTranslation();

  const typewriterTexts = [
    t('hero.typewriter1'),
    t('hero.typewriter2'),
    t('hero.typewriter3'),
    t('hero.typewriter4'),
    t('hero.typewriter5')
  ];

  const typewriterText = useTypewriter(typewriterTexts, 100, 50, 2000);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-purple-900/50 to-slate-900/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="container mx-auto px-6 z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl">
          <div className="w-32 h-32 mb-2 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
            {t('hero.greeting')} {t('hero.name')}
          </h1>

          <div className="h-16 flex items-center justify-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white/95">
              {typewriterText}
            </h2>
            <span className="w-0.5 h-8 bg-white/70 ml-1 animate-pulse"></span>
          </div>

          <p className="text-base md:text-lg text-white/80 max-w-3xl leading-relaxed">
            {t('hero.description')}
          </p>

          <div className="flex gap-4 mt-6">
            <a
              href="https://github.com/YosraHouas"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-200"
              aria-label={t('hero.github')}
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/yosra-houas-4aa39a106/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-200"
              aria-label={t('hero.linkedin')}
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="mailto:houas_yora@hotmail.fr"
              className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-200"
              aria-label={t('hero.email')}
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>

        <div className="absolute bottom-12 flex flex-col items-center gap-2">
          <p className="text-sm text-white/80">{t('hero.learnMore')}</p>
          <button
            onClick={() => scrollToSection('about')}
            className="p-2 hover:bg-white/10 backdrop-blur-sm rounded-lg transition-all duration-200 animate-bounce"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
