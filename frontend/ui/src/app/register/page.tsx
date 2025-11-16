"use client";
import RegisterModal from "@/components/RegisterModal";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <RegisterModal onRegister={() => { window.location.href = "/login"; }} />
    </div>
  );
}
