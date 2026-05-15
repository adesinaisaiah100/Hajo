import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f9fafb] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] sm:min-h-[calc(100vh-5rem)] max-w-7xl items-center justify-center">
        {children}
      </div>
    </div>
  );
}
