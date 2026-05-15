import type { ReactNode } from "react";
import { DashboardShell } from "@/app/components/layout/DashboardShell";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return <DashboardShell role="customer">{children}</DashboardShell>;
}
