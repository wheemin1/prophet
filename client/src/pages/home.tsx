
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
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [countdown, setCountdown] = useState("계산 중...");

  const { currentFortune, nextFortuneTime, generateFortune, isGenerating } = useFortune(
    profile,
    selectedPeriod
  );

  // 시간 계산 함수들
  const getTimeUntilNext = (period: Period): string => {
    const now = new Date();
    const seoulTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
    let nextTime: Date;

    switch (period) {
      case "daily":
        nextTime = new Date(seoulTime);
        nextTime.setDate(nextTime.getDate() + 1);
        nextTime.setHours(0, 0, 0, 0);
        break;
      case "weekly":
        nextTime = new Date(seoulTime);
        const daysUntilMonday = (7 - seoulTime.getDay() + 1) % 7 || 7;
        nextTime.setDate(nextTime.getDate() + daysUntilMonday);
        nextTime.setHours(0, 0, 0, 0);
        break;
      case "monthly":
        nextTime = new Date(seoulTime.getFullYear(), seoulTime.getMonth() + 1, 1);
        break;
      case "yearly":
        nextTime = new Date(seoulTime.getFullYear() + 1, 0, 1);
        break;
      default:
        nextTime = new Date(seoulTime);
        nextTime.setDate(nextTime.getDate() + 1);
        nextTime.setHours(0, 0, 0, 0);
    }

    const diff = nextTime.getTime() - seoulTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}일 ${hours % 24}시간 ${minutes}분`;
    }
    return `${hours}시간 ${minutes}분`;
  };

  // 카운트다운 업데이트
  useEffect(() => {
    const updateCountdown = () => {
      setCountdown(getTimeUntilNext(selectedPeriod));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // 1분마다 업데이트

    return () => clearInterval(interval);
  }, [selectedPeriod]);

  // 기간 변경시 카운트다운 업데이트
  useEffect(() => {
    setCountdown(getTimeUntilNext(selectedPeriod));
  }, [selectedPeriod]);

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
    switch (selectedPeriod) {
      case "daily":
        return `다음 예언: ${countdown} 후 · 내일 00:00 (Asia/Seoul)`;
      case "weekly":
        return `다음 예언: ${countdown} 후 · 다음 주 월요일 00:00 (Asia/Seoul)`;
      case "monthly":
        return `다음 예언: ${countdown} 후 · 다음 달 1일 00:00 (Asia/Seoul)`;
      case "yearly":
        return `다음 예언: ${countdown} 후 · 내년 1월 1일 00:00 (Asia/Seoul)`;
      default:
        return `다음 예언: ${countdown} 후 · 내일 00:00 (Asia/Seoul)`;
    }
  };

  return (
    <div className="min-h-screen bg-mystical-dark text-white font-korean">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-shimmer tracking-wide floating-animation">
              한 줄 예언
            </h1>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-mystical-gold to-transparent mx-auto"></div>
          </div>
          <p className="text-mystical-silver text-lg font-light tracking-wide">
            예언은 오늘 단 하나만 주어진다
          </p>
          
          {/* Status Chips */}
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <div className="chip-enhanced rounded-full px-4 py-2 text-mystical-silver">
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-mystical-gold pulse-glow"></div>
                <span>오늘의 목소리: {getVoiceStyle()} (자동)</span>
              </span>
            </div>
            <div className="chip-enhanced rounded-full px-4 py-2 text-mystical-silver flex items-center space-x-2">
              <Clock className="w-3 h-3 text-mystical-gold" />
              <span>{getNextFortuneText()}</span>
            </div>
            {hasProfile && (
              <Dialog open={showPersonalization} onOpenChange={setShowPersonalization}>
                <DialogTrigger asChild>
                  <button className="chip-enhanced bg-mystical-gold/15 border border-mystical-gold/40 rounded-full px-4 py-2 text-mystical-gold hover:bg-mystical-gold/25 interactive-button">
                    <span className="flex items-center space-x-2">
                      <User className="w-3 h-3" />
                      <span>{getProfileChipText()}</span>
                    </span>
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
              profile={profile}
              isGenerating={isGenerating}
              onGenerate={generateFortune}
              settings={settings}
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
              <h2 className="text-2xl font-semibold text-mystical-gold">
                {selectedPeriod === "daily" && "오늘의 예언"}
                {selectedPeriod === "weekly" && "이주의 예언"}
                {selectedPeriod === "monthly" && "이달의 예언"}
                {selectedPeriod === "yearly" && "올해의 예언"}
              </h2>
              <FortuneDisplay
                fortune={currentFortune}
                profile={profile}
                isGenerating={isGenerating}
                onGenerate={generateFortune}
                settings={settings}
              />
            </div>
          </section>
        )}

        {/* Secondary Actions */}
        <section className="flex justify-center space-x-4">
          <Sheet open={showHistory} onOpenChange={setShowHistory}>
            <SheetTrigger asChild>
              <Button variant="outline" className="mystical-glow-enhanced glass-morphism border-mystical-gold/30 text-mystical-silver hover:text-mystical-gold interactive-button">
                <History className="w-4 h-4 mr-2" />
                내 예언 기록
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="mystical-gradient border-mystical-gold/30 h-[80vh]">
              <SheetHeader>
                <SheetTitle className="text-mystical-gold">내 예언 기록</SheetTitle>
              </SheetHeader>
              <HistoryList />
            </SheetContent>
          </Sheet>

          <Button 
            variant="outline" 
            onClick={() => setShowSettings(!showSettings)}
            className="mystical-glow-enhanced glass-morphism border-mystical-gold/30 text-mystical-silver hover:text-mystical-gold interactive-button"
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
