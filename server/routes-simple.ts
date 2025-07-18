import type { Express } from "express";
import { createServer, type Server } from "http";
import { simpleStorage } from "./storage-simple";
import { insertMediaItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  console.log("Starting MediaNudge in standalone mode - no authentication required");
  
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // Media items routes
  app.get('/api/media', async (req, res) => {
    try {
      const { type, limit } = req.query;
      const items = await simpleStorage.getMediaItems(
        type as string,
        limit ? parseInt(limit as string) : undefined
      );
      res.json(items);
    } catch (error) {
      console.error("Error fetching media items:", error);
      res.status(500).json({ message: "Failed to fetch media items" });
    }
  });

  app.get('/api/media/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await simpleStorage.getMediaItem(id);
      
      if (!item) {
        return res.status(404).json({ message: "Media item not found" });
      }
      
      res.json(item);
    } catch (error) {
      console.error("Error fetching media item:", error);
      res.status(500).json({ message: "Failed to fetch media item" });
    }
  });

  app.get('/api/search', async (req, res) => {
    try {
      const { q, type } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const items = await simpleStorage.searchMediaItems(q, type as string);
      res.json(items);
    } catch (error) {
      console.error("Error searching media items:", error);
      res.status(500).json({ message: "Failed to search media items" });
    }
  });

  // Admin routes
  app.post('/api/media', async (req, res) => {
    try {
      const validatedData = insertMediaItemSchema.parse(req.body);
      const item = await simpleStorage.createMediaItem(validatedData);
      res.json(item);
    } catch (error) {
      console.error("Error creating media item:", error);
      res.status(500).json({ message: "Failed to create media item" });
    }
  });

  app.post('/api/admin/media', async (req, res) => {
    try {
      const validatedData = insertMediaItemSchema.parse(req.body);
      const item = await simpleStorage.createMediaItem(validatedData);
      res.json(item);
    } catch (error) {
      console.error("Error creating media item:", error);
      res.status(500).json({ message: "Failed to create media item" });
    }
  });

  app.delete('/api/media/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await simpleStorage.deleteMediaItem(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting media item:", error);
      res.status(500).json({ message: "Failed to delete media item" });
    }
  });

  app.delete('/api/admin/media/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await simpleStorage.deleteMediaItem(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting media item:", error);
      res.status(500).json({ message: "Failed to delete media item" });
    }
  });

  // Weekly challenge route
  app.get('/api/weekly-challenge', async (req, res) => {
    try {
      const challenge = await simpleStorage.getActiveWeeklyChallenge();
      res.json(challenge);
    } catch (error) {
      console.error("Error fetching weekly challenge:", error);
      res.status(500).json({ message: "Failed to fetch weekly challenge" });
    }
  });

  // Recommendations routes
  app.get('/api/recommendations', async (req, res) => {
    try {
      const { type } = req.query;
      const recommendations = await simpleStorage.getRecommendations(type as string);
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  app.get('/api/top-users', async (req, res) => {
    try {
      const users = await simpleStorage.getTopUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching top users:", error);
      res.status(500).json({ message: "Failed to fetch top users" });
    }
  });

  // Guiding questions routes
  app.get('/api/guiding-questions', async (req, res) => {
    try {
      const questions = await simpleStorage.getGuidingQuestions();
      res.json(questions);
    } catch (error) {
      console.error("Error fetching guiding questions:", error);
      res.status(500).json({ message: "Failed to fetch guiding questions" });
    }
  });

  app.post('/api/guiding-questions', async (req, res) => {
    try {
      const { question } = req.body;
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ message: "Question is required" });
      }
      
      const createdQuestion = await simpleStorage.createGuidingQuestion({ question });
      res.json(createdQuestion);
    } catch (error) {
      console.error("Error creating guiding question:", error);
      res.status(500).json({ message: "Failed to create guiding question" });
    }
  });

  app.delete('/api/guiding-questions/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await simpleStorage.deleteGuidingQuestion(id);
      res.json({ success: true, message: "Guiding question deleted successfully" });
    } catch (error) {
      console.error("Error deleting guiding question:", error);
      res.status(500).json({ message: "Failed to delete guiding question" });
    }
  });

  // Disabled user-specific routes (return empty responses)
  
  app.get('/api/user/media-ratings', (req, res) => res.json([]));
  app.post('/api/user/media-ratings', (req, res) => res.json({ success: true, message: "Feature disabled in standalone mode" }));
  
  app.post('/api/user/follow', (req, res) => res.json({ success: true, message: "Feature disabled in standalone mode" }));
  app.post('/api/user/unfollow', (req, res) => res.json({ success: true, message: "Feature disabled in standalone mode" }));
  app.get('/api/user/followers', (req, res) => res.json([]));
  app.get('/api/user/following', (req, res) => res.json([]));
  app.get('/api/user/activity', (req, res) => res.json([]));
  
  app.get('/api/user/yearly-goal/:year', (req, res) => res.json(null));
  app.post('/api/user/yearly-goal', (req, res) => res.json({ success: true, message: "Feature disabled in standalone mode" }));
  
  app.get('/api/user/content', (req, res) => res.json([]));
  app.post('/api/user/content', (req, res) => res.json({ success: true, message: "Feature disabled in standalone mode" }));
  
  app.get('/api/user/challenge-progress/:challengeId', (req, res) => res.json(null));
  app.post('/api/user/challenge-progress/:challengeId', (req, res) => res.json({ success: true, message: "Feature disabled in standalone mode" }));

  const httpServer = createServer(app);
  return httpServer;
}