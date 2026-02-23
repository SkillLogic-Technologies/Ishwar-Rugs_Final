"use client";

import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("title") || "";

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/product?page=${page}&limit=10&title=${searchQuery}`);
      setProducts(res.data.data);
      setTotalPages(res.data.totalPages);

    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    toast((t) => (
    <div className="flex flex-col gap-3">
      <p className="font-medium">
        Are you sure you want to delete this product?
      </p>

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            toast.dismiss(t.id);

            try {
              await axios.delete(
                `http://localhost:5000/api/product/${id}`
              );

              toast.success("Product deleted successfully ✅");

              fetchProducts();
            } catch (error) {
              toast.error("Failed to delete product ❌");
              console.log(error);
            }
          }}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  ));
  };


  useEffect(() => {
    fetchProducts();
  }, [page, searchQuery]);


  return (
    <div className="bg-white text-black dark:bg-black/40 p-2 dark:text-white min-h-screen">

      <div className="flex justify-between items-center mb-6 mt-20">

        <h1 className="text-2xl font-semibold text-warm-gold dark:text-premium-gold">
          All Products
        </h1>

        <Link href="/admin/add-products">
          <button className="bg-warm-gold text-white px-5 py-2 rounded-lg shadow hover:bg-premium-gold">
            + Add Product
          </button>
        </Link>

      </div>

      <div className="bg-white dark:bg-black/10 rounded-xl shadow-sm overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600 dark:bg-black/10 dark:text-gray-200">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Is Featured</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>


          <tbody>

            {products.map((product: any) => (
              <tr
                key={product._id}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-black"
              >

                <td className="p-4">
                  <img
                    src={`http://localhost:5000/${product.thumbnail}`}
                    className="w-14 h-14 object-cover rounded"
                  />
                </td>

                <td className="p-4 font-medium">
                  {product.title}
                </td>


                <td className="p-4">
                  {product.category.name}
                </td>

                <td className="p-4">
                  {product.price}
                </td>

                <td className="p-4">
                  {product.stock}
                </td>

                <td className="p-4">
                  <span className="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 px-3 py-1 rounded-full text-xs">
                    {product.isFeatured ? "✅" : "❌"}
                  </span>
                </td>

                <td className="p-4 flex gap-3">

                  <Link href={`/admin/edit-products/${product.slug}`}>
                    <button className="text-green-600 hover:text-green-800">
                      <Pencil size={18} />
                    </button>
                  </Link>

                  <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(product._id)}>
                    <Trash2 size={18} />
                  </button>

                </td>
              </tr>
            ))}

          </tbody>
        </table>

      </div>

      <div className="flex items-center gap-3 mt-6">


        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 disabled:opacity-50 cursor-pointer"
        >
          {"<<"}
        </button>


        <button className="px-4 py-1 bg-warm-gold text-white">
          {page}
        </button>


        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 disabled:opacity-50 cursor-pointer"
        >
          {">>"}
        </button>

      </div>


    </div>
  );
}
