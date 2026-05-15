import type { ReactNode } from "react";
import { DashboardShell } from "@/app/components/layout/DashboardShell";

export default function ProviderLayout({ children }: { children: ReactNode }) {
  return <DashboardShell role="provider">{children}</DashboardShell>;
}
