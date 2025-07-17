import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertGuidingQuestionSchema,
  insertMediaItemSchema,
  insertUserMediaRatingSchema,
  insertYearlyGoalSchema,
  insertUserContentSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Docker
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // Auth middleware (disabled in standalone mode)
  await setupAuth(app);

  // Guiding questions routes - disabled in standalone mode
  app.get('/api/guiding-questions', async (req, res) => {
    res.json([]);
  });

  app.post('/api/guiding-questions', async (req, res) => {
    res.json({ success: true, message: "Feature disabled in standalone mode" });
  });

  app.delete('/api/guiding-questions/:id', async (req, res) => {
    res.json({ success: true, message: "Feature disabled in standalone mode" });
  });

  // Media items routes
  app.get('/api/media', async (req, res) => {
    try {
      const { type, limit } = req.query;
      const items = await storage.getMediaItems(
        type as string,
        limit ? parseInt(limit as string) : undefined
      );
      res.json(items);
    } catch (error) {
      console.error("Error fetching media items:", error);
      res.status(500).json({ message: "Failed to fetch media items" });
    }
  });

  app.get('/api/media/search', async (req, res) => {
    try {
      const { q, type } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      
      const items = await storage.searchMediaItems(q as string, type as string);
      res.json(items);
    } catch (error) {
      console.error("Error searching media items:", error);
      res.status(500).json({ message: "Failed to search media items" });
    }
  });

  app.post('/api/media', async (req: any, res) => {
    try {
      const validatedData = insertMediaItemSchema.parse(req.body);
      const item = await storage.createMediaItem(validatedData);
      res.json(item);
    } catch (error) {
      console.error("Error creating media item:", error);
      res.status(500).json({ message: "Failed to create media item" });
    }
  });

  app.get('/api/media/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getMediaItem(id);
      if (!item) {
        return res.status(404).json({ message: "Media item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching media item:", error);
      res.status(500).json({ message: "Failed to fetch media item" });
    }
  });

  app.delete('/api/media/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMediaItem(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting media item:", error);
      res.status(500).json({ message: "Failed to delete media item" });
    }
  });

  // User media ratings routes - disabled in standalone mode
  app.get('/api/user/media-ratings', async (req, res) => {
    res.json([]);
  });

  app.post('/api/user/media-ratings', async (req, res) => {
    res.json({ success: true, message: "Feature disabled in standalone mode" });
  });

  // Social features routes - disabled in standalone mode
  app.post('/api/user/follow', async (req, res) => {
    res.json({ success: true, message: "Feature disabled in standalone mode" });
  });

  app.post('/api/user/unfollow', async (req, res) => {
    res.json({ success: true, message: "Feature disabled in standalone mode" });
  });

  app.get('/api/user/followers', async (req, res) => {
    res.json([]);
  });

  app.get('/api/user/following', async (req, res) => {
    res.json([]);
  });

  app.get('/api/user/activity', async (req, res) => {
    res.json([]);
  });

  // Goals routes - disabled in standalone mode
  app.get('/api/user/yearly-goal/:year', async (req, res) => {
    res.json(null);
  });

  app.post('/api/user/yearly-goal', async (req, res) => {
    res.json({ success: true, message: "Feature disabled in standalone mode" });
  });

  // User content routes - disabled in standalone mode
  app.get('/api/user/content', async (req, res) => {
    res.json([]);
  });

  app.post('/api/user/content', async (req, res) => {
    res.json({ success: true, message: "Feature disabled in standalone mode" });
  });

  // Weekly challenges routes
  app.get('/api/weekly-challenge', async (req, res) => {
    try {
      const challenge = await storage.getActiveWeeklyChallenge();
      res.json(challenge);
    } catch (error) {
      console.error("Error fetching weekly challenge:", error);
      res.status(500).json({ message: "Failed to fetch weekly challenge" });
    }
  });

  app.get('/api/user/challenge-progress/:challengeId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const challengeId = parseInt(req.params.challengeId);
      const progress = await storage.getUserChallengeProgress(userId, challengeId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching challenge progress:", error);
      res.status(500).json({ message: "Failed to fetch challenge progress" });
    }
  });

  app.post('/api/user/challenge-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { challengeId, progress } = req.body;
      
      await storage.updateChallengeProgress(userId, challengeId, progress);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating challenge progress:", error);
      res.status(500).json({ message: "Failed to update challenge progress" });
    }
  });

  // Recommendations routes
  app.get('/api/recommendations', async (req: any, res) => {
    try {
      const { type } = req.query;
      const recommendations = await storage.getRecommendations("anonymous", type as string);
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  app.get('/api/top-users', async (req, res) => {
    try {
      const users = await storage.getTopUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching top users:", error);
      res.status(500).json({ message: "Failed to fetch top users" });
    }
  });

  // Public profile routes
  app.get('/api/profile/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const [
        guidingQuestions,
        mediaRatings,
        userContent,
        yearlyGoal,
        followers,
        following,
      ] = await Promise.all([
        storage.getGuidingQuestions(userId),
        storage.getUserMediaRatings(userId),
        storage.getUserContent(userId),
        storage.getYearlyGoal(userId, new Date().getFullYear()),
        storage.getFollowers(userId),
        storage.getFollowing(userId),
      ]);
      
      res.json({
        user,
        guidingQuestions,
        mediaRatings,
        userContent,
        yearlyGoal,
        followersCount: followers.length,
        followingCount: following.length,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
