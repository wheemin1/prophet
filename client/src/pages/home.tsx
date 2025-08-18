import { useState, useEffect } from "react";
import { PersonalizationForm } from "@/components/PersonalizationForm";
import { PeriodTabs } from "@/components/PeriodTabs";
import { FortuneDisplay } from "@/components/FortuneDisplay";
import { HistoryList } from "@/components/HistoryList";
import { SettingsPanel } from "@/components/SettingsPanel";
import { useFortune } from "@/hooks/use-fortune";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { UserProfile, Settings, Period } from "@shared/schema";
import { Clock, Info, Settings as SettingsIcon, ChevronDown, ChevronUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [showPersonalization, setShowPersonalization] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

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

  // Auto-collapse personalization after applying
  useEffect(() => {
    if (profile.name || profile.birthdate) {
      setShowPersonalization(false);
    }
  }, [profile.name, profile.birthdate]);

  const getVoiceStyle = () => {
    // Auto-determined voice style based on profile
    return "균형";
  };

  const hasProfile = profile.name || profile.birthdate;

  const getProfileChipText = () => {
    if (!hasProfile) return null;
    return `${profile.name || "익명"} · ${profile.birthdate || "생년월일 미설정"}`;
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
          <div className="flex items-center justify-between mb-6">
            {/* Header Icons */}
            <div></div>
            <div className="flex items-center space-x-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-mystical-silver hover:text-mystical-gold"
                  >
                    <SettingsIcon className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>설정</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-mystical-silver hover:text-mystical-gold"
                  >
                    <Info className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>정보</TooltipContent>
              </Tooltip>
            </div>
          </div>
          
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
                  <p>설정에서 한 번만 바꿀 수 있어요.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          
          {/* Profile Chip (when personalization is collapsed) */}
          {hasProfile && !showPersonalization && (
            <div className="text-center mt-4">
              <Button
                variant="ghost"
                onClick={() => setShowPersonalization(true)}
                className="text-sm text-mystical-silver hover:text-mystical-gold bg-mystical-purple/20 hover:bg-mystical-purple/30 px-4 py-2 rounded-full"
              >
                {getProfileChipText()}
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-24">
        <div className="space-y-8 md:space-y-12">
        {/* Collapsible Personalization Section */}
        {showPersonalization && (
          <section>
            <Card className="dynamic-card mystical-gradient border-mystical-gold/20 backdrop-blur-sm">
              <CardHeader 
                className="cursor-pointer"
                onClick={() => setShowPersonalization(!showPersonalization)}
              >
                <CardTitle className="text-xl text-mystical-gold flex items-center justify-between">
                  <span>개인화 입력</span>
                  {showPersonalization ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </CardTitle>
                <p className="text-sm text-mystical-silver">
                  입력 정보는 서버에 저장되지 않으며, 예언 생성 시드로만 사용됩니다.
                </p>
              </CardHeader>
              <CardContent>
                <PersonalizationForm profile={profile} onProfileChange={setProfile} />
              </CardContent>
            </Card>
          </section>
        )}

        {/* Period Tabs */}
        <section>
          <PeriodTabs selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
        </section>

        {/* Countdown Timer */}
        <section className="text-center">
          <p className="text-sm text-mystical-silver mb-2 flex items-center justify-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>다음 예언</span>
          </p>
          <p className="text-lg font-semibold text-mystical-gold">
            {nextFortuneTime}
          </p>
        </section>

        {/* Fortune Display Section */}
        <section>
          <FortuneDisplay
            fortune={currentFortune}
            profile={profile}
            isGenerating={isGenerating}
            onGenerate={generateFortune}
            settings={settings}
          />
        </section>

        {/* In-feed Ad Placeholder */}
        <section className="bg-mystical-purple/10 border border-mystical-gold/10 rounded-2xl p-8 text-center">
          <div className="text-xs text-mystical-silver/50">
            광고 영역 (In-feed/Native)
          </div>
        </section>

        {/* History Section */}
        <section>
          <HistoryList period={selectedPeriod} />
        </section>

        {/* Settings Panel (conditionally shown) */}
        {showSettings && (
          <section>
            <SettingsPanel settings={settings} onSettingsChange={setSettings} />
          </section>
        )}

        {/* Legal/Privacy Notice */}
        <section className="text-center text-xs text-mystical-silver/70 space-y-2 pt-8">
          <p>엔터테인먼트 목적이며, 의료·금전 조언이 아닙니다.</p>
          <p>모든 데이터는 브라우저에만 저장되며 서버로 전송되지 않습니다.</p>
          <div className="space-x-4">
            <a href="#" className="hover:text-mystical-gold transition-colors duration-200">개인정보처리방침</a>
            <a href="#" className="hover:text-mystical-gold transition-colors duration-200">이용약관</a>
          </div>
        </section>
        </div>
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
