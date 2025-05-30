"use client";
import { useEffect, useState } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
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
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
        <p className="text-gray-600">
          Welcome back, {user?.firstName || user?.emailAddresses[0]?.emailAddress}! 
          Manage your personal tasks below.
        </p>
      </div>

      {/* Add Task Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h2>
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
          <button 
            type="submit" 
            disabled={submitting || !name.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Adding...' : 'Add'}
          </button>
        </form>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Tasks</h2>
        </div>
        
        <div className="p-6">
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
              <p className="text-sm text-gray-500">Create your first task using the form above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
