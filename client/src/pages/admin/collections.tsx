"use client";

import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

interface Collection {
  _id: string;
  name: string;
  description: string;
  slug: string;
  image: string | string[];
}

export default function AdminCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchCollections = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `/api/collection?page=${page}&limit=10`
      );

      setCollections(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);

    } catch (error) {
      console.error(error);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this collection?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(`/api/collection/${id}`);

      setCollections((prev) => prev.filter((c) => c._id !== id));

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [page]);

  return (
    <div className="mt-20 bg-white dark:bg-neutral-950 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 px-5">

        <h1 className="text-xl sm:text-2xl font-semibold text-warm-gold dark:text-yellow-400">
          All Collections
        </h1>

        <Link href="/admin/add-collection">
          <button className="bg-warm-gold text-white px-5 py-2 rounded-lg shadow hover:bg-premium-gold transition">
            + Add Collection
          </button>
        </Link>

      </div>

      {/* ================= DESKTOP TABLE ================= */}

      <div className="hidden md:block">

        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm overflow-x-auto border border-gray-200 dark:border-neutral-700">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-gray-300">

              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Slug</th>
                <th className="p-4 text-left">Actions</th>
              </tr>

            </thead>

            <tbody>

              {collections.map((collection) => (

                <tr
                  key={collection._id}
                  className="border-t border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"
                >

                  <td className="p-4">

                    <img
                      src={`/${
                        Array.isArray(collection.image)
                          ? collection.image[0]
                          : collection.image
                      }`}
                      className="w-14 h-14 object-cover rounded"
                    />

                  </td>

                  <td className="p-4 font-medium text-gray-900 dark:text-white">
                    {collection.name}
                  </td>

                  <td className="p-4 max-w-xs truncate text-gray-600 dark:text-gray-300">
                    {collection.description}
                  </td>

                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {collection.slug}
                  </td>

                  <td className="p-4 flex gap-3">

                    <Link href={`/admin/edit-collection/${collection.slug}`}>
                      <button className="text-green-600 hover:text-green-800">
                        <Pencil size={18} />
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDelete(collection._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= MOBILE CARD ================= */}

      <div className="md:hidden  space-y-4">

        {collections.map((collection) => (

          <div
            key={collection._id}
            className="bg-white dark:bg-neutral-900 rounded-xl p-4 shadow border border-gray-200 dark:border-neutral-700"
          >

            <div className="flex gap-4">

              <img
                src={`/${
                  Array.isArray(collection.image)
                    ? collection.image[0]
                    : collection.image
                }`}
                className="w-16 h-16 object-cover rounded"
              />

              <div className="flex-1">

                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {collection.name}
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {collection.description}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {collection.slug}
                </p>

              </div>

            </div>

            <div className="flex gap-4 mt-4">

              <Link href={`/admin/edit-collection/${collection.slug}`}>
                <button className="flex items-center gap-1 text-green-600">
                  <Pencil size={16} /> Edit
                </button>
              </Link>

              <button
                onClick={() => handleDelete(collection._id)}
                className="flex items-center gap-1 text-red-600"
              >
                <Trash2 size={16} /> Delete
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* PAGINATION */}

      <div className="flex justify-center items-center gap-3 mt-8 pb-10">

        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 dark:bg-neutral-800 rounded disabled:opacity-50"
        >
          {"<<"}
        </button>

        <span className="px-4 py-1 bg-warm-gold text-white rounded">
          {page}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 dark:bg-neutral-800 rounded disabled:opacity-50"
        >
          {">>"}
        </button>

      </div>

    </div>
  );
}