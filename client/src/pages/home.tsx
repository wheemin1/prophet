import { useState, useEffect } from "react";
import { PersonalizationForm } from "@/components/PersonalizationForm";
import { PeriodTabs } from "@/components/PeriodTabs";
import { FortuneDisplay } from "@/components/FortuneDisplay";
import { HistoryList } from "@/components/HistoryList";
import { SettingsPanel } from "@/components/SettingsPanel";
import { useFortune } from "@/hooks/use-fortune";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { UserProfile, Settings, Period } from "@shared/schema";
import { Clock, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Home() {
  const [profile, setProfile] = useLocalStorage<UserProfile>("profile", {
    createdAt: new Date().toISOString(),
    timezone: "Asia/Seoul",
    honorificStyle: "short",
  });
  
  const [settings, setSettings] = useLocalStorage<Settings>("settings", {
    soundEnabled: true,
    motionEnabled: true,
    theme: "dark",
    consentGiven: false,
  });

  const [selectedPeriod, setSelectedPeriod] = useState<Period>("daily");
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  const { currentFortune, nextFortuneTime, generateFortune, isGenerating } = useFortune(
    profile,
    selectedPeriod
  );

  // PWA install banner logic
  useEffect(() => {
    const visitCount = parseInt(localStorage.getItem("visitCount") || "0") + 1;
    localStorage.setItem("visitCount", visitCount.toString());
    
    if (visitCount > 1) {
      setShowInstallBanner(true);
    }
  }, []);

  const getVoiceStyle = () => {
    // Auto-determined voice style based on profile
    return "균형";
  };

  return (
    <div className="min-h-screen bg-mystical-dark text-white font-korean">
      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="fixed top-0 left-0 right-0 bg-mystical-purple/90 backdrop-blur-sm text-white p-3 z-50 border-b border-mystical-gold/20">
          <div className="container mx-auto flex items-center justify-between text-sm">
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-mystical-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              <span>홈 화면에 추가하면 더 빨라요</span>
            </span>
            <button 
              onClick={() => setShowInstallBanner(false)} 
              className="text-mystical-gold hover:text-mystical-glow"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 mystical-gradient"></div>
        <div className="absolute inset-0 opacity-10 runic-pattern"></div>
        
        <div className="relative container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-mystical-gold">
              한줄신탁
            </h1>
            <p className="text-lg md:text-xl text-mystical-silver mb-6">
              예언은 오늘 단 하나만 주어진다
            </p>
            
            {/* Today's Voice Chip */}
            <div className="inline-flex items-center space-x-2 bg-mystical-purple/30 px-4 py-2 rounded-full text-sm border border-mystical-gold/20">
              <span className="text-mystical-silver">오늘의 목소리:</span>
              <span className="text-mystical-gold font-medium">{getVoiceStyle()} (자동)</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-mystical-silver cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>설정에서 한 번만 바꿀 수 있어요</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20">
        {/* Personalization Section */}
        <section className="mb-8">
          <PersonalizationForm profile={profile} onProfileChange={setProfile} />
        </section>

        {/* Period Tabs */}
        <section className="mb-8">
          <PeriodTabs selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
        </section>

        {/* Countdown Timer */}
        <div className="text-center mb-6">
          <p className="text-sm text-mystical-silver mb-2 flex items-center justify-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>다음 예언</span>
          </p>
          <p className="text-lg font-semibold text-mystical-gold">
            {nextFortuneTime}
          </p>
        </div>

        {/* Fortune Display Section */}
        <section className="mb-8">
          <FortuneDisplay
            fortune={currentFortune}
            profile={profile}
            isGenerating={isGenerating}
            onGenerate={generateFortune}
            settings={settings}
          />
        </section>

        {/* History Section */}
        <section className="mb-8">
          <HistoryList period={selectedPeriod} />
        </section>

        {/* Settings and Data Management */}
        <section className="mb-8">
          <SettingsPanel settings={settings} onSettingsChange={setSettings} />
        </section>

        {/* Legal/Privacy Notice */}
        <section className="text-center text-xs text-mystical-silver/70 space-y-2">
          <p>엔터테인먼트 목적으로 제작되었으며, 의료·금융 조언이 아닙니다.</p>
          <p>모든 데이터는 브라우저에만 저장되며 서버로 전송되지 않습니다.</p>
          <div className="space-x-4">
            <a href="#" className="hover:text-mystical-gold transition-colors duration-200">개인정보처리방침</a>
            <a href="#" className="hover:text-mystical-gold transition-colors duration-200">이용약관</a>
          </div>
        </section>
      </main>

      {/* Fixed Bottom Ad Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-mystical-dark/95 backdrop-blur-sm border-t border-mystical-gold/20 z-40">
        <div className="h-16 flex items-center justify-center">
          <div className="text-xs text-mystical-silver/50">
            광고 영역 (320x50)
          </div>
        </div>
      </div>
    </div>
  );
}
