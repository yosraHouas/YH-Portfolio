import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors duration-200 text-white border border-slate-700 hover:border-slate-600"
      aria-label="Toggle language"
    >
      <Globe size={18} />
      <span className="font-medium uppercase">
        {i18n.language === 'en' ? 'FR' : 'EN'}
      </span>
    </button>
  );
}
