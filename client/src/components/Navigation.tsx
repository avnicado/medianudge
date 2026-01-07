import { useState } from "react";
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
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const wisdomLevel = "College Senior+"; // Default level for all users (450 score)

  const navLinks = [
    { href: "/", label: "Discover", active: location === "/" },
    { href: "/social", label: "Social", active: location === "/social" },
    { href: "/progress", label: "Progress", active: location === "/progress" },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-slate-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">MediaNudge</h1>
                <p className="text-xs text-slate-500 font-medium">Cultivate Wisdom</p>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`px-4 py-2 rounded-lg transition-all duration-200 font-semibold ${
                link.active 
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md' 
                  : 'text-slate-700 hover:bg-slate-100 hover:text-primary'
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
                className="w-64 pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-slate-50 hover:bg-white"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            </div>
            
            <div className="flex items-center space-x-3 bg-slate-50 rounded-xl px-3 py-2 hover:bg-slate-100 transition-all">
              <Avatar className="w-10 h-10 ring-2 ring-primary/20 ring-offset-2">
                <AvatarImage 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
                  alt="User profile" 
                />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold">
                  EX
                </AvatarFallback>
              </Avatar>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm hover:bg-transparent p-0">
                    <div className="text-left">
                      <div className="font-semibold text-slate-900">
                        Demo User
                      </div>
                      <div className="text-xs font-medium bg-gradient-to-r from-wisdom to-secondary bg-clip-text text-transparent">
                        Wisdom: {wisdomLevel}
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Link href="/profile">
                      <a className="w-full">My Profile</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/progress">
                      <a className="w-full">Progress</a>
                    </Link>
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
