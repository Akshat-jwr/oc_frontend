'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const slides = [
  {
    id: 1,
    title: "Discover Amazing Products",
    subtitle: "Up to 70% Off on Selected Items",
    description: "Shop the latest trends and discover unique handcrafted items",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
    cta: "Shop Now",
    ctaLink: "/products",
    bgGradient: "from-blue-600 to-purple-700"
  },
  {
    id: 2,
    title: "Handcrafted with Love",
    subtitle: "Premium Quality Guaranteed",
    description: "Each product is carefully crafted by skilled artisans",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
    cta: "Explore Collection",
    ctaLink: "/products",
    bgGradient: "from-green-600 to-teal-700"
  },
  {
    id: 3,
    title: "New Arrivals",
    subtitle: "Fresh Designs Every Week",
    description: "Be the first to get your hands on our latest creations",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop",
    cta: "View New",
    ctaLink: "/products?sort=newest",
    bgGradient: "from-orange-600 to-red-700"
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

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} opacity-75`} />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-3xl">
                <div className="animate-fade-in-up">
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <h2 className="text-2xl md:text-3xl font-semibold text-yellow-300 mb-6">
                    {slide.subtitle}
                  </h2>
                  <p className="text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href={slide.ctaLink}
                      className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-amazon-600 hover:bg-amazon-700 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      {slide.cta}
                    </Link>
                    <Link
                      href="/categories"
                      className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white hover:bg-white hover:text-gray-900 rounded-lg transition-all duration-300"
                    >
                      Browse Categories
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 hover:bg-black/50 text-white rounded-full transition-all duration-300"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 hover:bg-black/50 text-white rounded-full transition-all duration-300"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
