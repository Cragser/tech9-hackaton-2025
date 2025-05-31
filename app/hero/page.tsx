"use client";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Trophy, Target, Calendar, MapPin, Award, CheckCircle } from "lucide-react";

// Feature flags inline para evitar problemas de importación
const flags = {
  SHOW_HERO_MOCK_PROFILE: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SHOW_HERO_MOCK_PROFILE === 'true',
  SHOW_HERO_MOCK_BADGES: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SHOW_HERO_MOCK_BADGES === 'true',
  SHOW_HERO_MOCK_ACTIVITY: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SHOW_HERO_MOCK_ACTIVITY === 'true',
  ENABLE_GAMIFICATION: true,
  ENABLE_LEADERBOARD: true,
} as const;

const isFeatureEnabled = (flagName: keyof typeof flags): boolean => {
  return flags[flagName];
};

interface HeroData {
  name: string;
  joinDate: string;
  location: string;
  totalBadges: number;
  issuesResolved: number;
  rank: string;
  points: number;
  avatar: string;
}

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  date: string | null;
}

interface Activity {
  id: number;
  type: "resolved" | "claimed" | "badge" | "info";
  title: string;
  date: string;
  points: number;
  photo: boolean;
}

interface HeroStat {
  label: string;
  value: string | number;
  icon: any;
  color: string;
}

export default function HeroPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  // Mock data controlled by flags
  const heroData: HeroData = isFeatureEnabled('SHOW_HERO_MOCK_PROFILE') ? {
    name: "Sarah Chen",
    joinDate: "March 2024",
    location: "Downtown District",
    totalBadges: 12,
    issuesResolved: 23,
    rank: "Community Champion",
    points: 2450,
    avatar: "SC"
  } : {
    name: "Guest User",
    joinDate: "Recently",
    location: "Unknown",
    totalBadges: 0,
    issuesResolved: 0,
    rank: "New Member",
    points: 0,
    avatar: "GU"
  };

  const badges: Badge[] = isFeatureEnabled('SHOW_HERO_MOCK_BADGES') ? [
    { id: 1, name: "First Fix", description: "Resolved your first community issue", icon: "🔧", earned: true, date: "Mar 15, 2024" },
    { id: 2, name: "Safety Hero", description: "Fixed 5 safety-related issues", icon: "🛡️", earned: true, date: "Apr 2, 2024" },
    { id: 3, name: "Infrastructure Expert", description: "Specialized in road and utility fixes", icon: "🏗️", earned: true, date: "Apr 20, 2024" },
    { id: 4, name: "Community Favorite", description: "Received 50+ likes on issue fixes", icon: "❤️", earned: true, date: "May 5, 2024" },
    { id: 5, name: "Speed Demon", description: "Resolved 3 issues in one day", icon: "⚡", earned: true, date: "May 12, 2024" },
    { id: 6, name: "Photo Pro", description: "Submitted high-quality before/after photos", icon: "📸", earned: true, date: "May 18, 2024" },
    { id: 7, name: "Team Player", description: "Collaborated on 5 multi-person fixes", icon: "🤝", earned: false, date: null },
    { id: 8, name: "Master Builder", description: "Complete 50 infrastructure projects", icon: "🏆", earned: false, date: null },
  ] : [
    { id: 1, name: "Welcome", description: "Join the community and start helping", icon: "👋", earned: false, date: null },
    { id: 2, name: "First Steps", description: "Complete your first task", icon: "👶", earned: false, date: null },
  ];

  const recentActivity: Activity[] = isFeatureEnabled('SHOW_HERO_MOCK_ACTIVITY') ? [
    {
      id: 1,
      type: "resolved",
      title: "Fixed broken streetlight on Oak Avenue",
      date: "2 days ago",
      points: 150,
      photo: true
    },
    {
      id: 2,
      type: "claimed",
      title: "Claimed pothole repair on Main Street",
      date: "5 days ago",
      points: 0,
      photo: false
    },
    {
      id: 3,
      type: "resolved",
      title: "Cleaned graffiti from bus stop",
      date: "1 week ago",
      points: 75,
      photo: true
    },
    {
      id: 4,
      type: "badge",
      title: "Earned 'Photo Pro' badge",
      date: "1 week ago",
      points: 100,
      photo: false
    },
  ] : [
    {
      id: 1,
      type: "info",
      title: "Welcome to the Hero community!",
      date: "Today",
      points: 0,
      photo: false
    }
  ];

  const stats: HeroStat[] = [
    { label: "Issues Resolved", value: heroData.issuesResolved, icon: CheckCircle, color: "text-green-600" },
    { label: "Badges Earned", value: heroData.totalBadges, icon: Award, color: "text-purple-600" },
    { label: "Community Points", value: heroData.points, icon: Star, color: "text-yellow-600" },
    { label: "Current Rank", value: heroData.rank, icon: Trophy, color: "text-blue-600" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Button 
        variant="ghost" 
        onClick={handleBack}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      {/* Debug info - only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="mb-4 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-sm text-yellow-800">Debug: Feature Flags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-yellow-700">
              Mock Profile: {isFeatureEnabled('SHOW_HERO_MOCK_PROFILE') ? '✅' : '❌'} | 
              Mock Badges: {isFeatureEnabled('SHOW_HERO_MOCK_BADGES') ? '✅' : '❌'} | 
              Mock Activity: {isFeatureEnabled('SHOW_HERO_MOCK_ACTIVITY') ? '✅' : '❌'}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
              {heroData.avatar}
            </div>
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{heroData.name}</CardTitle>
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {heroData.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {heroData.joinDate}
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <Trophy className="w-3 h-3 mr-1" />
                {heroData.rank}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <Icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold mb-1">
                  {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Badges Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Achievement Badges
            </CardTitle>
            <CardDescription>
              Earn badges by completing different types of community work
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    badge.earned
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-gray-50 opacity-60"
                  }`}
                >
                  <div className="text-2xl mb-2">{badge.icon}</div>
                  <div className="font-medium text-sm mb-1">{badge.name}</div>
                  <div className="text-xs text-gray-600 mb-2">{badge.description}</div>
                  {badge.earned && badge.date && (
                    <Badge variant="secondary" className="text-xs">
                      {badge.date}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest contributions to the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === "resolved" ? "bg-green-500" :
                    activity.type === "claimed" ? "bg-blue-500" :
                    activity.type === "badge" ? "bg-purple-500" :
                    "bg-gray-500"
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium text-sm mb-1">{activity.title}</div>
                    <div className="text-xs text-gray-600 mb-2">{activity.date}</div>
                    <div className="flex items-center gap-2">
                      {activity.points > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          +{activity.points} points
                        </Badge>
                      )}
                      {activity.photo && (
                        <Badge variant="outline" className="text-xs">
                          📸 Photo uploaded
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Target className="w-4 h-4 mr-2" />
          Find Issues to Fix
        </Button>
        {isFeatureEnabled('ENABLE_GAMIFICATION') && (
          <Button variant="outline">
            <Star className="w-4 h-4 mr-2" />
            View Badge Gallery
          </Button>
        )}
        {isFeatureEnabled('ENABLE_LEADERBOARD') && (
          <Button variant="outline">
            <Trophy className="w-4 h-4 mr-2" />
            Leaderboard
          </Button>
        )}
      </div>
    </div>
  );
} 