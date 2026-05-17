import { AlertCircle, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface ErrorBannerProps {
  onRetry: () => void;
}

export function ErrorBanner({ onRetry }: ErrorBannerProps) {
  const { isArabic } = useLanguage();
  return (
    <div
      className="mx-4 my-2 rounded-xl border border-red-200 bg-red-50 p-3 flex items-start gap-3"
      role="alert"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-red-800">
          {isArabic
            ? 'تعذر الوصول إلى الخدمة. حاول إرسال الرسالة مرة أخرى.'
            : "We couldn't reach the assistant. Try sending your message again."}
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1 text-xs text-red-800 hover:text-red-900 underline-offset-2 hover:underline"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        {isArabic ? 'إعادة المحاولة' : 'Retry'}
      </button>
    </div>
  );
}
