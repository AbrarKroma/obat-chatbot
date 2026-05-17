import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Mic, Paperclip, Send } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface InputBarProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function InputBar({ onSend, disabled = false }: InputBarProps) {
  const [message, setMessage] = useState('');
  const { isArabic } = useLanguage();

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3 safe-bottom">
      <div
        className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0"
          aria-label={isArabic ? 'إرفاق ملف' : 'Attach file'}
        >
          <Paperclip className="w-5 h-5 text-gray-500" />
        </Button>
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isArabic ? 'اكتب رسالتك…' : 'Type your message…'}
            className={`${isArabic ? 'pl-10' : 'pr-10'} rounded-full border-gray-300`}
            dir={isArabic ? 'rtl' : 'ltr'}
            disabled={disabled}
            aria-label={isArabic ? 'حقل الرسالة' : 'Message field'}
          />
          <Button
            variant="ghost"
            size="icon"
            className={`absolute ${isArabic ? 'left-1' : 'right-1'} top-1/2 -translate-y-1/2`}
            aria-label={isArabic ? 'إدخال صوتي' : 'Voice input'}
          >
            <Mic className="w-5 h-5 text-gray-500" />
          </Button>
        </div>
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="flex-shrink-0 bg-[#E60000] hover:bg-[#cc0000] rounded-full w-10 h-10 p-0"
          aria-label={isArabic ? 'إرسال' : 'Send'}
        >
          <Send className={`w-5 h-5 ${isArabic ? 'rtl:flip' : ''}`} />
        </Button>
      </div>
    </div>
  );
}
