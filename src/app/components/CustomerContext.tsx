import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Building2, Wifi, Shield, Wrench } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type { CustomerProfile } from '../../services/types';

interface CustomerContextProps {
  customer: CustomerProfile;
}

const SLA_COLORS: Record<string, string> = {
  Gold: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Silver: 'bg-gray-100 text-gray-800 border-gray-300',
  Bronze: 'bg-orange-100 text-orange-800 border-orange-300',
  Platinum: 'bg-purple-100 text-purple-800 border-purple-300',
};

export function CustomerContext({ customer }: CustomerContextProps) {
  const { isArabic } = useLanguage();
  return (
    <div className="space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
      <div>
        <h2 className="text-gray-900 mb-1">
          {isArabic ? 'معلومات العميل' : 'Customer Context'}
        </h2>
        <p className="text-sm text-gray-500">
          {isArabic ? 'Customer Context' : 'معلومات العميل'}
        </p>
      </div>

      <Card className="p-4 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Building2 className="w-4 h-4" />
            <span>{isArabic ? 'اسم الشركة' : 'Company Name'}</span>
          </div>
          <p className="text-gray-900 pl-6">
            {isArabic ? customer.companyNameAr : customer.companyName}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Wifi className="w-4 h-4" />
            <span>{isArabic ? 'نوع الخطة' : 'Plan Type'}</span>
          </div>
          <p className="text-gray-900 pl-6">{customer.planName}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Shield className="w-4 h-4" />
            <span>{isArabic ? 'مستوى الخدمة' : 'SLA Level'}</span>
          </div>
          <div className="pl-6">
            <Badge className={SLA_COLORS[customer.slaLevel]} variant="outline">
              {customer.slaLevel} • {customer.slaResponseHours}h
            </Badge>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Wrench className="w-4 h-4" />
            <span>{isArabic ? 'حالة الصيانة' : 'Maintenance Status'}</span>
          </div>
          <div className="pl-6">
            <Badge
              variant="outline"
              className={
                customer.maintenanceStatus === 'Active'
                  ? 'bg-orange-100 text-orange-800 border-orange-300'
                  : 'bg-green-100 text-green-800 border-green-300'
              }
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

        <div className="pt-2 border-t text-xs text-gray-500">
          {isArabic ? 'الموقع: ' : 'Location: '}
          {isArabic ? customer.cityAr : customer.city}
        </div>
      </Card>
    </div>
  );
}
