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
    const seoulTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
    
    switch (period) {
      case "daily":
        return seoulTime.toISOString().split('T')[0]; // YYYY-MM-DD
      case "weekly": {
        const year = seoulTime.getFullYear();
        const firstDayOfYear = new Date(year, 0, 1);
        const pastDaysOfYear = (seoulTime.getTime() - firstDayOfYear.getTime()) / 86400000;
        const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        return `${year}-W${week.toString().padStart(2, '0')}`;
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
        const tomorrow = new Date(seoulTime);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return `내일 00:00 (Asia/Seoul)`;
      }
      case "weekly": {
        const nextWeek = new Date(seoulTime);
        nextWeek.setDate(nextWeek.getDate() + (7 - nextWeek.getDay()));
        return `다음 주 월요일 (Asia/Seoul)`;
      }
      case "monthly": {
        const nextMonth = new Date(seoulTime);
        nextMonth.setMonth(nextMonth.getMonth() + 1, 1);
        return `다음 달 1일 (Asia/Seoul)`;
      }
      case "yearly": {
        const nextYear = new Date(seoulTime);
        nextYear.setFullYear(nextYear.getFullYear() + 1, 0, 1);
        return `내년 1월 1일 (Asia/Seoul)`;
      }
    }
  };

  // Load current fortune
  useEffect(() => {
    const periodKey = getCurrentPeriodKey(period);
    const existingFortune = fortuneHistory[period]?.[periodKey];
    
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
