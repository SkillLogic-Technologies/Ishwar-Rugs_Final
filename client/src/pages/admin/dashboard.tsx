import React, { useEffect } from "react";
import { useLocation } from "wouter";
import AdminLayout from "./AdminLayout";

const stats = [
  { label: "Total Products", value: 128 },
  { label: "Total Inquiries", value: 36 },
  { label: "Total Customers", value: 92 },
  { label: "Total Orders", value: 49 },
];

const AdminDashboard = () => {
  const [location, setLocation] = useLocation();

  // ✅ Protect route if not logged in
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/admin/profile", {
          credentials: "include",
        });

        if (!res.ok) {
          setLocation("/admin/login");
          return;
        }

        const data = await res.json();

        if (!data.success) {
          setLocation("/admin/login");
        }
      } catch (error) {
        setLocation("/admin/login");
      }
    };

    checkAdmin();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 bg-soft-gray dark:bg-neutral-950 min-h-screen">
        <h1 className="text-3xl font-serif font-semibold mb-8 text-primary-brown dark:text-warm-gold">
          Welcome to the Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 shadow-sm p-6 transition-all"
            >
              <h2 className="text-sm font-medium text-primary-brown/70 dark:text-neutral-300">
                {stat.label}
              </h2>
              <p className="text-3xl font-bold mt-2 text-primary-brown dark:text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
