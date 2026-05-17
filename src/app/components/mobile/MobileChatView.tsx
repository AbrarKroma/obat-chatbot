import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { MobileHeader } from './MobileHeader';
import { ContextCard } from './ContextCard';
import { ChatBubble } from './ChatBubble';
import { TypingIndicator } from './TypingIndicator';
import { InsightChips } from './InsightChips';
import { OfferCard } from './OfferCard';
import { InputBar } from './InputBar';
import { EscalationModal } from './EscalationModal';
import { OfferSheet } from './OfferSheet';
import { Button } from '../ui/button';
import { QuickReplies } from '../shared/QuickReplies';
import { WelcomeScreen } from '../shared/WelcomeScreen';
import { ErrorBanner } from '../shared/ErrorBanner';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  formatTimestamp,
  generateSessionId,
  getDefaultCustomer,
  getGreeting,
  sendMessage,
} from '../../../services/chatService';
import type {
  ChatMessage,
  IntentInfo,
  OfferSuggestion,
  QuickReply,
  RecommendedAction,
} from '../../../services/types';

export function MobileChatView() {
  const { language, isArabic, t } = useLanguage();
  const customer = useMemo(() => getDefaultCustomer(), []);
  const sessionIdRef = useRef<string>(generateSessionId());

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [activeIntent, setActiveIntent] = useState<IntentInfo | null>(null);
  const [activeAction, setActiveAction] = useState<{
    action: RecommendedAction;
    label: string;
    labelAr: string;
  } | null>(null);
  const [activeOffer, setActiveOffer] = useState<OfferSuggestion | null>(null);
  const [activeQuickReplies, setActiveQuickReplies] = useState<QuickReply[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);
  const [pendingRetry, setPendingRetry] = useState<string | null>(null);
  const [showEscalation, setShowEscalation] = useState(false);
  const [showOffer, setShowOffer] = useState(false);

  const scrollViewportRef = useRef<HTMLDivElement | null>(null);

  // Greet on first mount
  useEffect(() => {
    const greeting = getGreeting('en', customer);
    setActiveQuickReplies(greeting.quickReplies);
  }, [customer]);

  // Auto-scroll on new messages / typing
  useEffect(() => {
    const node = scrollViewportRef.current;
    if (!node) return;
    requestAnimationFrame(() => {
      node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
    });
  }, [messages, isTyping, activeQuickReplies, activeOffer]);

  const appendMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const updateMessage = useCallback((id: string, patch: Partial<ChatMessage>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }, []);

  const dispatchSend = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text) return;

      setHasStarted(true);
      setLastError(null);
      setPendingRetry(null);

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        role: 'user',
        textEn: text,
        textAr: text,
        timestamp: formatTimestamp(new Date(), language),
        status: 'sent',
      };
      appendMessage(userMessage);
      setIsTyping(true);
      setActiveQuickReplies([]);

      try {
        const response = await sendMessage({
          text,
          language,
          sessionId: sessionIdRef.current,
          customer,
        });

        setIsTyping(false);

        const botMessage: ChatMessage = {
          id: response.id,
          role: 'assistant',
          textEn: response.textEn,
          textAr: response.textAr,
          timestamp: formatTimestamp(new Date(), language),
          status: 'sent',
          meta: {
            intent: response.intent,
            action: response.action,
            quickReplies: response.quickReplies,
            offer: response.offer,
            escalation: response.escalation,
          },
        };
        appendMessage(botMessage);

        setActiveIntent(response.intent);
        setActiveAction({
          action: response.action,
          label: response.actionLabel,
          labelAr: response.actionLabelAr,
        });
        setActiveQuickReplies(response.quickReplies);
        if (response.offer) setActiveOffer(response.offer);

        if (response.intent.issueType === 'agent_handoff') {
          toast.success(
            isArabic ? 'تم تحويلك إلى وكيل مباشر' : 'Routing you to a live agent',
            {
              description: isArabic
                ? 'وقت الانتظار المتوقع أقل من 4 دقائق'
                : 'Estimated wait time under 4 minutes',
            },
          );
        }
      } catch (err) {
        console.error('[MobileChatView] sendMessage failed', err);
        setIsTyping(false);
        setLastError(err instanceof Error ? err.message : 'unknown');
        setPendingRetry(text);
        appendMessage({
          id: `err-${Date.now()}`,
          role: 'assistant',
          textEn:
            "I couldn't reach the assistant. Please tap retry to try again.",
          textAr: 'تعذر الوصول إلى المساعد. اضغط إعادة المحاولة.',
          timestamp: formatTimestamp(new Date(), language),
          status: 'error',
        });
      }
    },
    [appendMessage, customer, isArabic, language],
  );

  const handleQuickReply = (reply: QuickReply) => {
    const payload = isArabic ? reply.payloadAr : reply.payload;
    void dispatchSend(payload);
  };

  const handleStartFromWelcome = (payload: string) => {
    void dispatchSend(payload);
  };

  const handleRetry = () => {
    if (pendingRetry) {
      void dispatchSend(pendingRetry);
    }
  };

  const handleFeedback = (id: string, value: 'up' | 'down') => {
    updateMessage(id, { feedback: value });
    toast(
      isArabic
        ? value === 'up'
          ? 'شكراً لتقييمك'
          : 'سننقل ملاحظاتك للفريق'
        : value === 'up'
          ? 'Thanks for the feedback!'
          : "Thanks - we'll review this response",
    );
  };

  const handleEscalationSubmit = () => {
    toast.success(
      isArabic ? 'تم إنشاء التذكرة بنجاح' : 'Ticket created successfully',
      {
        description: isArabic
          ? `سيتصل بك فني خلال ${customer.slaResponseHours} ساعات`
          : `A technician will contact you within ${customer.slaResponseHours} hours`,
      },
    );
  };

  return (
    <div
      className="h-screen w-full bg-[#F5F5F5] flex flex-col overflow-hidden"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <MobileHeader />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {!hasStarted ? (
          <WelcomeScreen
            customerName={isArabic ? customer.companyNameAr : customer.companyName}
            onStart={handleStartFromWelcome}
          />
        ) : (
          <>
            <ContextCard customer={customer} />

            <div
              ref={scrollViewportRef}
              className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-2"
            >
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message}
                  onFeedback={handleFeedback}
                />
              ))}

              {isTyping && <TypingIndicator />}

              {activeIntent && activeAction && !isTyping && (
                <InsightChips
                  intent={activeIntent}
                  action={activeAction.action}
                  actionLabel={activeAction.label}
                  actionLabelAr={activeAction.labelAr}
                />
              )}

              {activeOffer && !isTyping && (
                <OfferCard offer={activeOffer} onUpgrade={() => setShowOffer(true)} />
              )}

              {lastError && <ErrorBanner onRetry={handleRetry} />}

              {!isTyping && activeQuickReplies.length > 0 && (
                <div className="mb-3 px-1">
                  <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1 px-1">
                    {t('Suggested', 'مقترحات')}
                  </p>
                  <QuickReplies replies={activeQuickReplies} onSelect={handleQuickReply} />
                </div>
              )}

              <div className="flex gap-2 justify-center my-4 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEscalation(true)}
                  className="text-xs"
                >
                  {t('Create Ticket', 'إنشاء تذكرة')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOffer(true)}
                  className="text-xs"
                >
                  {t('View Upgrade', 'عرض الترقية')}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <InputBar onSend={dispatchSend} disabled={isTyping} />

      <EscalationModal
        open={showEscalation}
        onClose={() => setShowEscalation(false)}
        onSubmit={handleEscalationSubmit}
        language={language}
      />

      <OfferSheet
        open={showOffer}
        onClose={() => setShowOffer(false)}
        language={language}
      />
    </div>
  );
}
