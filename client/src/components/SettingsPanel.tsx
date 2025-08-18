import { Settings } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, RotateCcw } from "lucide-react";

interface SettingsPanelProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const { toast } = useToast();

  const handleSettingChange = (key: keyof Settings, value: boolean) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  const handleExportData = () => {
    try {
      const data = {
        profile: localStorage.getItem("profile"),
        settings: localStorage.getItem("settings"),
        fortuneHistory: localStorage.getItem("fortuneHistory"),
        exportDate: new Date().toISOString(),
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `한줄신탁_백업_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "내보내기 완료",
        description: "데이터가 성공적으로 내보내졌습니다.",
      });
    } catch (error) {
      toast({
        title: "내보내기 실패",
        description: "데이터 내보내기 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          
          if (data.profile) localStorage.setItem("profile", data.profile);
          if (data.settings) localStorage.setItem("settings", data.settings);
          if (data.fortuneHistory) localStorage.setItem("fortuneHistory", data.fortuneHistory);
          
          window.location.reload();
        } catch (error) {
          toast({
            title: "가져오기 실패",
            description: "잘못된 파일 형식입니다.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleResetData = () => {
    if (confirm("모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Settings Card */}
      <Card className="bg-mystical-purple/10 border-mystical-gold/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-mystical-gold">설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="sound" className="text-sm text-mystical-silver">사운드 효과</Label>
            <Switch
              id="sound"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => handleSettingChange("soundEnabled", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="motion" className="text-sm text-mystical-silver">모션 효과</Label>
            <Switch
              id="motion"
              checked={settings.motionEnabled}
              onCheckedChange={(checked) => handleSettingChange("motionEnabled", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="theme" className="text-sm text-mystical-silver">다크 모드</Label>
            <Switch
              id="theme"
              checked={settings.theme === "dark"}
              onCheckedChange={(checked) => handleSettingChange("theme", checked)}
              disabled={true}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Data Management Card */}
      <Card className="bg-mystical-purple/10 border-mystical-gold/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-mystical-gold">데이터 관리</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={handleExportData}
            className="w-full justify-start bg-mystical-dark/30 text-mystical-silver hover:bg-mystical-dark/50"
          >
            <Download className="w-4 h-4 mr-2" />
            내보내기 (JSON)
          </Button>
          <Button
            onClick={handleImportData}
            className="w-full justify-start bg-mystical-dark/30 text-mystical-silver hover:bg-mystical-dark/50"
          >
            <Upload className="w-4 h-4 mr-2" />
            가져오기
          </Button>
          <Button
            onClick={handleResetData}
            className="w-full justify-start bg-red-500/20 text-red-300 hover:bg-red-500/30"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            초기화
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
