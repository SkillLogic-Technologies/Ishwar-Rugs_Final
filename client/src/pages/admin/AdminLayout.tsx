import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-soft-gray dark:bg-neutral-950 text-primary-brown dark:text-white">
      {/* Sidebar */}
      <aside className="mt-20 w-64 bg-white dark:bg-neutral-900 shadow-md fixed top-0 left-0 h-full z-10 border-r border-gray-200 dark:border-neutral-800">
        <AdminSidebar />
      </aside>

      {/* Page Content */}
      <main className="ml-64 flex-1 p-6 pt-[88px] overflow-auto">
        {children}
      </main>
    </div>
  );
}
