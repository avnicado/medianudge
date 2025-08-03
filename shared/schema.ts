import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  real,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  wisdomScore: integer("wisdom_score").default(0),
  criticScore: real("critic_score").default(0),
  expertiseGoal: integer("expertise_goal").default(5), // 1-10 scale
  junkTolerance: integer("junk_tolerance").default(3), // 1-5 scale
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const guidingQuestions = pgTable("guiding_questions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  question: text("question").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mediaItems = pgTable("media_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: varchar("type").notNull(), // book, course, movie, podcast, debate, game
  author: text("author"),
  description: text("description"),
  imageUrl: text("image_url"),
  externalId: text("external_id"), // For API integration
  // Three-dimensional ratings (1-5 scale)
  avgMindExpanding: real("avg_mind_expanding").default(3.0),
  avgInformative: real("avg_informative").default(3.0),
  avgEntertaining: real("avg_entertaining").default(3.0),
  totalRatings: integer("total_ratings").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userMediaRatings = pgTable("user_media_ratings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  mediaId: integer("media_id").notNull().references(() => mediaItems.id),
  // Three-dimensional ratings (1-5 scale each)
  mindExpandingRating: integer("mind_expanding_rating").notNull(), // 1-5: junk food -> mind expanding
  informativeRating: integer("informative_rating").notNull(), // 1-5: uninformative -> informative  
  entertainingRating: integer("entertaining_rating").notNull(), // 1-5: boring -> entertaining
  review: text("review"),
  dateConsumed: timestamp("date_consumed"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userFollows = pgTable("user_follows", {
  followerId: varchar("follower_id").notNull().references(() => users.id),
  followingId: varchar("following_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.followerId, table.followingId] }),
}));

export const yearlyGoals = pgTable("yearly_goals", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  year: integer("year").notNull(),
  booksTarget: integer("books_target").default(0),
  coursesTarget: integer("courses_target").default(0),
  debatesTarget: integer("debates_target").default(0),
  podcastsTarget: integer("podcasts_target").default(0),
  booksCompleted: integer("books_completed").default(0),
  coursesCompleted: integer("courses_completed").default(0),
  debatesCompleted: integer("debates_completed").default(0),
  podcastsCompleted: integer("podcasts_completed").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userContent = pgTable("user_content", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  type: varchar("type").notNull(), // video, article, debate_contribution
  content: text("content"),
  url: text("url"),
  avgRating: real("avg_rating").default(0),
  totalRatings: integer("total_ratings").default(0),
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const weeklyCharlenges = pgTable("weekly_challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  requirements: jsonb("requirements").notNull(), // Array of requirements
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userChallengeProgress = pgTable("user_challenge_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  challengeId: integer("challenge_id").notNull().references(() => weeklyCharlenges.id),
  progress: jsonb("progress").notNull(), // Array of completed requirements
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  guidingQuestions: many(guidingQuestions),
  mediaRatings: many(userMediaRatings),
  yearlyGoals: many(yearlyGoals),
  userContent: many(userContent),
  challengeProgress: many(userChallengeProgress),
  followers: many(userFollows, { relationName: "followers" }),
  following: many(userFollows, { relationName: "following" }),
}));

export const guidingQuestionsRelations = relations(guidingQuestions, ({ one }) => ({
  user: one(users, {
    fields: [guidingQuestions.userId],
    references: [users.id],
  }),
}));

export const mediaItemsRelations = relations(mediaItems, ({ many }) => ({
  ratings: many(userMediaRatings),
}));

export const userMediaRatingsRelations = relations(userMediaRatings, ({ one }) => ({
  user: one(users, {
    fields: [userMediaRatings.userId],
    references: [users.id],
  }),
  media: one(mediaItems, {
    fields: [userMediaRatings.mediaId],
    references: [mediaItems.id],
  }),
}));

export const userFollowsRelations = relations(userFollows, ({ one }) => ({
  follower: one(users, {
    fields: [userFollows.followerId],
    references: [users.id],
    relationName: "followers",
  }),
  following: one(users, {
    fields: [userFollows.followingId],
    references: [users.id],
    relationName: "following",
  }),
}));

export const yearlyGoalsRelations = relations(yearlyGoals, ({ one }) => ({
  user: one(users, {
    fields: [yearlyGoals.userId],
    references: [users.id],
  }),
}));

export const userContentRelations = relations(userContent, ({ one }) => ({
  user: one(users, {
    fields: [userContent.userId],
    references: [users.id],
  }),
}));

export const weeklyCharlengesRelations = relations(weeklyCharlenges, ({ many }) => ({
  userProgress: many(userChallengeProgress),
}));

export const userChallengeProgressRelations = relations(userChallengeProgress, ({ one }) => ({
  user: one(users, {
    fields: [userChallengeProgress.userId],
    references: [users.id],
  }),
  challenge: one(weeklyCharlenges, {
    fields: [userChallengeProgress.challengeId],
    references: [weeklyCharlenges.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  wisdomScore: true,
  criticScore: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGuidingQuestionSchema = createInsertSchema(guidingQuestions).omit({
  id: true,
  createdAt: true,
});

export const insertMediaItemSchema = createInsertSchema(mediaItems).omit({
  id: true,
  createdAt: true,
});

export const insertUserMediaRatingSchema = createInsertSchema(userMediaRatings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertYearlyGoalSchema = createInsertSchema(yearlyGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserContentSchema = createInsertSchema(userContent).omit({
  id: true,
  avgRating: true,
  totalRatings: true,
  views: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type GuidingQuestion = typeof guidingQuestions.$inferSelect;
export type InsertGuidingQuestion = z.infer<typeof insertGuidingQuestionSchema>;
export type MediaItem = typeof mediaItems.$inferSelect;
export type InsertMediaItem = z.infer<typeof insertMediaItemSchema>;
export type UserMediaRating = typeof userMediaRatings.$inferSelect;
export type InsertUserMediaRating = z.infer<typeof insertUserMediaRatingSchema>;
export type YearlyGoal = typeof yearlyGoals.$inferSelect;
export type InsertYearlyGoal = z.infer<typeof insertYearlyGoalSchema>;
export type UserContent = typeof userContent.$inferSelect;
export type InsertUserContent = z.infer<typeof insertUserContentSchema>;
export type WeeklyChallenge = typeof weeklyCharlenges.$inferSelect;
export type UserChallengeProgress = typeof userChallengeProgress.$inferSelect;
