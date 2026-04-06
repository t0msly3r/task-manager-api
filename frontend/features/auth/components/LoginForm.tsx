"use client";

import { useState } from "react";
import { useLogin } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function LoginForm() {
  const login = useLogin();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login.mutate(
      { email, password },
      {
        onSuccess: () => {
          toast.success("Welcome back!");
          router.push("/tasks");
        },
        onError: (error: unknown) => {
          const status = (error as { response?: { status?: number } }).response
            ?.status;

          if (status === 401) {
            setErrorMessage("Invalid email or password.");
          } else if (status === 429) {
            setErrorMessage("Too many attempts. Please try again later.");
          } else {
            setErrorMessage("Something went wrong. Please try again.");
          }
          setPassword("");
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-extrabold text-cyan-500 tracking-tight">
              TaskFlow
            </span>
          </Link>
          <p className="text-sm text-gray-400 mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Email
              </label>
              <input
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition bg-gray-50 focus:bg-white"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Password
              </label>
              <input
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition bg-gray-50 focus:bg-white"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg px-3 py-2.5">
                {errorMessage}
              </div>
            )}

            <button
              className="mt-1 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-xl transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={login.isPending}
            >
              {login.isPending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          No account yet?{" "}
          <Link
            href="/register"
            className="text-cyan-500 font-medium hover:underline"
          >
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
