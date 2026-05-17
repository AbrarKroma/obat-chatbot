import { useLanguage } from '../i18n/LanguageContext';
import { LanguageToggle } from './shared/LanguageToggle';

export function Header() {
  const { isArabic } = useLanguage();
  return (
    <header
      className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#e60000] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">O</span>
        </div>
        <div>
          <h1 className="text-gray-900">
            {isArabic
              ? 'أوبت للأعمال — مساعد الدعم الذكي'
              : 'Obat Business – AI Support Assistant'}
          </h1>
          <p className="text-sm text-gray-500">
            {isArabic ? 'مدعوم من ذكاء أوريدو للأعمال' : 'Powered by Ooredoo Enterprise AI'}
          </p>
        </div>
      </div>
      <LanguageToggle />
    </header>
  );
}
