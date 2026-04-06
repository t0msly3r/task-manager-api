"use client";

import { useState } from "react";
import { useRegister } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const register = useRegister();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    register.mutate(
      { email, password },
      {
        onSuccess: () => {
          toast.success("Account created!");
          router.push("/tasks");
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
          <p className="text-sm text-gray-400 mt-1">Create your free account</p>
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

            {register.error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg px-3 py-2.5">
                Could not create account. Please try again.
              </div>
            )}

            <button
              className="mt-1 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-xl transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={register.isPending}
            >
              {register.isPending ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-cyan-500 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
