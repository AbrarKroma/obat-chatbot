import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface MessageFeedbackProps {
  value?: 'up' | 'down';
  onChange: (next: 'up' | 'down') => void;
}

export function MessageFeedback({ value, onChange }: MessageFeedbackProps) {
  const { isArabic } = useLanguage();
  return (
    <div className="flex items-center gap-1 mt-1" dir={isArabic ? 'rtl' : 'ltr'}>
      <button
        type="button"
        aria-label={isArabic ? 'إجابة مفيدة' : 'Helpful response'}
        aria-pressed={value === 'up'}
        onClick={() => onChange('up')}
        className={`p-1 rounded-full transition-colors ${
          value === 'up'
            ? 'bg-green-100 text-green-700'
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
        }`}
      >
        <ThumbsUp className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        aria-label={isArabic ? 'إجابة غير مفيدة' : 'Not helpful'}
        aria-pressed={value === 'down'}
        onClick={() => onChange('down')}
        className={`p-1 rounded-full transition-colors ${
          value === 'down'
            ? 'bg-red-100 text-red-700'
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
        }`}
      >
        <ThumbsDown className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
