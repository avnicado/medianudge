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
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Guiding questions routes
  app.get('/api/guiding-questions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const questions = await storage.getGuidingQuestions(userId);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching guiding questions:", error);
      res.status(500).json({ message: "Failed to fetch guiding questions" });
    }
  });

  app.post('/api/guiding-questions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertGuidingQuestionSchema.parse({
        ...req.body,
        userId,
      });
      
      const question = await storage.createGuidingQuestion(validatedData);
      res.json(question);
    } catch (error) {
      console.error("Error creating guiding question:", error);
      res.status(500).json({ message: "Failed to create guiding question" });
    }
  });

  app.delete('/api/guiding-questions/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteGuidingQuestion(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting guiding question:", error);
      res.status(500).json({ message: "Failed to delete guiding question" });
    }
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

  // User media ratings routes
  app.get('/api/user/media-ratings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const ratings = await storage.getUserMediaRatings(userId);
      res.json(ratings);
    } catch (error) {
      console.error("Error fetching user media ratings:", error);
      res.status(500).json({ message: "Failed to fetch user media ratings" });
    }
  });

  app.post('/api/user/media-ratings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertUserMediaRatingSchema.parse({
        ...req.body,
        userId,
      });
      
      const rating = await storage.createOrUpdateUserMediaRating(validatedData);
      res.json(rating);
    } catch (error) {
      console.error("Error creating/updating media rating:", error);
      res.status(500).json({ message: "Failed to create/update media rating" });
    }
  });

  // Social features routes
  app.post('/api/user/follow', isAuthenticated, async (req: any, res) => {
    try {
      const followerId = req.user.claims.sub;
      const { followingId } = req.body;
      
      await storage.followUser(followerId, followingId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error following user:", error);
      res.status(500).json({ message: "Failed to follow user" });
    }
  });

  app.post('/api/user/unfollow', isAuthenticated, async (req: any, res) => {
    try {
      const followerId = req.user.claims.sub;
      const { followingId } = req.body;
      
      await storage.unfollowUser(followerId, followingId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error unfollowing user:", error);
      res.status(500).json({ message: "Failed to unfollow user" });
    }
  });

  app.get('/api/user/followers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const followers = await storage.getFollowers(userId);
      res.json(followers);
    } catch (error) {
      console.error("Error fetching followers:", error);
      res.status(500).json({ message: "Failed to fetch followers" });
    }
  });

  app.get('/api/user/following', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const following = await storage.getFollowing(userId);
      res.json(following);
    } catch (error) {
      console.error("Error fetching following:", error);
      res.status(500).json({ message: "Failed to fetch following" });
    }
  });

  app.get('/api/user/activity', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const activity = await storage.getRecentActivity(userId);
      res.json(activity);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });

  // Goals routes
  app.get('/api/user/yearly-goal/:year', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const year = parseInt(req.params.year);
      const goal = await storage.getYearlyGoal(userId, year);
      res.json(goal);
    } catch (error) {
      console.error("Error fetching yearly goal:", error);
      res.status(500).json({ message: "Failed to fetch yearly goal" });
    }
  });

  app.post('/api/user/yearly-goal', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertYearlyGoalSchema.parse({
        ...req.body,
        userId,
      });
      
      const goal = await storage.createOrUpdateYearlyGoal(validatedData);
      res.json(goal);
    } catch (error) {
      console.error("Error creating/updating yearly goal:", error);
      res.status(500).json({ message: "Failed to create/update yearly goal" });
    }
  });

  // User content routes
  app.get('/api/user/content', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const content = await storage.getUserContent(userId);
      res.json(content);
    } catch (error) {
      console.error("Error fetching user content:", error);
      res.status(500).json({ message: "Failed to fetch user content" });
    }
  });

  app.post('/api/user/content', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertUserContentSchema.parse({
        ...req.body,
        userId,
      });
      
      const content = await storage.createUserContent(validatedData);
      res.json(content);
    } catch (error) {
      console.error("Error creating user content:", error);
      res.status(500).json({ message: "Failed to create user content" });
    }
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
