import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <p className="flex items-center justify-center gap-2 text-slate-400">
            {t('footer.madeWith')} <Heart className="w-4 h-4 text-red-500 fill-current" /> {t('footer.by')} Yosra Houas
          </p>
          <p className="mt-2 text-slate-500 text-sm">
            © {new Date().getFullYear()} {t('footer.rights')}
          </p>
          <a
            href="/admin"
            className="mt-3 inline-block text-slate-600 hover:text-slate-400 text-xs transition-colors"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/admin');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
          >
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
