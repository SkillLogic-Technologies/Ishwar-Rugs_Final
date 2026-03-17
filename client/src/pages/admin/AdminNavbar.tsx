"use client";

import { Search, Sun, Moon, Menu } from "lucide-react";
import logo from "../../../public/logo/Logo.png";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminNavbar({ setIsOpen }) {
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const adminName = localStorage.getItem("adminName") || "";
  const firstLetter = adminName.charAt(0).toUpperCase();

  // 🔐 ADMIN AUTH CHECK
  useEffect(() => {
    const admin = localStorage.getItem("adminName");

    if (!admin) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminName");
    navigate("/admin/login");
  };

  return (
    <div
      className="
       h-20 fixed top-0 z-10 right-0 
      flex items-center md:justify-between 
      px-4 shadow-md gap-3 w-full lg:w-[83%]
      bg-gray-50 dark:bg-neutral-900
      border-b border-gray-200 dark:border-neutral-800
    "
    >
      <Link to="/">
        <img
          src={logo}
          alt="IshwarRugs Logo"
          className="md:w-20 md:h-20 object-contain h-16 w-16"
        />
      </Link>

      <div className="flex md:w-[420px] w-[190px] h-[35px]">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search here"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              navigate(`/admin/products?title=${search}`);
            }
          }}
          className="rounded-l-md px-2 md:px-4 w-[80%] h-full outline-none text-black"
        />

        <button
          onClick={() => navigate(`/admin/products?title=${search}`)}
          className="
          bg-warm-gold px-4 py-3 text-white flex items-center
          hover:opacity-90 transition rounded-r-md
        "
        >
          <Search size={18} />
        </button>
      </div>

      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="
        text-gray-700 dark:text-gray-300
        hover:text-premium-gold
        hover:bg-white/20 dark:hover:bg-neutral-800
        transition-all duration-300
      "
        >
          {theme === "dark" ? (
            <Sun className="!h-5 !w-5" />
          ) : (
            <Moon className="!h-5 !w-5" />
          )}
        </Button>

        {/* USER AREA */}
        <div className="relative group">
          <div
            className="
        flex items-center gap-4
        md:px-5 md:py-2 md:rounded-lg md:shadow
        md:bg-warm-gold md:text-white
      "
          >
            <div className="w-8 h-8 md:bg-white bg-warm-gold rounded-full text-black flex items-center justify-center">
              {firstLetter}
            </div>

            <span className="md:text-sm md:font-medium hidden md:block">
              {adminName}
            </span>
          </div>

          {/* LOGOUT DROPDOWN */}
          <div
            className="
            absolute right-0 mt-2 w-28 
            bg-white dark:bg-neutral-800
            border border-gray-200 dark:border-neutral-700
            rounded shadow-md
            opacity-0 group-hover:opacity-100
            invisible group-hover:visible
            transition-all duration-200
          "
          >
            <button
              onClick={handleLogout}
              className="
              w-full text-left px-4 py-2 text-sm
              hover:bg-gray-100 dark:hover:bg-neutral-700
            "
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <button
        className="bg-warm-gold lg:hidden text-white p-2 rounded shadow"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={20} />
      </button>
    </div>
  );
}
