import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { MobileChatView } from './components/mobile/MobileChatView';
import { DesktopDashboard } from './components/desktop/DesktopDashboard';
import { Button } from './components/ui/button';
import { Monitor, Smartphone } from 'lucide-react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';

function AppShell() {
  const [view, setView] = useState<'mobile' | 'desktop'>('mobile');
  const { isArabic } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-100" dir={isArabic ? 'rtl' : 'ltr'}>
      <div
        className={`fixed top-4 ${isArabic ? 'left-4' : 'right-4'} z-50 flex gap-2 bg-white rounded-lg shadow-lg p-2`}
      >
        <Button
          variant={view === 'mobile' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('mobile')}
          className={view === 'mobile' ? 'bg-[#E60000] hover:bg-[#cc0000]' : ''}
        >
          <Smartphone className={`w-4 h-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
          {isArabic ? 'الجوال' : 'Mobile'}
        </Button>
        <Button
          variant={view === 'desktop' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('desktop')}
          className={view === 'desktop' ? 'bg-[#E60000] hover:bg-[#cc0000]' : ''}
        >
          <Monitor className={`w-4 h-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
          {isArabic ? 'سطح المكتب' : 'Desktop'}
        </Button>
      </div>

      {view === 'mobile' ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-200 sm:p-6">
          <div className="w-full sm:w-[420px] sm:shadow-2xl sm:rounded-3xl overflow-hidden">
            <MobileChatView />
          </div>
        </div>
      ) : (
        <DesktopDashboard />
      )}

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  );
}
