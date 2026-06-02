import type { ReactNode } from "react";
import Sidebar from "@/components/MainMenu";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
