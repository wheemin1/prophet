import { useState, useEffect } from "react";
import { Fortune, UserProfile, Period } from "@shared/schema";
import { useLocalStorage } from "./use-local-storage";
import { generateFortune } from "@/lib/fortune-engine";

export function useFortune(profile: UserProfile, period: Period) {
  const [fortuneHistory, setFortuneHistory] = useLocalStorage("fortuneHistory", {
    daily: {},
    weekly: {},
    monthly: {},
    yearly: {},
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentFortune, setCurrentFortune] = useState<Fortune | null>(null);
  const [nextFortuneTime, setNextFortuneTime] = useState<string>("");

  // Get current period key
  const getCurrentPeriodKey = (period: Period): string => {
    const now = new Date();
    // 정확한 Seoul 시간 계산
    const seoulTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
    
    switch (period) {
      case "daily":
        return seoulTime.toISOString().split('T')[0]; // YYYY-MM-DD
      case "weekly": {
        // 현재 주의 월요일을 기준으로 키 생성
        const currentDate = new Date(seoulTime);
        const dayOfWeek = currentDate.getDay(); // 0=일요일, 1=월요일
        
        // 이번 주 월요일 찾기 (일요일이면 지난 월요일, 아니면 이번 주 월요일)
        const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const thisMonday = new Date(currentDate);
        thisMonday.setDate(currentDate.getDate() + daysToMonday);
        
        const year = thisMonday.getFullYear();
        const month = thisMonday.getMonth() + 1;
        const date = thisMonday.getDate();
        
        return `${year}-W${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
      }
      case "monthly":
        return `${seoulTime.getFullYear()}-${(seoulTime.getMonth() + 1).toString().padStart(2, '0')}`;
      case "yearly":
        return seoulTime.getFullYear().toString();
    }
  };

  // Calculate next fortune time
  const getNextFortuneTime = (period: Period): string => {
    const now = new Date();
    const seoulTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
    
    switch (period) {
      case "daily": {
        return `내일 00:00 (Asia/Seoul)`;
      }
      case "weekly": {
        return `다음 주 월요일 00:00 (Asia/Seoul)`;
      }
      case "monthly": {
        return `다음 달 1일 00:00 (Asia/Seoul)`;
      }
      case "yearly": {
        return `내년 1월 1일 00:00 (Asia/Seoul)`;
      }
    }
  };

  // Load current fortune
  useEffect(() => {
    const periodKey = getCurrentPeriodKey(period);
    const periodHistory = fortuneHistory[period] as Record<string, Fortune>;
    const existingFortune = periodHistory?.[periodKey];
    
    if (existingFortune) {
      setCurrentFortune(existingFortune);
    } else {
      setCurrentFortune(null);
    }
    
    setNextFortuneTime(getNextFortuneTime(period));
  }, [period, fortuneHistory]);

  const handleGenerateFortune = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      // Simulate network delay for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const periodKey = getCurrentPeriodKey(period);
      const fortune = generateFortune(profile, period, periodKey);
      
      // Save to history
      const updatedHistory = {
        ...fortuneHistory,
        [period]: {
          ...fortuneHistory[period],
          [periodKey]: fortune,
        },
      };
      
      setFortuneHistory(updatedHistory);
      setCurrentFortune(fortune);
    } catch (error) {
      console.error("Failed to generate fortune:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    currentFortune,
    nextFortuneTime,
    generateFortune: handleGenerateFortune,
    isGenerating,
  };
}
