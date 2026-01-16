import { Code2, Rocket, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();
  const highlights = [
    {
      icon: Code2,
      title: t('about.highlights.quality.title'),
      description: t('about.highlights.quality.description'),
    },
    {
      icon: Rocket,
      title: t('about.highlights.performance.title'),
      description: t('about.highlights.performance.description'),
    },
    {
      icon: Users,
      title: t('about.highlights.collaboration.title'),
      description: t('about.highlights.collaboration.description'),
    },
  ];

  return (
    <section id="about" className="py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              {t('about.title')}
            </h2>
            <div className="w-20 h-1 bg-cyan-500"></div>
          </div>

          <div className="space-y-8 mb-16">
            <p className="text-lg text-slate-700 leading-relaxed">
              {t('about.p1')}
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              {t('about.p2')}
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              {t('about.p3')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-lg p-6 hover:border-cyan-500 transition-colors duration-200"
              >
                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
