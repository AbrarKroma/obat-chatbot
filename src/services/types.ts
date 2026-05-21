export type Language = 'en' | 'ar';

export type MessageRole = 'user' | 'assistant' | 'system';

export type IntentType =
  | 'connectivity'
  | 'billing'
  | 'cloud'
  | 'iot'
  | 'service_setup'
  | 'agent_handoff'
  | 'maintenance'
  | 'account'
  | 'general';

export type RecommendedAction = 'solve' | 'escalate' | 'upgrade' | 'inform';

export interface QuickReply {
  id: string;
  label: string;
  labelAr: string;
  payload: string;
  payloadAr: string;
}

export interface OfferSuggestion {
  productId: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  price: string;
  bandwidth?: string;
}

export interface EscalationInfo {
  required: boolean;
  level: string;
  reason: string;
  reasonAr: string;
}

export interface IntentInfo {
  issueType: IntentType;
  confidence: number;
  label: string;
  labelAr: string;
}

export interface Reference {
  id: string;
  source: string;
  text: string;
  language: Language;
}

export interface BotResponse {
  id: string;
  textEn: string;
  textAr: string;
  intent: IntentInfo;
  action: RecommendedAction;
  actionLabel: string;
  actionLabelAr: string;
  quickReplies: QuickReply[];
  offer?: OfferSuggestion;
  escalation: EscalationInfo;
  references: Reference[];
  responseTimeMs: number;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  textEn: string;
  textAr: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
  feedback?: 'up' | 'down';
  meta?: {
    intent?: IntentInfo;
    action?: RecommendedAction;
    quickReplies?: QuickReply[];
    offer?: OfferSuggestion;
    escalation?: EscalationInfo;
  };
}

export interface CustomerProfile {
  customerId: string;
  companyName: string;
  companyNameAr: string;
  industry: string;
  industryAr: string;
  planName: string;
  bandwidth: string;
  slaLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  slaResponseHours: number;
  maintenanceStatus: 'Active' | 'None';
  city: string;
  cityAr: string;
}

export interface ConversationTurn {
  role: MessageRole;
  text: string;
  intent?: IntentType;
}

export interface SendMessageOptions {
  text: string;
  language: Language;
  sessionId: string;
  customer: CustomerProfile;
  history?: ConversationTurn[];
}
