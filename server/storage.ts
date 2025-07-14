import {
  users,
  guidingQuestions,
  mediaItems,
  userMediaRatings,
  userFollows,
  yearlyGoals,
  userContent,
  weeklyCharlenges,
  userChallengeProgress,
  type User,
  type UpsertUser,
  type GuidingQuestion,
  type InsertGuidingQuestion,
  type MediaItem,
  type InsertMediaItem,
  type UserMediaRating,
  type InsertUserMediaRating,
  type YearlyGoal,
  type InsertYearlyGoal,
  type UserContent,
  type InsertUserContent,
  type WeeklyChallenge,
  type UserChallengeProgress,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, or, count } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Guiding questions
  getGuidingQuestions(userId: string): Promise<GuidingQuestion[]>;
  createGuidingQuestion(question: InsertGuidingQuestion): Promise<GuidingQuestion>;
  deleteGuidingQuestion(id: number): Promise<void>;
  
  // Media items
  getMediaItems(type?: string, limit?: number): Promise<MediaItem[]>;
  getMediaItem(id: number): Promise<MediaItem | undefined>;
  createMediaItem(item: InsertMediaItem): Promise<MediaItem>;
  deleteMediaItem(id: number): Promise<void>;
  searchMediaItems(query: string, type?: string): Promise<MediaItem[]>;
  
  // User media ratings
  getUserMediaRatings(userId: string): Promise<(UserMediaRating & { media: MediaItem })[]>;
  getUserMediaRating(userId: string, mediaId: number): Promise<UserMediaRating | undefined>;
  createOrUpdateUserMediaRating(rating: InsertUserMediaRating): Promise<UserMediaRating>;
  
  // Social features
  followUser(followerId: string, followingId: string): Promise<void>;
  unfollowUser(followerId: string, followingId: string): Promise<void>;
  getFollowers(userId: string): Promise<User[]>;
  getFollowing(userId: string): Promise<User[]>;
  getRecentActivity(userId: string): Promise<any[]>;
  
  // Goals
  getYearlyGoal(userId: string, year: number): Promise<YearlyGoal | undefined>;
  createOrUpdateYearlyGoal(goal: InsertYearlyGoal): Promise<YearlyGoal>;
  
  // User content
  getUserContent(userId: string): Promise<UserContent[]>;
  createUserContent(content: InsertUserContent): Promise<UserContent>;
  
  // Weekly challenges
  getActiveWeeklyChallenge(): Promise<WeeklyChallenge | undefined>;
  getUserChallengeProgress(userId: string, challengeId: number): Promise<UserChallengeProgress | undefined>;
  updateChallengeProgress(userId: string, challengeId: number, progress: any): Promise<void>;
  
  // Recommendations
  getRecommendations(userId: string, type?: string): Promise<MediaItem[]>;
  getTopUsers(): Promise<User[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations - mandatory for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Guiding questions
  async getGuidingQuestions(userId: string): Promise<GuidingQuestion[]> {
    return await db
      .select()
      .from(guidingQuestions)
      .where(eq(guidingQuestions.userId, userId))
      .orderBy(desc(guidingQuestions.createdAt));
  }

  async createGuidingQuestion(question: InsertGuidingQuestion): Promise<GuidingQuestion> {
    const [newQuestion] = await db
      .insert(guidingQuestions)
      .values(question)
      .returning();
    return newQuestion;
  }

  async deleteGuidingQuestion(id: number): Promise<void> {
    await db.delete(guidingQuestions).where(eq(guidingQuestions.id, id));
  }

  // Media items
  async getMediaItems(type?: string, limit = 20): Promise<MediaItem[]> {
    const query = db
      .select()
      .from(mediaItems)
      .orderBy(desc(mediaItems.avgRating))
      .limit(limit);
    
    if (type) {
      query.where(eq(mediaItems.type, type));
    }
    
    return await query;
  }

  async getMediaItem(id: number): Promise<MediaItem | undefined> {
    const [item] = await db
      .select()
      .from(mediaItems)
      .where(eq(mediaItems.id, id));
    return item;
  }

  async createMediaItem(item: InsertMediaItem): Promise<MediaItem> {
    const [newItem] = await db
      .insert(mediaItems)
      .values(item)
      .returning();
    return newItem;
  }

  async deleteMediaItem(id: number): Promise<void> {
    await db.delete(mediaItems).where(eq(mediaItems.id, id));
  }

  async searchMediaItems(query: string, type?: string): Promise<MediaItem[]> {
    const searchQuery = db
      .select()
      .from(mediaItems)
      .where(
        and(
          or(
            sql`${mediaItems.title} ILIKE ${`%${query}%`}`,
            sql`${mediaItems.author} ILIKE ${`%${query}%`}`,
            sql`${mediaItems.description} ILIKE ${`%${query}%`}`
          ),
          type ? eq(mediaItems.type, type) : undefined
        )
      )
      .orderBy(desc(mediaItems.avgRating))
      .limit(20);
    
    return await searchQuery;
  }

  // User media ratings
  async getUserMediaRatings(userId: string): Promise<(UserMediaRating & { media: MediaItem })[]> {
    const results = await db
      .select()
      .from(userMediaRatings)
      .innerJoin(mediaItems, eq(userMediaRatings.mediaId, mediaItems.id))
      .where(eq(userMediaRatings.userId, userId))
      .orderBy(desc(userMediaRatings.createdAt));
    
    return results.map(row => ({
      ...row.user_media_ratings,
      media: row.media_items
    }));
  }

  async getUserMediaRating(userId: string, mediaId: number): Promise<UserMediaRating | undefined> {
    const [rating] = await db
      .select()
      .from(userMediaRatings)
      .where(
        and(
          eq(userMediaRatings.userId, userId),
          eq(userMediaRatings.mediaId, mediaId)
        )
      );
    return rating;
  }

  async createOrUpdateUserMediaRating(rating: InsertUserMediaRating): Promise<UserMediaRating> {
    const [newRating] = await db
      .insert(userMediaRatings)
      .values(rating)
      .onConflictDoUpdate({
        target: [userMediaRatings.userId, userMediaRatings.mediaId],
        set: {
          ...rating,
          updatedAt: new Date(),
        },
      })
      .returning();

    // Update media item average rating
    const avgResult = await db
      .select({
        avgRating: sql<number>`AVG(${userMediaRatings.rating})`,
        totalRatings: count(userMediaRatings.id),
      })
      .from(userMediaRatings)
      .where(eq(userMediaRatings.mediaId, rating.mediaId));

    if (avgResult[0]) {
      await db
        .update(mediaItems)
        .set({
          avgRating: avgResult[0].avgRating,
          totalRatings: avgResult[0].totalRatings,
        })
        .where(eq(mediaItems.id, rating.mediaId));
    }

    return newRating;
  }

  // Social features
  async followUser(followerId: string, followingId: string): Promise<void> {
    await db
      .insert(userFollows)
      .values({ followerId, followingId })
      .onConflictDoNothing();
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    await db
      .delete(userFollows)
      .where(
        and(
          eq(userFollows.followerId, followerId),
          eq(userFollows.followingId, followingId)
        )
      );
  }

  async getFollowers(userId: string): Promise<User[]> {
    const results = await db
      .select()
      .from(users)
      .innerJoin(userFollows, eq(users.id, userFollows.followerId))
      .where(eq(userFollows.followingId, userId));
    
    return results.map(row => row.users);
  }

  async getFollowing(userId: string): Promise<User[]> {
    const results = await db
      .select()
      .from(users)
      .innerJoin(userFollows, eq(users.id, userFollows.followingId))
      .where(eq(userFollows.followerId, userId));
    
    return results.map(row => row.users);
  }

  async getRecentActivity(userId: string): Promise<any[]> {
    // Get recent ratings from users that the current user follows
    const followingUsers = await db
      .select({ id: users.id })
      .from(users)
      .innerJoin(userFollows, eq(users.id, userFollows.followingId))
      .where(eq(userFollows.followerId, userId));

    if (followingUsers.length === 0) {
      return [];
    }

    const followingIds = followingUsers.map(u => u.id);
    
    return await db
      .select({
        id: userMediaRatings.id,
        userId: userMediaRatings.userId,
        rating: userMediaRatings.rating,
        review: userMediaRatings.review,
        createdAt: userMediaRatings.createdAt,
        mediaTitle: mediaItems.title,
        mediaType: mediaItems.type,
        userFirstName: users.firstName,
        userLastName: users.lastName,
        userProfileImageUrl: users.profileImageUrl,
      })
      .from(userMediaRatings)
      .innerJoin(mediaItems, eq(userMediaRatings.mediaId, mediaItems.id))
      .innerJoin(users, eq(userMediaRatings.userId, users.id))
      .where(sql`${userMediaRatings.userId} = ANY(${followingIds})`)
      .orderBy(desc(userMediaRatings.createdAt))
      .limit(20);
  }

  // Goals
  async getYearlyGoal(userId: string, year: number): Promise<YearlyGoal | undefined> {
    const [goal] = await db
      .select()
      .from(yearlyGoals)
      .where(
        and(
          eq(yearlyGoals.userId, userId),
          eq(yearlyGoals.year, year)
        )
      );
    return goal;
  }

  async createOrUpdateYearlyGoal(goal: InsertYearlyGoal): Promise<YearlyGoal> {
    const [newGoal] = await db
      .insert(yearlyGoals)
      .values(goal)
      .onConflictDoUpdate({
        target: [yearlyGoals.userId, yearlyGoals.year],
        set: {
          ...goal,
          updatedAt: new Date(),
        },
      })
      .returning();
    return newGoal;
  }

  // User content
  async getUserContent(userId: string): Promise<UserContent[]> {
    return await db
      .select()
      .from(userContent)
      .where(eq(userContent.userId, userId))
      .orderBy(desc(userContent.createdAt));
  }

  async createUserContent(content: InsertUserContent): Promise<UserContent> {
    const [newContent] = await db
      .insert(userContent)
      .values(content)
      .returning();
    return newContent;
  }

  // Weekly challenges
  async getActiveWeeklyChallenge(): Promise<WeeklyChallenge | undefined> {
    const [challenge] = await db
      .select()
      .from(weeklyCharlenges)
      .where(eq(weeklyCharlenges.active, true))
      .orderBy(desc(weeklyCharlenges.createdAt))
      .limit(1);
    return challenge;
  }

  async getUserChallengeProgress(userId: string, challengeId: number): Promise<UserChallengeProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userChallengeProgress)
      .where(
        and(
          eq(userChallengeProgress.userId, userId),
          eq(userChallengeProgress.challengeId, challengeId)
        )
      );
    return progress;
  }

  async updateChallengeProgress(userId: string, challengeId: number, progress: any): Promise<void> {
    await db
      .insert(userChallengeProgress)
      .values({
        userId,
        challengeId,
        progress,
        completed: progress.completed || false,
      })
      .onConflictDoUpdate({
        target: [userChallengeProgress.userId, userChallengeProgress.challengeId],
        set: {
          progress,
          completed: progress.completed || false,
          updatedAt: new Date(),
        },
      });
  }

  // Recommendations
  async getRecommendations(userId: string, type?: string): Promise<MediaItem[]> {
    // Simple recommendation: get highest rated items that user hasn't rated yet
    const userRatedItems = await db
      .select({ mediaId: userMediaRatings.mediaId })
      .from(userMediaRatings)
      .where(eq(userMediaRatings.userId, userId));

    const ratedIds = userRatedItems.map(r => r.mediaId);
    
    // Build conditions array
    const conditions = [];
    
    if (ratedIds.length > 0) {
      conditions.push(sql`${mediaItems.id} NOT IN (${ratedIds})`);
    }
    
    if (type) {
      conditions.push(eq(mediaItems.type, type));
    }
    
    const query = db
      .select()
      .from(mediaItems)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(mediaItems.avgRating))
      .limit(10);

    return await query;
  }

  async getTopUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.wisdomScore))
      .limit(10);
  }
}

export const storage = new DatabaseStorage();
