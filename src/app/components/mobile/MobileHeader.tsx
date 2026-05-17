import { Badge } from '../ui/badge';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageToggle } from '../shared/LanguageToggle';

interface MobileHeaderProps {
  online?: boolean;
}

export function MobileHeader({ online = true }: MobileHeaderProps) {
  const { isArabic } = useLanguage();
  return (
    <div
      className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-[#E60000] rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-white text-sm">O</span>
        </div>
        <div className="leading-tight">
          <h1 className="text-gray-900 text-sm">
            {isArabic ? 'أوبت للأعمال' : 'Obat Business'}
          </h1>
          <p className="text-[10px] text-gray-500">
            {isArabic ? 'مساعد أوريدو للذكاء الاصطناعي' : 'Ooredoo AI Assistant'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          className={
            online
              ? 'bg-green-100 text-green-800 border-green-300'
              : 'bg-gray-100 text-gray-700 border-gray-300'
          }
          variant="outline"
        >
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
              online ? 'bg-green-500 obat-pulse' : 'bg-gray-400'
            }`}
          />
          {online
            ? isArabic
              ? 'متصل'
              : 'Online'
            : isArabic
              ? 'غير متصل'
              : 'Offline'}
        </Badge>
        <LanguageToggle />
      </div>
    </div>
  );
}
