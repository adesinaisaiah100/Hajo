import type { ReactNode } from "react";
import { DashboardShell } from "@/app/components/layout/DashboardShell";
import { CustomerBottomNavbar } from "@/app/components/layout/CustomerBottomNavbar";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell role="customer">
      {children}
      <CustomerBottomNavbar />
    </DashboardShell>
  );
}
