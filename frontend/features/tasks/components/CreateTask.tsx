"use client";

import { useState } from "react";
import { useCreateTask } from "@/features/tasks/hooks/useTasks";
import toast from "react-hot-toast";

export default function CreateTask() {
  const [title, setTitle] = useState("");
  const createTask = useCreateTask();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;
    const toastId = toast.loading("Creating task...");

    createTask.mutate(title, {
      onSuccess: () => {
        toast.success("Task added!", { id: toastId });
        setTitle("");
      },
      onError: () =>
        toast.error("Failed to add task. Please try again.", { id: toastId }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        className="flex-1 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-100 bg-white shadow-sm text-gray-900"
        type="text"
        placeholder="What do you need to do?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white px-5 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
        disabled={createTask.isPending}
      >
        {createTask.isPending ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
