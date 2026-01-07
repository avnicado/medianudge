import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import UserCard from "@/components/UserCard";
import MediaCard from "@/components/MediaCard";
import StarRating from "@/components/StarRating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Users, 
  Trophy, 
  Star, 
  BookOpen, 
  Search,
  TrendingUp,
  MessageCircle,
  Calendar,
  Filter,
  UserPlus,
  Award,
  Target,
  Zap
} from "lucide-react";

export default function Social() {
  const { toast } = useToast();

  // Fetch social data (no authentication required)
  const { data: recentActivity } = useQuery({
    queryKey: ["/api/user/activity"],
    enabled: false, // Disable user-specific data
  });

  const { data: topUsers } = useQuery({
    queryKey: ["/api/top-users"],
    enabled: true, // Enable public data
  });

  const { data: followers } = useQuery({
    queryKey: ["/api/user/followers"],
    enabled: false, // Disable user-specific data
  });

  const { data: following } = useQuery({
    queryKey: ["/api/user/following"],
    enabled: false, // Disable user-specific data
  });

  const { data: userContent } = useQuery({
    queryKey: ["/api/user/content"],
    enabled: false, // Disable user-specific data
  });

  // No authentication required - show content to all users

  const getWisdomLevel = (score: number) => {
    if (score >= 800) return "PhD Level";
    if (score >= 600) return "Master's Level";
    if (score >= 400) return "College Senior+";
    if (score >= 200) return "College Junior";
    return "High School";
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-50">
        <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Social</h1>
              <p className="text-slate-600 mt-1">
                Connect with fellow learners and discover what's inspiring the community
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input 
                      placeholder="Search users or content..."
                      className="pl-10 w-80"
                      disabled
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Not implemented yet</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" disabled>
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Not implemented yet</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 text-primary mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentActivity?.length > 0 ? (
                    recentActivity.map((activity: any) => (
                      <div key={activity.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage 
                              src={activity.userProfileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                              alt={`${activity.userFirstName} profile`}
                            />
                            <AvatarFallback>
                              {activity.userFirstName?.[0] || 'U'}{activity.userLastName?.[0] || ''}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-slate-900">
                                {activity.userFirstName} {activity.userLastName}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {getWisdomLevel(800)} {/* Would be dynamic in real app */}
                              </Badge>
                              <span className="text-sm text-slate-500">
                                {new Date(activity.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            
                            <p className="text-slate-700 mb-3">
                              {activity.review ? (
                                <>Just finished "{activity.mediaTitle}" - {activity.review}</>
                              ) : (
                                <>Rated "{activity.mediaTitle}" {activity.rating}★</>
                              )}
                            </p>
                            
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <StarRating rating={activity.rating} readonly size="sm" />
                                <span className="text-sm font-medium">{activity.rating}★</span>
                              </div>
                              
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${
                                  activity.rating >= 4 ? 'bg-green-100 text-green-600' :
                                  activity.rating >= 3 ? 'bg-blue-100 text-blue-600' :
                                  'bg-yellow-100 text-yellow-600'
                                }`}
                              >
                                {activity.mediaType}
                              </Badge>
                              
                              <div className="flex items-center space-x-4 text-sm text-slate-500">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="flex items-center space-x-1" disabled>
                                      <MessageCircle className="w-4 h-4" />
                                      <span>Comment</span>
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Not implemented yet</p>
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="flex items-center space-x-1" disabled>
                                      <Trophy className="w-4 h-4" />
                                      <span>Appreciate</span>
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Not implemented yet</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-500 py-12">
                      <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p className="text-lg font-medium mb-2">No recent activity</p>
                      <p className="text-sm">Follow some users to see their activity here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Community Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-primary mr-2" />
                  Community Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="trending" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                    <TabsTrigger value="debates">Debates</TabsTrigger>
                    <TabsTrigger value="book-clubs">Book Clubs</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="trending" className="mt-6">
                    <div className="space-y-4">
                      <div className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium text-slate-900">Most Discussed This Week</span>
                        </div>
                        <h4 className="font-medium text-slate-900 mb-2">
                          "The Structure of Scientific Revolutions" by Thomas Kuhn
                        </h4>
                        <p className="text-sm text-slate-600 mb-3">
                          Mind-blowing exploration of how scientific paradigms shift. Currently sparking debates about AI and consciousness.
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <span>47 ratings this week</span>
                          <span>Average: 4.8★</span>
                          <span>23 discussions</span>
                        </div>
                      </div>
                      
                      <div className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="w-4 h-4 text-purple-500" />
                          <span className="font-medium text-slate-900">Highest Rated New Content</span>
                        </div>
                        <h4 className="font-medium text-slate-900 mb-2">
                          "Philosophy of Mind" Course - MIT OpenCourseWare
                        </h4>
                        <p className="text-sm text-slate-600 mb-3">
                          Deep dive into consciousness, perception, and the nature of mind. Perfect for those questioning reality.
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <span>12 ratings</span>
                          <span>Average: 4.9★</span>
                          <span>16 hours</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="debates" className="mt-6">
                    <div className="space-y-4">
                      <div className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-slate-900">
                            "Does AI pose an existential threat to humanity?"
                          </h4>
                          <Badge variant="secondary" className="bg-red-100 text-red-600">
                            Active
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                          Exploring the implications of artificial general intelligence and superintelligence on human civilization.
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <span>23 participants</span>
                          <span>156 arguments</span>
                          <span>Started 3 days ago</span>
                        </div>
                      </div>
                      
                      <div className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-slate-900">
                            "Is democracy the best form of government?"
                          </h4>
                          <Badge variant="secondary" className="bg-green-100 text-green-600">
                            Open
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                          Examining the strengths and weaknesses of democratic systems in the 21st century.
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <span>31 participants</span>
                          <span>203 arguments</span>
                          <span>Started 1 week ago</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="book-clubs" className="mt-6">
                    <div className="space-y-4">
                      <div className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-slate-900">
                            Philosophy & Ethics Book Club
                          </h4>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-600">
                            Reading
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                          Currently reading "Justice: What's the Right Thing to Do?" by Michael Sandel
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <span>47 members</span>
                          <span>Week 3 of 6</span>
                          <span>Next discussion: Tomorrow</span>
                        </div>
                      </div>
                      
                      <div className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-slate-900">
                            Science & Technology Book Club
                          </h4>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-600">
                            Starting Soon
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                          Next book: "The Alignment Problem" by Brian Christian - starts Monday
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <span>23 members</span>
                          <span>8 weeks</span>
                          <span>Join by Friday</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Contributors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 text-primary mr-2" />
                  Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topUsers?.slice(0, 5).map((user: any, index: number) => (
                    <div key={user.id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <Avatar className="w-10 h-10">
                        <AvatarImage 
                          src={user.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                        <AvatarFallback>
                          {user.firstName?.[0] || 'U'}{user.lastName?.[0] || ''}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 text-sm">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {getWisdomLevel(user.wisdomScore || 0)}
                        </p>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-primary" disabled>
                            <UserPlus className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Not implemented yet</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="w-full text-primary" disabled>
                      View Leaderboard
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Not implemented yet</p>
                  </TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>

            {/* Your Network */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 text-primary mr-2" />
                  Your Network
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      {(followers?.length || 0) + (following?.length || 0)}
                    </div>
                    <div className="text-sm text-slate-500">Total connections</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-slate-900">
                        {followers?.length || 0}
                      </div>
                      <div className="text-sm text-slate-500">Followers</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-slate-900">
                        {following?.length || 0}
                      </div>
                      <div className="text-sm text-slate-500">Following</div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start text-primary" disabled>
                        View All Followers
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Not implemented yet</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start text-primary" disabled>
                        View All Following
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Not implemented yet</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start text-primary" disabled>
                        Discover New Users
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Not implemented yet</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>

            {/* Your Recent Contributions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 text-primary mr-2" />
                  Your Recent Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userContent?.slice(0, 3).map((content: any) => (
                    <div key={content.id} className="border border-slate-200 rounded-lg p-3">
                      <h4 className="font-medium text-slate-900 text-sm mb-1">
                        {content.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <Badge variant="secondary" className="text-xs">
                          {content.type}
                        </Badge>
                        <span>{content.views || 0} views</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span>{content.avgRating?.toFixed(1) || '0.0'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="w-full bg-primary text-white" disabled>
                      Create New Content
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Not implemented yet</p>
                  </TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
    </TooltipProvider>
  );
}
