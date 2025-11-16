"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setChecking(false); // token exists, show children
    }
  }, [router]);

  if (checking) return <div>Checking authentication...</div>;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-bold">Budget App</h2>

        <nav className="space-y-3">
          <a href="/dashboard" className="block hover:text-blue-600">
            Dashboard
          </a>
          <a href="/transactions" className="block hover:text-blue-600">
            Transactions
          </a>
          <a href="/categories" className="block hover:text-blue-600">
            Categories
          </a>
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="w-full px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
