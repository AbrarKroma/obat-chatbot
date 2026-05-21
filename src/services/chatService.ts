import type {
  BotResponse,
  ConversationTurn,
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
  FOLLOW_UP_SIGNALS_AR,
  FOLLOW_UP_SIGNALS_EN,
  GREETING_QUICK_REPLIES,
  INTENT_RULES,
  SMALL_TALK_RULES,
  type IntentRule,
  type SmallTalkRule,
} from './mockKnowledge';

const API_BASE_URL =
  (import.meta.env?.VITE_API_BASE_URL as string | undefined) ?? '';
const API_TIMEOUT_MS = 12000;
const BACKEND_RETRY_AFTER_MS = 15000;

let backendAvailable: boolean | null = null;
let backendCheckedAt = 0;

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

function hasFollowUpSignal(text: string): boolean {
  const normalized = text.toLowerCase();
  for (const signal of FOLLOW_UP_SIGNALS_EN) {
    if (normalized.includes(signal)) return true;
  }
  for (const signal of FOLLOW_UP_SIGNALS_AR) {
    if (text.includes(signal)) return true;
  }
  return false;
}

function getLastBotIntent(history: ConversationTurn[] | undefined): IntentType | null {
  if (!history) return null;
  for (let i = history.length - 1; i >= 0; i -= 1) {
    const turn = history[i];
    if (turn.role === 'assistant' && turn.intent) return turn.intent;
  }
  return null;
}

function pickSmallTalk(text: string): SmallTalkRule | null {
  const normalized = text.toLowerCase().trim();
  if (!normalized) return null;
  const wordCount = normalized.split(/\s+/).filter(Boolean).length;
  let best: { rule: SmallTalkRule; score: number } | null = null;
  for (const rule of SMALL_TALK_RULES) {
    let score = 0;
    for (const keyword of rule.keywords) {
      if (normalized === keyword || normalized.startsWith(`${keyword} `) || normalized.endsWith(` ${keyword}`)) {
        score += 3;
      } else if (normalized.includes(keyword)) {
        score += 1;
      }
    }
    for (const keyword of rule.keywordsAr) {
      if (text.includes(keyword)) score += 2;
    }
    if (score > 0 && (best === null || score > best.score)) {
      best = { rule, score };
    }
  }
  if (!best) return null;
  // Only treat as small talk for short messages or strong matches to avoid
  // hijacking real questions like "How do I pay my bill?" (which contains "pay").
  if (wordCount <= 4 || best.score >= 3) return best.rule;
  return null;
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

function buildMockResponse(
  text: string,
  customer: CustomerProfile,
  startedAt: number,
  history: ConversationTurn[] | undefined,
): BotResponse {
  const id = `bot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const lastIntent = getLastBotIntent(history);
  const followUpSignal = hasFollowUpSignal(text);

  const smallTalk = pickSmallTalk(text);
  if (smallTalk && !followUpSignal) {
    const intent: IntentInfo = {
      issueType: 'general',
      confidence: 0.9,
      label: 'Small Talk',
      labelAr: 'حديث ودي',
    };
    return {
      id,
      textEn: smallTalk.responseEn,
      textAr: smallTalk.responseAr,
      intent,
      action: 'inform',
      actionLabel: 'Acknowledge',
      actionLabelAr: 'إقرار',
      quickReplies: GREETING_QUICK_REPLIES,
      escalation: buildEscalation('general', 0.9, customer),
      references: [],
      responseTimeMs: Date.now() - startedAt,
    };
  }

  const { rule, confidence } = pickIntentRule(text);

  // If we have a follow-up signal but the new intent is unclear, anchor to last intent.
  const effectiveRule: IntentRule | null =
    rule ??
    (followUpSignal && lastIntent
      ? INTENT_RULES.find((r) => r.intent === lastIntent) ?? null
      : null);

  if (!effectiveRule) {
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

  const repeatingSameIntent = lastIntent !== null && lastIntent === effectiveRule.intent;
  const useFollowUp = Boolean(effectiveRule.followUp) && (followUpSignal || repeatingSameIntent);

  const intent: IntentInfo = {
    issueType: effectiveRule.intent,
    confidence: rule ? confidence : 0.6,
    label: effectiveRule.label,
    labelAr: effectiveRule.labelAr,
  };

  if (useFollowUp && effectiveRule.followUp) {
    const fu = effectiveRule.followUp;
    const action = fu.action ?? effectiveRule.action;
    return {
      id,
      textEn: fu.responseEn,
      textAr: fu.responseAr,
      intent,
      action,
      actionLabel: fu.actionLabel ?? effectiveRule.actionLabel,
      actionLabelAr: fu.actionLabelAr ?? effectiveRule.actionLabelAr,
      quickReplies: fu.quickReplies ?? effectiveRule.quickReplies,
      offer: effectiveRule.offer,
      escalation: {
        ...buildEscalation(effectiveRule.intent, intent.confidence, customer),
        required: action === 'escalate' ? true : buildEscalation(effectiveRule.intent, intent.confidence, customer).required,
      },
      references: effectiveRule.references,
      responseTimeMs: Date.now() - startedAt,
    };
  }

  return {
    id,
    textEn: effectiveRule.responseEn,
    textAr: effectiveRule.responseAr,
    intent,
    action: effectiveRule.action,
    actionLabel: effectiveRule.actionLabel,
    actionLabelAr: effectiveRule.actionLabelAr,
    quickReplies: effectiveRule.quickReplies,
    offer: effectiveRule.offer,
    escalation: buildEscalation(effectiveRule.intent, intent.confidence, customer),
    references: effectiveRule.references,
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
  const now = Date.now();
  // Cache positive results indefinitely; retry negatives after a short cooldown
  // so the UI auto-recovers when the backend comes back online.
  if (backendAvailable === true) return true;
  if (backendAvailable === false && now - backendCheckedAt < BACKEND_RETRY_AFTER_MS) {
    return false;
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timer);
    backendAvailable = res.ok;
  } catch {
    backendAvailable = false;
  }
  backendCheckedAt = Date.now();
  return backendAvailable;
}

function jitter(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min));
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendMessage(options: SendMessageOptions): Promise<BotResponse> {
  const { text, language, customer, history } = options;
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
  return buildMockResponse(text, customer, startedAt, history);
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
