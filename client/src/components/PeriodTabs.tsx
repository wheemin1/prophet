import { Period } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface PeriodTabsProps {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
}

const periods = [
  { id: "daily" as Period, label: "오늘", tone: "밈" },
  { id: "weekly" as Period, label: "이주", tone: "반진지" },
  { id: "monthly" as Period, label: "이달", tone: "장엄" },
  { id: "yearly" as Period, label: "올해", tone: "신탁" },
];

export function PeriodTabs({ selectedPeriod, onPeriodChange }: PeriodTabsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-mystical-purple/20 rounded-2xl border border-mystical-gold/20">
      {periods.map((period) => (
        <Button
          key={period.id}
          onClick={() => onPeriodChange(period.id)}
          className={`functional-button flex flex-col items-center gap-1 p-3 h-auto transition-all duration-200 ${
            selectedPeriod === period.id
              ? "bg-mystical-gold text-mystical-dark"
              : "text-mystical-silver hover:bg-mystical-purple/30 bg-transparent border-none"
          }`}
        >
          <span className="text-sm font-medium">{period.label}</span>
          <span className="text-xs text-label opacity-70">{period.tone}</span>
        </Button>
      ))}
    </div>
  );
}
