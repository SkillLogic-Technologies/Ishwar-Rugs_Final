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
  "https://i.postimg.cc/CMmKx8SM/ChatGPT_Image_Jun_20,_2025,_10_42_35_PM.png",
  "https://i.postimg.cc/mDVThxxp/ChatGPT_Image_Jun_20,_2025,_10_45_37_PM.png",
  "https://i.postimg.cc/N06sq9dc/ChatGPT_Image_Jun_20,_2025,_10_46_55_PM.png",
  "https://i.postimg.cc/Gt2dyMdL/ChatGPT_Image_Jun_20,_2025,_11_03_56_PM.png",
  "https://i.postimg.cc/k47nnJHt/ChatGPT_Image_Jun_20,_2025,_11_07_33_PM.png",
  "https://i.postimg.cc/VLY5mcTt/ChatGPT_Image_Jun_30,_2025,_10_22_23_PM.png",
  "https://i.postimg.cc/xTMvXYT1/ChatGPT_Image_Jun_30,_2025,_10_35_12_PM.png",
  "https://i.postimg.cc/pdSbc3h3/ChatGPT_Image_Jun_30,_2025,_11_23_06_PM.png",
  "https://i.postimg.cc/CxNw7v4V/ChatGPT_Image_Jun_30,_2025,_11_22_16_PM.png",
  "https://i.postimg.cc/FR7YSt3R/ChatGPT_Image_Jun_30,_2025,_10_43_47_PM.png",
  "https://i.postimg.cc/tTnpN9Ts/ChatGPT_Image_Jun_30,_2025,_11_01_28_PM.png",
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
