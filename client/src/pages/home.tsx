import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import MediaCard from "@/components/MediaCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  BookOpen, 
  GraduationCap, 
  Headphones, 
  Film, 
  Users, 
  Gamepad2,
  Trophy,
  Target,
  Star,
  Calendar,
  Compass,
  Plus,
  Edit,
  History,
  Lightbulb,
  TrendingUp
} from "lucide-react";

export default function Home() {
  const { toast } = useToast();

  // Fetch user data and recommendations (no authentication required)
  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
    enabled: false, // Disable auth queries
  });

  const { data: guidingQuestions } = useQuery({
    queryKey: ["/api/guiding-questions"],
    enabled: false, // Disable user-specific queries
  });

  const { data: userRatings } = useQuery({
    queryKey: ["/api/user/media-ratings"],
    enabled: false, // Disable user-specific queries
  });

  const { data: userContent } = useQuery({
    queryKey: ["/api/user/content"],
    enabled: false, // Disable user-specific queries
  });

  const { data: yearlyGoal } = useQuery({
    queryKey: ["/api/user/yearly-goal", new Date().getFullYear()],
    enabled: false, // Disable user-specific queries
  });

  const { data: weeklyChallenge } = useQuery({
    queryKey: ["/api/weekly-challenge"],
    enabled: true, // Keep weekly challenge enabled
  });

  const { data: recentActivity } = useQuery({
    queryKey: ["/api/user/activity"],
    enabled: false, // Disable user-specific queries
  });

  const { data: booksRecommendations } = useQuery({
    queryKey: ["/api/recommendations?type=book"],
    enabled: true, // Enable recommendations for all users
  });

  const { data: coursesRecommendations } = useQuery({
    queryKey: ["/api/recommendations?type=course"],
    enabled: true, // Enable recommendations for all users
  });

  const { data: podcastsRecommendations } = useQuery({
    queryKey: ["/api/recommendations?type=podcast"],
    enabled: true, // Enable recommendations for all users
  });

  const { data: moviesRecommendations } = useQuery({
    queryKey: ["/api/recommendations?type=movie"],
    enabled: true, // Enable recommendations for all users
  });

  const { data: gamesRecommendations } = useQuery({
    queryKey: ["/api/recommendations?type=game"],
    enabled: true, // Enable recommendations for all users
  });

  const { data: debatesRecommendations } = useQuery({
    queryKey: ["/api/recommendations?type=debate"],
    enabled: true, // Enable recommendations for all users
  });

  // No authentication required - show content to all users

  const wisdomLevel = "College Senior+"; // Default level for anonymous users (450 score)

  const getProgressPercentage = () => {
    return 0; // Default for anonymous users
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="gradient-primary rounded-2xl p-10 text-white mb-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-3 tracking-tight">Welcome to MediaNudge!</h2>
              <p className="text-blue-100 mb-6 text-lg leading-relaxed max-w-3xl">Discover quality content that cultivates education, wisdom, and meaningful engagement. Browse curated recommendations across books, courses, podcasts, movies, games, and debates.</p>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                  <Trophy className="w-5 h-5 text-yellow-300" />
                  <span className="font-semibold">Wisdom Level: {wisdomLevel}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <span className="font-semibold">Quality First Platform</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                  <Target className="w-5 h-5 text-green-300" />
                  <span className="font-semibold">Growth Over Entertainment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation Categories - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
          {/* Books */}
          <Card className="border-2 border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-purple-50 border-b-2 border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-3 shadow-md">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  Books
                </CardTitle>
                <span className="text-sm text-slate-600 font-medium">Based on your interests</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {booksRecommendations?.slice(0, 2).map((book: any) => (
                  <MediaCard key={book.id} media={book} />
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-primary hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white transition-all font-semibold" onClick={() => {
                window.location.href = '/category?type=book';
              }}>
                View All Books
              </Button>
            </CardContent>
          </Card>

          {/* Courses */}
          <Card className="border-2 border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-green-50 to-blue-50 border-b-2 border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-3 shadow-md">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  Courses
                </CardTitle>
                <span className="text-sm text-slate-600 font-medium">Skill building</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {coursesRecommendations?.slice(0, 2).map((course: any) => (
                  <MediaCard key={course.id} media={course} />
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-primary hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white transition-all font-semibold" onClick={() => window.location.href = '/category?type=course'}>
                View All Courses
              </Button>
            </CardContent>
          </Card>

          {/* Podcasts */}
          <Card className="border-2 border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50 border-b-2 border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-3 shadow-md">
                    <Headphones className="w-5 h-5 text-white" />
                  </div>
                  Podcasts
                </CardTitle>
                <span className="text-sm text-slate-600 font-medium">Curated episodes</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {podcastsRecommendations?.slice(0, 2).map((podcast: any) => (
                  <MediaCard key={podcast.id} media={podcast} />
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-primary hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white transition-all font-semibold" onClick={() => window.location.href = '/category?type=podcast'}>
                View All Podcasts
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recommendation Categories - Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {/* Movies */}
          <Card className="border-2 border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-red-50 to-orange-50 border-b-2 border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-3 shadow-md">
                    <Film className="w-5 h-5 text-white" />
                  </div>
                  Movies
                </CardTitle>
                <span className="text-sm text-slate-600 font-medium">Thought-provoking films</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {moviesRecommendations?.slice(0, 2).map((movie: any) => (
                  <MediaCard key={movie.id} media={movie} />
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-primary hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white transition-all font-semibold" onClick={() => window.location.href = '/category?type=movie'}>
                View All Movies
              </Button>
            </CardContent>
          </Card>

          {/* Games */}
          <Card className="border-2 border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-yellow-50 to-green-50 border-b-2 border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-3 shadow-md">
                    <Gamepad2 className="w-5 h-5 text-white" />
                  </div>
                  Games
                </CardTitle>
                <span className="text-sm text-slate-600 font-medium">Engaging experiences</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {gamesRecommendations?.slice(0, 2).map((game: any) => (
                  <MediaCard key={game.id} media={game} />
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-primary hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white transition-all font-semibold" onClick={() => window.location.href = '/category?type=game'}>
                View All Games
              </Button>
            </CardContent>
          </Card>

          {/* Debates */}
          <Card className="border-2 border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-indigo-50 to-purple-50 border-b-2 border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-3 shadow-md">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  Debates
                </CardTitle>
                <span className="text-sm text-slate-600 font-medium">Critical thinking</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {debatesRecommendations?.slice(0, 2).map((debate: any) => (
                  <MediaCard key={debate.id} media={debate} />
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-primary hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white transition-all font-semibold" onClick={() => window.location.href = '/category?type=debate'}>
                View All Debates
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Weekly Challenge */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Activity */}
          <Card className="border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-br from-slate-50 to-blue-50 border-b-2 border-slate-100">
              <CardTitle className="flex items-center text-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-3 shadow-md">
                  <History className="w-5 h-5 text-white" />
                </div>
                Your Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {userRatings && userRatings.length > 0 ? (
                  userRatings.slice(0, 3).map((rating: any) => (
                    <div key={rating.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">
                          {rating.media?.title || 'Media Item'}
                        </p>
                        <p className="text-xs text-slate-500">
                          Rated {rating.rating}★ • {new Date(rating.createdAt).toLocaleDateString()}
                        </p>
                      </div>
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
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-500 py-8">
                    <History className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="text-base font-medium mb-1">No recent activity yet</p>
                    <p className="text-sm text-slate-400">Start rating books, courses, and other content to see your activity here</p>
                  </div>
                )}
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="w-full mt-4 text-primary" disabled>
                    View Full History
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Not implemented yet</p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>

          {/* Weekly Challenge */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 text-primary mr-2" />
                Weekly Challenge
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weeklyChallenge ? (
                <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-slate-900 mb-2">{weeklyChallenge.title}</h4>
                  <p className="text-sm text-slate-600 mb-3">{weeklyChallenge.description}</p>
                  <div className="flex items-center space-x-2 mb-3">
                    <ProgressBar value={60} className="flex-1" />
                    <span className="text-sm font-medium text-slate-700">3/5 Complete</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    4 days remaining
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>No active challenge this week</p>
                </div>
              )}
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="w-full bg-primary text-white" disabled>
                    Find Challenge Content
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Not implemented yet</p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>
        </div>

        {/* Social Highlights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 text-primary mr-2" />
              Social Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity && recentActivity.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentActivity.slice(0, 3).map((activity: any) => (
                    <div key={activity.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <img 
                          src={activity.userProfileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                          alt={`${activity.userFirstName} profile`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {activity.userFirstName} {activity.userLastName}
                          </p>
                          <p className="text-xs text-slate-500">Wisdom: {wisdomLevel}</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-700 mb-2">
                        {activity.review || `Rated "${activity.mediaTitle}" ${activity.rating}★`}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < activity.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                          <span className="text-sm font-medium ml-1">{activity.rating}★</span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
            
                <Separator className="my-4" />
              </>
            ) : (
              <div className="text-center text-slate-500 py-8">
                <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="text-base font-medium mb-1">No social activity yet</p>
                <p className="text-sm text-slate-400">Community ratings and reviews will appear here</p>
              </div>
            )}
            
            <Separator className="my-4" />
            
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium text-slate-900">Top Contributors This Week</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="text-primary font-medium text-sm" disabled>
                    View Leaderboard
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Not implemented yet</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        {/* Your Contributions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="w-5 h-5 text-primary mr-2" />
              Your Contributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userContent && userContent.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {userContent.slice(0, 2).map((content: any) => (
                    <div key={content.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Film className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium text-slate-900">{content.type}</span>
                      </div>
                      <h4 className="font-medium text-slate-900 mb-1">{content.title}</h4>
                      <p className="text-sm text-slate-600 mb-2">{content.content}</p>
                      <div className="flex items-center space-x-3 text-sm">
                        <span className="text-slate-500">{content.views || 0} views</span>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="ml-1 font-medium">{content.avgRating?.toFixed(1) || '0.0'}★</span>
                        </div>
                        <span className="text-slate-500">
                          {new Date(content.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
            
                <div className="flex items-center justify-between">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="bg-primary text-white font-medium" disabled>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Content
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Not implemented yet</p>
                    </TooltipContent>
                  </Tooltip>
                  <Button variant="ghost" className="text-primary hover:text-primary/80 font-medium" onClick={() => window.location.href = '/progress'}>
                    View All Contributions
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center text-slate-500 py-8">
                <Lightbulb className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="text-base font-medium mb-1">No contributions yet</p>
                <p className="text-sm text-slate-400 mb-4">Share your insights by creating videos, articles, or debate contributions</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="bg-primary text-white font-medium" disabled>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Contribution
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Not implemented yet</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
    </TooltipProvider>
  );
}
