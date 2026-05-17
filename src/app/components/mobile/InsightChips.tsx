import { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Lightbulb, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import type { IntentInfo, RecommendedAction } from '../../../services/types';

interface InsightChipsProps {
  intent: IntentInfo;
  action: RecommendedAction;
  actionLabel: string;
  actionLabelAr: string;
}

const INTENT_COLORS: Record<string, string> = {
  connectivity: 'bg-blue-100 text-blue-800 border-blue-300',
  billing: 'bg-purple-100 text-purple-800 border-purple-300',
  cloud: 'bg-cyan-100 text-cyan-800 border-cyan-300',
  iot: 'bg-green-100 text-green-800 border-green-300',
  service_setup: 'bg-orange-100 text-orange-800 border-orange-300',
  maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  account: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  agent_handoff: 'bg-pink-100 text-pink-800 border-pink-300',
  general: 'bg-gray-100 text-gray-800 border-gray-300',
};

const ACTION_COLORS: Record<RecommendedAction, string> = {
  solve: 'bg-green-100 text-green-800 border-green-300',
  escalate: 'bg-red-100 text-red-800 border-red-300',
  upgrade: 'bg-blue-100 text-blue-800 border-blue-300',
  inform: 'bg-gray-100 text-gray-800 border-gray-300',
};

export function InsightChips({ intent, action, actionLabel, actionLabelAr }: InsightChipsProps) {
  const [expanded, setExpanded] = useState(false);
  const { isArabic } = useLanguage();

  return (
    <Card
      className="mx-4 mb-3 bg-white border border-[#E9E9E9] rounded-xl shadow-sm overflow-hidden"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#E60000]" />
          <span className="text-sm text-[#333333]">
            {isArabic ? 'رؤى الذكاء الاصطناعي' : 'AI Insights'}
          </span>
          <span className="text-xs text-gray-400">
            {Math.round(intent.confidence * 100)}%
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-gray-100 pt-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500">
                {isArabic ? 'النية' : 'Intent'}
              </span>
            </div>
            <Badge
              className={INTENT_COLORS[intent.issueType] ?? INTENT_COLORS.general}
              variant="outline"
            >
              {isArabic ? intent.labelAr : intent.label}
            </Badge>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500">
                {isArabic ? 'الإجراء' : 'Action'}
              </span>
            </div>
            <Badge className={ACTION_COLORS[action]} variant="outline">
              {isArabic ? actionLabelAr : actionLabel}
            </Badge>
          </div>
        </div>
      )}
    </Card>
  );
}
