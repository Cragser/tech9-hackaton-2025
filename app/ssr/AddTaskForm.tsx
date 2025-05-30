'use client';
import React, { useState } from 'react';
import { addTask } from './actions';
import { useRouter } from 'next/navigation';

function AddTaskForm() {
  const [taskName, setTaskName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function onSubmit() {
    if (!taskName.trim()) return;
    
    setSubmitting(true);
    try {
      await addTask(taskName);
      setTaskName('');
      router.refresh();
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form action={onSubmit} className="flex gap-3">
      <input
        autoFocus
        type="text"
        name="name"
        placeholder="Enter new task"
        onChange={(e) => setTaskName(e.target.value)}
        value={taskName}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
        disabled={submitting}
      />
      <button 
        type="submit"
        disabled={submitting || !taskName.trim()}
        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}
export default AddTaskForm;
