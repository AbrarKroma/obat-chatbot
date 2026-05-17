import { Languages } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface LanguageToggleProps {
  variant?: 'pill' | 'icon';
  className?: string;
}

export function LanguageToggle({ variant = 'pill', className = '' }: LanguageToggleProps) {
  const { isArabic, toggleLanguage } = useLanguage();
  const label = isArabic ? 'EN' : 'AR';
  const a11y = isArabic ? 'Switch to English' : 'التبديل إلى العربية';

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        aria-label={a11y}
        className={`inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 ${className}`}
      >
        <Languages className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={a11y}
      className={`inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 text-xs ${className}`}
    >
      <Languages className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
}
