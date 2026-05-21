import type {
  IntentType,
  OfferSuggestion,
  QuickReply,
  RecommendedAction,
  Reference,
} from './types';

export interface IntentRule {
  intent: IntentType;
  label: string;
  labelAr: string;
  action: RecommendedAction;
  actionLabel: string;
  actionLabelAr: string;
  keywords: string[];
  keywordsAr: string[];
  responseEn: string;
  responseAr: string;
  quickReplies: QuickReply[];
  offer?: OfferSuggestion;
  references: Reference[];
  followUp?: {
    responseEn: string;
    responseAr: string;
    action?: RecommendedAction;
    actionLabel?: string;
    actionLabelAr?: string;
    quickReplies?: QuickReply[];
  };
}

export const INTENT_RULES: IntentRule[] = [
  {
    intent: 'connectivity',
    label: 'Connectivity Issue',
    labelAr: 'مشكلة في الاتصال',
    action: 'escalate',
    actionLabel: 'Escalate',
    actionLabelAr: 'تصعيد',
    keywords: [
      'internet',
      'down',
      'offline',
      'no connection',
      'slow',
      'wifi',
      'fiber',
      'router',
      'leased line',
      'vpn',
      'disconnect',
      'outage',
      'mbps',
    ],
    keywordsAr: [
      'الإنترنت',
      'انقطاع',
      'بطيء',
      'واي فاي',
      'الراوتر',
      'الاتصال',
      'لا يعمل',
      'معطل',
      'في بي إن',
      'انقطع',
    ],
    responseEn:
      "I'm running a quick line check. No active maintenance is currently affecting your circuit. Please reboot your business router by unplugging power for 30 seconds, then reconnecting. If the issue persists, I can dispatch a field technician under your SLA.",
    responseAr:
      'أقوم بفحص سريع للخط. لا توجد صيانة نشطة تؤثر على دائرتك حالياً. يُرجى إعادة تشغيل جهاز الراوتر بفصل الطاقة لمدة 30 ثانية ثم إعادة توصيله. إذا استمرت المشكلة، يمكنني إرسال فني ميداني وفق مستوى الخدمة الخاص بك.',
    quickReplies: [
      {
        id: 'qr-conn-1',
        label: 'I restarted the router',
        labelAr: 'أعدت تشغيل الراوتر',
        payload: "I've restarted the router but it's still down",
        payloadAr: 'أعدت تشغيل الراوتر لكن الخدمة لا تزال معطلة',
      },
      {
        id: 'qr-conn-2',
        label: 'Run a speed test',
        labelAr: 'إجراء اختبار السرعة',
        payload: 'My speed is lower than my plan',
        payloadAr: 'سرعة الإنترنت أقل من سرعة خطتي',
      },
      {
        id: 'qr-conn-3',
        label: 'Create support ticket',
        labelAr: 'إنشاء تذكرة دعم',
        payload: 'Please create a support ticket for me',
        payloadAr: 'يرجى إنشاء تذكرة دعم لي',
      },
      {
        id: 'qr-conn-4',
        label: 'Talk to a human agent',
        labelAr: 'التحدث إلى وكيل',
        payload: 'I want to talk to a human agent',
        payloadAr: 'أريد التحدث إلى وكيل بشري',
      },
    ],
    offer: {
      productId: 'PROD000002',
      title: 'Upgrade to 200 Mbps Business Fiber',
      titleAr: 'الترقية إلى ألياف الأعمال 200 ميجابت',
      description: 'Double the bandwidth, enhanced 99.9% reliability, free router upgrade.',
      descriptionAr: 'ضعف السرعة، موثوقية محسّنة 99.9٪، ترقية مجانية للموجه.',
      price: 'QAR 426.55/mo',
      bandwidth: '200 Mbps',
    },
    references: [
      {
        id: 'faq-conn-1',
        source: 'faqs_troubleshooting',
        language: 'en',
        text:
          'Step 1: Verify all cables are properly connected and router LEDs are lit. Step 2: Power-cycle the router (30 seconds). Step 3: Check whether other office devices are affected. Step 4: Verify account is not on payment hold.',
      },
    ],
    followUp: {
      responseEn:
        "Thanks for trying that. Since the issue persists, I'm escalating this as a priority incident under your Gold SLA. A field technician will be dispatched within 4 hours and you'll receive an SMS with the ticket number. Would you also like me to loop in a live agent now?",
      responseAr:
        'شكراً على المحاولة. بما أن المشكلة لا تزال قائمة، سأقوم بتصعيدها كحادثة ذات أولوية وفق مستوى الخدمة الذهبي. سيتم إرسال فني ميداني خلال 4 ساعات وستصلك رسالة نصية برقم التذكرة. هل تريد أيضاً التحدث مع وكيل مباشر الآن؟',
      action: 'escalate',
      actionLabel: 'Dispatch Technician',
      actionLabelAr: 'إرسال فني',
      quickReplies: [
        {
          id: 'qr-conn-fu-1',
          label: 'Yes, connect me to an agent',
          labelAr: 'نعم، حولني إلى وكيل',
          payload: 'Yes please connect me to a live agent',
          payloadAr: 'نعم، يرجى تحويلي إلى وكيل مباشر',
        },
        {
          id: 'qr-conn-fu-2',
          label: 'Confirm the ticket',
          labelAr: 'تأكيد التذكرة',
          payload: 'Please confirm the support ticket has been opened',
          payloadAr: 'يرجى تأكيد فتح تذكرة الدعم',
        },
        {
          id: 'qr-conn-fu-3',
          label: 'Share ETA on site',
          labelAr: 'أرسل الوقت المتوقع للوصول',
          payload: 'When will the technician arrive on site?',
          payloadAr: 'متى سيصل الفني إلى الموقع؟',
        },
      ],
    },
  },
  {
    intent: 'billing',
    label: 'Billing & Invoicing',
    labelAr: 'الفوترة والحسابات',
    action: 'solve',
    actionLabel: 'Resolve',
    actionLabelAr: 'حل',
    keywords: [
      'bill',
      'invoice',
      'charge',
      'payment',
      'pay',
      'refund',
      'overcharged',
      'qar',
      'monthly fee',
      'discount',
      'balance',
      'credit',
    ],
    keywordsAr: [
      'فاتورة',
      'الفوترة',
      'دفع',
      'سداد',
      'مبلغ',
      'رصيد',
      'استرداد',
      'خصم',
      'رسوم',
      'شهري',
    ],
    responseEn:
      "I've pulled up your account. Your current month's invoice is QAR 284.05 for Fiber Business 100 Mbps, due in 12 days. No disputed charges are flagged. I can email a duplicate invoice or walk you through any line item.",
    responseAr:
      'تم استدعاء معلومات حسابك. فاتورة هذا الشهر بقيمة 284.05 ريال قطري لخدمة ألياف الأعمال 100 ميجابت، مستحقة خلال 12 يوماً. لا توجد رسوم متنازع عليها. يمكنني إرسال نسخة من الفاتورة أو شرح أي بند.',
    quickReplies: [
      {
        id: 'qr-bill-1',
        label: 'Email me the invoice',
        labelAr: 'أرسل لي الفاتورة بالبريد',
        payload: 'Please email me a copy of the invoice',
        payloadAr: 'يرجى إرسال نسخة من الفاتورة عبر البريد',
      },
      {
        id: 'qr-bill-2',
        label: 'Dispute a charge',
        labelAr: 'الاعتراض على رسم',
        payload: "I want to dispute a charge on my invoice",
        payloadAr: 'أريد الاعتراض على رسم في فاتورتي',
      },
      {
        id: 'qr-bill-3',
        label: 'Set up auto-pay',
        labelAr: 'تفعيل الدفع التلقائي',
        payload: 'How do I set up auto-pay?',
        payloadAr: 'كيف أقوم بتفعيل الدفع التلقائي؟',
      },
    ],
    references: [
      {
        id: 'ref-bill-1',
        source: 'historical_tickets',
        language: 'en',
        text:
          'Typical billing resolutions: resend invoice to verified email, issue credit on confirmed errors, configure auto-pay via business portal.',
      },
    ],
    followUp: {
      responseEn:
        "Understood - let me dig deeper. I've opened a billing review (case BIL-INQ-${TICKET}) and routed it to our Business Billing Desk. They typically respond within one business day. Meanwhile, can you tell me which specific charge or invoice line is in question?",
      responseAr:
        'مفهوم - دعني أتعمق أكثر. لقد فتحت مراجعة فوترة (الحالة BIL-INQ-${TICKET}) وحولتها إلى مكتب فوترة الأعمال. عادةً ما يستجيبون خلال يوم عمل واحد. في هذه الأثناء، أخبرني أي رسم أو بند في الفاتورة موضع الاستفسار؟',
      action: 'escalate',
      actionLabel: 'Escalate to Billing',
      actionLabelAr: 'تصعيد إلى الفوترة',
      quickReplies: [
        {
          id: 'qr-bill-fu-1',
          label: 'Disputed charge details',
          labelAr: 'تفاصيل الرسم المتنازع عليه',
          payload: 'The disputed charge is the recurring monthly fee',
          payloadAr: 'الرسم المتنازع عليه هو الرسم الشهري المتكرر',
        },
        {
          id: 'qr-bill-fu-2',
          label: 'Talk to billing agent',
          labelAr: 'التحدث مع وكيل فوترة',
          payload: 'I want to talk to a billing agent now',
          payloadAr: 'أريد التحدث مع وكيل فوترة الآن',
        },
      ],
    },
  },
  {
    intent: 'cloud',
    label: 'Cloud Services',
    labelAr: 'الخدمات السحابية',
    action: 'solve',
    actionLabel: 'Resolve',
    actionLabelAr: 'حل',
    keywords: [
      'cloud',
      'vm',
      'virtual machine',
      'server',
      'backup',
      'storage',
      'restore',
      'database',
      'firewall',
      'ddos',
      's3',
    ],
    keywordsAr: [
      'السحابة',
      'خادم',
      'الخوادم',
      'نسخ احتياطي',
      'تخزين',
      'استعادة',
      'قاعدة بيانات',
      'جدار حماية',
    ],
    responseEn:
      "I can help with your cloud workloads. I see your VM backup schedule ran successfully at 02:00 today and storage is at 47% capacity. Tell me whether this is about provisioning, performance, backups, or security and I'll dive deeper.",
    responseAr:
      'يمكنني المساعدة في الأحمال السحابية الخاصة بك. أرى أن جدول النسخ الاحتياطي للخادم تم بنجاح الساعة 02:00 اليوم والتخزين يبلغ 47٪ من السعة. أخبرني هل المشكلة في الإعداد أم الأداء أم النسخ الاحتياطي أم الأمان وسأتعمق أكثر.',
    quickReplies: [
      {
        id: 'qr-cloud-1',
        label: 'Backup failed',
        labelAr: 'فشل النسخ الاحتياطي',
        payload: 'My backup failed last night',
        payloadAr: 'فشل النسخ الاحتياطي ليلة أمس',
      },
      {
        id: 'qr-cloud-2',
        label: 'Add storage',
        labelAr: 'إضافة تخزين',
        payload: 'I need to add more storage to my plan',
        payloadAr: 'أحتاج إلى إضافة المزيد من التخزين إلى خطتي',
      },
      {
        id: 'qr-cloud-3',
        label: 'Provision a VM',
        labelAr: 'إنشاء خادم افتراضي',
        payload: 'I want to provision a new virtual machine',
        payloadAr: 'أريد إنشاء خادم افتراضي جديد',
      },
    ],
    offer: {
      productId: 'PROD-CLOUD-PRO',
      title: 'Managed Cloud Backup Premium',
      titleAr: 'النسخ الاحتياطي السحابي المُدار - بريميوم',
      description: 'Hourly snapshots, off-site replication, 99.99% durability.',
      descriptionAr: 'نسخ احتياطي كل ساعة، نسخ بعيد، متانة 99.99٪.',
      price: 'QAR 199/mo',
    },
    references: [
      {
        id: 'ref-cloud-1',
        source: 'faqs_troubleshooting',
        language: 'en',
        text:
          'Validate cloud resources, backup schedules, retention policies, and access roles before escalating to L2.',
      },
    ],
    followUp: {
      responseEn:
        "Got it. I'm pulling the backup logs and resource metrics into a Cloud Ops case for L2 to investigate. To narrow this down, can you share the VM or workload ID and the approximate time the issue started?",
      responseAr:
        'تمام. أقوم بسحب سجلات النسخ الاحتياطي ومقاييس الموارد إلى حالة عمليات سحابية ليبحث فيها فريق المستوى الثاني. لتضييق نطاق المشكلة، هل يمكنك مشاركة معرّف الخادم الافتراضي والوقت التقريبي لبدء المشكلة؟',
      action: 'escalate',
      actionLabel: 'Escalate to Cloud Ops',
      actionLabelAr: 'تصعيد إلى عمليات السحابة',
      quickReplies: [
        {
          id: 'qr-cloud-fu-1',
          label: 'Share VM ID',
          labelAr: 'مشاركة معرف الخادم',
          payload: 'The affected VM ID is VM-PROD-0021',
          payloadAr: 'معرف الخادم المتأثر هو VM-PROD-0021',
        },
        {
          id: 'qr-cloud-fu-2',
          label: 'Talk to a cloud engineer',
          labelAr: 'التحدث إلى مهندس سحابة',
          payload: 'I want to talk to a cloud engineer',
          payloadAr: 'أريد التحدث إلى مهندس سحابة',
        },
      ],
    },
  },
  {
    intent: 'iot',
    label: 'IoT & Devices',
    labelAr: 'إنترنت الأشياء والأجهزة',
    action: 'solve',
    actionLabel: 'Diagnose',
    actionLabelAr: 'تشخيص',
    keywords: [
      'iot',
      'sim',
      'gps',
      'tracker',
      'fleet',
      'smart meter',
      'sensor',
      'device',
      'firmware',
      'asset monitoring',
    ],
    keywordsAr: [
      'إنترنت الأشياء',
      'شريحة',
      'الشرائح',
      'تتبع',
      'أسطول',
      'عداد ذكي',
      'مستشعر',
      'جهاز',
      'الأجهزة',
      'البرنامج الثابت',
    ],
    responseEn:
      'I see 12 IoT devices on your account, all reporting normally except one fleet tracker (DEV-0044) with stale GPS data. I can push a firmware refresh remotely or open a device-replacement ticket.',
    responseAr:
      'أرى 12 جهاز إنترنت الأشياء على حسابك، جميعها تعمل بشكل طبيعي باستثناء جهاز تتبع أسطول (DEV-0044) ببيانات GPS قديمة. يمكنني تحديث البرنامج الثابت عن بُعد أو فتح تذكرة لاستبدال الجهاز.',
    quickReplies: [
      {
        id: 'qr-iot-1',
        label: 'Refresh firmware',
        labelAr: 'تحديث البرنامج الثابت',
        payload: 'Please push a firmware refresh to DEV-0044',
        payloadAr: 'يرجى إرسال تحديث للبرنامج الثابت إلى DEV-0044',
      },
      {
        id: 'qr-iot-2',
        label: 'Activate new SIM',
        labelAr: 'تفعيل شريحة جديدة',
        payload: 'I need to activate a new IoT SIM',
        payloadAr: 'أحتاج إلى تفعيل شريحة إنترنت الأشياء جديدة',
      },
      {
        id: 'qr-iot-3',
        label: 'Replace device',
        labelAr: 'استبدال الجهاز',
        payload: 'Please open a replacement ticket for the faulty device',
        payloadAr: 'يرجى فتح تذكرة لاستبدال الجهاز المعطل',
      },
    ],
    references: [
      {
        id: 'ref-iot-1',
        source: 'historical_tickets',
        language: 'en',
        text: 'GPS inaccuracies are commonly resolved by firmware update + position recalibration.',
      },
    ],
    followUp: {
      responseEn:
        "Thanks for the update. Since the device still isn't reporting correctly, I've opened a hardware replacement ticket and scheduled a swap-out. Expect a courier within 24-48 hours. Would you like me to also activate a spare SIM in the meantime?",
      responseAr:
        'شكراً على التحديث. بما أن الجهاز لا يزال لا يبلّغ بشكل صحيح، فقد فتحت تذكرة لاستبدال الجهاز وحددت موعداً للتبديل. توقع وصول مندوب خلال 24-48 ساعة. هل ترغب أيضاً في تفعيل شريحة احتياطية في هذه الأثناء؟',
      action: 'escalate',
      actionLabel: 'Replace Device',
      actionLabelAr: 'استبدال الجهاز',
      quickReplies: [
        {
          id: 'qr-iot-fu-1',
          label: 'Activate spare SIM',
          labelAr: 'تفعيل شريحة احتياطية',
          payload: 'Yes please activate a spare SIM for the failing device',
          payloadAr: 'نعم، يرجى تفعيل شريحة احتياطية للجهاز المعطل',
        },
        {
          id: 'qr-iot-fu-2',
          label: 'Track the courier',
          labelAr: 'تتبع المندوب',
          payload: 'How can I track the replacement courier?',
          payloadAr: 'كيف يمكنني تتبع مندوب الاستبدال؟',
        },
      ],
    },
  },
  {
    intent: 'service_setup',
    label: 'Service Setup',
    labelAr: 'إعداد الخدمة',
    action: 'solve',
    actionLabel: 'Guide',
    actionLabelAr: 'إرشاد',
    keywords: [
      'setup',
      'set up',
      'install',
      'activate',
      'provision',
      'configure',
      'onboarding',
      'new service',
    ],
    keywordsAr: [
      'إعداد',
      'تركيب',
      'تفعيل',
      'تكوين',
      'تهيئة',
      'خدمة جديدة',
    ],
    responseEn:
      "I'll guide you step-by-step. First, confirm the service type and target location. Once confirmed, I'll trigger the provisioning workflow and book a technician visit if hardware is needed.",
    responseAr:
      'سأرشدك خطوة بخطوة. أولاً، أكد نوع الخدمة والموقع المستهدف. بعد التأكيد، سأبدأ سير عمل التهيئة وأحجز زيارة فني إذا كانت هناك حاجة لمعدات.',
    quickReplies: [
      {
        id: 'qr-setup-1',
        label: 'New fiber line',
        labelAr: 'خط ألياف جديد',
        payload: 'I want to set up a new fiber line at a branch office',
        payloadAr: 'أريد إعداد خط ألياف جديد في فرع',
      },
      {
        id: 'qr-setup-2',
        label: 'MPLS setup',
        labelAr: 'إعداد MPLS',
        payload: 'I need MPLS provisioned between two sites',
        payloadAr: 'أحتاج إلى تهيئة MPLS بين موقعين',
      },
      {
        id: 'qr-setup-3',
        label: 'Schedule a technician',
        labelAr: 'حجز فني',
        payload: 'Please schedule a technician visit',
        payloadAr: 'يرجى تحديد موعد لزيارة فني',
      },
    ],
    references: [],
    followUp: {
      responseEn:
        "Great. I've created the provisioning request and booked an installation slot - the team will reach out within one business day to confirm the date and site survey. Anything else I should add to the order (e.g., backup link, static IPs, managed Wi-Fi)?",
      responseAr:
        'ممتاز. أنشأت طلب التهيئة وحجزت موعد التركيب - سيتواصل الفريق معك خلال يوم عمل لتأكيد التاريخ ومسح الموقع. هل تود إضافة أي شيء آخر إلى الطلب (مثل خط احتياطي، عناوين IP ثابتة، واي فاي مُدار)؟',
      action: 'solve',
      actionLabel: 'Confirm Order',
      actionLabelAr: 'تأكيد الطلب',
      quickReplies: [
        {
          id: 'qr-setup-fu-1',
          label: 'Add static IPs',
          labelAr: 'إضافة عناوين IP ثابتة',
          payload: 'Please add static IPs to the order',
          payloadAr: 'يرجى إضافة عناوين IP ثابتة إلى الطلب',
        },
        {
          id: 'qr-setup-fu-2',
          label: 'No, that is all',
          labelAr: 'لا، هذا كل شيء',
          payload: "No that's all, please confirm the order",
          payloadAr: 'لا، هذا كل شيء، يرجى تأكيد الطلب',
        },
      ],
    },
  },
  {
    intent: 'agent_handoff',
    label: 'Agent Handoff',
    labelAr: 'تحويل إلى وكيل',
    action: 'escalate',
    actionLabel: 'Escalate',
    actionLabelAr: 'تصعيد',
    keywords: [
      'agent',
      'human',
      'talk to someone',
      'representative',
      'escalate',
      'speak to a person',
      'real person',
    ],
    keywordsAr: [
      'وكيل',
      'إنسان',
      'شخص حقيقي',
      'تصعيد',
      'موظف',
      'مندوب',
    ],
    responseEn:
      "Got it - I'm queuing you for a live agent. Based on your Gold SLA, expected wait time is under 4 minutes. Anything you'd like me to pre-fill on the case while you wait?",
    responseAr:
      'تمام - سأضعك في قائمة الانتظار للتحدث مع وكيل مباشر. بناءً على مستوى الخدمة الذهبي، وقت الانتظار المتوقع أقل من 4 دقائق. هل ترغب أن أُعدّ بيانات الحالة بينما تنتظر؟',
    quickReplies: [
      {
        id: 'qr-agent-1',
        label: 'Yes, pre-fill the case',
        labelAr: 'نعم، أعدّ الحالة',
        payload: 'Yes please pre-fill the case with our conversation context',
        payloadAr: 'نعم، يرجى إعداد الحالة بمعلومات محادثتنا',
      },
      {
        id: 'qr-agent-2',
        label: 'Cancel, keep using Obat',
        labelAr: 'إلغاء، متابعة مع أوبت',
        payload: 'Actually cancel that, let me continue with you',
        payloadAr: 'في الواقع، ألغ ذلك ودعنا نتابع معك',
      },
    ],
    references: [],
  },
  {
    intent: 'maintenance',
    label: 'Maintenance & Outages',
    labelAr: 'الصيانة والانقطاعات',
    action: 'inform',
    actionLabel: 'Inform',
    actionLabelAr: 'إعلام',
    keywords: [
      'maintenance',
      'outage',
      'scheduled',
      'down for maintenance',
      'planned work',
      'when will',
    ],
    keywordsAr: [
      'صيانة',
      'انقطاع مجدول',
      'أعمال مجدولة',
      'انقطاع',
      'متى ستعود',
    ],
    responseEn:
      'There is no active maintenance affecting your site (Doha - Diplomatic Area). A planned Fiber Internet maintenance window in Doha - Diplomatic Area is scheduled for Oct 20, 17:00 - 13:00 next day (impact: High). I will notify you if anything changes.',
    responseAr:
      'لا توجد أعمال صيانة نشطة تؤثر على موقعك (الدوحة - الحي الدبلوماسي). هناك نافذة صيانة مخططة لشبكة الألياف في الحي الدبلوماسي يوم 20 أكتوبر من الساعة 17:00 حتى 13:00 من اليوم التالي (التأثير: مرتفع). سأبلغك بأي تغيير.',
    quickReplies: [
      {
        id: 'qr-mnt-1',
        label: 'Notify me on changes',
        labelAr: 'أبلغني بالتحديثات',
        payload: 'Please notify me on any changes to that maintenance window',
        payloadAr: 'يرجى إبلاغي بأي تغييرات على نافذة الصيانة',
      },
      {
        id: 'qr-mnt-2',
        label: 'See all sites',
        labelAr: 'عرض جميع المواقع',
        payload: 'Show me maintenance across all my sites',
        payloadAr: 'اعرض لي الصيانة في جميع مواقعي',
      },
    ],
    references: [
      {
        id: 'ref-mnt-1',
        source: 'active_maintenance_sites',
        language: 'en',
        text:
          'MNT00000009 | Doha - Diplomatic Area | Fiber Internet | High impact | In Progress | Facility electrical system maintenance.',
      },
    ],
  },
  {
    intent: 'account',
    label: 'Account & Plan',
    labelAr: 'الحساب والخطة',
    action: 'inform',
    actionLabel: 'Inform',
    actionLabelAr: 'إعلام',
    keywords: [
      'plan',
      'subscription',
      'account',
      'sla',
      'contract',
      'renewal',
      'upgrade plan',
      'my services',
    ],
    keywordsAr: [
      'الخطة',
      'الاشتراك',
      'الحساب',
      'العقد',
      'تجديد',
      'مستوى الخدمة',
      'الخدمات',
    ],
    responseEn:
      'Your account at a glance: Fiber Business 100 Mbps, Gold SLA (4h response), contract renews in 8 months, monthly fee QAR 284.05. You are eligible for a 200 Mbps upgrade with a 10% multi-year discount.',
    responseAr:
      'لمحة عن حسابك: ألياف الأعمال 100 ميجابت، مستوى خدمة ذهبي (استجابة 4 ساعات)، يجدد العقد خلال 8 أشهر، الرسوم الشهرية 284.05 ريال قطري. أنت مؤهل للترقية إلى 200 ميجابت مع خصم 10٪ للعقود متعددة السنوات.',
    quickReplies: [
      {
        id: 'qr-acct-1',
        label: 'Show upgrade options',
        labelAr: 'عرض خيارات الترقية',
        payload: 'Show me my upgrade options',
        payloadAr: 'اعرض لي خيارات الترقية',
      },
      {
        id: 'qr-acct-2',
        label: 'Renew contract early',
        labelAr: 'تجديد العقد مبكراً',
        payload: 'I want to renew my contract early',
        payloadAr: 'أريد تجديد عقدي مبكراً',
      },
    ],
    offer: {
      productId: 'PROD000002',
      title: 'Upgrade to 200 Mbps Business Fiber',
      titleAr: 'الترقية إلى ألياف الأعمال 200 ميجابت',
      description: 'Double bandwidth, free router upgrade, priority support.',
      descriptionAr: 'ضعف السرعة، ترقية مجانية للموجه، دعم ذو أولوية.',
      price: 'QAR 426.55/mo',
      bandwidth: '200 Mbps',
    },
    references: [],
  },
];

export const GREETING_QUICK_REPLIES: QuickReply[] = [
  {
    id: 'qr-greet-1',
    label: 'My internet is down',
    labelAr: 'الإنترنت لا يعمل',
    payload: 'Our internet is down at the office',
    payloadAr: 'الإنترنت معطل في المكتب',
  },
  {
    id: 'qr-greet-2',
    label: 'Check my balance',
    labelAr: 'تحقق من رصيدي',
    payload: 'Can you show me my current invoice and balance?',
    payloadAr: 'هل يمكنك عرض فاتورتي الحالية ورصيدي؟',
  },
  {
    id: 'qr-greet-3',
    label: 'Any planned maintenance?',
    labelAr: 'هل توجد صيانة مجدولة؟',
    payload: 'Is there any planned maintenance affecting my site?',
    payloadAr: 'هل هناك صيانة مجدولة تؤثر على موقعي؟',
  },
  {
    id: 'qr-greet-4',
    label: 'Talk to an agent',
    labelAr: 'التحدث إلى وكيل',
    payload: 'I want to talk to a human agent',
    payloadAr: 'أريد التحدث إلى وكيل بشري',
  },
];

export const FALLBACK_RESPONSE = {
  en: "I want to make sure I help you correctly. Could you give me a bit more detail - for example, is this about connectivity, billing, cloud, IoT, or a new service setup?",
  ar: 'أريد التأكد من مساعدتك بشكل صحيح. هل يمكنك إعطائي مزيداً من التفاصيل - على سبيل المثال، هل هذا يتعلق بالاتصال أم الفوترة أم السحابة أم إنترنت الأشياء أم إعداد خدمة جديدة؟',
};

export type SmallTalkKind = 'greeting' | 'thanks' | 'affirm' | 'deny' | 'goodbye';

export interface SmallTalkRule {
  kind: SmallTalkKind;
  keywords: string[];
  keywordsAr: string[];
  responseEn: string;
  responseAr: string;
}

export const SMALL_TALK_RULES: SmallTalkRule[] = [
  {
    kind: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'salam', 'salaam'],
    keywordsAr: ['مرحبا', 'مرحباً', 'السلام عليكم', 'أهلا', 'أهلاً', 'صباح الخير', 'مساء الخير'],
    responseEn:
      "Hello! I'm Obat, your Ooredoo Business assistant. I can help with connectivity, billing, cloud, IoT, service setup, and more. What can I help you with today?",
    responseAr:
      'مرحباً! أنا أوبت، مساعدك من أوريدو للأعمال. يمكنني المساعدة في الاتصال والفوترة والسحابة وإنترنت الأشياء وإعداد الخدمات. كيف يمكنني مساعدتك اليوم؟',
  },
  {
    kind: 'thanks',
    keywords: ['thank', 'thanks', 'thx', 'appreciate', 'cheers'],
    keywordsAr: ['شكرا', 'شكراً', 'مشكور', 'يعطيك العافية', 'تسلم'],
    responseEn: "You're welcome! Is there anything else I can help you with?",
    responseAr: 'العفو! هل هناك شيء آخر يمكنني مساعدتك به؟',
  },
  {
    kind: 'affirm',
    keywords: ['yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'please do', 'go ahead', 'sounds good'],
    keywordsAr: ['نعم', 'أيوه', 'تمام', 'حسنا', 'حسناً', 'موافق', 'تفضل'],
    responseEn:
      "Got it - I'll proceed. Anything specific you'd like me to confirm or add before I move forward?",
    responseAr: 'تمام - سأمضي قدماً. هل هناك شيء محدد تريد تأكيده أو إضافته قبل أن أتابع؟',
  },
  {
    kind: 'deny',
    keywords: ["no", 'nope', 'nah', "don't", 'cancel', 'not now', 'later'],
    keywordsAr: ['لا', 'كلا', 'ليس الآن', 'لاحقا', 'لاحقاً', 'إلغاء'],
    responseEn:
      "No problem. I'll hold off on that. Let me know if you'd like to revisit it later or if there's anything else I can help with.",
    responseAr: 'لا مشكلة. سأتوقف عن ذلك. أعلمني إذا أردت العودة إليه لاحقاً أو إذا كان هناك شيء آخر يمكنني مساعدتك به.',
  },
  {
    kind: 'goodbye',
    keywords: ['bye', 'goodbye', 'see you', 'later', 'that is all', "that's all"],
    keywordsAr: ['مع السلامة', 'إلى اللقاء', 'وداعا', 'وداعاً'],
    responseEn:
      "Thanks for chatting with Obat. Have a great day, and reach out anytime - we're here 24/7.",
    responseAr: 'شكراً لتواصلك مع أوبت. أتمنى لك يوماً سعيداً، وتواصل معنا في أي وقت - نحن متاحون 24/7.',
  },
];

export const FOLLOW_UP_SIGNALS_EN: string[] = [
  'still',
  "didn't work",
  'did not work',
  "doesn't work",
  'does not work',
  'not working',
  'persists',
  'persist',
  'no luck',
  'no change',
  'same problem',
  'same issue',
  'tried that',
  'already tried',
  'already did',
  'restarted',
  'rebooted',
  'reset',
  'power cycled',
  'power-cycled',
  'unplugged',
  "doesn't help",
  'no improvement',
];

export const FOLLOW_UP_SIGNALS_AR: string[] = [
  'لا يزال',
  'مازال',
  'ما زال',
  'لا تزال',
  'لازال',
  'لم ينجح',
  'لم تنجح',
  'لا يعمل',
  'لا تعمل',
  'مستمر',
  'مستمرة',
  'نفس المشكلة',
  'جربت',
  'حاولت',
  'أعدت التشغيل',
  'أعدت تشغيل',
  'فصلت',
  'لا فرق',
  'لا فائدة',
  'بدون تحسن',
];
