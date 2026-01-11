import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Upload, Plus, BookOpen, GraduationCap, Headphones, Film, Users, Gamepad2, Trash2, Edit, Eye, Target, Brain, Info, Heart, Trophy, Star, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mediaItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["book", "course", "podcast", "movie", "game", "debate"], {
    required_error: "Please select a media type",
  }),
  author: z.string().min(1, "Author is required"),
  description: z.string().min(1, "Description is required"),
  avgMindExpanding: z.number().min(1).max(5).default(3),
  avgInformative: z.number().min(1).max(5).default(3),
  avgEntertaining: z.number().min(1).max(5).default(3),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

const guidingQuestionSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters").max(500, "Question too long"),
});

const weeklyChallengeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.date(),
  endDate: z.date(),
  requirements: z.any().default({}),
  active: z.boolean().default(false),
});

type MediaItemFormData = z.infer<typeof mediaItemSchema>;
type GuidingQuestionFormData = z.infer<typeof guidingQuestionSchema>;
type WeeklyChallengeFormData = z.infer<typeof weeklyChallengeSchema>;

const mediaTypeOptions = [
  { value: "book", label: "Book", icon: BookOpen },
  { value: "course", label: "Course", icon: GraduationCap },
  { value: "podcast", label: "Podcast", icon: Headphones },
  { value: "movie", label: "Movie", icon: Film },
  { value: "game", label: "Game", icon: Gamepad2 },
  { value: "debate", label: "Debate", icon: Users },
];

export default function Admin() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [isChallengeDialogOpen, setIsChallengeDialogOpen] = useState(false);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<any>(null);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [editingRating, setEditingRating] = useState<any>(null);
  const [editingContent, setEditingContent] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<MediaItemFormData>({
    resolver: zodResolver(mediaItemSchema),
    defaultValues: {
      title: "",
      type: "book",
      author: "",
      description: "",
      avgMindExpanding: 3.0,
      avgInformative: 3.0,
      avgEntertaining: 3.0,
      imageUrl: "",
    },
  });

  const questionForm = useForm<GuidingQuestionFormData>({
    resolver: zodResolver(guidingQuestionSchema),
    defaultValues: {
      question: "",
    },
  });

  const challengeForm = useForm<WeeklyChallengeFormData>({
    resolver: zodResolver(weeklyChallengeSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      requirements: {},
      active: false,
    },
  });

  // Fetch all media items
  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ["/api/media"],
    queryFn: async () => {
      const response = await fetch("/api/media");
      if (!response.ok) {
        throw new Error("Failed to fetch media items");
      }
      return response.json();
    },
  });

  // Fetch guiding questions
  const { data: guidingQuestions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ["/api/guiding-questions"],
    queryFn: async () => {
      const response = await fetch("/api/guiding-questions");
      if (!response.ok) {
        throw new Error("Failed to fetch guiding questions");
      }
      return response.json();
    },
  });

  // Fetch weekly challenges
  const { data: weeklyChallenges, isLoading: isLoadingChallenges } = useQuery({
    queryKey: ["/api/weekly-challenges"],
    queryFn: async () => {
      const response = await fetch("/api/weekly-challenges");
      if (!response.ok) {
        throw new Error("Failed to fetch weekly challenges");
      }
      return response.json();
    },
  });

  // Fetch goal progress
  const { data: goalProgress, isLoading: isLoadingGoals } = useQuery({
    queryKey: ["/api/goal-progress"],
    queryFn: async () => {
      const response = await fetch("/api/goal-progress");
      if (!response.ok) {
        throw new Error("Failed to fetch goal progress");
      }
      return response.json();
    },
  });

  // Fetch demo ratings
  const { data: demoRatings, isLoading: isLoadingRatings } = useQuery({
    queryKey: ["/api/demo-data/ratings"],
    queryFn: async () => {
      const response = await fetch("/api/demo-data/ratings");
      if (!response.ok) {
        throw new Error("Failed to fetch demo ratings");
      }
      return response.json();
    },
  });

  // Fetch demo content
  const { data: demoContent, isLoading: isLoadingContent } = useQuery({
    queryKey: ["/api/demo-data/content"],
    queryFn: async () => {
      const response = await fetch("/api/demo-data/content");
      if (!response.ok) {
        throw new Error("Failed to fetch demo content");
      }
      return response.json();
    },
  });

  const createMediaItemMutation = useMutation({
    mutationFn: async (data: MediaItemFormData) => {
      const payload = {
        ...data,
        avgMindExpanding: data.avgMindExpanding || 3.0,
        avgInformative: data.avgInformative || 3.0,
        avgEntertaining: data.avgEntertaining || 3.0,
        imageUrl: data.imageUrl || null,
      };
      return await apiRequest("POST", "/api/media", payload);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Media item created successfully!",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create media item",
        variant: "destructive",
      });
    },
  });

  const deleteMediaItemMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/media/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Media item deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete media item",
        variant: "destructive",
      });
    },
  });

  const addQuestionMutation = useMutation({
    mutationFn: async (data: GuidingQuestionFormData) => {
      await apiRequest("POST", "/api/guiding-questions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guiding-questions"] });
      questionForm.reset();
      setIsQuestionDialogOpen(false);
      setEditingQuestion(null);
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

  const updateQuestionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: GuidingQuestionFormData }) => {
      await apiRequest("PUT", `/api/guiding-questions/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guiding-questions"] });
      questionForm.reset();
      setIsQuestionDialogOpen(false);
      setEditingQuestion(null);
      toast({
        title: "Success",
        description: "Guiding question updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update guiding question",
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

  const createChallengeMutation = useMutation({
    mutationFn: async (data: WeeklyChallengeFormData) => {
      await apiRequest("POST", "/api/weekly-challenges", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/weekly-challenges"] });
      queryClient.invalidateQueries({ queryKey: ["/api/weekly-challenge"] });
      challengeForm.reset();
      setIsChallengeDialogOpen(false);
      setEditingChallenge(null);
      toast({
        title: "Success",
        description: "Weekly challenge created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create weekly challenge",
        variant: "destructive",
      });
    },
  });

  const updateChallengeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<WeeklyChallengeFormData> }) => {
      await apiRequest("PUT", `/api/weekly-challenges/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/weekly-challenges"] });
      queryClient.invalidateQueries({ queryKey: ["/api/weekly-challenge"] });
      challengeForm.reset();
      setIsChallengeDialogOpen(false);
      setEditingChallenge(null);
      toast({
        title: "Success",
        description: "Weekly challenge updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update weekly challenge",
        variant: "destructive",
      });
    },
  });

  const deleteChallengeMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/weekly-challenges/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/weekly-challenges"] });
      queryClient.invalidateQueries({ queryKey: ["/api/weekly-challenge"] });
      toast({
        title: "Success",
        description: "Weekly challenge deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete weekly challenge",
        variant: "destructive",
      });
    },
  });

  const updateGoalProgressMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PUT", "/api/goal-progress", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goal-progress"] });
      toast({
        title: "Success",
        description: "Goal progress updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update goal progress",
        variant: "destructive",
      });
    },
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this media item?")) {
      await deleteMediaItemMutation.mutateAsync(id);
    }
  };

  const onSubmit = async (data: MediaItemFormData) => {
    setIsSubmitting(true);
    try {
      await createMediaItemMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitQuestion = async (data: GuidingQuestionFormData) => {
    if (editingQuestion) {
      await updateQuestionMutation.mutateAsync({ id: editingQuestion.id, data });
    } else {
      await addQuestionMutation.mutateAsync(data);
    }
  };

  const handleEditQuestion = (question: any) => {
    setEditingQuestion(question);
    questionForm.reset({
      question: question.question,
    });
    setIsQuestionDialogOpen(true);
  };

  const onSubmitChallenge = async (data: WeeklyChallengeFormData) => {
    if (editingChallenge) {
      await updateChallengeMutation.mutateAsync({ id: editingChallenge.id, data });
    } else {
      await createChallengeMutation.mutateAsync(data);
    }
  };

  const handleEditChallenge = (challenge: any) => {
    setEditingChallenge(challenge);
    challengeForm.reset({
      title: challenge.title,
      description: challenge.description,
      startDate: new Date(challenge.startDate),
      endDate: new Date(challenge.endDate),
      requirements: challenge.requirements || {},
      active: challenge.active || false,
    });
    setIsChallengeDialogOpen(true);
  };

  const handleDeleteChallenge = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this weekly challenge?")) {
      await deleteChallengeMutation.mutateAsync(id);
    }
  };

  const handleSaveGoalProgress = async () => {
    const booksCompleted = parseInt((document.getElementById('books-completed') as HTMLInputElement)?.value || '0');
    const coursesCompleted = parseInt((document.getElementById('courses-completed') as HTMLInputElement)?.value || '0');
    const podcastsCompleted = parseInt((document.getElementById('podcasts-completed') as HTMLInputElement)?.value || '0');
    const debatesCompleted = parseInt((document.getElementById('debates-completed') as HTMLInputElement)?.value || '0');
    const wisdomScore = parseInt((document.getElementById('wisdom-score') as HTMLInputElement)?.value || '0');
    const criticScore = parseFloat((document.getElementById('critic-score') as HTMLInputElement)?.value || '0');

    await updateGoalProgressMutation.mutateAsync({
      booksCompleted,
      coursesCompleted,
      podcastsCompleted,
      debatesCompleted,
      wisdomScore,
      criticScore,
    });
  };

  const handleResetGoalProgress = () => {
    if (goalProgress) {
      (document.getElementById('books-completed') as HTMLInputElement).value = String(goalProgress.booksCompleted || 8);
      (document.getElementById('courses-completed') as HTMLInputElement).value = String(goalProgress.coursesCompleted || 2);
      (document.getElementById('podcasts-completed') as HTMLInputElement).value = String(goalProgress.podcastsCompleted || 5);
      (document.getElementById('debates-completed') as HTMLInputElement).value = String(goalProgress.debatesCompleted || 1);
      (document.getElementById('wisdom-score') as HTMLInputElement).value = String(goalProgress.wisdomScore || 450);
      (document.getElementById('critic-score') as HTMLInputElement).value = String(goalProgress.criticScore || 4.2);
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Panel</h1>
          <p className="text-slate-600">Manage media items, user goals, and guiding questions</p>
        </div>

        <Tabs defaultValue="media" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="media">Media Items</TabsTrigger>
            <TabsTrigger value="challenges">Weekly Challenges</TabsTrigger>
            <TabsTrigger value="goals">Goal Settings</TabsTrigger>
            <TabsTrigger value="questions">Guiding Questions</TabsTrigger>
            <TabsTrigger value="ratings">Demo Ratings</TabsTrigger>
            <TabsTrigger value="content">Demo Content</TabsTrigger>
          </TabsList>

          <TabsContent value="media" className="mt-6">
            <div className="space-y-8">
              {/* Add New Media Item */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Add New Media Item
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter media title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select media type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {mediaTypeOptions.map((option) => {
                                    const Icon = option.icon;
                                    return (
                                      <SelectItem key={option.value} value={option.value}>
                                        <div className="flex items-center">
                                          <Icon className="w-4 h-4 mr-2" />
                                          {option.label}
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="author"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Author/Creator</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter author or creator name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="https://example.com/image.jpg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter a detailed description of the media item..."
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Three-Dimensional Rating System */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900">Rating Dimensions (1-5 scale)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            control={form.control}
                            name="avgMindExpanding"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center text-purple-600">
                                  <Brain className="w-4 h-4 mr-2" />
                                  Mind Expanding
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    min="1"
                                    max="5"
                                    placeholder="3.0"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                  />
                                </FormControl>
                                <FormDescription>1 = Junk Food, 5 = Mind-Expanding</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="avgInformative"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center text-blue-600">
                                  <Info className="w-4 h-4 mr-2" />
                                  Informative
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    min="1"
                                    max="5"
                                    placeholder="3.0"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                  />
                                </FormControl>
                                <FormDescription>1 = Uninformative, 5 = Highly Informative</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="avgEntertaining"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center text-red-500">
                                  <Heart className="w-4 h-4 mr-2" />
                                  Entertaining
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    min="1"
                                    max="5"
                                    placeholder="3.0"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                  />
                                </FormControl>
                                <FormDescription>1 = Boring, 5 = Highly Entertaining</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Creating..." : "Create Media Item"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Existing Media Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Existing Media Items ({mediaItems?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">Loading media items...</div>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {mediaItems?.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium text-slate-900">{item.title}</h3>
                                <Badge variant="secondary">{item.type}</Badge>
                              </div>
                              <p className="text-sm text-slate-600">{item.author}</p>
                              <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-sm text-slate-600">
                                  ⭐ {item.avgRating?.toFixed(1)} ({item.totalRatings} ratings)
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Trophy className="w-5 h-5 text-primary mr-2" />
                    Weekly Challenges Management
                  </CardTitle>
                  <Dialog open={isChallengeDialogOpen} onOpenChange={(open) => {
                    setIsChallengeDialogOpen(open);
                    if (!open) {
                      setEditingChallenge(null);
                      challengeForm.reset();
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Challenge
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{editingChallenge ? 'Edit' : 'Add'} Weekly Challenge</DialogTitle>
                      </DialogHeader>
                      <Form {...challengeForm}>
                        <form onSubmit={challengeForm.handleSubmit(onSubmitChallenge)} className="space-y-4">
                          <FormField
                            control={challengeForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Read 5 High-Quality Articles" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={challengeForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Describe the challenge and its goals..."
                                    className="min-h-[80px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={challengeForm.control}
                              name="startDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Start Date</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="date" 
                                      value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                                      onChange={(e) => field.onChange(new Date(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={challengeForm.control}
                              name="endDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>End Date</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="date"
                                      value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                                      onChange={(e) => field.onChange(new Date(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={challengeForm.control}
                            name="active"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <input 
                                    type="checkbox" 
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="w-4 h-4"
                                  />
                                </FormControl>
                                <FormLabel className="!mt-0">Set as Active Challenge</FormLabel>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button 
                            type="submit" 
                            className="w-full"
                            disabled={createChallengeMutation.isPending || updateChallengeMutation.isPending}
                          >
                            {(createChallengeMutation.isPending || updateChallengeMutation.isPending) 
                              ? "Saving..." 
                              : editingChallenge ? "Update Challenge" : "Create Challenge"}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {isLoadingChallenges ? (
                    <div className="text-center py-8">Loading challenges...</div>
                  ) : (
                    <>
                      {weeklyChallenges?.map((challenge: any) => (
                        <div key={challenge.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-slate-900">{challenge.title}</h3>
                              {challenge.active && <Badge className="bg-green-500">Active</Badge>}
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{challenge.description}</p>
                            <div className="text-xs text-slate-500">
                              {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditChallenge(challenge)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteChallenge(challenge.id)}
                              disabled={deleteChallengeMutation.isPending}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {(!weeklyChallenges || weeklyChallenges.length === 0) && (
                        <div className="text-center text-slate-500 py-8">
                          <Trophy className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                          <p className="text-sm">No weekly challenges yet</p>
                          <p className="text-xs text-slate-400 mt-1">Add your first challenge to motivate users</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Edit className="w-5 h-5 mr-2" />
                  Goal Management Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingGoals ? (
                  <div className="text-center py-8">Loading goal progress...</div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <Label htmlFor="books-completed">Books Completed</Label>
                        <Input 
                          id="books-completed"
                          type="number"
                          defaultValue={goalProgress?.booksCompleted || 8}
                          min="0"
                          className="mt-1"
                        />
                        <p className="text-sm text-slate-500 mt-1">out of {goalProgress?.booksTarget || 24} target</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="courses-completed">Courses Completed</Label>
                        <Input 
                          id="courses-completed"
                          type="number"
                          defaultValue={goalProgress?.coursesCompleted || 2}
                          min="0"
                          className="mt-1"
                        />
                        <p className="text-sm text-slate-500 mt-1">out of {goalProgress?.coursesTarget || 6} target</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="podcasts-completed">Podcasts Completed</Label>
                        <Input 
                          id="podcasts-completed"
                          type="number"
                          defaultValue={goalProgress?.podcastsCompleted || 5}
                          min="0"
                          className="mt-1"
                        />
                        <p className="text-sm text-slate-500 mt-1">out of {goalProgress?.podcastsTarget || 12} target</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="debates-completed">Debates Completed</Label>
                        <Input 
                          id="debates-completed"
                          type="number"
                          defaultValue={goalProgress?.debatesCompleted || 1}
                          min="0"
                          className="mt-1"
                        />
                        <p className="text-sm text-slate-500 mt-1">out of {goalProgress?.debatesTarget || 4} target</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="wisdom-score">Wisdom Score</Label>
                        <Input 
                          id="wisdom-score"
                          type="number"
                          defaultValue={goalProgress?.wisdomScore || 450}
                          min="0"
                          max="1000"
                          className="mt-1"
                        />
                        <p className="text-sm text-slate-500 mt-1">Current wisdom level</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="critic-score">Critic Score</Label>
                        <Input 
                          id="critic-score"
                          type="number"
                          step="0.1"
                          defaultValue={goalProgress?.criticScore || 4.2}
                          min="0"
                          max="5"
                          className="mt-1"
                        />
                        <p className="text-sm text-slate-500 mt-1">Review quality rating</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex space-x-3">
                      <Button 
                        className="bg-green-600 text-white hover:bg-green-700"
                        onClick={handleSaveGoalProgress}
                        disabled={updateGoalProgressMutation.isPending}
                      >
                        {updateGoalProgressMutation.isPending ? "Saving..." : "Save Goal Settings"}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={handleResetGoalProgress}
                      >
                        Reset to Current Values
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 text-primary mr-2" />
                    Guiding Questions Management
                  </CardTitle>
                  <Dialog open={isQuestionDialogOpen} onOpenChange={(open) => {
                    setIsQuestionDialogOpen(open);
                    if (!open) {
                      setEditingQuestion(null);
                      questionForm.reset();
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingQuestion ? 'Edit' : 'Add'} Guiding Question</DialogTitle>
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
                                    className="min-h-[100px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button 
                            type="submit" 
                            className="w-full"
                            disabled={addQuestionMutation.isPending || updateQuestionMutation.isPending}
                          >
                            {(addQuestionMutation.isPending || updateQuestionMutation.isPending) 
                              ? "Saving..." 
                              : editingQuestion ? "Update Question" : "Add Question"}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {isLoadingQuestions ? (
                    <div className="text-center py-8">Loading questions...</div>
                  ) : (
                    <>
                      {guidingQuestions?.map((question: any) => (
                        <div key={question.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                          <span className="text-sm text-slate-700 flex-1">"{question.question}"</span>
                          <div className="flex space-x-2 ml-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditQuestion(question)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => deleteQuestionMutation.mutate(question.id)}
                              disabled={deleteQuestionMutation.isPending}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {(!guidingQuestions || guidingQuestions.length === 0) && (
                        <div className="text-center text-slate-500 py-8">
                          <Target className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                          <p className="text-sm">No guiding questions yet</p>
                          <p className="text-xs text-slate-400 mt-1">Add your first question to help guide your learning journey</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ratings" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 text-primary mr-2" />
                    Demo User Ratings Management
                  </CardTitle>
                  <Dialog open={isRatingDialogOpen} onOpenChange={(open) => {
                    setIsRatingDialogOpen(open);
                    if (!open) {
                      setEditingRating(null);
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Rating
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{editingRating ? 'Edit' : 'Add'} Demo Rating</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Media Item</Label>
                          <Select 
                            defaultValue={editingRating?.mediaId?.toString()} 
                            onValueChange={(value) => {
                              const form = document.getElementById('rating-form') as any;
                              if (form) form.mediaId = parseInt(value);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select media item" />
                            </SelectTrigger>
                            <SelectContent>
                              {mediaItems?.map((item: any) => (
                                <SelectItem key={item.id} value={item.id.toString()}>
                                  {item.title} ({item.type})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Review</Label>
                          <Textarea 
                            id="rating-review"
                            defaultValue={editingRating?.review || ''}
                            placeholder="Write your review..."
                            className="min-h-[100px]"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Mind Expanding (1-5)</Label>
                            <Input 
                              id="rating-mind"
                              type="number" 
                              min="1" 
                              max="5" 
                              defaultValue={editingRating?.mindExpandingRating || 3}
                            />
                          </div>
                          <div>
                            <Label>Informative (1-5)</Label>
                            <Input 
                              id="rating-info"
                              type="number" 
                              min="1" 
                              max="5" 
                              defaultValue={editingRating?.informativeRating || 3}
                            />
                          </div>
                          <div>
                            <Label>Entertaining (1-5)</Label>
                            <Input 
                              id="rating-fun"
                              type="number" 
                              min="1" 
                              max="5" 
                              defaultValue={editingRating?.entertainingRating || 3}
                            />
                          </div>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={async () => {
                            const form = document.getElementById('rating-form') as any;
                            const review = (document.getElementById('rating-review') as HTMLTextAreaElement).value;
                            const mind = parseInt((document.getElementById('rating-mind') as HTMLInputElement).value);
                            const info = parseInt((document.getElementById('rating-info') as HTMLInputElement).value);
                            const fun = parseInt((document.getElementById('rating-fun') as HTMLInputElement).value);
                            
                            if (!form?.mediaId) {
                              toast({ title: "Error", description: "Please select a media item", variant: "destructive" });
                              return;
                            }
                            
                            const data = {
                              mediaId: form.mediaId,
                              review,
                              mindExpandingRating: mind,
                              informativeRating: info,
                              entertainingRating: fun,
                              userId: "demo-user"
                            };
                            
                            try {
                              if (editingRating) {
                                await apiRequest('PUT', `/api/demo-data/ratings/${editingRating.id}`, data);
                              } else {
                                await apiRequest('POST', '/api/demo-data/ratings', data);
                              }
                              queryClient.invalidateQueries({ queryKey: ["/api/demo-data/ratings"] });
                              queryClient.invalidateQueries({ queryKey: ["/api/user/media-ratings"] });
                              queryClient.invalidateQueries({ queryKey: ["/api/user/activity"] });
                              setIsRatingDialogOpen(false);
                              setEditingRating(null);
                              toast({ title: "Success", description: `Rating ${editingRating ? 'updated' : 'created'} successfully` });
                            } catch (error) {
                              toast({ title: "Error", description: `Failed to ${editingRating ? 'update' : 'create'} rating`, variant: "destructive" });
                            }
                          }}
                        >
                          {editingRating ? 'Update Rating' : 'Create Rating'}
                        </Button>
                      </div>
                      <form id="rating-form" style={{display: 'none'}} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingRatings ? (
                  <div className="text-center py-8">Loading demo ratings...</div>
                ) : (
                  <div className="space-y-3">
                    {demoRatings && demoRatings.length > 0 ? (
                      demoRatings.map((rating: any) => (
                        <div key={rating.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 mb-1">{rating.media?.title || 'Unknown Media'}</h3>
                            <p className="text-sm text-slate-600 mb-2">{rating.review}</p>
                            <div className="flex items-center space-x-4 text-sm text-slate-500">
                              <span>Rating: {rating.rating}★</span>
                              <span>Mind: {rating.mindExpandingRating}</span>
                              <span>Info: {rating.informativeRating}</span>
                              <span>Fun: {rating.entertainingRating}</span>
                              <span>{new Date(rating.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                setEditingRating(rating);
                                setIsRatingDialogOpen(true);
                              }}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={async () => {
                                if (window.confirm('Delete this rating?')) {
                                  await apiRequest('DELETE', `/api/demo-data/ratings/${rating.id}`);
                                  queryClient.invalidateQueries({ queryKey: ["/api/demo-data/ratings"] });
                                  queryClient.invalidateQueries({ queryKey: ["/api/user/media-ratings"] });
                                  queryClient.invalidateQueries({ queryKey: ["/api/user/activity"] });
                                }
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-slate-500 py-8">
                        <Star className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm">No demo ratings yet</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Lightbulb className="w-5 h-5 text-primary mr-2" />
                    Demo User Content Management
                  </CardTitle>
                  <Dialog open={isContentDialogOpen} onOpenChange={(open) => {
                    setIsContentDialogOpen(open);
                    if (!open) {
                      setEditingContent(null);
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Content
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{editingContent ? 'Edit' : 'Add'} Demo Content</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Title</Label>
                          <Input 
                            id="content-title"
                            defaultValue={editingContent?.title || ''}
                            placeholder="Content title..."
                          />
                        </div>
                        <div>
                          <Label>Type</Label>
                          <Select 
                            defaultValue={editingContent?.type || 'article'}
                            onValueChange={(value) => {
                              const form = document.getElementById('content-form') as any;
                              if (form) form.type = value;
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select content type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="article">Article</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                              <SelectItem value="debate_contribution">Debate Contribution</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea 
                            id="content-description"
                            defaultValue={editingContent?.content || ''}
                            placeholder="Content description..."
                            className="min-h-[100px]"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Views</Label>
                            <Input 
                              id="content-views"
                              type="number" 
                              min="0" 
                              defaultValue={editingContent?.views || 0}
                            />
                          </div>
                          <div>
                            <Label>Avg Rating</Label>
                            <Input 
                              id="content-rating"
                              type="number" 
                              step="0.1"
                              min="0" 
                              max="5" 
                              defaultValue={editingContent?.avgRating || 0}
                            />
                          </div>
                          <div>
                            <Label>Total Ratings</Label>
                            <Input 
                              id="content-total-ratings"
                              type="number" 
                              min="0" 
                              defaultValue={editingContent?.totalRatings || 0}
                            />
                          </div>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={async () => {
                            const form = document.getElementById('content-form') as any;
                            const title = (document.getElementById('content-title') as HTMLInputElement).value;
                            const content = (document.getElementById('content-description') as HTMLTextAreaElement).value;
                            const views = parseInt((document.getElementById('content-views') as HTMLInputElement).value);
                            const avgRating = parseFloat((document.getElementById('content-rating') as HTMLInputElement).value);
                            const totalRatings = parseInt((document.getElementById('content-total-ratings') as HTMLInputElement).value);
                            
                            if (!title) {
                              toast({ title: "Error", description: "Please enter a title", variant: "destructive" });
                              return;
                            }
                            
                            const data = {
                              title,
                              type: form?.type || editingContent?.type || 'article',
                              content,
                              views,
                              avgRating,
                              totalRatings,
                              userId: "demo-user"
                            };
                            
                            try {
                              if (editingContent) {
                                await apiRequest('PUT', `/api/demo-data/content/${editingContent.id}`, data);
                              } else {
                                await apiRequest('POST', '/api/demo-data/content', data);
                              }
                              queryClient.invalidateQueries({ queryKey: ["/api/demo-data/content"] });
                              queryClient.invalidateQueries({ queryKey: ["/api/user/content"] });
                              setIsContentDialogOpen(false);
                              setEditingContent(null);
                              toast({ title: "Success", description: `Content ${editingContent ? 'updated' : 'created'} successfully` });
                            } catch (error) {
                              toast({ title: "Error", description: `Failed to ${editingContent ? 'update' : 'create'} content`, variant: "destructive" });
                            }
                          }}
                        >
                          {editingContent ? 'Update Content' : 'Create Content'}
                        </Button>
                      </div>
                      <form id="content-form" style={{display: 'none'}} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingContent ? (
                  <div className="text-center py-8">Loading demo content...</div>
                ) : (
                  <div className="space-y-3">
                    {demoContent && demoContent.length > 0 ? (
                      demoContent.map((content: any) => (
                        <div key={content.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-slate-900">{content.title}</h3>
                              <Badge variant="secondary" className="text-xs">{content.type}</Badge>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{content.content}</p>
                            <div className="flex items-center space-x-4 text-sm text-slate-500">
                              <span>{content.views} views</span>
                              <span>{content.avgRating?.toFixed(1)}★ ({content.totalRatings} ratings)</span>
                              <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                setEditingContent(content);
                                setIsContentDialogOpen(true);
                              }}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={async () => {
                                if (window.confirm('Delete this content?')) {
                                  await apiRequest('DELETE', `/api/demo-data/content/${content.id}`);
                                  queryClient.invalidateQueries({ queryKey: ["/api/demo-data/content"] });
                                  queryClient.invalidateQueries({ queryKey: ["/api/user/content"] });
                                }
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-slate-500 py-8">
                        <Lightbulb className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm">No demo content yet</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </TooltipProvider>
  );
}