import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

interface Collection {
  id: number;
  name: string;
  slug: string;
  category: string;
  featured: boolean;
  heroImage: string;
}

const AdminCollections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "",
    description: "",
    heroImage: "",
    featured: false,
  });

  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    images: [""],
    collectionId: 0,
  });

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/collections");

      const collectionsArray = res.data?.collections || res.data?.data || [];

      setCollections(collectionsArray);
    } catch (err) {
      console.error("Error fetching collections:", err);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/collections/${id}`);
      fetchCollections();
    } catch (err) {
      console.error("Error deleting collection:", err);
    }
  };

  const handleCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId !== null) {
        await axios.put(`/api/collections/${editingId}`, formData);
      } else {
        await axios.post("/api/collections", formData);
      }
      setShowForm(false);
      setEditingId(null);
      fetchCollections();
      setFormData({
        name: "",
        slug: "",
        category: "",
        description: "",
        heroImage: "",
        featured: false,
      });
    } catch (err) {
      console.error("Error saving collection:", err);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/products", productForm);
      setShowProductForm(false);
      setProductForm({
        name: "",
        slug: "",
        description: "",
        price: 0,
        images: [""],
        collectionId: 0,
      });
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Collections</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({
                name: "",
                slug: "",
                category: "",
                description: "",
                heroImage: "",
                featured: false,
              });
            }}
            className="bg-primary text-white px-4 py-2 rounded-md"
          >
            + Add Collection
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="border rounded-xl p-4 bg-white shadow hover:shadow-md transition-all"
              >
                <img
                  src={collection.heroImage}
                  alt={collection.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <h2 className="text-lg font-bold">{collection.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Category: {collection.category}
                </p>
                {collection.featured && (
                  <span className="text-xs text-green-600 font-medium">
                    Featured
                  </span>
                )}
                <div className="flex justify-between items-center mt-2 gap-2">
                  <button
                    onClick={() => {
                      setShowProductForm(true);
                      setProductForm({
                        ...productForm,
                        collectionId: collection.id,
                      });
                    }}
                    className="text-blue-600 text-sm"
                  >
                    + Add Product
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setEditingId(collection.id);
                      setFormData({
                        name: collection.name,
                        slug: collection.slug,
                        category: collection.category,
                        description: "",
                        heroImage: collection.heroImage,
                        featured: collection.featured,
                      });
                    }}
                    className="text-yellow-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(collection.id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Collection Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
              <h2 className="text-xl font-semibold">
                {editingId ? "Edit Collection" : "New Collection"}
              </h2>
              <form onSubmit={handleCollectionSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full border px-3 py-2 rounded"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Slug"
                  className="w-full border px-3 py-2 rounded"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  className="w-full border px-3 py-2 rounded"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Hero Image URL"
                  className="w-full border px-3 py-2 rounded"
                  value={formData.heroImage}
                  onChange={(e) =>
                    setFormData({ ...formData, heroImage: e.target.value })
                  }
                  required
                />
                <textarea
                  placeholder="Description"
                  className="w-full border px-3 py-2 rounded"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
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
                      setEditingId(null);
                    }}
                    className="px-4 py-2 border rounded text-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    {editingId ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Product Modal (Unchanged) */}
        {showProductForm && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
              <h2 className="text-xl font-semibold">New Product</h2>
              <form onSubmit={handleProductSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full border px-3 py-2 rounded"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Slug"
                  className="w-full border px-3 py-2 rounded"
                  value={productForm.slug}
                  onChange={(e) =>
                    setProductForm({ ...productForm, slug: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="w-full border px-3 py-2 rounded"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      price: parseFloat(e.target.value),
                    })
                  }
                  required
                />
                <textarea
                  placeholder="Description"
                  className="w-full border px-3 py-2 rounded"
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  className="w-full border px-3 py-2 rounded"
                  value={productForm.images[0]}
                  onChange={(e) =>
                    setProductForm({ ...productForm, images: [e.target.value] })
                  }
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCollections;
