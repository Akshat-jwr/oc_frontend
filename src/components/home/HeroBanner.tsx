'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const slides = [
  {
    id: 1,
    title: "Personalized Gifts That Tell Your Story",
    subtitle: "Custom photo frames, mugs, and more - all made with love",
    cta: "Shop Now",
    link: "/products",
    bg: "bg-gradient-to-r from-pink-500 to-rose-500",
    textColor: "text-white"
  },
  {
    id: 2,
    title: "Free Delivery on Orders Above ₹999",
    subtitle: "Quality customization with nationwide shipping",
    cta: "Explore Categories",
    link: "/categories",
    bg: "bg-gradient-to-r from-blue-600 to-purple-600",
    textColor: "text-white"
  },
  {
    id: 3,
    title: "Custom Corporate Gifts",
    subtitle: "Professional gifting solutions for businesses",
    cta: "Contact Us",
    link: "/contact",
    bg: "bg-gradient-to-r from-green-500 to-teal-600",
    textColor: "text-white"
  }
];

const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          } ${slide.bg}`}
        >
          <div className="flex items-center justify-center h-full">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${slide.textColor} animate-fade-in`}>
                {slide.title}
              </h1>
              <p className={`text-lg md:text-xl mb-8 ${slide.textColor} opacity-90 animate-slide-up`}>
                {slide.subtitle}
              </p>
              <Link
                href={slide.link}
                className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide 
                ? 'bg-white' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => goToSlide((currentSlide + 1) % slides.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default HeroBanner;
