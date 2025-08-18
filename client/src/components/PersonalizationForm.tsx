import { useState } from "react";
import { UserProfile } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PersonalizationFormProps {
  profile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
}

export function PersonalizationForm({ profile, onProfileChange }: PersonalizationFormProps) {
  const [name, setName] = useState(profile.name || "");
  const [birthdate, setBirthdate] = useState(profile.birthdate || "");

  const handleApply = () => {
    onProfileChange({
      ...profile,
      name: name.trim() || undefined,
      birthdate: birthdate || undefined,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <Label htmlFor="name" className="text-mystical-silver">이름 (선택)</Label>
        <Input
          id="name"
          type="text"
          placeholder="홍길동"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-mystical-dark/50 border-mystical-gold/30 text-white placeholder-mystical-silver/50 focus:ring-mystical-gold focus:border-mystical-gold"
        />
      </div>
      <div>
        <Label htmlFor="birthdate" className="text-mystical-silver">생년월일 (선택)</Label>
        <Input
          id="birthdate"
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          className="bg-mystical-dark/50 border-mystical-gold/30 text-white focus:ring-mystical-gold focus:border-mystical-gold"
        />
      </div>
      
      <div className="md:col-span-2 text-center mt-4">
        <Button
          onClick={handleApply}
          className="bg-mystical-gold/20 text-mystical-gold border border-mystical-gold/50 hover:bg-mystical-gold/30 hover:border-mystical-gold"
        >
          개인화 적용
        </Button>
      </div>
    </div>
  );
}
