"use client";
import { useEffect, useState } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Trophy, Target, Heart } from "lucide-react";

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
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

  // Create a `client` object for accessing Supabase data using the Clerk token
  const client = createClerkSupabaseClient();

  // This `useEffect` will wait for the User object to be loaded before requesting
  // the tasks for the signed in user
  useEffect(() => {
    if (!user) return;

    async function loadTasks() {
      setLoading(true);
      const { data, error } = await client.from("tasks").select();
      if (!error) setTasks(data);
      setLoading(false);
    }

    loadTasks();
  }, [user]);

  async function createTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return;
    
    setSubmitting(true);
    try {
      // Insert task into the "tasks" database
      await client.from("tasks").insert({
        name,
      });
      setName("");
      // Reload tasks instead of page
      const { data, error } = await client.from("tasks").select();
      if (!error) setTasks(data);
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
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

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Add Task Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Add New Task</CardTitle>
            <CardDescription>
              Keep track of your personal tasks and contributions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={createTask} className="flex gap-3">
              <input
                autoFocus
                type="text"
                name="name"
                placeholder="Enter new task"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={submitting}
              />
              <Button 
                type="submit" 
                disabled={submitting || !name.trim()}
                className="px-6 py-2"
              >
                {submitting ? 'Adding...' : 'Add'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Your Tasks</CardTitle>
            <CardDescription>
              Track your progress and completed work
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading tasks...</span>
              </div>
            )}

            {!loading && tasks.length > 0 && (
              <ul className="space-y-3">
                {tasks.map((task: any) => (
                  <li key={task.id} className="flex items-center p-3 bg-gray-50 rounded-md">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-900">{task.name}</span>
                    {task.created_at && (
                      <span className="ml-auto text-sm text-gray-500">
                        {new Date(task.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {!loading && tasks.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-600">No tasks found</p>
                <p className="text-sm text-gray-500">Create your first task using the form!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold mb-1">{tasks.length}</div>
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
  );
}
