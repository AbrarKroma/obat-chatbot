import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-2 mb-3">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#E60000]">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="rounded-2xl px-4 py-3 bg-[#FDECEC] shadow-sm">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-[#E60000] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-[#E60000] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-[#E60000] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
