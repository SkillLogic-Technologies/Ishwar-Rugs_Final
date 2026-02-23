"use client";

import { useState, useEffect, } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRoute } from "wouter";
import toast from "react-hot-toast"

export default function AddProductPage() {
    const [match, params] = useRoute("/admin/edit-category/:slug");
    const [categoryId, setCategoryId] = useState("");
    const [existingImage, setExistingImage] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const navigate = useNavigate()

    const [form, setForm] = useState({
        name: "",
        description: "",
        isActive: true,
    });

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("isActive", String(form.isActive));

            if (image) {
                formData.append("image", image);
            }

            if (match && categoryId) {
            
                await axios.put(`http://localhost:5000/api/category/${categoryId}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                toast.success("Category Updated Successfully ✅");
            } else {
                await axios.post("http://localhost:5000/api/category",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                toast.success("Category Added Successfully ✅");
            }

            navigate("/admin/categories");

        } catch (error) {
            console.log(error);
        }
    };

    const fetchCategoryBySlug = async (slug: string) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/category/${slug}`
            );

            const category = res.data.data;

            setCategoryId(category._id); 

            setForm({
                name: category.name,
                description: category.description,
                isActive: category.isActive,
            });

            setExistingImage(category.image);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (match && params?.slug) {
            fetchCategoryBySlug(params.slug);
        }
    }, [match, params?.slug]);

    return (
        <div className="max-w-6xl mx-auto mt-20 text-black dark:text-white">
            <h1 className="text-2xl text-center font-semibold mb-6 text-warm-gold dark:text-premium-gold">
                {match ? "Edit Category" : "Add Category"}
            </h1>
            <div className="bg-white dark:bg-black/40 p-6 rounded-xl shadow space-y-8">
                <div>
                    <h2 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Basic Information</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            name="name"
                            value={form.name}
                            placeholder="Category Name"
                            onChange={handleChange}
                            className="mb-2 border p-2 rounded focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white"
                        />
                        <textarea
                            name="description"
                            value={form.description}
                            placeholder="Description"
                            onChange={handleChange}
                            className="border p-2 rounded focus:outline-none w-full bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white mb-2"
                        />
                    </div>

                </div>


                <div>
                    <h2 className="font-semibold mb-4">
                        Media
                    </h2>

                    <label className="block mb-1 font-medium">
                        Category Image
                    </label>
                    {match && existingImage && (
                        <img
                            src={`http://127.0.0.1:5000/${existingImage}`}
                            className="w-24 h-24 object-cover mb-2 rounded"
                        />
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setImage(e.target.files ? e.target.files[0] : null)
                        }
                        className="border p-3 rounded w-full mb-4 focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white"
                    />

                    <label className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={form.isActive}
                            onChange={handleChange}
                        />
                        Active Category
                    </label>
                </div>
                <button className="bg-premium-gold text-white px-4 py-2 rounded-lg shadow-md dark:bg-gradient-to-r
                 dark:from-yellow-400 dark:to-yellow-600 dark:text-black" onClick={handleSubmit}>
                    Save Category
                </button>
            </div>
        </div>
    );
}
