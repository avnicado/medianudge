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

  const wisdomLevel = "Explorer"; // Default level for anonymous users

  const getProgressPercentage = () => {
    return 0; // Default for anonymous users
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="gradient-primary rounded-xl p-8 text-white mb-6">
            <h2 className="text-2xl font-bold mb-2">Welcome to MediaNudge!</h2>
            <p className="text-blue-100 mb-4">Discover quality content that cultivates education, wisdom, and meaningful engagement. Browse curated recommendations across books, courses, podcasts, movies, games, and debates.</p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-yellow-300" />
                <span>Wisdom Level: {wisdomLevel}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-300" />
                <span>Quality First Platform</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-green-300" />
                <span>Growth Over Entertainment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation Categories - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {/* Books */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 text-primary mr-2" />
                  Books
                </CardTitle>
                <span className="text-sm text-slate-500">Based on your interests</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {booksRecommendations?.slice(0, 2).map((book: any) => (
                  <MediaCard key={book.id} media={book} />
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-primary hover:bg-primary/5">
                View All Books
              </Button>
            </CardContent>
          </Card>

          {/* Courses */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <GraduationCap className="w-5 h-5 text-primary mr-2" />
                  Courses
                </CardTitle>
                <span className="text-sm text-slate-500">Skill building</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coursesRecommendations?.slice(0, 2).map((course: any) => (
                  <MediaCard key={course.id} media={course} />
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-primary hover:bg-primary/5">
                View All Courses
              </Button>
            </CardContent>
          </Card>

          {/* Podcasts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Headphones className="w-5 h-5 text-primary mr-2" />
                  Podcasts
                </CardTitle>
                <span className="text-sm text-slate-500">Curated episodes</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {podcastsRecommendations?.slice(0, 2).map((podcast: any) => (
                  <MediaCard key={podcast.id} media={podcast} />
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-primary hover:bg-primary/5">
                View All Podcasts
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recommendation Categories - Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {/* Movies */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Film className="w-5 h-5 text-primary mr-2" />
                  Movies
                </CardTitle>
                <span className="text-sm text-slate-500">Thought-provoking films</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moviesRecommendations?.slice(0, 2).map((movie: any) => (
                  <MediaCard key={movie.id} media={movie} />
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-primary hover:bg-primary/5">
                View All Movies
              </Button>
            </CardContent>
          </Card>

          {/* Games */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Gamepad2 className="w-5 h-5 text-primary mr-2" />
                  Games
                </CardTitle>
                <span className="text-sm text-slate-500">Engaging experiences</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gamesRecommendations?.slice(0, 2).map((game: any) => (
                  <MediaCard key={game.id} media={game} />
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-primary hover:bg-primary/5">
                View All Games
              </Button>
            </CardContent>
          </Card>

          {/* Debates */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 text-primary mr-2" />
                  Debates
                </CardTitle>
                <span className="text-sm text-slate-500">Critical thinking</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {debatesRecommendations?.slice(0, 2).map((debate: any) => (
                  <MediaCard key={debate.id} media={debate} />
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-primary hover:bg-primary/5">
                View All Debates
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Weekly Challenge */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="w-5 h-5 text-primary mr-2" />
                Your Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userRatings?.slice(0, 3).map((rating: any) => (
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
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-primary hover:bg-primary/5">
                View Full History
              </Button>
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
              
              <Button className="w-full bg-primary text-white hover:bg-primary/90">
                Find Challenge Content
              </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentActivity?.slice(0, 3).map((activity: any) => (
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
            
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium text-slate-900">Top Contributors This Week</span>
              </div>
              <Button variant="ghost" className="text-primary hover:text-primary/80 font-medium text-sm">
                View Leaderboard
              </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {userContent?.slice(0, 2).map((content: any) => (
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
              <Button className="bg-primary text-white hover:bg-primary/90 font-medium">
                <Plus className="w-4 h-4 mr-2" />
                Create Content
              </Button>
              <Button variant="ghost" className="text-primary hover:text-primary/80 font-medium">
                View All Contributions
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
