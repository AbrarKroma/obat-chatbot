import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { AlertCircle, Upload } from 'lucide-react';
import { useState } from 'react';

interface EscalationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  language?: 'en' | 'ar';
}

export function EscalationModal({ open, onClose, onSubmit, language = 'en' }: EscalationModalProps) {
  const [impact, setImpact] = useState('medium');
  const [description, setDescription] = useState('Internet connection is down. Restarted router but issue persists.');
  const isArabic = language === 'ar';

  const handleSubmit = () => {
    onSubmit();
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
        <SheetHeader>
          <SheetTitle className="text-xl text-[#333333]">
            {isArabic ? 'إنشاء تذكرة دعم' : 'Create Support Ticket'}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Impact Level */}
          <div>
            <Label className="text-sm text-gray-700 mb-3 block">
              {isArabic ? 'مستوى التأثير' : 'Impact Level'}
            </Label>
            <RadioGroup value={impact} onValueChange={setImpact} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="flex items-center gap-2 cursor-pointer">
                  <Badge className="bg-green-100 text-green-800 border-green-300" variant="outline">
                    {isArabic ? 'منخفض' : 'Low'}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {isArabic ? 'غير عاجل' : 'Non-urgent'}
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="flex items-center gap-2 cursor-pointer">
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300" variant="outline">
                    {isArabic ? 'متوسط' : 'Medium'}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {isArabic ? 'يؤثر على العمل' : 'Affecting operations'}
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="flex items-center gap-2 cursor-pointer">
                  <Badge className="bg-red-100 text-red-800 border-red-300" variant="outline">
                    {isArabic ? 'مرتفع' : 'High'}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {isArabic ? 'توقف كامل' : 'Complete outage'}
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm text-gray-700 mb-2 block">
              {isArabic ? 'الوصف' : 'Description'}
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
              dir={isArabic ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Attach Screenshot */}
          <div>
            <Label className="text-sm text-gray-700 mb-2 block">
              {isArabic ? 'إرفاق لقطة شاشة' : 'Attach Screenshot'}
            </Label>
            <Button variant="outline" className="w-full justify-start">
              <Upload className="w-4 h-4 mr-2" />
              {isArabic ? 'اختر ملف' : 'Choose file'}
            </Button>
          </div>

          {/* SLA Reminder */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[#333333]">
                {isArabic ? 'مستوى الخدمة الذهبي' : 'Gold SLA Level'}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {isArabic
                  ? 'وقت الاستجابة: ≤ 4 ساعات'
                  : 'Response time: ≤ 4 hours'}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button
            onClick={handleSubmit}
            className="w-full bg-[#E60000] hover:bg-[#cc0000]"
          >
            {isArabic ? 'إرسال إلى المستوى الثاني' : 'Submit to L2'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
