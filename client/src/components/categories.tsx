import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation } from "wouter";

interface Category {
  slug: string;
  name: string;
  image: string;
}

export default function Categories() {
  const BASE_URL = "/";
  const [categories, setCategories] = useState<Category[]>([]);
  const [, setLocation] = useLocation();
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/category`, {
        withCredentials: true,
      });
      setCategories(res.data.data);
    } catch (error) {
      console.error("Error while fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!categories.length) return;

    const track = trackRef.current;
    if (!track) return;

    const speed = 0.5; // px per frame

    const animate = () => {
      if (!pausedRef.current) {
        posRef.current += speed;
        const half = track.scrollWidth / 2;
        if (posRef.current >= half) {
          posRef.current = 0;
        }
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [categories]);

  const repeated = [...categories, ...categories, ...categories];

  return (
    <section className="w-full py-10 overflow-hidden">
      <h2 className="text-center font-serif text-5xl md:text-6xl font-semibold mb-12">
        Explore Categories
      </h2>

      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        <div ref={trackRef} className="flex gap-6 w-max">
          {repeated.map((cat, i) => (
            <div
              key={`${cat.slug}-${i}`}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => setLocation(`/category/${cat.slug}`)}
            >
              <div className="w-[220px] h-[300px] md:w-[260px] md:h-[360px] overflow-hidden rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-sm md:text-lg font-medium tracking-wide text-black dark:text-white text-center group-hover:text-premium-gold transition-colors duration-300">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
