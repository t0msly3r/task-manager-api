"use client";

import { useState } from "react";
import { useLogin } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
          toast.success("Logged in successfully!");
          router.push("/tasks");
        },
        onError: (error: unknown) => {
          const status = (error as { response?: { status?: number } }).response
            ?.status;

          if (status === 401) {
            setErrorMessage("Invalid credentials");
          } else if (status === 429) {
            setErrorMessage("Too many attempts. Please try again later.");
          } else {
            setErrorMessage("An error occurred. Please try again.");
          }
          setPassword("");
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 max-w-sm mx-auto mt-10"
    >
      <h2 className="text-xl font-bold">Login</h2>

      <input
        className="border p-2 rounded"
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 rounded"
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white p-2 rounded"
        disabled={login.isPending}
      >
        {login.isPending ? "Logging in..." : "Login"}
      </button>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <p className="text-sm text-gray-500">
        Don't have an account?{" "}
        <span
          onClick={() => router.push("/register")}
          className="text-blue-500 cursor-pointer hover:underline"
        >
          Register
        </span>
      </p>
    </form>
  );
}
