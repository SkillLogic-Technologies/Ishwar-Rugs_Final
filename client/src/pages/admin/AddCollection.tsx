"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRoute } from "wouter";

interface CollectionForm {
  name: string;
  slug: string;
  description: string;
  isFeatured: boolean;
}

axios.defaults.withCredentials = true;

export default function AddCollection() {
  const [match, params] = useRoute("/admin/edit-collection/:slug");

  const [collectionId, setCollectionId] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<CollectionForm>({
    name: "",
    slug: "",
    description: "",
    isFeatured: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const input = e.target as HTMLInputElement;
      setForm((prev) => ({
        ...prev,
        [name]: input.checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!match && !thumbnail) {
        alert("Thumbnail required");
        setLoading(false);
        return;
      }

      if (match && !collectionId) {
        alert("Collection not loaded yet");
        setLoading(false);
        return;
      }

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      if (thumbnail) {
        formData.append("image", thumbnail);
      }

      if (match && params?.slug) {
        await axios.put(
          `/api/collection/${collectionId}`,
          formData
        );
        alert("Collection Updated ");
      } else {
        await axios.post("/api/collection", formData);
        alert("Collection Added Successfully");

        setForm({
          name: "",
          slug: "",
          description: "",
          isFeatured: false,
        });
        setThumbnail(null);
      }
    } catch (error: any) {
      console.error("Save collection error:", error);
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchCollectionBySlug = async (slug: string) => {
    try {
      const res = await axios.get(
        `/api/collection/${slug}`
      );

      const col = res.data.data;

      setForm({
        name: col.name || "",
        slug: col.slug || "",
        description: col.description || "",
        isFeatured: col.isFeatured || false,
      });

      setExistingThumbnail(col.thumbnail || "");
      setCollectionId(col._id);
    } catch (error) {
      console.log("Fetch collection error:", error);
    }
  };

  useEffect(() => {
    if (match && params?.slug) {
      fetchCollectionBySlug(params.slug);
    }
  }, [match, params?.slug]);

  return (
    <div className="max-w-5xl mx-auto mt-16 sm:mt-20 px-4 sm:px-6 bg-white dark:bg-neutral-950 min-h-screen transition-colors">

      <h1 className="text-xl sm:text-2xl text-center font-semibold mb-6 text-warm-gold dark:text-yellow-400">
        {match ? "Edit Collection" : "Add Collection"}
      </h1>

      <div className="bg-white dark:bg-neutral-900 p-4 sm:p-6 rounded-xl shadow border border-gray-200 dark:border-neutral-700 space-y-8 transition">

        {/* Basic Info */}
        <div>
          <h2 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              placeholder="Collection Name"
              onChange={handleChange}
              className="border border-gray-300 dark:border-neutral-700 p-3 rounded focus:outline-none bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 w-full"
            />

            <input
              name="slug"
              value={form.slug}
              placeholder="Slug"
              onChange={handleChange}
              className="border border-gray-300 dark:border-neutral-700 p-3 rounded focus:outline-none bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 w-full"
            />
          </div>

          <textarea
            name="description"
            value={form.description}
            placeholder="Description"
            onChange={handleChange}
            className="border border-gray-300 dark:border-neutral-700 p-3 rounded w-full mt-4 focus:outline-none bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400"
            rows={4}
          />

          <label className="flex items-center gap-2 mt-4 text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
              className="accent-yellow-500"
            />
            Featured Collection
          </label>
        </div>

        {/* Image */}
        <div>
          <h2 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Image
          </h2>

          {match && existingThumbnail && (
            <img
              src={`http://127.0.0.1:5000/${existingThumbnail}`}
              className="w-24 h-24 object-cover mb-3 rounded border dark:border-neutral-700"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0] || null;
              setThumbnail(file);
            }}
            className="border border-gray-300 dark:border-neutral-700 p-3 rounded w-full focus:outline-none bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
          />
        </div>

        {/* Button */}
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="w-full sm:w-auto bg-premium-gold hover:bg-warm-gold text-white px-6 py-3 rounded-lg disabled:opacity-50 transition"
        >
          {loading
            ? "Saving..."
            : match
            ? "Update Collection"
            : "Save Collection"}
        </button>

      </div>
    </div>
  );
}