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
import { Upload, Plus, BookOpen, GraduationCap, Headphones, Film, Users, Gamepad2, Trash2, Edit, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const mediaItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["book", "course", "podcast", "movie", "game", "debate"], {
    required_error: "Please select a media type",
  }),
  author: z.string().min(1, "Author is required"),
  description: z.string().min(1, "Description is required"),
  avgRating: z.number().min(1).max(5).optional(),
  totalRatings: z.number().min(0).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

type MediaItemFormData = z.infer<typeof mediaItemSchema>;

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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<MediaItemFormData>({
    resolver: zodResolver(mediaItemSchema),
    defaultValues: {
      title: "",
      type: "book",
      author: "",
      description: "",
      avgRating: 4.0,
      totalRatings: 0,
      imageUrl: "",
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

  const createMediaItemMutation = useMutation({
    mutationFn: async (data: MediaItemFormData) => {
      const payload = {
        ...data,
        avgRating: data.avgRating || 4.0,
        totalRatings: data.totalRatings || 0,
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
      // Invalidate recommendations cache to refresh the home page
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
      // Invalidate caches to refresh the data
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Panel</h1>
          <p className="text-slate-600">Add new media items to the platform</p>
        </div>

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
                        <FormDescription>
                          Optional URL for the media item image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="avgRating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Average Rating</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="5" 
                            step="0.1" 
                            placeholder="4.0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 4.0)}
                          />
                        </FormControl>
                        <FormDescription>
                          Rating from 1.0 to 5.0
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="totalRatings"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Ratings</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>
                          Number of users who have rated this item
                        </FormDescription>
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
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a compelling description that helps users understand the value of this content
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => form.reset()}
                    disabled={isSubmitting}
                  >
                    Reset Form
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Media Item
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Quick Guide</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• All fields except Image URL are required</li>
            <li>• Rating should be between 1.0 and 5.0 (use decimals for precision)</li>
            <li>• Total ratings represents how many users have rated this item</li>
            <li>• New items will appear in the appropriate category on the home page</li>
          </ul>
        </div>

        {/* Media Items Management */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Manage Media Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
              </div>
            ) : (
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {mediaItems?.map((item: any) => {
                    const typeOption = mediaTypeOptions.find(opt => opt.value === item.type);
                    const Icon = typeOption?.icon || BookOpen;
                    
                    return (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                        <div className="flex items-center space-x-4">
                          <Icon className="w-5 h-5 text-slate-600" />
                          <div>
                            <h3 className="font-semibold text-slate-900">{item.title}</h3>
                            <p className="text-sm text-slate-600">{item.author}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {typeOption?.label || item.type}
                              </Badge>
                              <span className="text-xs text-slate-500">
                                {item.avgRating ? `${item.avgRating}★` : 'No rating'} 
                                {item.totalRatings ? ` (${item.totalRatings})` : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            disabled={deleteMediaItemMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {mediaItems?.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      No media items found. Add some using the form above.
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}