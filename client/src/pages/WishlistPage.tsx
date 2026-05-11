import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter"
import axios from "axios";
import toast from "react-hot-toast";
import { useWishlist } from "@/context/WishlistContext";

const WishlistPage = () => {
  const BASE_URL = "/"
  type WishlistItem = any;
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { setWishlistCount } = useWishlist();

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/user/wishlist`, {
        withCredentials: true,
      });
      const items = res.data.data || [];
      setWishlistItems(items);
    } catch (err) {
    console.error(err);
  }};

  const removeFromWishlist = async (productId: string) => {
      try {
        await axios.post( `${BASE_URL}api/user/wishlist/${productId}`,
          {},
          { withCredentials: true }
        );

    setWishlistItems((prev) =>
      prev.filter(
        (item) =>
          item._id !== productId &&
          item.products?._id !== productId
      )
    );
    setWishlistCount((prev) =>
      Math.max(prev - 1, 0)
    );

    toast.success("Removed from favourites");

  } catch (err) {
    toast.error("Remove failed");
  }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);
   
 return (
  <div className="min-h-screen my-20 bg-[#faf7f2] dark:bg-[#1a1816] p-4 sm:p-6 md:p-10">

    <div className="mb-10 text-center">

      <h1 className="text-2xl md:text-3xl font-bold text-premium-gold tracking-wide">
        Your Favourites
      </h1>

      <p className="text-sm mt-2 text-primary-brown/70 dark:text-[#e7dbc6]/70">
        Save your favorite rugs for later 🧡
      </p>

      <div className="w-24 h-[2px]bg-premium-goldmx-auto mt-4" />
    </div>

  
    {wishlistItems.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-20">

        <Heart className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />

        <h2 className="text-xl font-semibold mb-2 text-primary-brown dark:text-[#f5e9d6] ">
          Your wishlist is empty
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Save your favorite rugs here ❤️
        </p>

        <Link href="/">
          <Button>Browse Rugs</Button>
        </Link>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 max-w-7xl mx-auto ">
        {wishlistItems.map((item) => (
          <Link key={item._id} href={`/product/${item.slug}`}>
          <div
            key={item._id}
            className="group bg-white dark:bg-[#2a2623] rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300
             w-full sm:max-w-[260px] md:max-w-[260px] mx-auto ">

            <div className="relative overflow-hidden rounded-lg">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="
                  w-full
                  h-52 sm:h-56 md:h-60 lg:h-64
                  object-cover
                  rounded-lg
                  cursor-pointer

                  transform
                  transition-transform
                  duration-500
                  ease-out
                  group-hover:scale-110
                "
              />

              <button
                onClick={(e) =>{
                  e.stopPropagation();
                  e.preventDefault(); 
                  removeFromWishlist(
                  item._id || item.products?._id
                )
                }
                
              }
                className="
                  absolute top-3 right-3
                  bg-white/90 dark:bg-black/70
                  p-2 rounded-full shadow
                  hover:scale-110 transition
                  cursor-pointer
                "
              >
                <Heart
                  className="w-5 h-5 text-premium-gold"
                  fill="#D4AF37"
                />
              </button>

            </div>
            <div className="text-center mt-4 space-y-1">

              <h3 className="
                font-semibold text-sm
                text-primary-brown
                dark:text-[#f5e9d6] cursor-pointer
              ">
                {item.title}
              </h3>

              <p className="
                text-xs
                text-primary-brown/70
                dark:text-[#e7dbc6]/70
              ">
                {item.category.name} / {item.length } x {item.width} ft
              </p>

              <p className="text-premium-gold font-semibold mt-1 ">
                ₹ {item.price}
              </p>

            </div>
          </div>
          </Link>
        ))}
      </div>
    )}
  </div>
);
};

export default WishlistPage;
