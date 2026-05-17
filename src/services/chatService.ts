import type {
  BotResponse,
  CustomerProfile,
  EscalationInfo,
  IntentInfo,
  IntentType,
  Language,
  QuickReply,
  Reference,
  SendMessageOptions,
} from './types';
import {
  FALLBACK_RESPONSE,
  GREETING_QUICK_REPLIES,
  INTENT_RULES,
  type IntentRule,
} from './mockKnowledge';

const API_BASE_URL =
  (import.meta.env?.VITE_API_BASE_URL as string | undefined) ?? '';
const API_TIMEOUT_MS = 6000;

let backendAvailable: boolean | null = null;

const DEFAULT_CUSTOMER: CustomerProfile = {
  customerId: 'SME000001',
  companyName: 'Tech Solutions LLC',
  companyNameAr: 'حلول التقنية',
  industry: 'Technology',
  industryAr: 'تقنية المعلومات',
  planName: 'Fiber Business 100 Mbps',
  bandwidth: '100 Mbps',
  slaLevel: 'Gold',
  slaResponseHours: 4,
  maintenanceStatus: 'None',
  city: 'Doha - Diplomatic Area',
  cityAr: 'الدوحة - الحي الدبلوماسي',
};

export function getDefaultCustomer(): CustomerProfile {
  return DEFAULT_CUSTOMER;
}

export function generateSessionId(): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `obat-${Date.now()}-${rand}`;
}

export function formatTimestamp(date: Date = new Date(), language: Language = 'en'): string {
  const locale = language === 'ar' ? 'ar-QA' : 'en-US';
  return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
}

function scoreIntent(text: string, rule: IntentRule): number {
  const normalized = text.toLowerCase();
  let score = 0;
  for (const keyword of rule.keywords) {
    if (normalized.includes(keyword.toLowerCase())) score += 2;
  }
  for (const keyword of rule.keywordsAr) {
    if (text.includes(keyword)) score += 2;
  }
  return score;
}

function pickIntentRule(text: string): { rule: IntentRule | null; confidence: number } {
  let bestRule: IntentRule | null = null;
  let bestScore = 0;
  for (const rule of INTENT_RULES) {
    const score = scoreIntent(text, rule);
    if (score > bestScore) {
      bestScore = score;
      bestRule = rule;
    }
  }
  const confidence = bestRule ? Math.min(0.5 + bestScore * 0.1, 0.97) : 0;
  return { rule: bestRule, confidence };
}

function buildEscalation(
  intent: IntentType,
  confidence: number,
  customer: CustomerProfile,
): EscalationInfo {
  const tier = customer.slaLevel.toLowerCase();
  const isHighPriorityIntent =
    intent === 'connectivity' || intent === 'service_setup' || intent === 'agent_handoff';
  const required = isHighPriorityIntent || confidence < 0.55;

  let level: string;
  if (intent === 'billing') level = 'Billing Desk';
  else if (intent === 'agent_handoff') level = 'Live Agent (L1)';
  else if ((tier === 'gold' || tier === 'platinum') && isHighPriorityIntent)
    level = 'Field Technician';
  else level = 'L2 Support';

  const reason =
    intent === 'connectivity' || intent === 'service_setup'
      ? 'High impact service issue'
      : intent === 'agent_handoff'
        ? 'Customer requested live agent'
        : 'Routine review';
  const reasonAr =
    intent === 'connectivity' || intent === 'service_setup'
      ? 'مشكلة خدمة ذات تأثير عالٍ'
      : intent === 'agent_handoff'
        ? 'طلب العميل وكيلاً مباشراً'
        : 'مراجعة روتينية';

  return { required, level, reason, reasonAr };
}

function buildMockResponse(text: string, customer: CustomerProfile, startedAt: number): BotResponse {
  const { rule, confidence } = pickIntentRule(text);

  const id = `bot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  if (!rule) {
    const intent: IntentInfo = {
      issueType: 'general',
      confidence: 0.4,
      label: 'General Inquiry',
      labelAr: 'استفسار عام',
    };
    return {
      id,
      textEn: FALLBACK_RESPONSE.en,
      textAr: FALLBACK_RESPONSE.ar,
      intent,
      action: 'inform',
      actionLabel: 'Inform',
      actionLabelAr: 'إعلام',
      quickReplies: GREETING_QUICK_REPLIES,
      escalation: buildEscalation('general', 0.4, customer),
      references: [],
      responseTimeMs: Date.now() - startedAt,
    };
  }

  const intent: IntentInfo = {
    issueType: rule.intent,
    confidence,
    label: rule.label,
    labelAr: rule.labelAr,
  };

  return {
    id,
    textEn: rule.responseEn,
    textAr: rule.responseAr,
    intent,
    action: rule.action,
    actionLabel: rule.actionLabel,
    actionLabelAr: rule.actionLabelAr,
    quickReplies: rule.quickReplies,
    offer: rule.offer,
    escalation: buildEscalation(rule.intent, confidence, customer),
    references: rule.references,
    responseTimeMs: Date.now() - startedAt,
  };
}

interface BackendRespondPayload {
  answer: { en: string; ar: string };
  intent: { issue_type: string; confidence: number; probabilities: Record<string, number> };
  references: Array<{
    chunk_id: string;
    source: string;
    language: string;
    text: string;
    similarity: number;
    metadata: Record<string, string>;
  }>;
  escalation: { required: boolean; level: string; reason: string };
}

const INTENT_LABEL_MAP: Record<string, { label: string; labelAr: string }> = {
  connectivity: { label: 'Connectivity Issue', labelAr: 'مشكلة في الاتصال' },
  billing: { label: 'Billing & Invoicing', labelAr: 'الفوترة والحسابات' },
  cloud: { label: 'Cloud Services', labelAr: 'الخدمات السحابية' },
  iot: { label: 'IoT & Devices', labelAr: 'إنترنت الأشياء والأجهزة' },
  service_setup: { label: 'Service Setup', labelAr: 'إعداد الخدمة' },
};

function mapBackendResponse(
  text: string,
  payload: BackendRespondPayload,
  customer: CustomerProfile,
  startedAt: number,
): BotResponse {
  const issueTypeRaw = payload.intent.issue_type;
  const labelInfo =
    INTENT_LABEL_MAP[issueTypeRaw] ?? { label: issueTypeRaw, labelAr: issueTypeRaw };

  const intent: IntentInfo = {
    issueType: (issueTypeRaw as IntentType) || 'general',
    confidence: payload.intent.confidence,
    label: labelInfo.label,
    labelAr: labelInfo.labelAr,
  };

  const matchingRule = INTENT_RULES.find((r) => r.intent === issueTypeRaw);
  const quickReplies: QuickReply[] = matchingRule?.quickReplies ?? GREETING_QUICK_REPLIES;

  const references: Reference[] = payload.references.map((r) => ({
    id: r.chunk_id,
    source: r.source,
    text: r.text,
    language: (r.language as Language) || 'en',
  }));

  return {
    id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    textEn: payload.answer.en,
    textAr: payload.answer.ar,
    intent,
    action: matchingRule?.action ?? (payload.escalation.required ? 'escalate' : 'inform'),
    actionLabel: matchingRule?.actionLabel ?? (payload.escalation.required ? 'Escalate' : 'Inform'),
    actionLabelAr: matchingRule?.actionLabelAr ?? (payload.escalation.required ? 'تصعيد' : 'إعلام'),
    quickReplies,
    offer: matchingRule?.offer,
    escalation: {
      required: payload.escalation.required,
      level: payload.escalation.level,
      reason: payload.escalation.reason,
      reasonAr: matchingRule
        ? buildEscalation(matchingRule.intent, payload.intent.confidence, customer).reasonAr
        : 'مراجعة',
    },
    references,
    responseTimeMs: Date.now() - startedAt,
  };
}

async function callBackend(
  text: string,
  language: Language,
  customer: CustomerProfile,
): Promise<BackendRespondPayload> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE_URL}/chat/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        language,
        top_k: 3,
        customer_tier: customer.slaLevel,
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as BackendRespondPayload;
  } finally {
    clearTimeout(timer);
  }
}

async function checkBackendHealth(): Promise<boolean> {
  if (!API_BASE_URL) return false;
  if (backendAvailable !== null) return backendAvailable;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timer);
    backendAvailable = res.ok;
  } catch {
    backendAvailable = false;
  }
  return backendAvailable;
}

function jitter(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min));
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendMessage(options: SendMessageOptions): Promise<BotResponse> {
  const { text, language, customer } = options;
  const startedAt = Date.now();

  const useBackend = await checkBackendHealth();
  if (useBackend) {
    try {
      const payload = await callBackend(text, language, customer);
      return mapBackendResponse(text, payload, customer, startedAt);
    } catch (err) {
      backendAvailable = false;
      console.warn('[chatService] backend call failed, falling back to mock:', err);
    }
  }

  await delay(jitter(450, 900));
  return buildMockResponse(text, customer, startedAt);
}

export function getGreeting(language: Language, customer: CustomerProfile) {
  const companyName = language === 'ar' ? customer.companyNameAr : customer.companyName;
  const en = `Hello ${customer.companyName} - I'm Obat, your Ooredoo Business assistant. I can help with connectivity, billing, cloud, IoT, service setup, and more. How can I help today?`;
  const ar = `مرحباً ${customer.companyNameAr} - أنا أوبت، مساعدك من أوريدو للأعمال. يمكنني مساعدتك في الاتصال والفوترة والسحابة وإنترنت الأشياء وإعداد الخدمات وغيرها. كيف يمكنني مساعدتك اليوم؟`;
  return {
    textEn: en,
    textAr: ar,
    quickReplies: GREETING_QUICK_REPLIES,
    companyName,
  };
}

export { GREETING_QUICK_REPLIES };
