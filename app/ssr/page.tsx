import { createServerSupabaseClient } from "./client";
import AddTaskForm from "./AddTaskForm";

// This forces the page to be dynamically rendered at request time
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Use the custom Supabase client you created
  const client = createServerSupabaseClient();

  // Query the 'tasks' table to render the list of tasks
  const { data, error } = await client.from("tasks").select();
  if (error) {
    throw error;
  }
  const tasks = data;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks (SSR)</h1>
        <p className="text-gray-600">
          Server-side rendered task management with Clerk + Supabase integration.
        </p>
      </div>

      {/* Add Task Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h2>
        <AddTaskForm />
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Tasks</h2>
        </div>
        
        <div className="p-6">
          {tasks && tasks.length > 0 ? (
            <ul className="space-y-3">
              {tasks.map((task: any) => (
                <li key={task.id} className="flex items-center p-3 bg-gray-50 rounded-md">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span className="text-gray-900">{task.name}</span>
                  {task.created_at && (
                    <span className="ml-auto text-sm text-gray-500">
                      {new Date(task.created_at).toLocaleDateString()}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
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
