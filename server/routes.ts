import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Static template serving for fortune generation
  app.get("/api/templates/:period", (req, res) => {
    const { period } = req.params;
    
    // Return template count for the period (used for analytics)
    const templateCounts = {
      daily: 300,
      weekly: 180, 
      monthly: 120,
      yearly: 24
    };
    
    res.json({ 
      period,
      templateCount: templateCounts[period as keyof typeof templateCounts] || 0
    });
  });

  // Analytics endpoint (optional, for tracking usage)
  app.post("/api/analytics", (req, res) => {
    // Simple analytics collection
    const { event, data } = req.body;
    
    // Log analytics event (in production, send to analytics service)
    console.log(`Analytics: ${event}`, data);
    
    res.json({ success: true });
  });

  const httpServer = createServer(app);
  return httpServer;
}
