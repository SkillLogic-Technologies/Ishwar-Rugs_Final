// UPDATED AdminProducts.tsx
import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  colors: string[];
  images: string[];
  featured: boolean;
  collectionId: number;
  price: number;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    colors: [] as string[],
    images: [] as string[],
    featured: false,
    collectionId: 1,
    price: 0,
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      toast({ title: "Error", description: "Failed to fetch products" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProductId !== null) {
        await axios.put(`/api/products/${editingProductId}`, formData);
        toast({ title: "Product updated successfully" });
      } else {
        await axios.post("/api/products", formData);
        toast({ title: "Product created successfully" });
      }
      setShowForm(false);
      setEditingProductId(null);
      fetchProducts();
      setFormData({
        name: "",
        slug: "",
        description: "",
        colors: [],
        images: [],
        featured: false,
        collectionId: 1,
        price: 0,
      });
    } catch (err) {
      toast({ title: "Error", description: "Failed to save product" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/products/${id}`);
      toast({ title: "Product deleted successfully" });
      fetchProducts();
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete product" });
    }
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setEditingProductId(product.id);
    setShowForm(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Products</h1>
          <button
            className="bg-primary text-white px-4 py-2 rounded-md text-sm"
            onClick={() => {
              setShowForm(true);
              setEditingProductId(null);
              setFormData({
                name: "",
                slug: "",
                description: "",
                colors: [],
                images: [],
                featured: false,
                collectionId: 1,
                price: 0,
              });
            }}
          >
            + Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg shadow p-4">
              <img
                src={product.images?.[0]}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
              <p className="text-sm text-muted-foreground">
                {product.description.slice(0, 80)}...
              </p>
              <p className="text-sm font-medium mt-1">
                ₹ {product.price.toFixed(2)}
              </p>
              <div className="flex justify-between items-center mt-2 text-xs">
                <span className="text-muted-foreground">Slug: {product.slug}</span>
                <span
                  className={`px-2 py-0.5 rounded text-white text-xs ${
                    product.featured ? "bg-green-600" : "bg-gray-400"
                  }`}
                >
                  {product.featured ? "Featured" : "Regular"}
                </span>
              </div>
              <div className="flex justify-end gap-2 mt-3 text-sm">
                <button
                  onClick={() => handleEdit(product)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
              <h2 className="text-xl font-semibold">
                {editingProductId ? "Edit Product" : "New Product"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full border px-3 py-2 rounded"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Slug"
                  className="w-full border px-3 py-2 rounded"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Description"
                  className="w-full border px-3 py-2 rounded"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="w-full border px-3 py-2 rounded"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  className="w-full border px-3 py-2 rounded"
                  value={formData.images[0] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, images: [e.target.value] })
                  }
                  required
                />
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                  />
                  <span>Featured</span>
                </label>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingProductId(null);
                    }}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    {editingProductId ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}