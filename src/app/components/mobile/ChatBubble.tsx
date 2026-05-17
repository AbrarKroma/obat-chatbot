import { Bot, User, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { MessageFeedback } from '../shared/MessageFeedback';
import type { ChatMessage } from '../../../services/types';

interface ChatBubbleProps {
  message: ChatMessage;
  onFeedback?: (id: string, value: 'up' | 'down') => void;
}

export function ChatBubble({ message, onFeedback }: ChatBubbleProps) {
  const { language, isArabic } = useLanguage();
  const isUser = message.role === 'user';
  const displayContent = isArabic ? message.textAr : message.textEn;
  const isError = message.status === 'error';

  return (
    <div
      className={`obat-message-enter flex gap-2 mb-3 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-gray-200' : 'bg-[#E60000]'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-gray-600" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      <div className={`flex-1 ${isUser ? 'items-end' : 'items-start'} flex flex-col min-w-0`}>
        <div
          className={`rounded-2xl px-4 py-3 max-w-[85%] shadow-sm break-words ${
            isUser
              ? 'bg-white border border-gray-200'
              : isError
                ? 'bg-red-50 border border-red-200'
                : 'bg-[#FDECEC]'
          }`}
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          {isError && (
            <div className="flex items-center gap-1.5 text-red-700 text-xs mb-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {isArabic ? 'فشل الإرسال' : 'Delivery failed'}
            </div>
          )}
          <p
            className={`text-sm leading-relaxed whitespace-pre-line ${
              isError ? 'text-red-800' : 'text-[#333333]'
            }`}
            lang={language}
          >
            {displayContent}
          </p>
        </div>
        <div
          className={`flex items-center gap-2 mt-1 px-2 ${
            isUser ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          <span className="text-xs text-gray-400">{message.timestamp}</span>
          {!isUser && !isError && onFeedback && (
            <MessageFeedback
              value={message.feedback}
              onChange={(value) => onFeedback(message.id, value)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
