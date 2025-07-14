import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/Navigation";
import StarRating from "@/components/StarRating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  TrendingUp, 
  Trophy, 
  Star, 
  Target, 
  BookOpen, 
  GraduationCap, 
  Headphones, 
  Users, 
  Calendar,
  Edit,
  Plus,
  BarChart3,
  Award,
  Zap,
  CheckCircle,
  Clock,
  TrendingDown,
  Filter
} from "lucide-react";

const yearlyGoalSchema = z.object({
  year: z.number(),
  booksTarget: z.number().min(0),
  coursesTarget: z.number().min(0),
  podcastsTarget: z.number().min(0),
  debatesTarget: z.number().min(0),
});

const guidingQuestionSchema = z.object({
  question: z.string().min(5).max(500),
});

export default function Progress() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // No authentication required - show public progress features

  // Fetch progress data (no authentication required)
  const { data: yearlyGoal } = useQuery({
    queryKey: ["/api/user/yearly-goal", selectedYear],
    enabled: false, // Disable user-specific data
  });

  const { data: mediaRatings } = useQuery({
    queryKey: ["/api/user/media-ratings"],
    enabled: false, // Disable user-specific data
  });

  const { data: guidingQuestions } = useQuery({
    queryKey: ["/api/guiding-questions"],
    enabled: false, // Disable user-specific data
  });

  const { data: userContent } = useQuery({
    queryKey: ["/api/user/content"],
    enabled: false, // Disable user-specific data
  });

  const { data: weeklyChallenge } = useQuery({
    queryKey: ["/api/weekly-challenge"],
    enabled: true, // Enable public data
  });

  const { data: challengeProgress } = useQuery({
    queryKey: ["/api/user/challenge-progress", weeklyChallenge?.id],
    enabled: false, // Disable user-specific data
  });

  // Forms
  const goalForm = useForm({
    resolver: zodResolver(yearlyGoalSchema),
    defaultValues: {
      year: selectedYear,
      booksTarget: yearlyGoal?.booksTarget || 0,
      coursesTarget: yearlyGoal?.coursesTarget || 0,
      podcastsTarget: yearlyGoal?.podcastsTarget || 0,
      debatesTarget: yearlyGoal?.debatesTarget || 0,
    },
  });

  const questionForm = useForm({
    resolver: zodResolver(guidingQuestionSchema),
    defaultValues: {
      question: "",
    },
  });

  // Mutations
  const updateGoalMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/user/yearly-goal", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/yearly-goal"] });
      toast({
        title: "Success",
        description: "Yearly goals updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update yearly goals",
        variant: "destructive",
      });
    },
  });

  const addQuestionMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/guiding-questions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guiding-questions"] });
      questionForm.reset();
      toast({
        title: "Success",
        description: "Guiding question added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add guiding question",
        variant: "destructive",
      });
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/guiding-questions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guiding-questions"] });
      toast({
        title: "Success",
        description: "Guiding question deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete guiding question",
        variant: "destructive",
      });
    },
  });

  // Update form when yearlyGoal changes
  useEffect(() => {
    if (yearlyGoal) {
      goalForm.reset({
        year: selectedYear,
        booksTarget: yearlyGoal.booksTarget || 0,
        coursesTarget: yearlyGoal.coursesTarget || 0,
        podcastsTarget: yearlyGoal.podcastsTarget || 0,
        debatesTarget: yearlyGoal.debatesTarget || 0,
      });
    }
  }, [yearlyGoal, selectedYear]);

  // No authentication required - show content to all users

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

  const getMediaTypeStats = () => {
    const stats = {
      books: { count: 0, avgRating: 0 },
      courses: { count: 0, avgRating: 0 },
      podcasts: { count: 0, avgRating: 0 },
      movies: { count: 0, avgRating: 0 },
      debates: { count: 0, avgRating: 0 },
      games: { count: 0, avgRating: 0 },
    };

    mediaRatings?.forEach((rating: any) => {
      const type = rating.media?.type || 'books';
      if (stats[type as keyof typeof stats]) {
        stats[type as keyof typeof stats].count++;
        stats[type as keyof typeof stats].avgRating += rating.rating;
      }
    });

    // Calculate averages
    Object.keys(stats).forEach((key) => {
      const stat = stats[key as keyof typeof stats];
      if (stat.count > 0) {
        stat.avgRating = stat.avgRating / stat.count;
      }
    });

    return stats;
  };

  const stats = getMediaTypeStats();

  const onSubmitGoal = (data: any) => {
    updateGoalMutation.mutate(data);
  };

  const onSubmitQuestion = (data: any) => {
    addQuestionMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Progress Dashboard</h1>
              <p className="text-slate-600 mt-1">
                Track your intellectual growth and set meaningful goals
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
                <option value={2022}>2022</option>
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Wisdom Score</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {getWisdomLevel(0)}
                  </p>
                  <p className="text-sm text-slate-500">
                    {getWisdomPercentile(0)} percentile
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Critic Score</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    0.0/5
                  </p>
                  <p className="text-sm text-slate-500">Review quality</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Yearly Progress</p>
                  <p className="text-2xl font-bold text-green-600">
                    {getProgressPercentage().toFixed(0)}%
                  </p>
                  <p className="text-sm text-slate-500">Goals completed</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Ratings</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {mediaRatings?.length || 0}
                  </p>
                  <p className="text-sm text-slate-500">Media consumed</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Yearly Goals */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 text-primary mr-2" />
                    {selectedYear} Goals & Progress
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Goals
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Set Your {selectedYear} Goals</DialogTitle>
                      </DialogHeader>
                      <Form {...goalForm}>
                        <form onSubmit={goalForm.handleSubmit(onSubmitGoal)} className="space-y-4">
                          <FormField
                            control={goalForm.control}
                            name="booksTarget"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Books Target</FormLabel>
                                <FormControl>
                                  <Input type="number" min="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={goalForm.control}
                            name="coursesTarget"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Courses Target</FormLabel>
                                <FormControl>
                                  <Input type="number" min="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={goalForm.control}
                            name="podcastsTarget"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Podcasts Target</FormLabel>
                                <FormControl>
                                  <Input type="number" min="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={goalForm.control}
                            name="debatesTarget"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Debates Target</FormLabel>
                                <FormControl>
                                  <Input type="number" min="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <Button 
                            type="submit" 
                            className="w-full"
                            disabled={updateGoalMutation.isPending}
                          >
                            {updateGoalMutation.isPending ? "Saving..." : "Save Goals"}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-lg font-semibold text-blue-900">
                      {yearlyGoal?.booksCompleted || 0}/{yearlyGoal?.booksTarget || 0}
                    </div>
                    <div className="text-sm text-blue-600 mb-2">Books</div>
                    <ProgressBar 
                      value={yearlyGoal?.booksTarget > 0 ? (yearlyGoal.booksCompleted / yearlyGoal.booksTarget) * 100 : 0}
                      className="h-2"
                    />
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <GraduationCap className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="text-lg font-semibold text-green-900">
                      {yearlyGoal?.coursesCompleted || 0}/{yearlyGoal?.coursesTarget || 0}
                    </div>
                    <div className="text-sm text-green-600 mb-2">Courses</div>
                    <ProgressBar 
                      value={yearlyGoal?.coursesTarget > 0 ? (yearlyGoal.coursesCompleted / yearlyGoal.coursesTarget) * 100 : 0}
                      className="h-2"
                    />
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Headphones className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-lg font-semibold text-purple-900">
                      {yearlyGoal?.podcastsCompleted || 0}/{yearlyGoal?.podcastsTarget || 0}
                    </div>
                    <div className="text-sm text-purple-600 mb-2">Podcasts</div>
                    <ProgressBar 
                      value={yearlyGoal?.podcastsTarget > 0 ? (yearlyGoal.podcastsCompleted / yearlyGoal.podcastsTarget) * 100 : 0}
                      className="h-2"
                    />
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Users className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                    <div className="text-lg font-semibold text-orange-900">
                      {yearlyGoal?.debatesCompleted || 0}/{yearlyGoal?.debatesTarget || 0}
                    </div>
                    <div className="text-sm text-orange-600 mb-2">Debates</div>
                    <ProgressBar 
                      value={yearlyGoal?.debatesTarget > 0 ? (yearlyGoal.debatesCompleted / yearlyGoal.debatesTarget) * 100 : 0}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media Consumption Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 text-primary mr-2" />
                  Media Consumption Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-slate-200 rounded-lg">
                    <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-lg font-semibold text-slate-900">
                      {stats.books.count}
                    </div>
                    <div className="text-sm text-slate-600 mb-1">Books</div>
                    <div className="flex items-center justify-center">
                      <StarRating rating={stats.books.avgRating} readonly size="sm" />
                      <span className="text-sm ml-1">{stats.books.avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 border border-slate-200 rounded-lg">
                    <GraduationCap className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <div className="text-lg font-semibold text-slate-900">
                      {stats.courses.count}
                    </div>
                    <div className="text-sm text-slate-600 mb-1">Courses</div>
                    <div className="flex items-center justify-center">
                      <StarRating rating={stats.courses.avgRating} readonly size="sm" />
                      <span className="text-sm ml-1">{stats.courses.avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 border border-slate-200 rounded-lg">
                    <Headphones className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <div className="text-lg font-semibold text-slate-900">
                      {stats.podcasts.count}
                    </div>
                    <div className="text-sm text-slate-600 mb-1">Podcasts</div>
                    <div className="flex items-center justify-center">
                      <StarRating rating={stats.podcasts.avgRating} readonly size="sm" />
                      <span className="text-sm ml-1">{stats.podcasts.avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 text-primary mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mediaRatings?.slice(0, 5).map((rating: any) => (
                    <div key={rating.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">
                          {rating.media?.title || 'Unknown Title'}
                        </p>
                        <p className="text-xs text-slate-500">
                          Rated {rating.rating}★ • {new Date(rating.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <StarRating rating={rating.rating} readonly size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weekly Challenge */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 text-primary mr-2" />
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
                      {Math.ceil((new Date(weeklyChallenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 py-8">
                    <Trophy className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p>No active challenge this week</p>
                  </div>
                )}
                
                <Button className="w-full bg-primary text-white hover:bg-primary/90">
                  Find Challenge Content
                </Button>
              </CardContent>
            </Card>

            {/* Guiding Questions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 text-primary mr-2" />
                    Guiding Questions
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Guiding Question</DialogTitle>
                      </DialogHeader>
                      <Form {...questionForm}>
                        <form onSubmit={questionForm.handleSubmit(onSubmitQuestion)} className="space-y-4">
                          <FormField
                            control={questionForm.control}
                            name="question"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Question</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="What big question drives your learning?"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <Button 
                            type="submit" 
                            className="w-full"
                            disabled={addQuestionMutation.isPending}
                          >
                            {addQuestionMutation.isPending ? "Adding..." : "Add Question"}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {guidingQuestions?.map((question: any) => (
                    <div key={question.id} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-700 flex-1">"{question.question}"</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteQuestionMutation.mutate(question.id)}
                        disabled={deleteQuestionMutation.isPending}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  {(!guidingQuestions || guidingQuestions.length === 0) && (
                    <div className="text-center text-slate-500 py-4">
                      <p className="text-sm">No guiding questions yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 text-primary mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">First Book</p>
                      <p className="text-xs text-slate-500">Completed your first book review</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Quality Curator</p>
                      <p className="text-xs text-slate-500">Averaged 4+ stars in ratings</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Target className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Goal Setter</p>
                      <p className="text-xs text-slate-500">Set your first yearly goals</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
