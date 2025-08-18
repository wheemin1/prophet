
import { Period } from "@shared/schema";

interface PeriodTabsProps {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
}

const periodLabels = {
  daily: { main: "오늘", sub: "밈" },
  weekly: { main: "이주", sub: "반진지" },
  monthly: { main: "이달", sub: "장엄" },
  yearly: { main: "올해", sub: "신탁" }
};

export function PeriodTabs({ selectedPeriod, onPeriodChange }: PeriodTabsProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-mystical-dark/50 backdrop-blur-sm rounded-lg p-1 border border-mystical-gold/20">
        {(Object.keys(periodLabels) as Period[]).map((period) => (
          <button
            key={period}
            onClick={() => onPeriodChange(period)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex flex-col items-center ${
              selectedPeriod === period
                ? "bg-mystical-gold/20 text-mystical-gold border border-mystical-gold/50"
                : "text-mystical-silver hover:text-white hover:bg-mystical-gold/10"
            }`}
          >
            <span className="text-base">{periodLabels[period].main}</span>
            <span className="text-xs opacity-70">{periodLabels[period].sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
