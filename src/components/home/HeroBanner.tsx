// components/home/HeroBanner.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const slides = [
  {
    title: "Personalized Gifts, Unforgettable Moments",
    subtitle: "Custom photo frames, mugs, and more - all made with love.",
    cta: "Shop The Collection",
    link: "/products",
    bgClass: "bg-gradient-to-r from-pink-500 to-rose-500",
  },
  {
    title: "Free Delivery On Orders Above ₹999",
    subtitle: "Quality customization with fast, reliable nationwide shipping.",
    cta: "Explore Categories",
    link: "/categories",
    bgClass: "bg-gradient-to-r from-blue-600 to-purple-600",
  },
  {
    title: "Custom Corporate Gifting",
    subtitle: "Elevate your brand with our professional gifting solutions.",
    cta: "Inquire Now",
    link: "/contact",
    bgClass: "bg-gradient-to-r from-green-500 to-teal-600",
  }
];

const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${slide.bgClass} ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center text-center md:text-left items-center md:items-start">
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
              {slide.title}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto md:mx-0 drop-shadow-md">
              {slide.subtitle}
            </p>
            <Link
              href={slide.link}
              className="mt-8 inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors shadow-lg transform hover:scale-105 duration-200"
            >
              {slide.cta}
            </Link>
          </div>
        </div>
      ))}

      {/* Navigation */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full text-white transition">
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full text-white transition">
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
