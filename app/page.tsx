"use client";
import { useEffect, useState } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Trophy, Target, Heart, MapPin, Camera, Users, Award, MessageSquare, Star } from "lucide-react";

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  
  // The `useUser()` hook is used to ensure that Clerk has loaded data about the signed in user
  const { user } = useUser();
  // The `useSession()` hook is used to get the Clerk session object
  // The session object is used to get the Clerk session token
  const { session } = useSession();

  // Create a custom Supabase client that injects the Clerk session token into the request headers
  function createClerkSupabaseClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!,
      {
        async accessToken() {
          return session?.getToken() ?? null;
        },
      },
    );
  }

  // Save Me Landing Page Content Component
  const SaveMeLandingPage = () => (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Save Me
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Empowering communities to identify, report, and solve local issues together. 
            From potholes to broken benches, we make civic engagement simple and rewarding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => router.push('/report')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              <Camera className="w-5 h-5 mr-2" />
              Report an Issue
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => router.push('/issues')}
              className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3"
            >
              <Users className="w-5 h-5 mr-2" />
              View Community Issues
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How Save Me Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Three simple steps to make your community better
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle>1. Report</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Snap a photo of local issues, add a description, and pin the location. 
                Our AI helps categorize and prioritize your report.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle>2. Engage</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Community members can comment, vote, and discuss issues. 
                Local heroes can claim problems to solve them.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle>3. Solve</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Heroes submit proof of fixes and earn badges. 
                The community celebrates progress and positive change.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-12">Community Impact</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">1,247</div>
              <div className="text-blue-100">Issues Reported</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">892</div>
              <div className="text-blue-100">Issues Resolved</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">156</div>
              <div className="text-blue-100">Community Heroes</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$12,450</div>
              <div className="text-blue-100">Donations Raised</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Heroes */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Community Heroes</h2>
          <p className="text-gray-600">Meet the amazing people making a difference</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Sarah Chen", badges: 12, issues: 23, avatar: "SC" },
            { name: "Mike Rodriguez", badges: 8, issues: 15, avatar: "MR" },
            { name: "Emma Thompson", badges: 15, issues: 31, avatar: "ET" }
          ].map((hero, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/hero')}>
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {hero.avatar}
                </div>
                <CardTitle>{hero.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex justify-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="font-bold text-lg">{hero.badges}</div>
                    <div className="text-sm text-gray-600">Badges</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{hero.issues}</div>
                    <div className="text-sm text-gray-600">Issues Solved</div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Star className="w-3 h-3 mr-1" />
                  Top Contributor
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );

  // If no user is logged in, show only the Save Me landing page
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <SaveMeLandingPage />
        </main>
      </div>
    );
  }

  // If user is logged in, show their dashboard content followed by the Save Me landing page
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Save Me Community</h1>
            <p className="text-gray-600">
              Welcome back, {user?.firstName || user?.emailAddresses[0]?.emailAddress}! 
              Help make your community better.
            </p>
          </div>

          {/* Navigation Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/hero')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <User className="w-5 h-5" />
                  Hero Profile
                </CardTitle>
                <CardDescription>
                  View your achievements, badges, and community contributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Profile
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow opacity-60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Target className="w-5 h-5" />
                  Report Issues
                </CardTitle>
                <CardDescription>
                  Report community problems that need fixing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow opacity-60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                  <Heart className="w-5 h-5" />
                  Donations
                </CardTitle>
                <CardDescription>
                  Support community heroes and platform development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                <div className="text-sm text-gray-600">Tasks Completed</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold mb-1">0</div>
                <div className="text-sm text-gray-600">Issues Reported</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <User className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold mb-1">New</div>
                <div className="text-sm text-gray-600">Community Rank</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save Me Landing Page Content */}
        <div className="max-w-6xl mx-auto mt-16">
          <SaveMeLandingPage />
        </div>
      </main>
    </div>
  );
}
