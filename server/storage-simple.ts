import { MediaItem, InsertMediaItem, WeeklyChallenge, InsertWeeklyChallenge, User, GuidingQuestion, InsertGuidingQuestion } from "@shared/schema";

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
  deleteGuidingQuestion(id: number): Promise<void>;
}

export class SimpleStorage implements ISimpleStorage {
  private guidingQuestions: GuidingQuestion[] = [];
  private nextQuestionId = 1;
  
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

  async deleteGuidingQuestion(id: number): Promise<void> {
    const index = this.guidingQuestions.findIndex(q => q.id === id);
    if (index !== -1) {
      this.guidingQuestions.splice(index, 1);
    }
  }
}

export const simpleStorage = new SimpleStorage();