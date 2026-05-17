import { useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Avatar } from './ui/avatar';
import { User, Bot } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { TypingIndicator } from './mobile/TypingIndicator';
import { MessageFeedback } from './shared/MessageFeedback';
import type { ChatMessage } from '../../services/types';

interface ChatPanelProps {
  messages: ChatMessage[];
  isTyping?: boolean;
  onFeedback?: (id: string, value: 'up' | 'down') => void;
}

export function ChatPanel({ messages, isTyping = false, onFeedback }: ChatPanelProps) {
  const { language, isArabic } = useLanguage();
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    requestAnimationFrame(() => {
      node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
    });
  }, [messages, isTyping]);

  return (
    <div className="space-y-4 h-full flex flex-col" dir={isArabic ? 'rtl' : 'ltr'}>
      <div>
        <h2 className="text-gray-900 mb-1">
          {isArabic ? 'المحادثة' : 'Conversation'}
        </h2>
        <p className="text-sm text-gray-500">
          {isArabic ? 'Conversation' : 'المحادثة'}
        </p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4" viewportRef={viewportRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-sm text-gray-400 text-center py-8">
                {isArabic
                  ? 'ابدأ محادثة لتظهر الرسائل هنا.'
                  : 'Start a conversation to see messages here.'}
              </div>
            )}
            {messages.map((message) => {
              const isUser = message.role === 'user';
              const isError = message.status === 'error';
              const content = isArabic ? message.textAr : message.textEn;
              return (
                <div
                  key={message.id}
                  className={`obat-message-enter flex gap-3 ${
                    isUser ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <Avatar
                    className={`w-8 h-8 flex items-center justify-center ${
                      isUser ? 'bg-gray-200' : 'bg-[#e60000]'
                    }`}
                  >
                    {isUser ? (
                      <User className="w-4 h-4 text-gray-700" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </Avatar>

                  <div
                    className={`flex-1 max-w-[80%] ${
                      isUser ? 'items-end' : 'items-start'
                    } flex flex-col gap-1`}
                  >
                    <div
                      className={`rounded-lg px-4 py-3 ${
                        isUser
                          ? 'bg-gray-100 text-gray-900'
                          : isError
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-[#e60000] text-white'
                      }`}
                      dir={isArabic ? 'rtl' : 'ltr'}
                      lang={language}
                    >
                      <p className="whitespace-pre-line">{content}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-2 ${isUser ? 'flex-row-reverse' : ''}`}>
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
            })}
            {isTyping && <TypingIndicator />}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
