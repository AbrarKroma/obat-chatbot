import { Sparkles, Wifi, CreditCard, Cloud, Cpu, Wrench } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import type { QuickReply } from '../../../services/types';

interface WelcomeScreenProps {
  customerName: string;
  onStart: (payload: string) => void;
  suggestedTopics?: QuickReply[];
}

const TOPIC_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  connectivity: Wifi,
  billing: CreditCard,
  cloud: Cloud,
  iot: Cpu,
  setup: Wrench,
};

const TOPIC_CARDS = [
  {
    key: 'connectivity',
    en: 'Connectivity',
    ar: 'الاتصال',
    descEn: 'Outages, slow speeds, VPN',
    descAr: 'انقطاعات، سرعات بطيئة، VPN',
    payloadEn: 'Our internet is down at the office',
    payloadAr: 'الإنترنت معطل في المكتب',
  },
  {
    key: 'billing',
    en: 'Billing',
    ar: 'الفوترة',
    descEn: 'Invoices, payments, disputes',
    descAr: 'الفواتير، الدفع، الاعتراضات',
    payloadEn: 'Can you show me my current invoice and balance?',
    payloadAr: 'هل يمكنك عرض فاتورتي الحالية ورصيدي؟',
  },
  {
    key: 'cloud',
    en: 'Cloud',
    ar: 'السحابة',
    descEn: 'VMs, backups, storage',
    descAr: 'الخوادم، النسخ الاحتياطي، التخزين',
    payloadEn: 'My cloud backup failed last night',
    payloadAr: 'فشل النسخ الاحتياطي السحابي ليلة أمس',
  },
  {
    key: 'iot',
    en: 'IoT',
    ar: 'إنترنت الأشياء',
    descEn: 'SIMs, devices, firmware',
    descAr: 'الشرائح، الأجهزة، البرنامج الثابت',
    payloadEn: 'I need to activate a new IoT SIM',
    payloadAr: 'أحتاج إلى تفعيل شريحة إنترنت الأشياء جديدة',
  },
  {
    key: 'setup',
    en: 'Service setup',
    ar: 'إعداد الخدمة',
    descEn: 'New lines, MPLS, provisioning',
    descAr: 'خطوط جديدة، MPLS، التهيئة',
    payloadEn: 'I want to set up a new fiber line at a branch office',
    payloadAr: 'أريد إعداد خط ألياف جديد في فرع',
  },
];

export function WelcomeScreen({ customerName, onStart }: WelcomeScreenProps) {
  const { isArabic, t } = useLanguage();

  return (
    <div
      className="flex-1 flex flex-col px-5 py-6 overflow-y-auto"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#FDECEC] text-[#E60000] px-3 py-1 text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          {t('Powered by Ooredoo Enterprise AI', 'مدعوم من ذكاء أوريدو للأعمال')}
        </div>
        <LanguageToggle />
      </div>

      <div className="mb-6">
        <h2 className="text-2xl text-[#333333] mb-1">
          {t(`Welcome, ${customerName}`, `مرحباً ${customerName}`)}
        </h2>
        <p className="text-sm text-gray-500">
          {t(
            "I'm Obat, your Ooredoo Business assistant. What can I help with today?",
            'أنا أوبت، مساعدك من أوريدو للأعمال. كيف يمكنني مساعدتك اليوم؟',
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {TOPIC_CARDS.map((topic) => {
          const Icon = TOPIC_ICONS[topic.key] ?? Sparkles;
          return (
            <button
              key={topic.key}
              type="button"
              onClick={() => onStart(t(topic.payloadEn, topic.payloadAr))}
              className="text-left p-3 rounded-xl border border-gray-200 bg-white hover:border-[#E60000]/40 hover:bg-[#FFF5F5] transition-colors shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FDECEC] text-[#E60000] flex items-center justify-center mb-2">
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-sm text-[#333333]">{t(topic.en, topic.ar)}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {t(topic.descEn, topic.descAr)}
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-400">
        {t(
          'Tip: try "Is there any planned maintenance affecting my site?"',
          'تلميح: جرّب "هل هناك صيانة مجدولة تؤثر على موقعي؟"',
        )}
      </p>
    </div>
  );
}
