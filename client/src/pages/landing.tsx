import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Users, Target, BookOpen, Award, TrendingUp } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">MediaNudge</h1>
              <p className="text-xs text-slate-500">Cultivate Wisdom</p>
            </div>
          </div>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="gradient-primary text-white hover:opacity-90"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Cultivate Education, Wisdom, and 
            <span className="text-primary"> Meaningful Engagement</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            A transparent social platform that tracks your intellectual journey, 
            promotes quality content discovery, and fosters accountability through 
            public engagement.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="gradient-primary text-white hover:opacity-90 px-8 py-3 text-lg"
            >
              Join the Community
            </Button>
            <Button variant="outline" className="px-8 py-3 text-lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Why MediaNudge?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-slate-200 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Track Your Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Monitor your intellectual journey with Wisdom Scores, Critic Ratings, 
                  and detailed progress tracking across all media types.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-xl">Discover Quality Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Get personalized recommendations for books, courses, podcasts, and more 
                  based on your guiding questions and interests.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Transparent Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  All profiles are public - see everyone's journey, ratings, and reviews. 
                  Accountability drives better choices.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle className="text-xl">Wisdom Scoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Earn wisdom points based on the quality of content you consume. 
                  Choose mind-expanding over mind-numbing.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-xl">Meaningful Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Join debate clubs, book clubs, and discussions. Connect with others 
                  who share your guiding questions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Personal Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Set yearly goals, track progress, and challenge yourself with 
                  weekly growth challenges.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Set Your Questions
              </h3>
              <p className="text-slate-600">
                Define your guiding questions - the big questions that drive your learning journey.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Consume & Rate
              </h3>
              <p className="text-slate-600">
                Engage with quality content and rate it on our 1-5 star scale from junk to wisdom.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Grow Together
              </h3>
              <p className="text-slate-600">
                Build your wisdom score, follow inspiring users, and contribute to the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 gradient-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Intellectual Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of learners who are choosing wisdom over distraction.
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="bg-white text-primary hover:bg-slate-100 px-8 py-3 text-lg"
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold">MediaNudge</span>
              </div>
              <p className="text-sm text-slate-400">
                Cultivating education, wisdom, and meaningful engagement through thoughtful media consumption.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Scoring System</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community Guidelines</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Features</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Recommendations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Progress Tracking</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Debate Clubs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Book Clubs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-6 text-center text-sm text-slate-400">
            <p>&copy; 2024 MediaNudge. All rights reserved. Built for thoughtful minds.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
