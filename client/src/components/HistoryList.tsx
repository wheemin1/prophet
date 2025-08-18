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
      <Card className="bg-mystical-purple/10 border-mystical-gold/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-mystical-gold flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>내 예언 기록</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-mystical-silver">아직 예언 기록이 없습니다.</p>
            <p className="text-sm text-mystical-silver/70 mt-2">
              첫 예언을 받아보세요!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-mystical-purple/10 border-mystical-gold/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg text-mystical-gold flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>내 예언 기록</span>
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
              variant="ghost"
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-mystical-gold hover:text-mystical-glow"
            >
              {showAll ? "접기" : "전체 기록 보기"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
