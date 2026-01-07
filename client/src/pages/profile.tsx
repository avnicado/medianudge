import { useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/Navigation";
import MediaCard from "@/components/MediaCard";
import StarRating from "@/components/StarRating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Trophy, 
  Star, 
  Users, 
  BookOpen, 
  Target, 
  Compass, 
  Calendar,
  Edit,
  UserPlus,
  UserCheck,
  Film,
  Headphones,
  GraduationCap,
  Gamepad2
} from "lucide-react";

export default function Profile() {
  const { userId } = useParams();
  
  // No authentication required - show demo profile
  const profileUserId = userId || "demo-user";
  const isOwnProfile = true; // Always show as own profile in demo mode

  // Demo profile data
  const profileData = {
    user: {
      id: "demo-user",
      firstName: "Demo",
      lastName: "User",
      email: "demo@example.com",
      profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      wisdomScore: 450,
      criticScore: 4.2,
      createdAt: "2024-01-01"
    },
    guidingQuestions: [
      {
        id: 1,
        question: "How can I apply systems thinking to solve complex problems?",
        userId: "demo-user",
        createdAt: "2024-01-01"
      },
      {
        id: 2,
        question: "What are the ethical implications of AI development?",
        userId: "demo-user",
        createdAt: "2024-01-05"
      },
      {
        id: 3,
        question: "How do I balance depth vs breadth in learning?",
        userId: "demo-user",
        createdAt: "2024-01-10"
      }
    ],
    mediaRatings: [
      {
        id: 1,
        rating: 5,
        review: "Excellent book on programming practices",
        media: { id: 1, title: "Clean Code", type: "book", author: "Robert C. Martin" },
        createdAt: "2024-01-15"
      },
      {
        id: 2,
        rating: 4,
        review: "Great course on machine learning fundamentals",
        media: { id: 2, title: "Machine Learning by Andrew Ng", type: "course", author: "Andrew Ng" },
        createdAt: "2024-02-20"
      },
      {
        id: 3,
        rating: 5,
        review: "Fascinating historical podcast series",
        media: { id: 3, title: "Hardcore History", type: "podcast", author: "Dan Carlin" },
        createdAt: "2024-03-10"
      },
      {
        id: 4,
        rating: 4,
        review: "Mind-bending film with great cinematography",
        media: { id: 4, title: "Inception", type: "movie", author: "Christopher Nolan" },
        createdAt: "2024-01-25"
      },
      {
        id: 5,
        rating: 5,
        review: "Brilliant puzzle game with excellent writing",
        media: { id: 5, title: "Portal 2", type: "game", author: "Valve" },
        createdAt: "2024-02-05"
      }
    ],
    userContent: [
      {
        id: 1,
        title: "My Reading Journey in 2024",
        content: "Reflections on the books I've read this year and how they've shaped my thinking...",
        type: "reflection",
        createdAt: "2024-03-15"
      },
      {
        id: 2,
        title: "Key Takeaways from Machine Learning Course",
        content: "Summary of the most important concepts I learned from Andrew Ng's course...",
        type: "summary",
        createdAt: "2024-02-28"
      }
    ],
    yearlyGoal: {
      id: 1,
      year: 2024,
      booksTarget: 24,
      booksCompleted: 8,
      coursesTarget: 6,
      coursesCompleted: 2,
      podcastsTarget: 12,
      podcastsCompleted: 5,
      debatesTarget: 4,
      debatesCompleted: 1,
      userId: "demo-user"
    },
    followersCount: 145,
    followingCount: 89
  };

  const { user: profileUser, guidingQuestions, mediaRatings, userContent, yearlyGoal } = profileData;

  const getWisdomLevel = (score: number) => {
    if (score >= 800) return "PhD Level";
    if (score >= 600) return "Master's Level";
    if (score >= 400) return "College Senior+";
    if (score >= 200) return "College Junior";
    return "High School";
  };

  const getWisdomPercentile = (score: number) => {
    if (score >= 800) return "95th";
    if (score >= 600) return "87th";
    if (score >= 400) return "70th";
    if (score >= 200) return "50th";
    return "25th";
  };

  const getProgressPercentage = () => {
    if (!yearlyGoal) return 0;
    const totalTargets = (yearlyGoal.booksTarget || 0) + (yearlyGoal.coursesTarget || 0) + 
                        (yearlyGoal.debatesTarget || 0) + (yearlyGoal.podcastsTarget || 0);
    const totalCompleted = (yearlyGoal.booksCompleted || 0) + (yearlyGoal.coursesCompleted || 0) + 
                          (yearlyGoal.debatesCompleted || 0) + (yearlyGoal.podcastsCompleted || 0);
    return totalTargets > 0 ? (totalCompleted / totalTargets) * 100 : 0;
  };

  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case 'book':
        return <BookOpen className="w-4 h-4" />;
      case 'course':
        return <GraduationCap className="w-4 h-4" />;
      case 'podcast':
        return <Headphones className="w-4 h-4" />;
      case 'movie':
        return <Film className="w-4 h-4" />;
      case 'game':
        return <Gamepad2 className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-50">
        <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage 
                  src={profileUser.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"} 
                  alt={`${profileUser.firstName} ${profileUser.lastName}`}
                />
                <AvatarFallback className="text-2xl">
                  {profileUser.firstName?.[0] || 'U'}{profileUser.lastName?.[0] || ''}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-slate-900">
                    {profileUser.firstName} {profileUser.lastName}
                  </h1>
                  
                  <div className="flex items-center space-x-2">
                    {!isOwnProfile && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button className="bg-primary text-white" disabled>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Follow
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Not implemented yet</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {isOwnProfile && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" disabled>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Not implemented yet</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Trophy className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-purple-900">Wisdom Score</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">
                      {getWisdomLevel(profileUser.wisdomScore || 0)}
                    </div>
                    <div className="text-sm text-purple-600">
                      {getWisdomPercentile(profileUser.wisdomScore || 0)} percentile
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-900">Critic Score</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-900">
                      {profileUser.criticScore?.toFixed(1) || '0.0'}/5
                    </div>
                    <div className="text-sm text-yellow-600">
                      Review quality rating
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Target className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-900">2024 Progress</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900">
                      {getProgressPercentage().toFixed(0)}%
                    </div>
                    <div className="text-sm text-green-600">
                      Yearly goals completed
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{profileData.followersCount || 0} followers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{profileData.followingCount || 0} following</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{mediaRatings?.length || 0} ratings</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(profileUser.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guiding Questions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Compass className="w-5 h-5 text-primary mr-2" />
              Guiding Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {guidingQuestions?.length > 0 ? (
              <div className="space-y-3">
                {guidingQuestions.map((question: any) => (
                  <div key={question.id} className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-700">"{question.question}"</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-500 py-8">
                <Compass className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No guiding questions set yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Yearly Goals */}
        {yearlyGoal && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 text-primary mr-2" />
                2024 Goals & Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-lg font-semibold text-blue-900">
                    {yearlyGoal.booksCompleted || 0}/{yearlyGoal.booksTarget || 0}
                  </div>
                  <div className="text-sm text-blue-600">Books</div>
                  <ProgressBar 
                    value={yearlyGoal.booksTarget > 0 ? (yearlyGoal.booksCompleted / yearlyGoal.booksTarget) * 100 : 0}
                    className="mt-2"
                  />
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <GraduationCap className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-lg font-semibold text-green-900">
                    {yearlyGoal.coursesCompleted || 0}/{yearlyGoal.coursesTarget || 0}
                  </div>
                  <div className="text-sm text-green-600">Courses</div>
                  <ProgressBar 
                    value={yearlyGoal.coursesTarget > 0 ? (yearlyGoal.coursesCompleted / yearlyGoal.coursesTarget) * 100 : 0}
                    className="mt-2"
                  />
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Headphones className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-lg font-semibold text-purple-900">
                    {yearlyGoal.podcastsCompleted || 0}/{yearlyGoal.podcastsTarget || 0}
                  </div>
                  <div className="text-sm text-purple-600">Podcasts</div>
                  <ProgressBar 
                    value={yearlyGoal.podcastsTarget > 0 ? (yearlyGoal.podcastsCompleted / yearlyGoal.podcastsTarget) * 100 : 0}
                    className="mt-2"
                  />
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Users className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-lg font-semibold text-orange-900">
                    {yearlyGoal.debatesCompleted || 0}/{yearlyGoal.debatesTarget || 0}
                  </div>
                  <div className="text-sm text-orange-600">Debates</div>
                  <ProgressBar 
                    value={yearlyGoal.debatesTarget > 0 ? (yearlyGoal.debatesCompleted / yearlyGoal.debatesTarget) * 100 : 0}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Tabs */}
        <Tabs defaultValue="media-history" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="media-history">Media History</TabsTrigger>
            <TabsTrigger value="contributions">Contributions</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>
          
          <TabsContent value="media-history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Media History</CardTitle>
                <p className="text-sm text-slate-600">
                  All content rated and reviewed, with date stamps
                </p>
              </CardHeader>
              <CardContent>
                {mediaRatings?.length > 0 ? (
                  <div className="space-y-4">
                    {mediaRatings.map((rating: any) => (
                      <div key={rating.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                              {getMediaTypeIcon(rating.media?.type || 'book')}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900">
                                {rating.media?.title || 'Unknown Title'}
                              </h4>
                              {rating.media?.author && (
                                <p className="text-sm text-slate-600">{rating.media.author}</p>
                              )}
                              <div className="flex items-center space-x-2 mt-2">
                                <StarRating rating={rating.rating} readonly />
                                <span className="text-sm text-slate-500">
                                  {new Date(rating.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              {rating.review && (
                                <p className="text-sm text-slate-700 mt-2">{rating.review}</p>
                              )}
                            </div>
                          </div>
                          {isOwnProfile && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-primary" disabled>
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Not implemented yet</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-500 py-8">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p>No media ratings yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contributions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Contributions</CardTitle>
                <p className="text-sm text-slate-600">
                  Articles, videos, and other content created by this user
                </p>
              </CardHeader>
              <CardContent>
                {userContent?.length > 0 ? (
                  <div className="space-y-4">
                    {userContent.map((content: any) => (
                      <div key={content.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Film className="w-4 h-4 text-red-500" />
                              <Badge variant="secondary" className="text-xs">
                                {content.type}
                              </Badge>
                            </div>
                            <h4 className="font-medium text-slate-900 mb-2">{content.title}</h4>
                            {content.content && (
                              <p className="text-sm text-slate-600 mb-3">{content.content}</p>
                            )}
                            <div className="flex items-center space-x-4 text-sm text-slate-500">
                              <span>{content.views || 0} views</span>
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span>{content.avgRating?.toFixed(1) || '0.0'}★</span>
                              </div>
                              <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-500 py-8">
                    <Film className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p>No contributions yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="social" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Followers ({profileData.followersCount || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-slate-500 py-8">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p>Social features coming soon</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Following ({profileData.followingCount || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-slate-500 py-8">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p>Social features coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
    </TooltipProvider>
  );
}
