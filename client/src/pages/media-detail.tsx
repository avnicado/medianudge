import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "@/components/StarRating";
import { BookOpen, GraduationCap, Headphones, Film, Users, Gamepad2, ArrowLeft, Star, User } from "lucide-react";

export default function MediaDetail() {
  const [location, setLocation] = useLocation();
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState("");
  
  // Get media ID from URL params
  const mediaId = new URLSearchParams(location.split('?')[1] || '').get('id');
  
  const { data: media, isLoading } = useQuery({
    queryKey: ["/api/media", mediaId],
    queryFn: async () => {
      const response = await fetch(`/api/media/${mediaId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch media details");
      }
      return response.json();
    },
    enabled: !!mediaId,
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'book':
        return <BookOpen className="w-5 h-5" />;
      case 'course':
        return <GraduationCap className="w-5 h-5" />;
      case 'podcast':
        return <Headphones className="w-5 h-5" />;
      case 'movie':
        return <Film className="w-5 h-5" />;
      case 'debate':
        return <Users className="w-5 h-5" />;
      case 'game':
        return <Gamepad2 className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-green-100 text-green-600';
    if (rating >= 3.5) return 'bg-blue-100 text-blue-600';
    if (rating >= 2.5) return 'bg-yellow-100 text-yellow-600';
    return 'bg-red-100 text-red-600';
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return 'Mind-Expanding';
    if (rating >= 3.5) return 'Thought-Provoking';
    if (rating >= 2.5) return 'Decent';
    return 'Junk Food';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Media Not Found</h2>
          <p className="text-slate-600 mb-4">The media item you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation("/")}>Go Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setLocation("/")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-32 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 flex-shrink-0">
                    {media.imageUrl ? (
                      <img 
                        src={media.imageUrl} 
                        alt={media.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      getTypeIcon(media.type)
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getTypeIcon(media.type)}
                      <Badge variant="secondary" className="capitalize">
                        {media.type}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-2xl mb-2">{media.title}</CardTitle>
                    
                    {media.author && (
                      <p className="text-lg text-slate-600 mb-3">by {media.author}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <StarRating rating={media.avgRating || 0} readonly size="lg" />
                        <span className="text-lg font-semibold">{media.avgRating?.toFixed(1) || '0.0'}★</span>
                      </div>
                      
                      <Badge className={`${getRatingColor(media.avgRating || 0)}`}>
                        {getRatingLabel(media.avgRating || 0)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-slate-500">
                      {media.totalRatings || 0} ratings
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {media.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-slate-700 leading-relaxed">{media.description}</p>
                  </div>
                )}
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Rate this {media.type}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Your Rating
                      </label>
                      <StarRating 
                        rating={userRating} 
                        onRate={setUserRating}
                        size="lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Review (Optional)
                      </label>
                      <Textarea 
                        placeholder="Share your thoughts about this content..."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <Button className="bg-primary text-white hover:bg-primary/90">
                      Submit Rating
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 text-primary mr-2" />
                  Recent Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Sample reviews */}
                  <div className="border-b pb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Alex Chen</p>
                        <div className="flex items-center">
                          <StarRating rating={5} readonly size="sm" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">
                      "Absolutely transformative content. Changed how I think about the subject entirely."
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Sarah Johnson</p>
                        <div className="flex items-center">
                          <StarRating rating={4} readonly size="sm" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">
                      "Great insights, though could be more concise. Still highly recommended."
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Mike Wilson</p>
                        <div className="flex items-center">
                          <StarRating rating={5} readonly size="sm" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">
                      "Perfect for anyone looking to deepen their understanding. Highly intellectual."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}