import { Period } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface PeriodTabsProps {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
}

const periods = [
  { id: "daily" as Period, label: "오늘" },
  { id: "weekly" as Period, label: "이주" },
  { id: "monthly" as Period, label: "이달" },
  { id: "yearly" as Period, label: "올해" },
];

export function PeriodTabs({ selectedPeriod, onPeriodChange }: PeriodTabsProps) {
  return (
    <div className="flex flex-wrap justify-center space-x-2 bg-mystical-purple/20 p-2 rounded-2xl border border-mystical-gold/20">
      {periods.map((period) => (
        <Button
          key={period.id}
          onClick={() => onPeriodChange(period.id)}
          className={`flex-1 min-w-0 px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-200 ${
            selectedPeriod === period.id
              ? "bg-mystical-gold text-mystical-dark"
              : "text-mystical-silver hover:bg-mystical-purple/30 bg-transparent border-none"
          }`}
        >
          {period.label}
        </Button>
      ))}
    </div>
  );
}
