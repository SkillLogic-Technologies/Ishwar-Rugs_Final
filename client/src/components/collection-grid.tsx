import { Link } from "wouter";
import type { Collection } from "@shared/schema";

interface CollectionGridProps {
  collections: Collection[];
  title?: string;
  showAll?: boolean;
}

export default function CollectionGrid({ collections, title, showAll = false }: CollectionGridProps) {
  const displayCollections = showAll ? collections : collections.slice(0, 6);

  return (
    <section className="py-32 bg-gradient-to-b from-luxury-brown to-background">
      <div className="max-w-8xl mx-auto px-4">
        {title && (
          <h2 className="font-serif text-5xl md:text-7xl font-bold text-center text-premium-gold mb-20">
            {title}
          </h2>
        )}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayCollections.map((collection) => (
            <Link 
              key={collection.id} 
              href={`/collections/${collection.slug}`}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-3xl mb-6 premium-shadow">
                <img
                  src={collection.heroImage}
                  alt={collection.name}
                  className="w-full h-80 md:h-96 lg:h-[28rem] object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <h4 className="text-white font-serif text-xl font-bold">{collection.name}</h4>
                </div>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-premium-gold mb-3 group-hover:text-warm-gold transition-colors">
                {collection.name.toUpperCase()}
              </h3>
              <p className="text-foreground/80 leading-relaxed text-lg font-light">
                {collection.shortDescription || collection.description}
              </p>
            </Link>
          ))}
        </div>

        {!showAll && collections.length > 6 && (
          <div className="text-center mt-16">
            <Link href="/collections">
              <button className="bg-premium-gold text-primary-brown hover:bg-warm-gold font-bold px-12 py-6 text-lg rounded-lg transition-all duration-300 hover:scale-105 premium-shadow">
                VIEW ALL COLLECTIONS
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
