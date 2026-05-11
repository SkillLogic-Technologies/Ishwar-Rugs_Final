import { useParams, Link } from "wouter";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

const BASE_URL = "/";

const ProductDetail = () => {
  
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const { setCartCount } = useCart();


  const imgRef = useRef<HTMLImageElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    if (imgRef.current) {
      imgRef.current.style.transformOrigin = `${x}% ${y}%`
      imgRef.current.style.transform = "scale(1.4)"
    }
  }

  const handleMouseLeave = () => {
    if (imgRef.current) {
      imgRef.current.style.transformOrigin = "center"
      imgRef.current.style.transform = "scale(1)"
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      await axios.post(
        `${BASE_URL}api/product/${product._id}/review/`,
        { rating, comment },
        { withCredentials: true }
      );

      const res = await axios.get(`${BASE_URL}api/product/${slug}`);
      setProduct(res.data.data);

      setRating(5);
      setComment("");
      setReviewOpen(false);

    } catch (err) {
      alert("Review submission failed");
    } finally {
      setSubmitting(false);
    }
  };

   const addToCart = async () => {
    try {

      const res = await axios.post( `${BASE_URL}api/user/cart/${product._id}`,
        { quantity: 1 },
        { withCredentials: true }
      );

        const items = res.data.items;

    const count = items.reduce(
      (acc: number, item: any) =>
        acc + item.quantity,
      0
    );
    setCartCount(count);

      toast.success("Beautiful choice — added to cart.");

    } catch (error: any) {
       toast.error("Failed to add item");
    }
  };

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BASE_URL}api/product/${slug}`, { withCredentials: true });
        setProduct(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // if (loading)
  //   return (
  //     <div className="flex items-center justify-center min-h-[40vh] sm:min-h-[50vh]">
  //       <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700 dark:text-gray-300">
  //         Loading...
  //       </p>
  //     </div>
  //   )
  if (loading)
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[50vh] gap-3">
      
      {/* Spinner */}
      <div className="w-8 h-8 border-4 border-premium-gold-500 border-t-black rounded-full animate-spin"></div>

      {/* Optional text */}
      {/* <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700 dark:text-gray-300">
        Loading Product...
      </p> */}

    </div>
  );


  if (!product)
    return (
      <div className="flex items-center justify-center min-h-[40vh] sm:min-h-[50vh]">
        <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700 dark:text-gray-300">
          Product not found
        </p>
      </div>
    )

  const galleryImages = product.thumbnail
    ? [product.thumbnail, ...product.images]
    : product.images;

  return (
    <section className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 my-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-1 flex flex-col gap-3 max-h-[450px] overflow-y-auto pr-1">
              {galleryImages.map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setActiveImage(index)}
                  className={`w-full h-20 object-cover rounded-md cursor-pointer border
                  ${activeImage === index ? "border-premium-gold" : "border-gray-300 dark:border-gray-700"}`}/>
              ))}
            </div>

            <div className="col-span-4 relative overflow-hidden rounded-xl bg-gray-100 dark:bg-[#0b0b0b] cursor-zoom-in"
              onClick={() => setIsImageOpen(true)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}>
              <img
                ref={imgRef}
                src={galleryImages[activeImage]}
                alt={product.title}
                className="w-full h-[500px] object-cover transition-transform duration-200 ease-out"/>
              <button
                onClick={(e) =>{e.stopPropagation(); setActiveImage( activeImage === 0 ? galleryImages.length - 1 : activeImage - 1)}}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/60 p-2 rounded shadow">
                  ‹
              </button>

              <button
                onClick={(e) =>{e.stopPropagation(); setActiveImage(activeImage === galleryImages.length - 1 ? 0 : activeImage + 1)}}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/60 p-2 rounded shadow">
                  ›
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl  font-semibold leading-snug">
              {product.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {product.material} • {product.length} X {product.width} ft
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-semibold text-premium-gold">
                ₹ {product.price || product.mrp}
              </span>
              {product.price && (
                <span className="line-through text-gray-400">
                  ₹ {product.mrp}
                </span>
              )}
              {product.discountPercent && (
                <span className="text-sm text-green-600 dark:text-green-400">
                  {product.discountPercent}% off
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              {product.rating !== undefined && (
                <div className="mt-1 flex justify-end">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star
                        key={i}
                        size={13}
                        className={ i <= Math.round(product.rating) ? "fill-[#C9A24D] text-[#C9A24D]" : "text-gray-400"}
                      />
                    ))}
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      ({product.reviews?.length || 0} reviews)
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Available Size</p>
              <div className="flex gap-3">
                <button className="px-3 py-1 border rounded-md 
                  border-premium-gold text-premium-gold">
                  {product.length} × {product.width} ft
                </button>
              </div>
            </div>
            <div className="mt-8 flex gap-4">
              <button onClick={addToCart}
                className="px-4 py-2 rounded-xl font-medium transition-all duration-300 ease-out bg-[#C9A24D]
                 text-black hover:bg-[#b8923f] hover:scale-[1.03] hover:shadow-lg active:scale-95 dark:bg-[#C9A24D]
                dark:hover:bg-[#d4af37] dark:hover:shadow-yellow-900/30">
                Add to Cart
              </button>
              <Link href="/contact">
              <button
                className="px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-300 ease-out
                border-gray-300 text-gray-800 hover:bg-gray-100
                dark:border-white/30 dark:text-white dark:hover:border-white dark:hover:bg-white/5">
                Enquire Now
              </button>
              </Link>
            </div>
            <div className="mt-8 border-t pt-6 text-sm space-y-2 text-gray-600 dark:text-gray-300">
              <p><b>Category:</b> {product.category?.name}</p>
              <p><b>Origin:</b> {product.originCountry}</p>
              <p><b>RUG ID:</b> {product.sku}</p>
              <p><b>Pattern:</b> {product.pattern}</p>
              <p><b>Style:</b> {product.style}</p>
              <p><b>Shape:</b> {product.shape}</p>
              <p><b>Care Instruction:</b> {product.careInstructions}</p>
            </div>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
          <div>
            <h2 className="text-2xl font-serif font-semibold mb-4">
              Product Description
            </h2>
            <div className="my-4 h-px bg-white/10" />
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
              This elegant Persian runner rug is handcrafted using traditional
              techniques, bringing warmth, texture, and timeless character
              to hallways and narrow spaces.
            </p>
            <ul className="mt-4 space-y-1 text-sm text-gray-400">
              <li>• Handcrafted by skilled artisans</li>
              <li>• Ideal for hallways & corridors</li>
              <li>• Soft underfoot with durable wool</li>
            </ul>
          </div>

          <div className="space-y-6 flex flex-col">
            <h2 className="text-2xl font-serif font-semibold text-black dark:text-white">
              Customer Reviews
            </h2>
          <div className="h-px w-16 bg-premium-gold" />
          <div className="flex">
            <button
              onClick={() => setReviewOpen(true)}
              className="inline-flex items-center px-5 py-2 rounded-full border border-premium-gold text-premium-gold
                text-sm font-medium transition-all duration-300 hover:bg-premium-gold hover:text-black">
                Write a Review
            </button>
          </div>

          {product.reviews.length === 0 ? (
            <p className="text-sm italic text-gray-500 dark:text-gray-400 my-4">
              No reviews yet. Be the first to review this piece.
            </p>
          ) : (
            <div className="space-y-6">
              {product.reviews.map((review, index) => (
                <div
                  key={index}
                  className="p-5 rounded-xl bg-white dark:bg-[#111] border border-gray-200
                   dark:border-gray-700 transition-all duration-300 hover:shadow-xl">

                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-black dark:text-white">
                      {review.user?.username || "Verified Buyer"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={14}
                        className={ i <= Math.floor(review.rating) ? "fill-[#C9A24D] text-[#C9A24D]"
                          : "text-gray-400 dark:text-gray-600"}
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>

      {isImageOpen && (
        <div onClick={() => setIsImageOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 dark:bg-black/85 px-4">
          <div onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-white dark:bg-[#0b0b0b] rounded-xl p-4">
            <button
              onClick={() => setIsImageOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full
               bg-black/60 dark:bg-black/70 backdrop-blur text-white text-xl shadow-md shadow-black/40
               hover:bg-black/80 active:scale-95 transition"
              aria-label="Close image">
              ✕
            </button> 
            <img
              src={`${BASE_URL}${galleryImages[activeImage]}`}
              alt={product.title}
              className="w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {reviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 px-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0f0f0f] rounded-2xl p-6 sm:p-8 border
           border-gray-200 dark:border-gray-700 shadow-2xl">
            <button
              onClick={() => setReviewOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full
              text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-white/10
              hover:text-black dark:hover:text-white">
              ✕
            </button>

            <h3 className="text-xl sm:text-2xl font-serif font-semibold text-black dark:text-white mb-6">
              Write a Review
            </h3>

            <form onSubmit={handleReviewSubmit} className="space-y-5" >
              <div>
                <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                  Rating
                </label>

                <select value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-600
                  text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-premium-gold">
                  <option value="5">★★★★★ (5)</option>
                  <option value="4">★★★★ (4)</option>
                  <option value="3">★★★ (3)</option>
                  <option value="2">★★ (2)</option>
                  <option value="1">★ (1)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                  Your Review
                </label>

                <textarea
                  rows={3}
                  placeholder="Share your experience with this rug…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-600
                  text-black dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-premium-gold"/>
              </div>
              <button type="submit" disabled={submitting}
                className="w-full mt-4 py-3 rounded-full bg-premium-gold text-black font-semibold transition-all duration-300 hover:brightness-110 active:scale-[0.98]">
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>  
  );
};

export default ProductDetail;
