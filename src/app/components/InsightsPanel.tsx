import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Lightbulb, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type {
  IntentInfo,
  OfferSuggestion,
  RecommendedAction,
} from '../../services/types';

interface InsightsPanelProps {
  intent: IntentInfo | null;
  action: RecommendedAction | null;
  actionLabel?: string;
  actionLabelAr?: string;
  offer?: OfferSuggestion | null;
  responseTimeMs?: number;
  onOpenOffer?: () => void;
}

const ACTION_COLORS: Record<RecommendedAction, string> = {
  solve: 'bg-green-100 text-green-800 border-green-300',
  escalate: 'bg-red-100 text-red-800 border-red-300',
  upgrade: 'bg-blue-100 text-blue-800 border-blue-300',
  inform: 'bg-gray-100 text-gray-800 border-gray-300',
};

export function InsightsPanel({
  intent,
  action,
  actionLabel,
  actionLabelAr,
  offer,
  responseTimeMs,
  onOpenOffer,
}: InsightsPanelProps) {
  const { isArabic } = useLanguage();
  return (
    <div className="space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
      <div>
        <h2 className="text-gray-900 mb-1">
          {isArabic ? 'رؤى الذكاء الاصطناعي' : 'AI Insights'}
        </h2>
        <p className="text-sm text-gray-500">
          {isArabic ? 'AI Insights' : 'رؤى الذكاء الاصطناعي'}
        </p>
      </div>

      <Card className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Lightbulb className="w-4 h-4" />
            <span>{isArabic ? 'النية المكتشفة' : 'Intent Detected'}</span>
          </div>
          <div className="pl-6">
            {intent ? (
              <>
                <p className="text-gray-900">{isArabic ? intent.labelAr : intent.label}</p>
                <p className="text-xs text-gray-400">
                  {isArabic ? 'الثقة' : 'Confidence'}: {Math.round(intent.confidence * 100)}%
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-400">
                {isArabic ? 'لا توجد محادثة بعد' : 'No conversation yet'}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Target className="w-4 h-4" />
            <span>{isArabic ? 'الإجراء الموصى' : 'Recommended Action'}</span>
          </div>
          <div className="pl-6 space-y-2">
            {action ? (
              <Badge variant="outline" className={ACTION_COLORS[action]}>
                {isArabic ? actionLabelAr ?? action : actionLabel ?? action}
              </Badge>
            ) : (
              <p className="text-sm text-gray-400">—</p>
            )}
          </div>
        </div>

        {offer && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>{isArabic ? 'العرض المقترح' : 'Suggested Offer'}</span>
            </div>
            <Card className="p-3 bg-blue-50 border-blue-200">
              <div className="space-y-2">
                <p className="text-gray-900">{isArabic ? offer.titleAr : offer.title}</p>
                <p className="text-sm text-gray-600">
                  {isArabic ? offer.descriptionAr : offer.description}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[#e60000]">{offer.price}</span>
                  {onOpenOffer && (
                    <Button
                      size="sm"
                      className="bg-[#e60000] hover:bg-[#cc0000]"
                      onClick={onOpenOffer}
                    >
                      {isArabic ? 'التفاصيل' : 'Learn More'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {intent && (
          <div className="pt-2 border-t">
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <p>
                {isArabic
                  ? `ثقة الذكاء: ${Math.round(intent.confidence * 100)}٪ • زمن الرد ${
                      responseTimeMs ? (responseTimeMs / 1000).toFixed(1) : '—'
                    }ث`
                  : `AI confidence: ${Math.round(intent.confidence * 100)}% • Response in ${
                      responseTimeMs ? (responseTimeMs / 1000).toFixed(1) : '—'
                    }s`}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
