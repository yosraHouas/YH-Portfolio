import { Github, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import projects from '../constants/projects.json';

interface Technology {
  name: string;
  image: string;
}

interface Project {
  id: string;
  titleKey: string;
  descriptionKey: string;
  technologies: Technology[];
  thumbnail: string;
  github?: string;
  deployed: string;
  dateKey: string;
}

export default function Projects() {
  const { t } = useTranslation();

  return (
    <section id="projects" className="py-24 bg-slate-50 scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              {t('projects.title')}
            </h2>
            <div className="w-20 h-1 bg-cyan-500"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(projects as Project[]).map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={project.thumbnail}
                    alt={t(project.titleKey)}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-slate-900">
                    {t(project.titleKey)}
                  </h3>
                  <p className="text-slate-600 mb-4 leading-relaxed text-sm">
                    {t(project.descriptionKey)}
                  </p>

                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="text-sm font-medium text-slate-700">Technology:</span>
                    {project.technologies.map((tech, index) => (
                      <div
                        key={index}
                        className="relative group"
                        title={tech.name}
                      >
                        <img
                          src={tech.image}
                          alt={tech.name}
                          className="w-8 h-8 object-contain hover:scale-110 transition-transform duration-200"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    {project.github && (
                      <a
                        href={project.github}
                        className="flex items-center gap-2 text-sm text-slate-700 hover:text-cyan-500 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="w-4 h-4" />
                        Code
                      </a>
                    )}
                    <a
                      href={project.deployed}
                      className="flex items-center gap-2 text-sm text-slate-700 hover:text-cyan-500 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Demo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
