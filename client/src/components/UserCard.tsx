import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Trophy, Users, BookOpen } from "lucide-react";
import { Link } from "wouter";

interface UserCardProps {
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
    wisdomScore?: number;
    criticScore?: number;
  };
  showFollowButton?: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
}

export default function UserCard({ 
  user, 
  showFollowButton = false, 
  isFollowing = false, 
  onFollow, 
  onUnfollow 
}: UserCardProps) {
  const getWisdomLevel = (score: number) => {
    if (score >= 800) return "PhD Level";
    if (score >= 600) return "Master's Level";
    if (score >= 400) return "College Senior+";
    if (score >= 200) return "College Junior";
    return "High School";
  };

  const getWisdomPercentile = (score: number) => {
    // Simple percentile calculation - in real app this would be more sophisticated
    if (score >= 800) return "95th";
    if (score >= 600) return "87th";
    if (score >= 400) return "70th";
    if (score >= 200) return "50th";
    return "25th";
  };

  return (
    <Card className="border border-slate-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage 
              src={user.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"} 
              alt={`${user.firstName} ${user.lastName}`}
            />
            <AvatarFallback>
              {user.firstName?.[0] || 'U'}{user.lastName?.[0] || ''}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <Link href={`/profile/${user.id}`}>
              <a className="font-medium text-slate-900 hover:text-primary transition-colors">
                {user.firstName} {user.lastName}
              </a>
            </Link>
            
            <div className="flex items-center space-x-4 mt-2 text-sm">
              <div className="flex items-center space-x-1">
                <Trophy className="w-3 h-3 text-purple-600" />
                <span className="text-slate-600">
                  {getWisdomLevel(user.wisdomScore || 0)}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {getWisdomPercentile(user.wisdomScore || 0)} percentile
                </Badge>
              </div>
              
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-600" />
                <span className="text-slate-600">
                  {user.criticScore?.toFixed(1) || '0.0'}/5
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-3 text-xs text-slate-500">
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-3 h-3" />
                  <span>42 reviews</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>8 followers</span>
                </div>
              </div>
              
              {showFollowButton && (
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  size="sm"
                  onClick={isFollowing ? onUnfollow : onFollow}
                  className={isFollowing ? "" : "bg-primary text-white hover:bg-primary/90"}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
