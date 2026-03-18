
// import { useEffect, useState } from "react";
// import { useParams, Link } from "wouter";
// import { motion } from "framer-motion";

// interface Product {
//   _id: string;
//   title: string;
//   price: number;
//   images: string[];
//   slug: string; // important
// }

// const BASE_URL = "/";

// export default function CollectionDetails() {
//   const { slug } = useParams<{ slug: string }>();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!slug) return;

//     fetch(`${BASE_URL}api/product/collection/${slug}`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) {
//           setProducts(data.data);
//         }
//       })
//       .catch((err) => console.error("Error:", err))
//       .finally(() => setLoading(false));
//   }, [slug]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[70vh]">
//         <p className="text-gray-400 text-lg">Loading products...</p>
//       </div>
//     );
//   }

//   return (
//     <section className="mt-32 mb-40 px-6 md:px-12 max-w-7xl mx-auto">

//       {/* Heading */}
//       <motion.h1
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.7 }}
//         className="text-4xl md:text-5xl font-serif font-bold uppercase mb-20 text-center tracking-wider text-premium-gold"
//       >
//         {slug} Collection
//       </motion.h1>

//       {products.length === 0 ? (
//         <p className="text-center text-gray-500">
//           No products found in this collection.
//         </p>
//       ) : (

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">

//           {products.map((product, index) => (

//             <Link key={product._id} href={`/product/${product.slug}`}>

//               <motion.div
//                 initial={{ opacity: 0, y: 40 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: index * 0.1 }}
//                 whileHover={{ y: -12 }}
//                 className="cursor-pointer group relative rounded-2xl overflow-hidden bg-neutral-950 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
//               >

//                 {/* IMAGE */}
//                 <div className="relative overflow-hidden">
//                   <motion.img
//                     src={`${BASE_URL}${product.images[0]}`}
//                     alt={product.title}
//                     className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-110"
//                   />

//                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />
//                 </div>

//                 {/* CONTENT */}
//                 <div className="p-6 text-center">
//                   <h2 className="text-xl font-semibold tracking-wide mb-2">
//                     {product.title}
//                   </h2>

//                   <div className="w-12 h-[2px] bg-yellow-500 mx-auto mb-3 opacity-70" />

//                   <p className="text-lg font-bold text-yellow-400">
//                     ₹ {product.price}
//                   </p>
//                 </div>

//                 {/* HOVER GLOW */}
//                 <div className="absolute inset-0 rounded-2xl ring-1 ring-yellow-400/0 group-hover:ring-yellow-400/40 transition-all duration-500 pointer-events-none" />

//               </motion.div>

//             </Link>

//           ))}

//         </div>

//       )}

//     </section>
//   );
// }




import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";

interface Product {
  _id: string;
  slug: string;
  title: string;
  price: number;
  images: string[];
}

const BASE_URL = "/";

export default function CollectionDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    fetch(`${BASE_URL}api/product/collection/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.data);
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-400 text-lg">Loading products...</p>
      </div>
    );
  }

  return (
    <section className="mt-32 mb-40 px-6 md:px-12 max-w-7xl mx-auto">

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-5xl font-serif font-bold uppercase mb-20 text-center tracking-wider text-premium-gold"
      >
        {slug} Collection
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">

        {products.map((product, index) => (
          <Link key={product._id} href={`/product/${product.slug}`}>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -12 }}
              className="cursor-pointer group relative rounded-2xl overflow-hidden 
              bg-white dark:bg-neutral-950 
              border border-gray-200 dark:border-white/10 
              shadow-lg"         
                 >

              <div className="relative overflow-hidden">
                <img
                  src={`${BASE_URL}${product.images?.[0]}`}
                  alt={product.title}
                  className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="p-6 text-center">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {product.title}
                </h2>

               <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                  ₹ {product.price}
                </p>
              </div>

            </motion.div>

          </Link>
        ))}

      </div>
    </section>
  );
}