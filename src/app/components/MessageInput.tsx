import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Mic, Send } from "lucide-react";

export default function MessageInput() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="max-w-4xl mx-auto flex gap-3">
        <div className="flex-1 flex gap-2 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 focus-within:border-[#e60000] focus-within:ring-2 focus-within:ring-[#e60000] focus-within:ring-opacity-20 transition-all">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here... / اكتب رسالتك هنا..."
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
          />
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 text-gray-500 hover:text-[#e60000] hover:bg-red-50"
            title="Voice input / إدخال صوتي"
          >
            <Mic className="w-5 h-5" />
          </Button>
        </div>
        <Button
          onClick={handleSend}
          className="bg-[#e60000] hover:bg-[#cc0000] px-6"
          disabled={!message.trim()}
        >
          <Send className="w-5 h-5 mr-2" />
          Send / إرسال
        </Button>
      </div>
    </div>
  );
}
