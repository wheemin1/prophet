
import { Period } from "@shared/schema";

interface PeriodTabsProps {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
}

const periodLabels = {
  daily: "오늘",
  weekly: "이주", 
  monthly: "이달",
  yearly: "올해"
};

export function PeriodTabs({ selectedPeriod, onPeriodChange }: PeriodTabsProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-mystical-dark/50 backdrop-blur-sm rounded-lg p-1 border border-mystical-gold/20 flex">
        {(Object.keys(periodLabels) as Period[]).map((period) => (
          <button
            key={period}
            onClick={() => onPeriodChange(period)}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
              selectedPeriod === period
                ? "bg-mystical-gold/20 text-mystical-gold border border-mystical-gold/50"
                : "text-mystical-silver hover:text-white hover:bg-mystical-gold/10"
            }`}
          >
            {periodLabels[period]}
          </button>
        ))}
      </div>
    </div>
  );
}
