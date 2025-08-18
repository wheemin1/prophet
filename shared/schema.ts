import { z } from "zod";

export const userProfileSchema = z.object({
  name: z.string().optional(),
  birthdate: z.string().optional(), // YYYY-MM-DD format
  timezone: z.string().default("Asia/Seoul"),
  createdAt: z.string(),
  honorificStyle: z.enum(["short", "full", "traveler"]).default("short"),
});

export const settingsSchema = z.object({
  soundEnabled: z.boolean().default(true),
  motionEnabled: z.boolean().default(true),
  theme: z.enum(["dark", "light"]).default("dark"),
  consentGiven: z.boolean().default(false),
});

export const fortuneSchema = z.object({
  id: z.string(),
  period: z.enum(["daily", "weekly", "monthly", "yearly"]),
  periodKey: z.string(), // YYYY-MM-DD, YYYY-WW, YYYY-MM, YYYY
  text: z.string(),
  templateId: z.string(),
  seed: z.string(),
  profileHash: z.string(),
  generatedAt: z.string(),
  reaction: z.enum(["positive", "neutral"]).optional(),
});

export const fortuneHistorySchema = z.object({
  daily: z.record(z.string(), fortuneSchema),
  weekly: z.record(z.string(), fortuneSchema),
  monthly: z.record(z.string(), fortuneSchema),
  yearly: z.record(z.string(), fortuneSchema),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type Fortune = z.infer<typeof fortuneSchema>;
export type FortuneHistory = z.infer<typeof fortuneHistorySchema>;
export type Period = "daily" | "weekly" | "monthly" | "yearly";
