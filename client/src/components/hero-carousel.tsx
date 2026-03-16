import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface CarouselSlide {
  id: string;
  title: string;
  description?: string;
  image: string;
  link: string;
  buttonText: string;
}

export default function HeroCarousel() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">(
    "desktop",
  );

  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;

      if (width < 768) {
        setDevice("mobile");
      } else if (width >= 768 && width <= 1024) {
        setDevice("tablet");
      } else {
        setDevice("desktop");
      }
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/collection")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const slidesData = data.data.map((item: any) => {
            const images = item.image || [];

            let imagePath = "";

            // desktop = index 0
            if (device === "desktop") {
              imagePath = images[0] ? `http://127.0.0.1:5000/${images[0]}` : "";
            }
            // mobile + tablet = index 1
            else {
              imagePath = images[1] ? `http://127.0.0.1:5000/${images[1]}` : "";
            }

            return {
              id: item._id,
              title: item.name,
              description: item.description,
              image: imagePath,
              link: `/collections/${item.slug}`,
              buttonText: "EXPLORE COLLECTION",
            };
          });

          setSlides(slidesData);
        }
      })
      .catch((err) => console.error(err));
  }, [device]);

  useEffect(() => {
    if (!slides.length) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides]);

  if (!slides.length) return null;

  return (
    <section className="relative mt-16 h-[70vh] md:h-[90vh] lg:h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {slide.image && (
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl">
              <h2 className="font-serif text-4xl md:text-6xl lg:text-[9rem] font-bold mb-6 bg-gradient-to-br from-yellow-400 to-amber-600 text-transparent bg-clip-text drop-shadow-xl">
                {slide.title}
              </h2>

              {slide.description && (
                <p className="text-sm md:text-lg text-yellow-300 mb-8 font-light leading-relaxed">
                  {slide.description}
                </p>
              )}

              <Link href={slide.link}>
                <Button className="px-8 py-4 text-white border border-white rounded-full text-sm md:text-lg font-semibold backdrop-blur bg-white/10 hover:bg-white/20">
                  {slide.buttonText}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          setCurrentSlide(
            currentSlide === 0 ? slides.length - 1 : currentSlide - 1,
          )
        }
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-white z-20"
      >
        <ChevronLeft size={32} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-white z-20"
      >
        <ChevronRight size={32} />
      </Button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
