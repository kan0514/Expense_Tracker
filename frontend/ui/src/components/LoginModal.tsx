"use client";
import { useState } from "react";
import api from "@/lib/api";

export default function LoginModal({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      onLogin();
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid login");
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Welcome Back</h2>

      {error && <div className="text-red-500 mb-3">{error}</div>}

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
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Login
      </button>
    </div>
  );
}
