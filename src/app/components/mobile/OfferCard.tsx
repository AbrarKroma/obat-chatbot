import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { TrendingUp, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import type { OfferSuggestion } from '../../../services/types';

interface OfferCardProps {
  offer: OfferSuggestion;
  onUpgrade: () => void;
}

export function OfferCard({ offer, onUpgrade }: OfferCardProps) {
  const { isArabic } = useLanguage();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <Card
      className="mx-4 mb-3 bg-gradient-to-br from-[#FFF5F5] to-white border-2 border-[#E60000] rounded-xl shadow-md p-4 obat-message-enter"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className={`flex items-start gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
        <div className="w-10 h-10 bg-[#E60000] rounded-lg flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[#333333] mb-1 break-words">
            {isArabic ? offer.titleAr : offer.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2 break-words">
            {isArabic ? offer.descriptionAr : offer.description}
          </p>
          <p className="text-sm text-[#E60000] mb-3">{offer.price}</p>
          <Button
            className="w-full bg-[#E60000] hover:bg-[#cc0000] text-white"
            size="sm"
            onClick={onUpgrade}
          >
            {isArabic ? 'الترقية الآن' : 'Upgrade now'}
            <Arrow className={`w-4 h-4 ${isArabic ? 'mr-2' : 'ml-2'}`} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
