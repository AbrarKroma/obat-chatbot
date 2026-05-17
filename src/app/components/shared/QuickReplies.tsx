import { useLanguage } from '../../i18n/LanguageContext';
import type { QuickReply } from '../../../services/types';

interface QuickRepliesProps {
  replies: QuickReply[];
  onSelect: (reply: QuickReply) => void;
  disabled?: boolean;
  variant?: 'inline' | 'rail';
}

export function QuickReplies({
  replies,
  onSelect,
  disabled = false,
  variant = 'rail',
}: QuickRepliesProps) {
  const { language, isArabic } = useLanguage();
  if (!replies || replies.length === 0) return null;

  const containerBase =
    variant === 'inline'
      ? 'flex flex-wrap gap-2'
      : 'flex gap-2 overflow-x-auto obat-no-scrollbar pb-1';

  return (
    <div
      className={`${containerBase} px-1`}
      dir={isArabic ? 'rtl' : 'ltr'}
      role="group"
      aria-label={isArabic ? 'ردود سريعة' : 'Quick replies'}
    >
      {replies.map((reply) => (
        <button
          key={reply.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(reply)}
          className="flex-shrink-0 rounded-full border border-[#E60000]/40 bg-white text-[#E60000] hover:bg-[#FFF5F5] active:bg-[#FDECEC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-3 py-1.5 text-xs whitespace-nowrap shadow-sm"
        >
          {language === 'ar' ? reply.labelAr : reply.label}
        </button>
      ))}
    </div>
  );
}
