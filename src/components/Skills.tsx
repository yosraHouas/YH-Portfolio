import { useTranslation } from 'react-i18next';
import {
  Code2,
  Database,
  Layout,
  GitBranch,
  FileCode,
  Braces,
  Table,
  Server,
  Cloud,
  Terminal,
  Blocks,
  Box,
} from 'lucide-react';

export default function Skills() {
  const { t } = useTranslation();

  const skillCategories = [
    {
      title: t('skills.backend'),
      skills: [
        { name: 'C#', icon: Code2 },
        { name: 'ASP.NET', icon: Server },
        { name: 'Entity Framework', icon: Blocks },
        { name: 'LINQ', icon: Braces },
        { name: 'REST APIs', icon: Box },
        { name: '.NET Core', icon: FileCode },
      ],
    },
    {
      title: t('skills.database'),
      skills: [
        { name: 'SQL Server', icon: Database },
        { name: 'T-SQL', icon: Terminal },
        { name: 'PostgreSQL', icon: Database },
        { name: 'Database Design', icon: Table },
      ],
    },
    {
      title: t('skills.frontend'),
      skills: [
        { name: 'React', icon: Layout },
        { name: 'TypeScript', icon: Code2 },
        { name: 'JavaScript', icon: FileCode },
        { name: 'HTML/CSS', icon: Layout },
      ],
    },
    {
      title: t('skills.devops'),
      skills: [
        { name: 'Git', icon: GitBranch },
        { name: 'Azure DevOps', icon: Cloud },
        { name: 'Visual Studio', icon: Code2 },
        { name: 'CI/CD', icon: GitBranch },
      ],
    },
  ];

  return (
    <section id="skills" className="py-24 bg-slate-50 scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              {t('skills.title')}
            </h2>
            <div className="w-20 h-1 bg-cyan-500"></div>
            <p className="text-slate-600 mt-6 text-lg">
              {t('skills.subtitle')}
            </p>
          </div>

          <div className="space-y-12">
            {skillCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  {category.title}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {category.skills.map((skill, skillIndex) => {
                    const Icon = skill.icon;
                    return (
                      <div
                        key={skillIndex}
                        className="bg-white border border-slate-200 rounded-lg p-4 hover:border-cyan-500 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <Icon size={32} className="text-slate-700" strokeWidth={1.5} />
                          <span className="text-sm font-medium text-slate-900 text-center">
                            {skill.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
