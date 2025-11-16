"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-blue-600">
        Personal Budget Tracker
      </h1>

      <p className="mb-6 text-gray-700">
        Track income, expenses and budgets easily.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 rounded bg-blue-600 text-white"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/register")}
          className="px-4 py-2 rounded border"
        >
          Register
        </button>
      </div>
    </div>
  );
}
