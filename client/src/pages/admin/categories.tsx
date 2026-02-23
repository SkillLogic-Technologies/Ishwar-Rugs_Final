"use client";

import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/category');
      setCategories(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    toast((t) => (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-lg w-80">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
        Delete Category
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        This action cannot be undone. Are you sure you want to permanently delete this category?
      </p>
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-4 py-1.5 text-sm rounded-md bg-gray-200 hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            toast.dismiss(t.id);
            const loadingToast = toast.loading("Deleting category...");
            try {
              await axios.delete(`http://localhost:5000/api/category/${id}`);
              toast.dismiss(loadingToast);
              toast.success("Category deleted successfully 🗑️");

              fetchCategories();
            } catch (error) {
              toast.dismiss(loadingToast);
              toast.error("Failed to delete category. Try again.");
              console.log(error);
            }
          }}
          className="px-4 py-1.5 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white transition"
        >
          Delete
        </button>
      </div>
    </div>
  ), {
    duration: Infinity, 
  });
    };
  useEffect(() => {
    fetchCategories();
  }, []);


  return (
    <div className="bg-white text-black dark:bg-black/40 p-2 dark:text-white min-h-screen">

      <div className="flex justify-between items-center mb-6 mt-20">

        <h1 className="text-2xl font-semibold text-warm-gold dark:text-premium-gold">
          All Categories
        </h1>

        <Link href="/admin/add-categories">
          <button className="bg-warm-gold text-white px-5 py-2 rounded-lg shadow hover:bg-premium-gold">
            + Add Category
          </button>
        </Link>

      </div>

      <div className="bg-white dark:bg-black/10 rounded-xl shadow-sm overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600 dark:bg-black/10 dark:text-gray-200">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Is Active</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>


          <tbody>

            {categories.map((category: any) => (
              <tr
                key={category._id}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-black"
              >

                <td className="p-4">
                  <img
                    src={`http://localhost:5000/${category.image}`}
                    className="w-14 h-14 object-cover rounded"
                  />
                </td>

                <td className="p-4 font-medium">
                  {category.name}
                </td>

                <td className="p-4">
                  {category.description}
                </td>

                <td className="p-4">
                  <span className="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 px-3 py-1 rounded-full text-xs">
                    {category.isActive ? "✅" : "❌"}
                  </span>
                </td>

                <td className="p-4 flex gap-3">

                  <Link href={`/admin/edit-category/${category.slug}`}>
                    <button className="text-green-600 hover:text-green-800">
                      <Pencil size={18} />
                    </button>
                  </Link>

                  <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(category._id)} >
                    <Trash2 size={18} />
                  </button>

                </td>
              </tr>
            ))}

          </tbody>
        </table>

      </div>

    </div>
  );
}
