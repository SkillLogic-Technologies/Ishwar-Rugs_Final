// pages/collections.tsx
import { useEffect, useState } from "react";
import { Link } from "wouter";

interface Collection {
  _id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/collection/");
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
      <h1 className="text-3xl font-bold text-premium-gold mb-8">All Collections</h1>

      {collections.length === 0 ? (
        <p className="text-gray-500">No collections available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {collections.map((c) => (
            <Link key={c._id} href={`/collections/${c.slug}`} className="group">
              <div className="overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
                <img
                  src={`http://127.0.0.1:5000/${c.image}`} // backend image path
                  alt={c.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 bg-[#020617] text-white">
                  <h2 className="text-lg font-semibold mb-1">{c.name}</h2>
                  <p className="text-sm text-gray-400">{c.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}