import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
            
            <TooltipProvider>
              <div className="flex flex-col space-y-2 mt-2">
                {/* Mind Expanding Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-purple-600">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Brain className="w-3 h-3 mr-1 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mind Expanding: How thought-provoking and intellectually stimulating this content is</p>
                      </TooltipContent>
                    </Tooltip>
                    <StarRating 
                      rating={media.avgMindExpanding || 0} 
                      readonly={true}
                      size="sm"
                    />
                    <span className="text-xs font-medium ml-1">{media.avgMindExpanding?.toFixed(1) || '0.0'}</span>
                  </div>
                </div>
                
                {/* Informative & Entertaining in one row */}
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center text-blue-600">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 mr-1 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Informative: How much valuable information and knowledge this content provides</p>
                      </TooltipContent>
                    </Tooltip>
                    <StarRating 
                      rating={media.avgInformative || 0} 
                      readonly={true}
                      size="sm"
                    />
                    <span className="font-medium ml-1">{media.avgInformative?.toFixed(1) || '0.0'}</span>
                  </div>
                  
                  <div className="flex items-center text-red-500">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Heart className="w-3 h-3 mr-1 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Entertaining: How engaging, enjoyable, and fun this content is</p>
                      </TooltipContent>
                    </Tooltip>
                    <StarRating 
                      rating={media.avgEntertaining || 0} 
                      readonly={true}
                      size="sm"
                    />
                    <span className="font-medium ml-1">{media.avgEntertaining?.toFixed(1) || '0.0'}</span>
                  </div>
                </div>
              </div>
            </TooltipProvider>
            
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
