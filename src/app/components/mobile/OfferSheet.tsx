import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Check, TrendingUp, Phone } from 'lucide-react';
import { useState } from 'react';

interface OfferSheetProps {
  open: boolean;
  onClose: () => void;
  language?: 'en' | 'ar';
}

export function OfferSheet({ open, onClose, language = 'en' }: OfferSheetProps) {
  const [selectedTerm, setSelectedTerm] = useState(24);
  const isArabic = language === 'ar';

  const pricingTiers = [
    { months: 12, price: 'QAR 475.00', savings: '' },
    { months: 24, price: 'QAR 426.55', savings: isArabic ? 'وفر 10%' : 'Save 10%' },
    { months: 36, price: 'QAR 391.25', savings: isArabic ? 'وفر 18%' : 'Save 18%' },
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
        <SheetHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#E60000] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <SheetTitle className="text-xl text-[#333333]">
                {isArabic ? 'تحسين سرعة الذروة' : 'Improve Peak Speeds'}
              </SheetTitle>
              <p className="text-sm text-gray-500">
                {isArabic ? 'ترقية السرعة' : 'Upgrade your connection'}
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-5 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Current vs New Plan */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 bg-gray-50">
              <p className="text-xs text-gray-500 mb-2">
                {isArabic ? 'الخطة الحالية' : 'Current Plan'}
              </p>
              <p className="text-2xl text-[#333333] mb-1">100</p>
              <p className="text-xs text-gray-600">Mbps</p>
            </Card>
            <Card className="p-4 bg-[#FFF5F5] border-2 border-[#E60000]">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-[#E60000]">
                  {isArabic ? 'الخطة الجديدة' : 'New Plan'}
                </p>
                <Badge className="bg-[#E60000] text-white text-xs">
                  {isArabic ? 'شائع' : 'Popular'}
                </Badge>
              </div>
              <p className="text-2xl text-[#333333] mb-1">200</p>
              <p className="text-xs text-gray-600">Mbps</p>
            </Card>
          </div>

          {/* Pricing Tiers */}
          <div>
            <Label className="text-sm text-gray-700 mb-3 block">
              {isArabic ? 'اختر المدة' : 'Select Term'}
            </Label>
            <div className="space-y-2">
              {pricingTiers.map((tier) => (
                <button
                  key={tier.months}
                  onClick={() => setSelectedTerm(tier.months)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedTerm === tier.months
                      ? 'border-[#E60000] bg-[#FFF5F5]'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-[#333333]">
                        {tier.months} {isArabic ? 'شهراً' : 'months'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{tier.price}/mo</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {tier.savings && (
                        <Badge className="bg-green-100 text-green-800 border-green-300" variant="outline">
                          {tier.savings}
                        </Badge>
                      )}
                      {selectedTerm === tier.months && (
                        <div className="w-5 h-5 bg-[#E60000] rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Monthly Delta */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {isArabic ? 'فرق السعر الشهري' : 'Monthly increase'}
              </span>
              <span className="text-lg text-[#333333]">
                +QAR {selectedTerm === 24 ? '142.50' : selectedTerm === 12 ? '190.95' : '107.20'}
              </span>
            </div>
          </Card>

          {/* Benefits */}
          <div>
            <p className="text-sm text-gray-700 mb-3">
              {isArabic ? 'المزايا' : 'Benefits'}
            </p>
            <div className="space-y-2">
              {[
                isArabic ? 'سرعة تحميل مضاعفة' : 'Double download speed',
                isArabic ? 'ترقية مجانية للموجه' : 'Free router upgrade',
                isArabic ? 'موثوقية محسنة 99.9%' : 'Enhanced 99.9% reliability',
                isArabic ? 'دعم ذو أولوية' : 'Priority support',
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t space-y-2">
          <Button className="w-full bg-[#E60000] hover:bg-[#cc0000]">
            {isArabic ? 'الترقية الآن' : 'Upgrade Now'}
          </Button>
          <Button variant="outline" className="w-full">
            <Phone className="w-4 h-4 mr-2" />
            {isArabic ? 'التحدث إلى المبيعات' : 'Talk to Sales'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
