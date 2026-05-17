import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../i18n/LanguageContext';
import type { CustomerProfile } from '../../../services/types';

interface ContextCardProps {
  customer: CustomerProfile;
}

export function ContextCard({ customer }: ContextCardProps) {
  const { isArabic } = useLanguage();

  return (
    <Card
      className="mx-4 mt-3 mb-2 p-3 bg-white border border-[#E9E9E9] rounded-xl shadow-sm"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500 text-xs mb-1">
            {isArabic ? 'الشركة' : 'Company'}
          </p>
          <p className="text-[#333333]">
            {isArabic ? customer.companyNameAr : customer.companyName}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-1">
            {isArabic ? 'الخطة' : 'Plan'}
          </p>
          <p className="text-[#333333]">{customer.planName}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-1">
            {isArabic ? 'مستوى الخدمة' : 'SLA'}
          </p>
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs" variant="outline">
            {customer.slaLevel} • {customer.slaResponseHours}h
          </Badge>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-1">
            {isArabic ? 'الصيانة' : 'Maintenance'}
          </p>
          <Badge
            className={
              customer.maintenanceStatus === 'Active'
                ? 'bg-orange-100 text-orange-800 border-orange-300 text-xs'
                : 'bg-green-100 text-green-800 border-green-300 text-xs'
            }
            variant="outline"
          >
            {customer.maintenanceStatus === 'Active'
              ? isArabic
                ? 'نشطة'
                : 'Active'
              : isArabic
                ? 'لا يوجد'
                : 'None'}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
