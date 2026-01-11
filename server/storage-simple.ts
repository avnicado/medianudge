import { MediaItem, InsertMediaItem, WeeklyChallenge, InsertWeeklyChallenge, User, GuidingQuestion, InsertGuidingQuestion, UserMediaRating, UserContent } from "@shared/schema";

// Demo data types
export interface DemoUserRating {
  id: number;
  userId: string;
  mediaId: number;
  mindExpandingRating: number;
  informativeRating: number;
  entertainingRating: number;
  review: string | null;
  dateConsumed: Date | null;
  createdAt: Date;
}

export interface DemoUserContent {
  id: number;
  userId: string;
  title: string;
  type: string;
  content: string | null;
  url: string | null;
  avgRating: number;
  totalRatings: number;
  views: number;
  createdAt: Date;
}

// Simple in-memory storage for standalone mode
export interface ISimpleStorage {
  // Media items
  getMediaItems(type?: string, limit?: number): Promise<MediaItem[]>;
  getMediaItem(id: number): Promise<MediaItem | undefined>;
  createMediaItem(item: InsertMediaItem): Promise<MediaItem>;
  deleteMediaItem(id: number): Promise<void>;
  searchMediaItems(query: string, type?: string): Promise<MediaItem[]>;
  
  // Weekly challenges
  getActiveWeeklyChallenge(): Promise<WeeklyChallenge | undefined>;
  getAllWeeklyChallenges(): Promise<WeeklyChallenge[]>;
  createWeeklyChallenge(challenge: InsertWeeklyChallenge): Promise<WeeklyChallenge>;
  updateWeeklyChallenge(id: number, challenge: Partial<InsertWeeklyChallenge>): Promise<WeeklyChallenge>;
  deleteWeeklyChallenge(id: number): Promise<void>;
  
  // Recommendations
  getRecommendations(type?: string): Promise<MediaItem[]>;
  getTopUsers(): Promise<User[]>;
  
  // Guiding questions
  getGuidingQuestions(): Promise<GuidingQuestion[]>;
  createGuidingQuestion(question: InsertGuidingQuestion): Promise<GuidingQuestion>;
  updateGuidingQuestion(id: number, question: Partial<InsertGuidingQuestion>): Promise<GuidingQuestion>;
  deleteGuidingQuestion(id: number): Promise<void>;
  
  // Goal and progress management
  getGoalProgress(): Promise<any>;
  updateGoalProgress(data: any): Promise<any>;
  
  // User ratings (demo data)
  getUserRatings(userId?: string): Promise<any[]>;
  getAllUserRatings(): Promise<any[]>;
  createUserRating(rating: Partial<DemoUserRating>): Promise<DemoUserRating>;
  updateUserRating(id: number, rating: Partial<DemoUserRating>): Promise<DemoUserRating>;
  deleteUserRating(id: number): Promise<void>;
  
  // User content (demo data)
  getUserContent(userId?: string): Promise<DemoUserContent[]>;
  getAllUserContent(): Promise<DemoUserContent[]>;
  createUserContent(content: Partial<DemoUserContent>): Promise<DemoUserContent>;
  updateUserContent(id: number, content: Partial<DemoUserContent>): Promise<DemoUserContent>;
  deleteUserContent(id: number): Promise<void>;
}

export class SimpleStorage implements ISimpleStorage {
  private guidingQuestions: GuidingQuestion[] = [];
  private nextQuestionId = 1;
  
  // Demo user ratings
  private userRatings: DemoUserRating[] = [
    {
      id: 1,
      userId: "demo-user",
      mediaId: 1, // The Pragmatic Programmer
      mindExpandingRating: 5,
      informativeRating: 5,
      entertainingRating: 4,
      review: "Excellent book for developers at any level. Filled with practical advice that has made me a better programmer.",
      dateConsumed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      userId: "demo-user",
      mediaId: 3, // Machine Learning by Andrew Ng
      mindExpandingRating: 5,
      informativeRating: 5,
      entertainingRating: 4,
      review: "The best introduction to machine learning. Andrew Ng explains complex concepts in an accessible way.",
      dateConsumed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      userId: "demo-user",
      mediaId: 4, // Hardcore History
      mindExpandingRating: 5,
      informativeRating: 5,
      entertainingRating: 5,
      review: "Dan Carlin brings history to life in a way that's both educational and utterly captivating.",
      dateConsumed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 4,
      userId: "1", // John Doe
      mediaId: 2, // Clean Code
      mindExpandingRating: 4,
      informativeRating: 5,
      entertainingRating: 3,
      review: "A must-read for any professional developer. Changed how I write code.",
      dateConsumed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 5,
      userId: "2", // Jane Smith
      mediaId: 5, // Inception
      mindExpandingRating: 5,
      informativeRating: 3,
      entertainingRating: 5,
      review: "Mind-bending thriller that makes you question reality. Nolan at his best.",
      dateConsumed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ];
  private nextRatingId = 6;
  
  // Demo user content
  private userContents: DemoUserContent[] = [
    {
      id: 1,
      userId: "demo-user",
      title: "Understanding Async/Await in JavaScript",
      type: "article",
      content: "A deep dive into modern JavaScript async patterns and how to avoid common pitfalls when working with promises and async/await.",
      url: null,
      avgRating: 4.5,
      totalRatings: 12,
      views: 234,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      userId: "demo-user",
      title: "The Philosophy of Software Design",
      type: "video",
      content: "Exploring the deeper principles behind good software architecture, inspired by John Ousterhout's work.",
      url: null,
      avgRating: 4.7,
      totalRatings: 18,
      views: 456,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      userId: "1", // John Doe
      title: "Why Functional Programming Matters",
      type: "article",
      content: "An exploration of functional programming principles and their benefits in modern software development.",
      url: null,
      avgRating: 4.3,
      totalRatings: 8,
      views: 167,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
    }
  ];
  private nextContentId = 4;
  
  private weeklyChallenges: WeeklyChallenge[] = [
    {
      id: 1,
      title: "Read 5 High-Quality Articles",
      description: "Challenge yourself to read 5 high-quality articles this week from reputable sources",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-07"),
      requirements: { target: 5, type: "articles" },
      active: true,
      createdAt: new Date()
    }
  ];
  private nextChallengeId = 2;
  
  private goalProgress = {
    booksCompleted: 8,
    booksTarget: 24,
    coursesCompleted: 2,
    coursesTarget: 6,
    podcastsCompleted: 5,
    podcastsTarget: 12,
    debatesCompleted: 1,
    debatesTarget: 4,
    wisdomScore: 450,
    criticScore: 4.2,
  };
  
  private mediaItems: MediaItem[] = [
    {
      id: 1,
      title: "The Pragmatic Programmer",
      type: "book",
      author: "Dave Thomas, Andy Hunt",
      description: "A guide to becoming a better programmer",
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
      externalId: null,
      avgMindExpanding: 4.5,
      avgInformative: 4.7,
      avgEntertaining: 3.8,
      totalRatings: 120,
      createdAt: new Date()
    },
    {
      id: 2,
      title: "Clean Code",
      type: "book",
      author: "Robert C. Martin",
      description: "A handbook of agile software craftsmanship",
      imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
      externalId: null,
      avgMindExpanding: 4.2,
      avgInformative: 4.8,
      avgEntertaining: 3.5,
      totalRatings: 89,
      createdAt: new Date()
    },
    {
      id: 3,
      title: "Machine Learning by Andrew Ng",
      type: "course",
      author: "Andrew Ng",
      description: "Stanford's machine learning course",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=600&fit=crop",
      externalId: null,
      avgMindExpanding: 4.9,
      avgInformative: 4.8,
      avgEntertaining: 3.9,
      totalRatings: 1250,
      createdAt: new Date()
    },
    {
      id: 4,
      title: "Hardcore History",
      type: "podcast",
      author: "Dan Carlin",
      description: "Hardcore History by Dan Carlin",
      imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=600&fit=crop",
      externalId: null,
      avgMindExpanding: 4.7,
      avgInformative: 4.9,
      avgEntertaining: 4.3,
      totalRatings: 567,
      createdAt: new Date()
    },
    {
      id: 5,
      title: "Inception",
      type: "movie",
      author: "Christopher Nolan",
      description: "A thief who steals corporate secrets through dream-sharing technology",
      imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
      externalId: null,
      avgMindExpanding: 4.8,
      avgInformative: 3.2,
      avgEntertaining: 4.7,
      totalRatings: 890,
      createdAt: new Date()
    },
    {
      id: 6,
      title: "Portal 2",
      type: "game",
      author: "Valve",
      description: "A puzzle-platform game with innovative mechanics",
      imageUrl: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=600&fit=crop",
      externalId: null,
      avgMindExpanding: 4.6,
      avgInformative: 3.8,
      avgEntertaining: 4.9,
      totalRatings: 445,
      createdAt: new Date()
    },
    {
      id: 7,
      title: "Intelligence Squared",
      type: "debate",
      author: "Various",
      description: "Oxford-style debates on current affairs",
      imageUrl: "https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=400&h=600&fit=crop",
      externalId: null,
      avgMindExpanding: 4.5,
      avgInformative: 4.7,
      avgEntertaining: 3.9,
      totalRatings: 334,
      createdAt: new Date()
    }
  ];

  private nextId = 8;

  private sampleUsers: User[] = [
    {
      id: "1",
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe",
      profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      wisdomScore: 75,
      criticScore: 4.2,
      expertiseGoal: 7,
      junkTolerance: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "2",
      email: "jane@example.com",
      firstName: "Jane",
      lastName: "Smith",
      profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b056d0e8?w=100&h=100&fit=crop&crop=face",
      wisdomScore: 92,
      criticScore: 4.8,
      expertiseGoal: 8,
      junkTolerance: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private nextId = 8;

  async getMediaItems(type?: string, limit = 20): Promise<MediaItem[]> {
    let items = this.mediaItems;
    
    if (type && type !== 'all') {
      items = items.filter(item => item.type === type);
    }
    
    return items.slice(0, limit);
  }

  async getMediaItem(id: number): Promise<MediaItem | undefined> {
    return this.mediaItems.find(item => item.id === id);
  }

  async createMediaItem(item: InsertMediaItem): Promise<MediaItem> {
    const newItem: MediaItem = {
      id: this.nextId++,
      ...item,
      avgMindExpanding: 3.0,
      avgInformative: 3.0,
      avgEntertaining: 3.0,
      totalRatings: 0,
      createdAt: new Date()
    };
    
    this.mediaItems.push(newItem);
    return newItem;
  }

  async deleteMediaItem(id: number): Promise<void> {
    this.mediaItems = this.mediaItems.filter(item => item.id !== id);
  }

  async searchMediaItems(query: string, type?: string): Promise<MediaItem[]> {
    const searchTerm = query.toLowerCase();
    let items = this.mediaItems;
    
    if (type && type !== 'all') {
      items = items.filter(item => item.type === type);
    }
    
    return items.filter(item => 
      item.title.toLowerCase().includes(searchTerm) ||
      item.author?.toLowerCase().includes(searchTerm) ||
      item.description?.toLowerCase().includes(searchTerm)
    );
  }

  async getActiveWeeklyChallenge(): Promise<WeeklyChallenge | undefined> {
    return this.weeklyChallenges.find(c => c.active);
  }

  async getAllWeeklyChallenges(): Promise<WeeklyChallenge[]> {
    return this.weeklyChallenges;
  }

  async createWeeklyChallenge(challengeData: InsertWeeklyChallenge): Promise<WeeklyChallenge> {
    // If the new challenge is active, deactivate all other challenges
    if (challengeData.active) {
      this.weeklyChallenges.forEach(c => c.active = false);
    }

    const challenge: WeeklyChallenge = {
      id: this.nextChallengeId++,
      ...challengeData,
      createdAt: new Date()
    };
    
    this.weeklyChallenges.push(challenge);
    return challenge;
  }

  async updateWeeklyChallenge(id: number, challengeData: Partial<InsertWeeklyChallenge>): Promise<WeeklyChallenge> {
    const index = this.weeklyChallenges.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Weekly challenge not found');
    }

    // If setting this challenge to active, deactivate all others
    if (challengeData.active) {
      this.weeklyChallenges.forEach(c => c.active = false);
    }

    this.weeklyChallenges[index] = {
      ...this.weeklyChallenges[index],
      ...challengeData
    };

    return this.weeklyChallenges[index];
  }

  async deleteWeeklyChallenge(id: number): Promise<void> {
    const index = this.weeklyChallenges.findIndex(c => c.id === id);
    if (index !== -1) {
      this.weeklyChallenges.splice(index, 1);
    }
  }

  async getRecommendations(type?: string): Promise<MediaItem[]> {
    // Return random recommendations based on type
    let items = this.mediaItems;
    
    if (type && type !== 'all') {
      items = items.filter(item => item.type === type);
    }
    
    // Shuffle and return top 3
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }

  async getTopUsers(): Promise<User[]> {
    return this.sampleUsers;
  }

  async getGuidingQuestions(): Promise<GuidingQuestion[]> {
    return this.guidingQuestions;
  }

  async createGuidingQuestion(questionData: InsertGuidingQuestion): Promise<GuidingQuestion> {
    const question: GuidingQuestion = {
      id: this.nextQuestionId++,
      userId: questionData.userId,
      question: questionData.question,
      createdAt: new Date()
    };
    
    this.guidingQuestions.push(question);
    return question;
  }

  async updateGuidingQuestion(id: number, questionData: Partial<InsertGuidingQuestion>): Promise<GuidingQuestion> {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new Error(`Invalid question ID: ${id}`);
    }
    
    const index = this.guidingQuestions.findIndex(q => q.id === id);
    if (index === -1) {
      throw new Error(`Guiding question with id ${id} not found`);
    }
    
    const existingQuestion = this.guidingQuestions[index];
    const updatedQuestion: GuidingQuestion = {
      ...existingQuestion,
      ...questionData,
      id: existingQuestion.id, // Ensure ID doesn't change
      createdAt: existingQuestion.createdAt // Preserve original creation date
    };
    
    this.guidingQuestions[index] = updatedQuestion;
    return updatedQuestion;
  }

  async deleteGuidingQuestion(id: number): Promise<void> {
    const index = this.guidingQuestions.findIndex(q => q.id === id);
    if (index !== -1) {
      this.guidingQuestions.splice(index, 1);
    }
  }

  async getGoalProgress(): Promise<any> {
    return this.goalProgress;
  }

  async updateGoalProgress(data: any): Promise<any> {
    this.goalProgress = { ...this.goalProgress, ...data };
    return this.goalProgress;
  }
  
  // User ratings methods
  async getUserRatings(userId?: string): Promise<any[]> {
    let ratings = this.userRatings;
    if (userId) {
      ratings = ratings.filter(r => r.userId === userId);
    }
    
    // Enrich with media details
    return ratings.map(rating => {
      const media = this.mediaItems.find(m => m.id === rating.mediaId);
      const rating_value = Math.round((rating.mindExpandingRating + rating.informativeRating + rating.entertainingRating) / 3);
      return {
        ...rating,
        media,
        rating: rating_value
      };
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getAllUserRatings(): Promise<any[]> {
    // Return all ratings with user and media details for social feed
    return this.userRatings.map(rating => {
      const media = this.mediaItems.find(m => m.id === rating.mediaId);
      const user = this.sampleUsers.find(u => u.id === rating.userId) || {
        id: "demo-user",
        firstName: "Demo",
        lastName: "User",
        profileImageUrl: null,
        wisdomScore: 450
      };
      
      const rating_value = Math.round((rating.mindExpandingRating + rating.informativeRating + rating.entertainingRating) / 3);
      
      return {
        id: rating.id,
        rating: rating_value,
        review: rating.review,
        mediaTitle: media?.title || "Unknown",
        mediaType: media?.type || "unknown",
        userFirstName: user.firstName,
        userLastName: user.lastName,
        userProfileImageUrl: user.profileImageUrl,
        userWisdomScore: user.wisdomScore,
        createdAt: rating.createdAt
      };
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async createUserRating(ratingData: Partial<DemoUserRating>): Promise<DemoUserRating> {
    const rating: DemoUserRating = {
      id: this.nextRatingId++,
      userId: ratingData.userId || "demo-user",
      mediaId: ratingData.mediaId || 1,
      mindExpandingRating: ratingData.mindExpandingRating || 3,
      informativeRating: ratingData.informativeRating || 3,
      entertainingRating: ratingData.entertainingRating || 3,
      review: ratingData.review || null,
      dateConsumed: ratingData.dateConsumed || new Date(),
      createdAt: new Date()
    };
    
    this.userRatings.push(rating);
    return rating;
  }
  
  async updateUserRating(id: number, ratingData: Partial<DemoUserRating>): Promise<DemoUserRating> {
    const index = this.userRatings.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('User rating not found');
    }
    
    this.userRatings[index] = {
      ...this.userRatings[index],
      ...ratingData
    };
    
    return this.userRatings[index];
  }
  
  async deleteUserRating(id: number): Promise<void> {
    this.userRatings = this.userRatings.filter(r => r.id !== id);
  }
  
  // User content methods
  async getUserContent(userId?: string): Promise<DemoUserContent[]> {
    let content = this.userContents;
    if (userId) {
      content = content.filter(c => c.userId === userId);
    }
    return content.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getAllUserContent(): Promise<DemoUserContent[]> {
    return this.userContents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async createUserContent(contentData: Partial<DemoUserContent>): Promise<DemoUserContent> {
    const content: DemoUserContent = {
      id: this.nextContentId++,
      userId: contentData.userId || "demo-user",
      title: contentData.title || "Untitled",
      type: contentData.type || "article",
      content: contentData.content || null,
      url: contentData.url || null,
      avgRating: contentData.avgRating || 0,
      totalRatings: contentData.totalRatings || 0,
      views: contentData.views || 0,
      createdAt: new Date()
    };
    
    this.userContents.push(content);
    return content;
  }
  
  async updateUserContent(id: number, contentData: Partial<DemoUserContent>): Promise<DemoUserContent> {
    const index = this.userContents.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('User content not found');
    }
    
    this.userContents[index] = {
      ...this.userContents[index],
      ...contentData
    };
    
    return this.userContents[index];
  }
  
  async deleteUserContent(id: number): Promise<void> {
    this.userContents = this.userContents.filter(c => c.id !== id);
  }
}

export const simpleStorage = new SimpleStorage();