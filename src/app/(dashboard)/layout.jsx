"use client";
import { Sidebar } from "@/components/shared/Sidebar";
export default function DashboardGroupLayout({ children, }) {
    return (<div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </main>
    </div>);
}
