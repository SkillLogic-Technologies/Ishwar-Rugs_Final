import React, { useEffect, useState } from "react";
import { useRoute } from "wouter";
import axios from "axios";
import AdminLayout from "../admin/AdminLayout";

interface Product {
  id: number;
  name: string;
  price: number;
  slug: string;
  images: string[];
  featured: boolean;
}

const CategoryPage = () => {
  const [match, params] = useRoute("/category/:category");
  const category = params?.category;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    axios
      .get(`/api/products?category=${category}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching category:", err))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 capitalize">{category} Carpets</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg shadow p-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-40 object-cover rounded"
                />
                <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
                <p className="text-sm mt-1 text-muted-foreground">₹ {product.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CategoryPage;
