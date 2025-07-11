import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Brain, Search, Menu, X } from "lucide-react";

export default function Navigation() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const wisdomLevel = user?.wisdomScore >= 800 ? "PhD Level" : 
                     user?.wisdomScore >= 600 ? "Master's Level" : 
                     user?.wisdomScore >= 400 ? "College Senior+" : 
                     user?.wisdomScore >= 200 ? "College Junior" : "High School";

  const navLinks = [
    { href: "/", label: "Discover", active: location === "/" },
    { href: "/social", label: "Social", active: location === "/social" },
    { href: "/progress", label: "Progress", active: location === "/progress" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">MediaNudge</h1>
                <p className="text-xs text-slate-500">Cultivate Wisdom</p>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`transition-colors font-medium ${
                link.active 
                  ? 'text-primary' 
                  : 'text-slate-700 hover:text-primary'
              }`}>
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Input 
                type="search" 
                placeholder="Search media..." 
                className="w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            </div>
            
            <div className="flex items-center space-x-2">
              <Avatar className="w-10 h-10">
                <AvatarImage 
                  src={user?.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"} 
                  alt="User profile" 
                />
                <AvatarFallback>
                  {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
                </AvatarFallback>
              </Avatar>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm">
                    <div className="text-left">
                      <div className="font-medium text-slate-900">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-xs text-purple-600">
                        Wisdom: {wisdomLevel}
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href={`/profile/${user?.id}`}>
                      <a className="w-full">My Profile</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/progress">
                      <a className="w-full">Progress</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <a href="/api/logout" className="w-full">Logout</a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a 
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      link.active 
                        ? 'text-primary bg-primary/10' 
                        : 'text-slate-700 hover:text-primary hover:bg-slate-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
            </div>
            
            <div className="mt-4 px-3">
              <div className="relative">
                <Input 
                  type="search" 
                  placeholder="Search media..." 
                  className="w-full pl-10 pr-4 py-2"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
