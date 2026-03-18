import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import { useLocation } from "wouter";

import "swiper/css";
import "swiper/css/free-mode";

export default function Categories() {
  interface Category {
    slug: string;
    name: string;
    image: string;
  }

  const BASE_URL = "/";
  const [categories, setCategories] = useState<Category[]>([]);
  const [, setLocation] = useLocation();
  const swiperRef = useRef<any>(null);

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
    const timer = setTimeout(() => {
      swiperRef.current?.autoplay?.start();
    }, 100);
    return () => clearTimeout(timer);
  }, [categories]);

  return (
    <section className="w-full py-10">
      <h2 className="text-center text-4xl mb-12 font-semibold">
        EXPLORE CATEGORIES
      </h2>

      <Swiper
        modules={[Autoplay, FreeMode]}
        loop={true}
        freeMode={{
          enabled: true,
          momentum: false,
        }}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        speed={8500}
        slidesPerView="auto"
        slidesPerGroup={1}
        slidesPerGroupSkip={0}
        spaceBetween={20}
        watchSlidesProgress={false}
        breakpoints={{
          480: { slidesPerView: 1, spaceBetween: 20 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 24 },
          1024: { slidesPerView: 4, spaceBetween: 28 },
          1280: { slidesPerView: 5, spaceBetween: 32 },
        }}
        className="w-full mx-auto px-4 overflow-hidden smooth-swiper"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {[...categories, ...categories, ...categories].map((cat) => (
          <SwiperSlide key={cat.slug} className="!w-auto group">
            <div
              className="flex flex-col items-center"
              onClick={() => setLocation(`/category/${cat.slug}`)}
            >
              <div
                style={{ willChange: "transform" }}
                className="relative w-[350px] h-[450px] sm:w-[240px] sm:h-[320px]
                md:w-[250px] md:h-[330px]
                lg:w-[260px] lg:h-[360px]
                overflow-hidden rounded-xl shadow-lg transition-all duration-300
                group-hover:shadow-2xl cursor-pointer"
              >
                <img
                  src={`${BASE_URL}${cat.image}`}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <p
                className="mt-3 text-sm sm:text-base md:text-lg font-medium tracking-wide text-black dark:text-white text-center transition-all duration-300
                group-hover:text-premium-gold cursor-pointer"
              >
                {cat.name}
              </p>
            </div>
          </SwiperSlide>
        ))}

        <button
          className="custom-prev"
          onClick={() => {
            const swiper = swiperRef.current;
            if (!swiper) return;
            swiper.slideTo(swiper.activeIndex - 1);
          }}
        >
          <span className="chevron">&#10094;</span>
        </button>

        <button
          className="custom-next"
          onClick={() => {
            const swiper = swiperRef.current;
            if (!swiper) return;
            swiper.slideTo(swiper.activeIndex + 1);
          }}
        >
          <span className="chevron">&#10095;</span>
        </button>
      </Swiper>
    </section>
  );
}
