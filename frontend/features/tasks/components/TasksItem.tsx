"use client";

import { useDeleteTask, useUpdateTask } from "@/features/tasks/hooks/useTasks";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Task } from "@/types/tasks";
import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";

export default function TasksItem({ task }: { task: Task }) {
  const { data: user } = useAuth();
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();

  const isAdmin = user?.role === "ADMIN";
  const isOwner = user?.id === task.userId;

  const canEdit = isAdmin || isOwner;

  const [isOpen, setIsOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleToggle = () => {
    updateTask.mutate({
      id: task.id,
      title: task.title,
      completed: !task.completed,
    });
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    deleteTask.mutate(id, {
      onSuccess: () => toast.success("Task deleted!"),
      onError: () => toast.error("Failed to delete task. Please try again."),
      onSettled: () => setDeletingId(null),
    });
  };

  const handleUpdate = () => {
    if (!title.trim()) return;
    setEditingId(task.id);
    updateTask.mutate(
      { id: task.id, title, completed: task.completed },
      {
        onSuccess: () => {
          toast.success("Task updated!");
          setIsEditing(false);
        },
        onError: () => toast.error("Failed to update task. Please try again."),
        onSettled: () => {
          setIsEditing(false);
          setEditingId(null);
        },
      },
    );
  };

  return (
    <li className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center hover:shadow-md transition">
      <span
        onClick={handleToggle}
        className={`cursor-pointer ${
          task.completed ? "line-through text-gray-400" : "text-gray-800"
        }`}
      >
        {task.title}
      </span>

      {canEdit && (
        <button
          onClick={() => setIsOpen(true)}
          className="text-sm text-red-500 hover:text-red-700 transition"
          disabled={deletingId === task.id}
        >
          {deletingId === task.id ? "Deleting..." : "Delete"}
        </button>
      )}

      {isOpen && (
        <ConfirmModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            handleDelete(task.id);
            setIsOpen(false);
          }}
        />
      )}

      {isEditing ? (
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-2 py-1 rounded flex items-center"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleUpdate();
            } else if (e.key === "Escape") {
              setIsEditing(false);
              setTitle(task.title);
            }
          }}
          autoFocus
        />
      ) : (
        <span
          onDoubleClick={() => setIsEditing(true)}
          className="border px-2 py-1 rounded outline-none focus:ring-2 focus:ring-blue-400"
        >
          {editingId === task.id ? "Saving..." : task.title}
        </span>
      )}
    </li>
  );
}
