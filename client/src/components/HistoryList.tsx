import { useLocalStorage } from "@/hooks/use-local-storage";
import { FortuneHistory, Period } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ThumbsUp, Meh } from "lucide-react";
import { useState } from "react";

interface HistoryListProps {
  period: Period;
}

export function HistoryList({ period }: HistoryListProps) {
  const [history] = useLocalStorage<FortuneHistory>("fortuneHistory", {
    daily: {},
    weekly: {},
    monthly: {},
    yearly: {},
  });
  
  const [showAll, setShowAll] = useState(false);
  
  const periodHistory = Object.values(history[period] || {})
    .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
  
  const displayedHistory = showAll ? periodHistory : periodHistory.slice(0, 3);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return "오늘";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "어제";
    } else {
      return date.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
    }
  };

  if (periodHistory.length === 0) {
    return (
      <Card className="dynamic-card bg-mystical-purple/10 border-mystical-gold/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-mystical-gold flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>내 예언 기록</span>
            <span className="text-xs text-label text-mystical-silver/70 ml-auto">
              {period === "daily" && "일별"} 
              {period === "weekly" && "주별"} 
              {period === "monthly" && "월별"} 
              {period === "yearly" && "연별"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-mystical-silver mb-2">아직 예언 기록이 없습니다.</p>
            <p className="text-sm text-mystical-silver/70">
              첫 예언을 받아보세요!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dynamic-card bg-mystical-purple/10 border-mystical-gold/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg text-mystical-gold flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>내 예언 기록</span>
          <span className="text-xs text-label text-mystical-silver/70 ml-auto">
            {period === "daily" && "일별"} 
            {period === "weekly" && "주별"} 
            {period === "monthly" && "월별"} 
            {period === "yearly" && "연별"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayedHistory.map((fortune) => (
            <div 
              key={fortune.id}
              className="flex items-start space-x-3 p-3 bg-mystical-dark/30 rounded-lg"
            >
              <div className="flex-shrink-0 w-2 h-2 bg-mystical-gold rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-mystical-silver">
                    {formatDate(fortune.generatedAt)}
                  </span>
                  {fortune.reaction && (
                    <span className="text-xs text-mystical-gold">
                      {fortune.reaction === "positive" ? (
                        <ThumbsUp className="w-3 h-3" />
                      ) : (
                        <Meh className="w-3 h-3" />
                      )}
                    </span>
                  )}
                </div>
                <p className="text-sm text-white">{fortune.text}</p>
              </div>
            </div>
          ))}
        </div>
        
        {periodHistory.length > 3 && (
          <div className="mt-4 text-center">
            <Button
              onClick={() => setShowAll(!showAll)}
              className="functional-button bg-mystical-purple/20 text-mystical-silver hover:bg-mystical-purple/30 hover:text-mystical-gold border border-mystical-silver/20 hover:border-mystical-gold/30"
            >
              <span className="text-label">
                {showAll ? "접기" : `${periodHistory.length - 3}개 더 보기`}
              </span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
