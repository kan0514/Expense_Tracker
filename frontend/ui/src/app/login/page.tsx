"use client";
import LoginModal from "@/components/LoginModal";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <LoginModal onLogin={() => { window.location.href = "/dashboard"; }} />
    </div>
  );
}
