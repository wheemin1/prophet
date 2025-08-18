import { Fortune, UserProfile, Period } from "@shared/schema";
import { getTemplatesByPeriod } from "./templates";
import { randomUUID } from "crypto";

// Simple hash function for deterministic seeding
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Generate profile hash for seed
function generateProfileHash(profile: UserProfile): string {
  const profileStr = `${profile.name || ""}_${profile.birthdate || ""}_${profile.honorificStyle}`;
  return hashString(profileStr).toString(36);
}

// Generate deterministic seed
function generateSeed(profileHash: string, periodKey: string): string {
  return hashString(`${profileHash}_${periodKey}`).toString(36);
}

// Seeded random number generator
function seededRandom(seed: string, index: number = 0): number {
  const hash = hashString(seed + index.toString());
  return (hash % 1000000) / 1000000;
}

export function generateFortune(
  profile: UserProfile,
  period: Period,
  periodKey: string
): Fortune {
  const templates = getTemplatesByPeriod(period);
  const profileHash = generateProfileHash(profile);
  const seed = generateSeed(profileHash, periodKey);
  
  // Select template using seeded random
  const templateIndex = Math.floor(seededRandom(seed) * templates.length);
  const selectedTemplate = templates[templateIndex];
  
  // Apply honorific style to template
  let fortuneText = selectedTemplate;
  if (profile.name) {
    const honorific = profile.honorificStyle === "full" ? "여" : 
                     profile.honorificStyle === "traveler" ? "여행자" : "";
    if (honorific) {
      fortuneText = `${profile.name}${honorific}, ${fortuneText}`;
    }
  }
  
  return {
    id: crypto.randomUUID(),
    period,
    periodKey,
    text: fortuneText,
    templateId: `${period}_${templateIndex}`,
    seed,
    profileHash,
    generatedAt: new Date().toISOString(),
  };
}
