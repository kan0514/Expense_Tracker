"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterModal({ onRegister }: { onRegister: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const res = await api.post("/auth/register", { name, email, password });
      if (res.data) onRegister();
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Account</h2>

      {error && <div className="text-red-500 mb-3">{error}</div>}

      <input
        className="w-full p-2 border rounded mb-3"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full p-2 border rounded mb-3"
        placeholder="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full p-2 border rounded mb-4"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleRegister}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Register
      </button>
    </div>
  );
}
