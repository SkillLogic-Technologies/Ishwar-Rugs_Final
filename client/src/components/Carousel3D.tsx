import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "@/components/styles/carousel.css"; // Make sure the file path is correct

const images = [
      "/carousel-3d/slide-01.png",
      "/carousel-3d/slide-02.png",
      "/carousel-3d/slide-03.png",
      "/carousel-3d/slide-04.png",
      "/carousel-3d/slide-05.png",
      "/carousel-3d/slide-06.png",
      "/carousel-3d/slide-07.png",
      "/carousel-3d/slide-08.png",
      "/carousel-3d/slide-09.png",
      "/carousel-3d/slide-10.png",
      "/carousel-3d/slide-11.png",
];

export default function Carousel360() {
  return (
    <section className="py-32 bg-background text-foreground">
      <div className="max-w-screen-2xl mx-auto px-2 sm:px-4">
        <h2 className="text-center font-serif text-5xl md:text-6xl font-semibold mb-16">
          Explore Our Crafted Portraits
        </h2>

        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView="auto"
          loop
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 300,
            modifier: 2.5,
            slideShadows: true,
          }}
          navigation
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          className="w-full swiper-dark"
        >
          {images.map((src, i) => (
            <SwiperSlide
              key={i}
              className="w-[350px] md:w-[400px] lg:w-[450px] h-[560px] rounded-3xl overflow-hidden shadow-xl"
            >
              <img
                src={src}
                alt={`Portrait ${i + 1}`}
                loading={i < 3 ? "eager" : "lazy"}   // first 2–3 fast load
                decoding="async"                     // browser ko async decode bolta hai
                // fetchpriority={i === 0 ? "high" : "auto"}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
