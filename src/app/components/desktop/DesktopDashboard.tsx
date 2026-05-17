import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Header } from '../Header';
import { CustomerContext } from '../CustomerContext';
import { ChatPanel } from '../ChatPanel';
import { InsightsPanel } from '../InsightsPanel';
import { ChatInput } from '../ChatInput';
import { MessageSquare, BarChart3, Package, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { QuickReplies } from '../shared/QuickReplies';
import { ErrorBanner } from '../shared/ErrorBanner';
import { OfferSheet } from '../mobile/OfferSheet';
import { EscalationModal } from '../mobile/EscalationModal';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  formatTimestamp,
  generateSessionId,
  getDefaultCustomer,
  getGreeting,
  sendMessage,
  GREETING_QUICK_REPLIES,
} from '../../../services/chatService';
import type {
  ChatMessage,
  IntentInfo,
  OfferSuggestion,
  QuickReply,
  RecommendedAction,
} from '../../../services/types';

export function DesktopDashboard() {
  const { language, isArabic, t } = useLanguage();
  const customer = useMemo(() => getDefaultCustomer(), []);
  const sessionIdRef = useRef<string>(generateSessionId());

  const [activeNav, setActiveNav] = useState('conversations');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeIntent, setActiveIntent] = useState<IntentInfo | null>(null);
  const [activeAction, setActiveAction] = useState<{
    action: RecommendedAction;
    label: string;
    labelAr: string;
  } | null>(null);
  const [activeOffer, setActiveOffer] = useState<OfferSuggestion | null>(null);
  const [activeQuickReplies, setActiveQuickReplies] =
    useState<QuickReply[]>(GREETING_QUICK_REPLIES);
  const [responseTimeMs, setResponseTimeMs] = useState<number | undefined>(undefined);
  const [lastError, setLastError] = useState<string | null>(null);
  const [pendingRetry, setPendingRetry] = useState<string | null>(null);
  const [showOffer, setShowOffer] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);

  const navItems = [
    {
      id: 'conversations',
      label: 'Conversations',
      labelAr: 'المحادثات',
      icon: MessageSquare,
    },
    { id: 'insights', label: 'Insights', labelAr: 'الرؤى', icon: BarChart3 },
    { id: 'products', label: 'Products', labelAr: 'المنتجات', icon: Package },
    { id: 'settings', label: 'Settings', labelAr: 'الإعدادات', icon: Settings },
  ];

  useEffect(() => {
    if (messages.length === 0) {
      const greeting = getGreeting(language, customer);
      setMessages([
        {
          id: 'greeting',
          role: 'assistant',
          textEn: greeting.textEn,
          textAr: greeting.textAr,
          timestamp: formatTimestamp(new Date(), language),
          status: 'sent',
        },
      ]);
      setActiveQuickReplies(greeting.quickReplies);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

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

        appendMessage({
          id: response.id,
          role: 'assistant',
          textEn: response.textEn,
          textAr: response.textAr,
          timestamp: formatTimestamp(new Date(), language),
          status: 'sent',
        });

        setActiveIntent(response.intent);
        setActiveAction({
          action: response.action,
          label: response.actionLabel,
          labelAr: response.actionLabelAr,
        });
        setActiveQuickReplies(response.quickReplies);
        setResponseTimeMs(response.responseTimeMs);
        if (response.offer) setActiveOffer(response.offer);

        if (response.intent.issueType === 'agent_handoff') {
          toast.success(
            isArabic ? 'تم تحويلك إلى وكيل مباشر' : 'Routing to a live agent',
          );
        }
      } catch (err) {
        console.error('[DesktopDashboard] sendMessage failed', err);
        setIsTyping(false);
        setLastError(err instanceof Error ? err.message : 'unknown');
        setPendingRetry(text);
        appendMessage({
          id: `err-${Date.now()}`,
          role: 'assistant',
          textEn: "I couldn't reach the assistant. Please retry.",
          textAr: 'تعذر الوصول إلى المساعد. يرجى المحاولة مرة أخرى.',
          timestamp: formatTimestamp(new Date(), language),
          status: 'error',
        });
      }
    },
    [appendMessage, customer, isArabic, language],
  );

  const handleQuickReply = (reply: QuickReply) => {
    void dispatchSend(isArabic ? reply.payloadAr : reply.payload);
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
      className="h-screen bg-gray-50 flex flex-col"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <div className={`w-64 bg-white p-4 ${isArabic ? 'border-l' : 'border-r'} border-gray-200`}>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeNav === item.id;
              return (
                <Button
                  key={item.id}
                  variant={active ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    active ? 'bg-[#E60000] hover:bg-[#cc0000]' : ''
                  }`}
                  onClick={() => setActiveNav(item.id)}
                >
                  <Icon className={`w-4 h-4 ${isArabic ? 'ml-3' : 'mr-3'}`} />
                  <span>{isArabic ? item.labelAr : item.label}</span>
                  <span className="text-xs ml-auto opacity-70">
                    {isArabic ? item.label : item.labelAr}
                  </span>
                </Button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div
            className={`w-80 flex-shrink-0 bg-gray-50 p-4 ${
              isArabic ? 'border-l' : 'border-r'
            } border-gray-200`}
          >
            <CustomerContext customer={customer} />
          </div>

          <div className="flex-1 flex flex-col bg-white">
            <div className="flex-1 overflow-hidden p-4">
              <ChatPanel
                messages={messages}
                isTyping={isTyping}
                onFeedback={handleFeedback}
              />
            </div>
            {lastError && (
              <div className="px-4">
                <ErrorBanner onRetry={() => pendingRetry && void dispatchSend(pendingRetry)} />
              </div>
            )}
            {activeQuickReplies.length > 0 && !isTyping && (
              <div className="px-6 pb-2">
                <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">
                  {t('Suggested', 'مقترحات')}
                </p>
                <QuickReplies replies={activeQuickReplies} onSelect={handleQuickReply} />
              </div>
            )}
            <ChatInput onSendMessage={dispatchSend} disabled={isTyping} />
          </div>

          <div
            className={`w-80 flex-shrink-0 bg-gray-50 p-4 ${
              isArabic ? 'border-r' : 'border-l'
            } border-gray-200`}
          >
            <InsightsPanel
              intent={activeIntent}
              action={activeAction?.action ?? null}
              actionLabel={activeAction?.label}
              actionLabelAr={activeAction?.labelAr}
              offer={activeOffer}
              responseTimeMs={responseTimeMs}
              onOpenOffer={() => setShowOffer(true)}
            />
            <div className="mt-4 space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEscalation(true)}
                className="w-full"
              >
                {t('Create Ticket', 'إنشاء تذكرة')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOffer(true)}
                className="w-full"
              >
                {t('View Upgrade', 'عرض الترقية')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <OfferSheet open={showOffer} onClose={() => setShowOffer(false)} language={language} />
      <EscalationModal
        open={showEscalation}
        onClose={() => setShowEscalation(false)}
        onSubmit={handleEscalationSubmit}
        language={language}
      />
    </div>
  );
}
