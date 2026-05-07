"use client";

import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useAuth } from "@/features/auth/hooks/useAuth";
import TasksItem from "@/features/tasks/components/TasksItem";
import CreateTask from "@/features/tasks/components/CreateTask";

export default function TasksPage() {
  const { data: tasks, isLoading } = useTasks();
  const { data: user } = useAuth();

  if (isLoading) {
    return (
      <div className="space-y-3 mt-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 text-black text-shadow-sm">
        Welcome {user?.email}
      </h2>

      <CreateTask />

      {!Array.isArray(tasks) || !tasks.length && (
        <p className="text-gray-500 mt-4">No tasks yet. Create one 👇</p>
      )}

      <ul className="flex flex-col gap-3 mt-4">
        {Array.isArray(tasks) && tasks.map((task) => (
          <TasksItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
}
