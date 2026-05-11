"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";

interface User {
  _id: string;
  username: string;
  email: string;
}

export default function AdminCustomers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  //  Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/customers", {
        withCredentials: true,
      });
      setUsers(res.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  //  Delete user
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/api/admin/customers/${id}`, {
        withCredentials: true,
      });

      //  instant UI update (better UX)
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="mt-10 px-5 bg-white dark:bg-neutral-950 min-h-screen transition-colors">
      
      {/* ✅ Heading */}
      <h1 className="text-2xl font-semibold mb-5 text-warm-gold dark:text-yellow-400 mt-20">
        Customers
      </h1>

      {/* ✅ Table container */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-neutral-700">
        <table className="w-full text-sm">
          
          {/* ✅ Table head */}
          <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="p-4 text-left">Username</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center p-6 text-gray-500 dark:text-gray-400"
                >
                  Loading...
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
                >
                  <td className="p-4 font-medium text-gray-900 dark:text-white">
                    {user.username}
                  </td>

                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {user.email}
                  </td>

                  <td className="p-4 flex gap-3">
                    <button
                      className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 transition"
                      onClick={() => handleDelete(user._id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="text-center p-6 text-gray-500 dark:text-gray-400"
                >
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}