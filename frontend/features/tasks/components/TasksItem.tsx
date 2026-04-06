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
    <li className="group bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 hover:shadow-md hover:border-cyan-100 transition-all duration-200">
      {/* Checkbox toggle */}
      <button
        onClick={handleToggle}
        className={`shrink w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          task.completed
            ? "bg-cyan-500 border-cyan-500"
            : "border-gray-300 hover:border-cyan-400"
        }`}
        title={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {task.completed && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      {/* Task title / edit input */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-cyan-300 rounded-lg px-3 py-1.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUpdate();
              else if (e.key === "Escape") {
                setIsEditing(false);
                setTitle(task.title);
              }
            }}
            autoFocus
          />
        ) : (
          <span
            onDoubleClick={() => canEdit && setIsEditing(true)}
            className={`block truncate text-sm font-medium transition-colors ${
              task.completed ? "line-through text-gray-400" : "text-gray-700"
            } ${canEdit ? "cursor-text" : ""}`}
            title={canEdit ? "Double-click to edit" : task.title}
          >
            {editingId === task.id ? "Saving..." : task.title}
          </span>
        )}
      </div>

      {/* Action buttons */}
      {canEdit && (
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {/* Edit button */}
          {isEditing ? (
            <button
              onClick={handleUpdate}
              className="text-xs font-medium text-white bg-cyan-500 hover:bg-cyan-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs font-medium text-cyan-600 hover:text-white hover:bg-cyan-500 border border-cyan-200 hover:border-cyan-500 px-3 py-1.5 rounded-lg transition-all"
            >
              Edit
            </button>
          )}

          {/* Delete button*/}
          <button
            onClick={() => setIsOpen(true)}
            className="text-xs font-medium text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
            disabled={deletingId === task.id}
          >
            {deletingId === task.id ? "..." : "Delete"}
          </button>
        </div>
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
    </li>
  );
}
