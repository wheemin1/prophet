// Minimal storage interface for analytics only
export interface IStorage {
  logEvent(event: string, data: any): Promise<void>;
}

export class MemStorage implements IStorage {
  async logEvent(event: string, data: any): Promise<void> {
    // Simple in-memory analytics logging
    console.log(`Analytics: ${event}`, data);
  }
}

export const storage = new MemStorage();
