import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Mic, Send } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const { isArabic } = useLanguage();

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="flex gap-3 max-w-7xl mx-auto">
        <Button
          variant="outline"
          size="icon"
          className="flex-shrink-0 border-gray-300"
          aria-label={isArabic ? 'إدخال صوتي' : 'Voice input'}
        >
          <Mic className="w-4 h-4" />
        </Button>
        <Input
          placeholder={isArabic ? 'اكتب رسالتك...' : 'Type your message...'}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
          dir={isArabic ? 'rtl' : 'ltr'}
          disabled={disabled}
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="bg-[#e60000] hover:bg-[#cc0000] flex-shrink-0"
        >
          <Send className={`w-4 h-4 ${isArabic ? 'ml-2 rtl:flip' : 'mr-2'}`} />
          {isArabic ? 'إرسال' : 'Send'}
        </Button>
      </div>
    </div>
  );
}
