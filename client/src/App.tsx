import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Profile from "@/pages/profile";
import Social from "@/pages/social";
import Progress from "@/pages/progress";
import Admin from "@/pages/admin";
import MediaDetail from "@/pages/media-detail";
import Category from "@/pages/category";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/profile/:userId?" component={Profile} />
      <Route path="/social" component={Social} />
      <Route path="/progress" component={Progress} />
      <Route path="/admin" component={Admin} />
      <Route path="/media-detail" component={MediaDetail} />
      <Route path="/category" component={Category} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
