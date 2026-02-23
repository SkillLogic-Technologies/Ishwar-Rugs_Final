"use client";

import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Package,
  Grid2X2,
  Layers,
  ShoppingCart,
  Users,
  MessageSquare,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdminSidebar({
  isOpen,
  setIsOpen,
}: AdminSidebarProps) {
  const [location] = useLocation();

  const menu = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
      match: ["/admin/dashboard"],
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
      match: [
        "/admin/products",
        "/admin/add-products",
        "/admin/edit-products",
      ],
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: Grid2X2,
      match: [
        "/admin/categories",
        "/admin/add-categories",
        "/admin/edit-category",
      ],
    },
    {
      name: "Collections",
      path: "/admin/collections",
      icon: Layers,
      match: [
        "/admin/collections",
        "/admin/add-collection",
        "/admin/edit-collection",
      ],
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingCart,
      match: ["/admin/orders"],
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: Users,
      match: ["/admin/customers"],
    },
    {
      name: "Inquiries",
      path: "/admin/inquiries",
      icon: MessageSquare,
      match: ["/admin/inquiries"],
    },
  ];

  return (
    <div>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <div
        className={`fixed top-0 left-0 h-screen w-64 z-50 transform transition-transform duration-300
        bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div
          className="flex md:justify-center justify-between items-center p-6 h-20 shadow-md
          bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800"
        >
          <h1 className="text-xl font-bold text-premium-gold">
            Admin Panel
          </h1>

          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-700 dark:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            const isActive = item.match?.some((path) =>
              location.startsWith(path)
            );

            return (
              <Link key={item.path} href={item.path}>
                <div
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition
                  ${
                    isActive
                      ? "bg-warm-gold text-white"
                      : `text-gray-700 dark:text-gray-300
                         hover:bg-soft-gray dark:hover:bg-neutral-800
                         hover:text-warm-gold`
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}