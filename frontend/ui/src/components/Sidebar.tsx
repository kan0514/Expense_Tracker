'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  user?: any;
  dashboard?: any;
  onLogout?: () => void;
  onOpenLogin?: () => void;
}

export default function Sidebar({ user, dashboard, onLogout, onOpenLogin }: SidebarProps) {
  const router = useRouter();
  const userName = user?.name || 'Guest User';
  const userEmail = user?.email || 'Not logged in';

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Transactions', path: '/transactions' },
    { label: 'Categories', path: '/categories' },
  ];

  return (
    <aside className="w-72 bg-[#0f1724] text-white min-h-screen p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
            <Image src="/avatar-placeholder.png" alt="avatar" width={48} height={48} />
          </div>
          <div>
            <h3 className="font-semibold text-white">{userName}</h3>
            <p className="text-xs text-gray-300">{userEmail}</p>
          </div>
        </div>

        {dashboard?.dashboard && (
          <div className="bg-gray-800 p-3 rounded-lg text-sm mb-4">
            <p>Total Spend: ₹{Number(dashboard.dashboard.totalSpend || 0).toLocaleString()}</p>
            <p>Transactions: {dashboard.dashboard.transactionCount || 0}</p>
          </div>
        )}

        <nav className="mt-6 space-y-3 text-gray-300">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => router.push(link.path)}
              className="w-full text-left py-2 px-3 rounded hover:bg-gray-800"
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-2">
        {user ? (
          <button onClick={() => onLogout && onLogout()} className="w-full py-2 px-3 rounded bg-red-600 hover:bg-red-700">
            Logout
          </button>
        ) : (
          <>
            <button onClick={() => router.push('/login')} className="w-full py-2 px-3 rounded bg-blue-600 hover:bg-blue-700">
              Login
            </button>
            <button onClick={() => router.push('/register')} className="w-full py-2 px-3 rounded border border-gray-600">
              Register
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
