
import { useState, useEffect } from "react";
import { Period } from "@shared/schema";
import { FortuneDisplay } from "@/components/FortuneDisplay";
import { PeriodTabs } from "@/components/PeriodTabs";
import { PersonalizationForm } from "@/components/PersonalizationForm";
import { SettingsPanel } from "@/components/SettingsPanel";
import { HistoryList } from "@/components/HistoryList";
import { useFortune } from "@/hooks/use-fortune";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Clock, User, Info, Settings, History } from "lucide-react";

interface Profile {
  name: string;
  birthdate: string;
  timezone: string;
}

interface Settings {
  notifications: boolean;
  soundEffects: boolean;
  shareAnalytics: boolean;
}

export default function Home() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("daily");
  const [profile, setProfile] = useLocalStorage<Profile>("profile", {
    name: "",
    birthdate: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [settings, setSettings] = useLocalStorage<Settings>("settings", {
    notifications: true,
    soundEffects: true,
    shareAnalytics: false,
  });
  
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

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
    return "균형";
  };

  const hasProfile = profile.name || profile.birthdate;

  const getProfileChipText = () => {
    if (!hasProfile) return null;
    return `${profile.name || "익명"} · ${profile.birthdate || "미설정"}`;
  };

  const getNextFortuneText = () => {
    const now = new Date();
    let nextTime: Date;
    
    switch (selectedPeriod) {
      case "daily":
        nextTime = new Date(now);
        nextTime.setDate(nextTime.getDate() + 1);
        nextTime.setHours(0, 0, 0, 0);
        return "다음 예언: 내일 00:00 (Asia/Seoul)";
      case "weekly":
        nextTime = new Date(now);
        const daysUntilMonday = (7 - now.getDay() + 1) % 7 || 7;
        nextTime.setDate(nextTime.getDate() + daysUntilMonday);
        nextTime.setHours(0, 0, 0, 0);
        return "다음 예언: 다음 주 월요일 00:00 (Asia/Seoul)";
      case "monthly":
        nextTime = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        return "다음 예언: 다음 달 1일 00:00 (Asia/Seoul)";
      case "yearly":
        nextTime = new Date(now.getFullYear() + 1, 0, 1);
        return "다음 예언: 내년 1월 1일 00:00 (Asia/Seoul)";
      default:
        return "다음 예언: 내일 00:00 (Asia/Seoul)";
    }
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

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-mystical-gold tracking-wide">
            한 줄 예언
          </h1>
          <p className="text-mystical-silver text-lg">
            예언은 오늘 단 하나만 주어진다
          </p>
          
          {/* Status Chips */}
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <div className="bg-mystical-dark/50 border border-mystical-gold/30 rounded-full px-3 py-1 text-mystical-silver">
              오늘의 목소리: {getVoiceStyle()}
            </div>
            <div className="bg-mystical-dark/50 border border-mystical-gold/30 rounded-full px-3 py-1 text-mystical-silver flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{getNextFortuneText()}</span>
            </div>
            {hasProfile && (
              <Dialog open={showPersonalization} onOpenChange={setShowPersonalization}>
                <DialogTrigger asChild>
                  <button className="bg-mystical-gold/20 border border-mystical-gold/50 rounded-full px-3 py-1 text-mystical-gold hover:bg-mystical-gold/30 transition-colors">
                    {getProfileChipText()}
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-mystical-dark border-mystical-gold/30">
                  <DialogHeader>
                    <DialogTitle className="text-mystical-gold">개인화 입력</DialogTitle>
                    <p className="text-mystical-silver text-sm">
                      입력 정보는 서버에 저장되지 않으며, 예언 생성 시드로만 사용됩니다.
                    </p>
                  </DialogHeader>
                  <PersonalizationForm profile={profile} onProfileChange={setProfile} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </header>

        {/* Period Tabs */}
        <PeriodTabs selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />

        {/* Hero Section - 봉인 중심 */}
        {!currentFortune ? (
          <section className="text-center space-y-6">
            {/* Fortune Display Component */}
            <FortuneDisplay
              fortune={currentFortune}
              isGenerating={isGenerating}
              onGenerate={generateFortune}
              period={selectedPeriod}
            />
            
            {/* 안내 문구 */}
            <div className="space-y-2 text-mystical-silver">
              <p>룬을 3초간 길게 누르면 예언이 공개됩니다.</p>
              <p className="text-sm">데스크톱: 스페이스바 3초 홀드</p>
            </div>
            
            {/* Secondary Links */}
            <div className="flex justify-center space-x-6 text-sm">
              {!hasProfile && (
                <Dialog open={showPersonalization} onOpenChange={setShowPersonalization}>
                  <DialogTrigger asChild>
                    <button className="flex items-center space-x-1 text-mystical-silver hover:text-mystical-gold transition-colors">
                      <User className="w-4 h-4" />
                      <span>개인화(선택)</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-mystical-dark border-mystical-gold/30">
                    <DialogHeader>
                      <DialogTitle className="text-mystical-gold">개인화 입력</DialogTitle>
                      <p className="text-mystical-silver text-sm">
                        입력 정보는 서버에 저장되지 않으며, 예언 생성 시드로만 사용됩니다.
                      </p>
                    </DialogHeader>
                    <PersonalizationForm profile={profile} onProfileChange={setProfile} />
                  </DialogContent>
                </Dialog>
              )}
              
              <button 
                onClick={() => setShowInfoModal(true)}
                className="flex items-center space-x-1 text-mystical-silver hover:text-mystical-gold transition-colors"
              >
                <Info className="w-4 h-4" />
                <span>알림/설명</span>
              </button>
            </div>
          </section>
        ) : (
          /* 예언 공개 상태 */
          <section className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-mystical-gold">오늘의 예언</h2>
              <FortuneDisplay
                fortune={currentFortune}
                isGenerating={isGenerating}
                onGenerate={generateFortune}
                period={selectedPeriod}
              />
            </div>
          </section>
        )}

        {/* Secondary Actions */}
        <section className="flex justify-center space-x-4">
          <Sheet open={showHistory} onOpenChange={setShowHistory}>
            <SheetTrigger asChild>
              <Button variant="outline" className="bg-mystical-dark/50 border-mystical-gold/30 text-mystical-silver hover:text-mystical-gold">
                <History className="w-4 h-4 mr-2" />
                내 예언 기록
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-mystical-dark border-mystical-gold/30 h-[80vh]">
              <SheetHeader>
                <SheetTitle className="text-mystical-gold">내 예언 기록</SheetTitle>
              </SheetHeader>
              <HistoryList />
            </SheetContent>
          </Sheet>

          <Button 
            variant="outline" 
            onClick={() => setShowSettings(!showSettings)}
            className="bg-mystical-dark/50 border-mystical-gold/30 text-mystical-silver hover:text-mystical-gold"
          >
            <Settings className="w-4 h-4 mr-2" />
            설정
          </Button>
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

      {/* Info Modal */}
      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="bg-mystical-dark border-mystical-gold/30">
          <DialogHeader>
            <DialogTitle className="text-mystical-gold">한 줄 예언 안내</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-mystical-silver">
            <p>• 개인 정보는 서버에 저장되지 않고 브라우저에만 보관됩니다.</p>
            <p>• 이름과 생년월일은 예언 생성을 위한 시드로만 사용됩니다.</p>
            <p>• 하루에 한 번씩 새로운 예언을 받을 수 있습니다.</p>
            <p>• 예언은 엔터테인먼트 목적으로 제공됩니다.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
