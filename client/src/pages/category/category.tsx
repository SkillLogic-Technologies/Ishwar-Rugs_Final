import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import axios from "axios";
import { Heart, Star } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  title: string;
  slug: string;
  material: string;
  length: number;
  width: number;
  thumbnail?: string;
  images?: string[];
  price?: number;
  mrp: number;
  discountPercent?: number;
  rating: number;
}

export default function CategoryPage() {

  const [match, params] = useRoute("/category/:slug");
  const slug = params?.slug;
  const BASE_URL = "/";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const { setWishlistCount } = useWishlist();

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/product/category/${slug}`, { withCredentials: true });
      if (Array.isArray(res.data.data)) {
        setProducts(res.data.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error while fetching category products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId: string) => {
  try {
    await axios.post(
      `${BASE_URL}api/user/wishlist/${productId}`,
      {},
      { withCredentials: true }
    );

    const isLiked = liked[productId];
    setLiked((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));

    if (isLiked) {
      setWishlistCount((prev) => prev - 1);
      toast.success("Removed from your favourites");
    } else {
      setWishlistCount((prev) => prev + 1);
      toast.success("Added to your favourites");
    }

  } catch (error) {
    console.error("Wishlist error");
  }
  };

 const fetchWishlist = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}api/user/wishlist`,
      { withCredentials: true }
    );

    console.log("Wishlist:", res.data);

    const map: Record<string, boolean> = {};

    const products = res.data?.data || [];

    products.forEach((p: any) => {
      map[p._id] = true;
    });

    setLiked(map);

  } catch (error) {
    console.error("Wishlist fetch error:", error);
  }
};

  useEffect(() => {
    if (slug) {
    fetchProducts();
    fetchWishlist();   
  }
  }, [slug]);

  const getProductImage = (product: Product) => {
    if (product.thumbnail) return `${BASE_URL}${product.thumbnail}`;
    if (product.images && product.images.length > 0)
      return `${BASE_URL}${product.images[0]}`;
    return "/no-image.png"; 
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-300">
        Loading category products...
      </div>
    );
  }

  return (
    <section className="p-6 min-h-screen my-20 bg-white text-black 
  dark:bg-black dark:text-white">
      <h1 className="text-center font-serif text-3xl md:text-4xl text-premium-gold leading-relaxed mb-8 font-semibold uppercase">
        {slug?.replace(/-/g, " ")}
      </h1>
      {products.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 text-lg mt-20">
          No products found in this category.
        </div>
      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link key={product._id} href={`/product/${product.slug}`}>
              <div className="cursor-pointer">
                <div
                  className="border rounded-lg h-full shadow-md p-4  bg-gray-100 dark:bg-[#151515] hover:shadow-xl duration-300 transition-transform hover:scale-[1.02]"
                >
                  <div className="overflow-hidden rounded relative">
                  <button
                     onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product._id);
                    }}
                    className="absolute top-3 right-3 z-10
                    bg-white/90 dark:bg-black/80
                    p-2 rounded-full
                    hover:scale-110 transition"
                  >
                  <Heart
                    size={18}
                    className={
                      liked[product._id]
                        ? "fill-red-700 text-red-700 stroke-red-700"
                        : "text-gray-600 dark:text-gray-300"
                    }
                  />
                  </button>
                  <img
                    src={getProductImage(product)}
                    alt={product.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-64 object-cover rounded mb-3 transition-transform duration-500
                    hover:scale-110"/>
                  </div>

                  <h2 className="text-lg font-medium mt-1 line-clamp-1">
                    {product.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {product.material} • {product.length} X {product.width} ft
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-premium-gold font-semibold text-base">
                      ₹ {product.price || product.mrp}
                    </p>
                    {product.price && product.price < product.mrp && (
                      <>
                        <p className="text-sm line-through text-gray-500 dark:text-gray-400">
                          ₹ {product.mrp}
                        </p>
                        <p className="text-xs text-green-400">
                          {product.discountPercent}% off
                        </p>
                      </>
                    )}
                  </div>
                  {product.rating !== undefined && (
                    <div className="mt-1 flex justify-end">
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map((i) => (
                          <Star
                            key={i}
                            size={13}
                            className={
                              i <= Math.round(product.rating)
                                ? "fill-[#C9A24D] text-[#C9A24D]"
                                : "text-gray-400"
                            }
                          />
                        ))}
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};



