"use client";

import { useState, useEffect, } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRoute } from "wouter";
import toast from "react-hot-toast";


export default function AddProductPage() {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [existingThumbnail, setExistingThumbnail] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [categoryId, setCategoryId] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [productId, setProductId] = useState("");
  const [match, params] = useRoute("/admin/edit-products/:slug");

  const navigate = useNavigate()


  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    sku: "",
    price: "",
    mrp: "",
    discountPercent: "",
    stock: "",
    material: "",
    weaveType: "",
    pattern: "",
    style: "",
    pileHeight: "",
    length: "",
    width: "",
    weight: "",
    shape: "",
    color: "",
    secondaryColor: "",
    originCountry: "",
    manufacturer: "Ishwar Rugs",
    careInstructions: "",
    tags: "",
    isFeatured: false,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const fetchDropdownData = async () => {
    try {
      const catRes = await axios.get("http://localhost:5000/api/category");
      const colRes = await axios.get("http://localhost:5000/api/collection");

      setCategories(catRes.data.data);
      setCollections(colRes.data.data);

    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!match && !thumbnail) {
        toast.error("Thumbnail required");
        return;
      }

      if (images.length < 3) {
        toast.error("Minimum 3 images required");
        return;
      }
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, (form as any)[key]);
      });

      formData.append("category", categoryId);
      formData.append("collection", collectionId);
      formData.append("thumbnail", thumbnail);
      images.forEach((img) => {
        formData.append("images", img);
      });

      if (match && params?.slug) {
        await axios.put(
          `http://localhost:5000/api/product/${productId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Product updated successfully ✅")
      } else {
        await axios.post(
          "http://localhost:5000/api/product",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Product added successfully ✅")
      }
      navigate('/admin/products')

    } catch (error) {
      console.log(error);
      toast.error("Error while adding product ❌")
    }
  };

  const fetchProductByslug = async (slug: string) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/product/${slug}`
      );

      const product = res.data.data;

      setForm({
        title: product.title || "",
        slug: product.slug || "",
        description: product.description || "",
        sku: product.sku || "",
        price: product.price || "",
        mrp: product.mrp || "",
        discountPercent: product.discountPercent || "",
        stock: product.stock || "",
        material: product.material || "",
        weaveType: product.weaveType || "",
        pattern: product.pattern || "",
        style: product.style || "",
        pileHeight: product.pileHeight || "",
        length: product.length || "",
        width: product.width || "",
        weight: product.weight || "",
        shape: product.shape || "",
        color: product.color || "",
        secondaryColor: product.secondaryColor || "",
        originCountry: product.originCountry || "",
        manufacturer: product.manufacturer || "Ishwar Rugs",
        careInstructions: product.careInstructions || "",
        tags: product.tags || "",
        isFeatured: product.isFeatured || false,
      });

      setCategoryId(product.category?._id || "");
      setCollectionId(product.collection?._id || "");
      setExistingThumbnail(product.thumbnail || "");
      setExistingImages(product.images || []);
      setProductId(product._id);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDropdownData();
    if (match && params?.slug) {
      fetchProductByslug(params.slug);
    }

  }, [match, params?.slug]);

  return (
    <div className="max-w-6xl mx-auto mt-20 text-black dark:text-white">
      <h1 className="text-2xl text-center font-semibold mb-6 text-warm-gold dark:text-premium-gold">
        {match ? "Edit Product" : "Add Product"}
      </h1>
      <div className="bg-white dark:bg-black/40 p-6 rounded-xl shadow space-y-8">
        <div>
          <h2 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">Basic Information</h2>

          <div className="grid grid-cols-2 gap-4">
            <input name="title" value={form.title} placeholder="Product Title" onChange={handleChange} className="mb-4 border p-3 rounded focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white" />
            <input
              name="tags"
              value={form.tags}
              placeholder="Tags"
              onChange={handleChange}
              className="border p-3 mb-4 rounded focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white"
            />

          </div>

          <textarea
            name="description"
            value={form.description}
            placeholder="Description"
            onChange={handleChange}
            className="border p-3 rounded focus:outline-none w-full bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white mb-2"
          />
        </div>

        <div>
          <h2 className="font-semibold mb-4">
            Pricing & Stock
          </h2>

          <div className="grid grid-cols-4 gap-4">

            <input name="mrp" value={form.mrp} placeholder="MRP" onChange={handleChange} className="border p-3 rounded focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white" />
            <input name="discountPercent" value={form.discountPercent} placeholder="Discount %" onChange={handleChange} className="border p-3 rounded focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white" />
            <input name="stock" value={form.stock} placeholder="Stock" onChange={handleChange} className="border p-3 rounded focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white" />

          </div>

          <label className="flex items-center gap-2 mt-4">
            <input type="checkbox" checked={form.isFeatured} name="isFeatured" onChange={handleChange} />
            Featured Product
          </label>
        </div>

        <div>
          <h2 className="font-semibold mb-4">
            Specifications
          </h2>

          <div className="grid grid-cols-3 gap-4">

            <input name="material" value={form.material} placeholder="Material" onChange={handleChange} className="border p-3 rounded focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white" />
            <input name="weaveType" value={form.weaveType} placeholder="Weave Type" onChange={handleChange} className="border p-3 rounded focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white" />
            <input name="pattern" value={form.pattern} placeholder="Pattern" onChange={handleChange} className="border p-3 rounded focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white" />
            <input name="style" value={form.style} placeholder="Style" onChange={handleChange} className="border p-3 rounded focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white" />
            <input name="pileHeight" value={form.pileHeight} placeholder="Pile Height" onChange={handleChange} className="border p-3 rounded focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white" />
            <input name="shape" value={form.shape} placeholder="Shape" onChange={handleChange} className="border p-3 rounded focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white" />

            <input
              type="text"
              value={form.color}
              placeholder="Primary Color"
              name="color"
              onChange={handleChange}
              className="border p-3 rounded focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white"
            />

            <input
              type="text"
              value={form.secondaryColor}
              placeholder="Secondary Color"
              name="secondaryColor"
              onChange={handleChange}
              className="border p-3 rounded focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white"
            />

            <input
              type="text"
              value={form.originCountry}
              placeholder="Origin Country"
              name="originCountry"
              onChange={handleChange}
              className="border p-3 rounded focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white"
            />

            <input
              type="text"
              value={form.manufacturer}
              placeholder="Manufacturer"
              name="manufacturer"
              defaultValue="Ishwar Rugs"
              onChange={handleChange}
              className="border p-3 rounded focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white"
            />

            <textarea
              placeholder="Care Instructions"
              value={form.careInstructions}
              name="careInstructions"
              onChange={handleChange}
              className="border p-3 rounded focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-4">
            Dimensions
          </h2>

          <div className="grid grid-cols-3 gap-4">

            <input name="length" value={form.length} placeholder="Length (ft)" onChange={handleChange} className="border p-3 rounded focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white" />
            <input name="width" value={form.width} placeholder="Width (ft)" onChange={handleChange} className="border p-3 rounded focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white" />
            <input name="weight" value={form.weight} placeholder="Weight (kg)" onChange={handleChange} className="border p-3 rounded focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white" />

          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-4">
            Media
          </h2>

          <label className="block mb-1 font-medium">
            Thumbnail (Only 1 Image)
          </label>
          {match && existingThumbnail && (
            <img
              src={`http://127.0.0.1:5000/${existingThumbnail}`}
              className="w-24 h-24 object-cover mb-2 rounded"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setThumbnail(e.target.files ? e.target.files[0] : null)
            }
            className="border p-3 rounded w-full mb-4 focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white"
          />

          <label className="block mt-4 mb-1 font-medium">
            Rug Gallery (Minimum 6 Images)
          </label>
          {match && existingImages.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mb-3">
              {existingImages.map((img, i) => (
                <img
                  key={i}
                  src={`http://127.0.0.1:5000/${img}`}
                  className="w-24 h-24 object-cover rounded"
                />
              ))}
            </div>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              setImages(e.target.files ? Array.from(e.target.files) : [])
            }
            className="border p-3 rounded w-full mb-4 focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white"
          />


        </div>

        <div>
          <h2 className="font-semibold mb-4">Organization</h2>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border p-3 rounded focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white"
            >
              <option value="">Select Category</option>

              {categories.map((cat: any) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className="border p-3 rounded focus:outline-none bg-white dark:bg-black/10 dark:border-gray-700 dark:text-white"
            >
              <option value="">Select Collection</option>

              {collections.map((col: any) => (
                <option key={col._id} value={col._id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        <button className="
    bg-premium-gold
    text-white
    px-4 py-2
    rounded-lg
    shadow-md

    dark:bg-gradient-to-r
    dark:from-yellow-400
    dark:to-yellow-600
    dark:text-black
  " onClick={handleSubmit}>
          Save Product
        </button>

      </div>
    </div>
  );
}
