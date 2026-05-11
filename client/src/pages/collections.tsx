
// import { useEffect, useState } from "react";
// import { Link } from "wouter";

// interface Collection {
//   _id: string;
//   name: string;
//   description: string;
//   image: string[]; // image array hai
//   slug: string;
// }

// export default function CollectionsPage() {
//   const [collections, setCollections] = useState<Collection[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCollections = async () => {
//       try {
//         const res = await fetch("/api/collection/");
//         const data = await res.json();
//         if (data.success) {
//           setCollections(data.data);
//         }
//       } catch (err) {
//         console.error("Error fetching collections:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCollections();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[70vh]">
//         <p className="text-gray-500 text-lg">Loading collections...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <h1 className="text-3xl font-bold text-premium-gold mb-8">
//         All Collections
//       </h1>

//       {collections.length === 0 ? (
//         <p className="text-gray-500">No collections available.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//           {collections.map((c) => (
//             <Link key={c._id} href={`/collections/${c.slug}`} className="group">
//               <div className="overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">

//                 {/* FIRST IMAGE ONLY */}
//                 <img
//                   src={`/${c.image[0]}`}
//                   alt={c.name}
//                   className="w-full h-64 object-cover"
//                 />

//                 <div className="p-4 bg-[#020617] text-white">
//                   <h2 className="text-lg font-semibold mb-1">{c.name}</h2>
//                   <p className="text-sm text-gray-400">{c.description}</p>
//                 </div>

//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }






import { useEffect, useState } from "react";
import { Link } from "wouter";

interface Collection {
  _id: string;
  name: string;
  description: string;
  image: string | string[]; // can be string or array
  slug: string;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch("/api/collection/");
        const data = await res.json();
        if (data.success) {
          setCollections(data.data);
        }
      } catch (err) {
        console.error("Error fetching collections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-500 text-lg">Loading collections...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-premium-gold mb-8">
        All Collections
      </h1>

      {collections.length === 0 ? (
        <p className="text-gray-500">No collections available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collections.map((c) => {
            const images = Array.isArray(c.image) ? c.image : [c.image];

            return (
              <Link
                key={c._id}
                href={`/collections/${c.slug}`}
                className="group block" // important for grid
              >
                <div className="overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 bg-white dark:bg-gray-900 h-full">
                  
                  {/* Image Carousel */}
                  <div className="relative w-full h-64">
                    {images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={c.name}
                        className={`w-full h-64 object-cover absolute top-0 left-0 transition-opacity duration-500 ${
                          idx === 0 ? "opacity-100" : "opacity-0"
                        } group-hover:opacity-100`}
                        onError={(e: any) => {
                          e.target.src =
                            "https://via.placeholder.com/400x400?text=No+Image";
                        }}
                      />
                    ))}
                  </div>

                  {/* Collection Info */}
                  <div className="p-4 text-gray-900 dark:text-white">
                    <h2 className="text-lg font-semibold mb-1">{c.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {c.description}
                    </p>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>

      )}

    </div>
  );
}