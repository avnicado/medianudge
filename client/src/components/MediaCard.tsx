import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/StarRating";
import { BookOpen, GraduationCap, Headphones, Film, Users, Gamepad2, Brain, Info, Heart } from "lucide-react";

interface MediaCardProps {
  media: {
    id: number;
    title: string;
    type: string;
    author?: string;
    description?: string;
    imageUrl?: string;
    avgMindExpanding?: number;
    avgInformative?: number;
    avgEntertaining?: number;
    totalRatings: number;
  };
  onRate?: (rating: number) => void;
  showRating?: boolean;
}

export default function MediaCard({ media, onRate, showRating = true }: MediaCardProps) {
  // Debug logging to ensure media has an ID
  console.log('MediaCard - media:', media);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'book':
        return <BookOpen className="w-4 h-4" />;
      case 'course':
        return <GraduationCap className="w-4 h-4" />;
      case 'podcast':
        return <Headphones className="w-4 h-4" />;
      case 'movie':
        return <Film className="w-4 h-4" />;
      case 'debate':
        return <Users className="w-4 h-4" />;
      case 'game':
        return <Gamepad2 className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getMindExpandingColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-purple-100 text-purple-600';
    if (rating >= 3.5) return 'bg-blue-100 text-blue-600';
    if (rating >= 2.5) return 'bg-yellow-100 text-yellow-600';
    return 'bg-red-100 text-red-600';
  };

  const getMindExpandingLabel = (rating: number) => {
    if (rating >= 4.5) return 'Mind-Expanding';
    if (rating >= 3.5) return 'Thought-Provoking';
    if (rating >= 2.5) return 'Decent';
    return 'Junk Food';
  };

  return (
    <Card className="border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-16 bg-slate-200 rounded flex items-center justify-center text-slate-400 flex-shrink-0">
            {media.imageUrl ? (
              <img 
                src={media.imageUrl} 
                alt={media.title}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              getTypeIcon(media.type)
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-slate-900 truncate">{media.title}</h4>
            {media.author && (
              <p className="text-sm text-slate-600 truncate">{media.author}</p>
            )}
            
            <div className="flex flex-col space-y-2 mt-2">
              {/* Mind Expanding Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-purple-600">
                  <Brain className="w-3 h-3 mr-1" />
                  <StarRating 
                    rating={media.avgMindExpanding || 0} 
                    readonly={true}
                    size="sm"
                  />
                  <span className="text-xs font-medium ml-1">{media.avgMindExpanding?.toFixed(1) || '0.0'}</span>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getMindExpandingColor(media.avgMindExpanding || 0)}`}
                >
                  {getMindExpandingLabel(media.avgMindExpanding || 0)}
                </Badge>
              </div>
              
              {/* Informative & Entertaining in one row */}
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center text-blue-600">
                  <Info className="w-3 h-3 mr-1" />
                  <StarRating 
                    rating={media.avgInformative || 0} 
                    readonly={true}
                    size="sm"
                  />
                  <span className="font-medium ml-1">{media.avgInformative?.toFixed(1) || '0.0'}</span>
                </div>
                
                <div className="flex items-center text-red-500">
                  <Heart className="w-3 h-3 mr-1" />
                  <StarRating 
                    rating={media.avgEntertaining || 0} 
                    readonly={true}
                    size="sm"
                  />
                  <span className="font-medium ml-1">{media.avgEntertaining?.toFixed(1) || '0.0'}</span>
                </div>
              </div>
            </div>
            
            {media.description && (
              <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                {media.description}
              </p>
            )}
            
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-slate-500">
                {media.totalRatings || 0} ratings
              </span>
              
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" onClick={() => {
                console.log('Navigating to media detail with ID:', media.id);
                window.location.href = `/media-detail?id=${media.id}`;
              }}>
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
