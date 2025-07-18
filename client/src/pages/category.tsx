import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MediaCard from "@/components/MediaCard";
import { BookOpen, GraduationCap, Headphones, Film, Users, Gamepad2, ArrowLeft, Filter } from "lucide-react";

export default function Category() {
  const [location, setLocation] = useLocation();
  
  // Get category from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const categoryType = urlParams.get('type');
  
  // Debug logging
  console.log('Category - location:', location);
  console.log('Category - window.location.search:', window.location.search);
  console.log('Category - categoryType:', categoryType);
  
  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ["/api/media", { type: categoryType }],
    queryFn: async () => {
      const response = await fetch(`/api/media?type=${categoryType}`);
      if (!response.ok) {
        throw new Error("Failed to fetch media items");
      }
      return response.json();
    },
    enabled: !!categoryType,
  });

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'book':
        return { 
          icon: BookOpen, 
          label: 'Books', 
          description: 'Curated collection of mind-expanding books',
          color: 'text-blue-600'
        };
      case 'course':
        return { 
          icon: GraduationCap, 
          label: 'Courses', 
          description: 'Educational courses for skill development',
          color: 'text-green-600'
        };
      case 'podcast':
        return { 
          icon: Headphones, 
          label: 'Podcasts', 
          description: 'Thought-provoking podcast episodes',
          color: 'text-purple-600'
        };
      case 'movie':
        return { 
          icon: Film, 
          label: 'Movies', 
          description: 'Intellectually stimulating films',
          color: 'text-red-600'
        };
      case 'debate':
        return { 
          icon: Users, 
          label: 'Debates', 
          description: 'Engaging debates on important topics',
          color: 'text-orange-600'
        };
      case 'game':
        return { 
          icon: Gamepad2, 
          label: 'Games', 
          description: 'Games that challenge your mind',
          color: 'text-indigo-600'
        };
      default:
        return { 
          icon: BookOpen, 
          label: 'Media', 
          description: 'Media collection',
          color: 'text-slate-600'
        };
    }
  };

  const typeInfo = getTypeInfo(categoryType || '');
  const Icon = typeInfo.icon;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => setLocation("/")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Icon className={`w-8 h-8 ${typeInfo.color}`} />
                <h1 className="text-3xl font-bold text-slate-900">{typeInfo.label}</h1>
              </div>
              <p className="text-slate-600">{typeInfo.description}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Badge variant="secondary" className="text-sm">
                {mediaItems?.length || 0} items
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mediaItems?.map((media: any) => (
            <MediaCard key={media.id} media={media} />
          ))}
          
          {(!mediaItems || mediaItems.length === 0) && (
            <div className="col-span-full text-center py-12">
              <Icon className={`w-16 h-16 ${typeInfo.color} mx-auto mb-4 opacity-50`} />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No {typeInfo.label} Found</h3>
              <p className="text-slate-600">Check back later for new additions to this collection.</p>
            </div>
          )}
        </div>

        {mediaItems?.length === 0 && (
          <div className="text-center py-12">
            <Icon className={`w-16 h-16 mx-auto mb-4 ${typeInfo.color} opacity-50`} />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No {typeInfo.label} Found</h3>
            <p className="text-slate-600 mb-4">
              We don't have any {typeInfo.label.toLowerCase()} in our collection yet.
            </p>
            <Button onClick={() => setLocation("/")}>
              Explore Other Categories
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}