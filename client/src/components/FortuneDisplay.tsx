import { useState, useRef, useEffect } from "react";
import { Fortune, UserProfile, Settings } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateFortuneCard } from "@/lib/canvas-generator";

interface FortuneDisplayProps {
  fortune: Fortune | null;
  profile: UserProfile;
  isGenerating: boolean;
  onGenerate: () => void;
  settings: Settings;
}

export function FortuneDisplay({ 
  fortune, 
  profile, 
  isGenerating, 
  onGenerate, 
  settings 
}: FortuneDisplayProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showFortune, setShowFortune] = useState(!!fortune);

  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const sealRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  useEffect(() => {
    setShowFortune(!!fortune);
  }, [fortune]);

  // 기간별 텍스트 스타일링 함수
  const getFortuneTextStyle = () => {
    if (!fortune) return {};
    
    const periodStyles = {
      daily: {
        fontSize: 'clamp(1.375rem, 4vw, 1.875rem)', // 22-30px
        lineHeight: '1.4'
      },
      weekly: {
        fontSize: 'clamp(1.25rem, 3.5vw, 1.75rem)', // 20-28px  
        lineHeight: '1.45'
      },
      monthly: {
        fontSize: 'clamp(1.125rem, 3vw, 1.625rem)', // 18-26px
        lineHeight: '1.5'
      },
      yearly: {
        fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)', // 20-24px
        lineHeight: '1.65'
      }
    } as const;

    const currentStyle = periodStyles[fortune.period as keyof typeof periodStyles] || periodStyles.daily;

    return {
      ...currentStyle,
      fontWeight: '900',
      color: '#FFD700',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
      letterSpacing: '0.02em'
    };
  };

  const startSealBreaking = () => {
    if (isPressed || showFortune || isGenerating) return;

    setIsPressed(true);
    let currentProgress = 0;
    const duration = 3000; // 3 seconds
    const interval = 50;

    // Haptic feedback
    if ('vibrate' in navigator && settings.motionEnabled) {
      navigator.vibrate([50, 100, 50]);
    }

    progressInterval.current = setInterval(() => {
      currentProgress += interval;
      const progressPercent = (currentProgress / duration) * 100;
      setProgress(progressPercent);

      if (currentProgress >= duration) {
        clearInterval(progressInterval.current!);
        breakSeal();
      }
    }, interval);
  };

  const stopSealBreaking = () => {
    if (!isPressed) return;

    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    // 400ms grace period before reset
    setTimeout(() => {
      if (!isPressed) {
        setProgress(0);
      }
    }, 400);

    setIsPressed(false);
  };

  const breakSeal = () => {
    if (settings.motionEnabled && 'vibrate' in navigator) {
      navigator.vibrate(100);
    }

    onGenerate();
    setShowFortune(true);
    setProgress(0);
    setIsPressed(false);
  };

  const handleShare = async () => {
    if (!fortune) return;

    const text = `${fortune.text}\n\n${getAddresseeText()}\n\n한 줄 예언에서 받은 예언`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "한 줄 예언",
          text: text,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(text);
        toast({
          title: "클립보드에 복사됨",
          description: "예언이 클립보드에 복사되었습니다.",
        });
      }
    } else {
      navigator.clipboard.writeText(text);
      toast({
        title: "클립보드에 복사됨", 
        description: "예언이 클립보드에 복사되었습니다.",
      });
    }
  };

  const handleSaveCard = async () => {
    if (!fortune) return;

    try {
      const canvas = await generateFortuneCard(fortune, getAddresseeText());
      const link = document.createElement('a');
      link.download = `한줄예언_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: "카드 저장 완료",
        description: "예언 카드가 저장되었습니다.",
      });
    } catch (error) {
      toast({
        title: "저장 실패",
        description: "카드 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const getAddresseeText = () => {
    if (!profile?.name) return "";
    const honorific = profile.honorificStyle === "full" ? "여" : "님";
    return `${profile.name}${honorific}에게`;
  };

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && !showFortune) {
        e.preventDefault();
        startSealBreaking();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !showFortune) {
        e.preventDefault();
        stopSealBreaking();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [showFortune]);

  if (showFortune && fortune) {
    return (
      <Card className="dynamic-card mystical-gradient border-mystical-gold/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 runic-pattern"></div>
        <CardContent className="p-6 md:p-8 relative">
          <div className="text-center">
            <p className="fortune-text font-black mb-8 animate-fortune-reveal leading-tight" style={getFortuneTextStyle()}>
              {fortune.text}
            </p>

            {getAddresseeText() && (
              <p className="text-mystical-silver text-sm">
                {getAddresseeText()}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bento-grid mt-8">
            <Button
              onClick={handleShare}
              className="functional-button bg-mystical-gold/20 text-mystical-gold border border-mystical-gold/50 hover:bg-mystical-gold/30 hover:border-mystical-gold flex items-center justify-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-label">공유</span>
            </Button>

            <Button
              onClick={handleSaveCard}
              className="functional-button bg-mystical-purple/30 text-mystical-silver border border-mystical-silver/30 hover:bg-mystical-purple/50 hover:border-mystical-silver flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span className="text-label">카드 저장</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-8">
      <div 
        ref={sealRef}
        className="relative cursor-pointer select-none seal-container p-8"
        onMouseDown={startSealBreaking}
        onMouseUp={stopSealBreaking}
        onMouseLeave={stopSealBreaking}
        onTouchStart={(e) => {
          e.preventDefault();
          startSealBreaking();
        }}
        onTouchEnd={stopSealBreaking}
        onTouchCancel={stopSealBreaking}
      >
        <div className="aspect-square max-w-sm mx-auto relative">
          <div className="absolute inset-0 rune-enhanced rounded-full border-4 border-mystical-gold/60 animate-glow">
            <div className="absolute inset-4 border-2 border-mystical-gold/40 rounded-full">
              <div className="absolute inset-4 border border-mystical-gold/25 rounded-full">
                <div className="absolute inset-6 border border-mystical-gold/15 rounded-full flex items-center justify-center">
                  <div className="w-20 h-20 text-mystical-gold floating-animation">
                    <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full animate-pulse-mystical">
                      <path d="M32 8L40 24H48L42 32L48 40H40L32 56L24 40H16L22 32L16 24H24L32 8Z"/>
                      <circle cx="32" cy="32" r="4" fill="currentColor"/>
                      <circle cx="32" cy="20" r="1.5" fill="currentColor" opacity="0.7"/>
                      <circle cx="32" cy="44" r="1.5" fill="currentColor" opacity="0.7"/>
                      <circle cx="20" cy="32" r="1.5" fill="currentColor" opacity="0.7"/>
                      <circle cx="44" cy="32" r="1.5" fill="currentColor" opacity="0.7"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress ring */}
          <div className={`absolute inset-0 transition-opacity duration-200 ${isPressed ? 'opacity-100' : 'opacity-0'}`}>
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="8"/>
              <circle 
                cx="100" 
                cy="100" 
                r="96" 
                fill="none" 
                stroke="#D4AF37" 
                strokeWidth="8"
                strokeDasharray="603"
                strokeDashoffset={603 - (603 * progress / 100)}
                className="transition-all duration-100 ease-linear"
              />
            </svg>
          </div>
        </div>

        <div className="text-center mt-8 space-y-4">
          <h3 className="text-mystical-gold font-semibold text-xl tracking-wide animate-pulse-mystical">봉인 의식</h3>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-mystical-gold to-transparent mx-auto"></div>
          
                    <div className="bg-mystical-purple/20 backdrop-blur-sm rounded-xl p-6 border border-mystical-purple/30">
            <div className="flex items-center justify-center">
              <span className="text-mystical-glow font-medium">
                룬을 3초간 길게 누르면 예언이 공개됩니다
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}