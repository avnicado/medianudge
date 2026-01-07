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
import { Upload, Plus, BookOpen, GraduationCap, Headphones, Film, Users, Gamepad2, Trash2, Edit, Eye, Target, Brain, Info, Heart } from "lucide-react";
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

type MediaItemFormData = z.infer<typeof mediaItemSchema>;
type GuidingQuestionFormData = z.infer<typeof guidingQuestionSchema>;

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
    await addQuestionMutation.mutateAsync(data);
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="media">Media Items</TabsTrigger>
            <TabsTrigger value="goals">Goal Settings</TabsTrigger>
            <TabsTrigger value="questions">Guiding Questions</TabsTrigger>
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

          <TabsContent value="goals" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Edit className="w-5 h-5 mr-2" />
                  Goal Management Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <Label htmlFor="books-completed">Books Completed</Label>
                    <Input 
                      id="books-completed"
                      type="number"
                      defaultValue="8"
                      min="0"
                      className="mt-1"
                    />
                    <p className="text-sm text-slate-500 mt-1">out of 24 target</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="courses-completed">Courses Completed</Label>
                    <Input 
                      id="courses-completed"
                      type="number"
                      defaultValue="2"
                      min="0"
                      className="mt-1"
                    />
                    <p className="text-sm text-slate-500 mt-1">out of 6 target</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="podcasts-completed">Podcasts Completed</Label>
                    <Input 
                      id="podcasts-completed"
                      type="number"
                      defaultValue="5"
                      min="0"
                      className="mt-1"
                    />
                    <p className="text-sm text-slate-500 mt-1">out of 12 target</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="debates-completed">Debates Completed</Label>
                    <Input 
                      id="debates-completed"
                      type="number"
                      defaultValue="1"
                      min="0"
                      className="mt-1"
                    />
                    <p className="text-sm text-slate-500 mt-1">out of 4 target</p>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="wisdom-score">Wisdom Score</Label>
                    <Input 
                      id="wisdom-score"
                      type="number"
                      defaultValue="450"
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
                      defaultValue="4.2"
                      min="0"
                      max="5"
                      className="mt-1"
                    />
                    <p className="text-sm text-slate-500 mt-1">Review quality rating</p>
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="bg-green-600 text-white" disabled>
                        Save Goal Settings
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Not implemented yet</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" disabled>
                        Reset to Demo Values
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Not implemented yet</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
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
                  <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
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
                  {isLoadingQuestions ? (
                    <div className="text-center py-8">Loading questions...</div>
                  ) : (
                    <>
                      {guidingQuestions?.map((question: any) => (
                        <div key={question.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                          <span className="text-sm text-slate-700 flex-1">"{question.question}"</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteQuestionMutation.mutate(question.id)}
                            disabled={deleteQuestionMutation.isPending}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
        </Tabs>
      </div>
    </div>
    </TooltipProvider>
  );
}