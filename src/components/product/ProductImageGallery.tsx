// components/product/ProductImageGallery.tsx

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/types';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(
    images.find(img => img.isFeatured) || images[0] || null
  );

  if (!selectedImage) {
    return (
      <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No Image Available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden pb-2 md:pb-0">
        {images.map((image) => (
          <button
            key={image.publicId} // Use publicId for a stable key
            onClick={() => setSelectedImage(image)}
            className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
              selectedImage.publicId === image.publicId ? 'border-amazon-600 ring-2 ring-amazon-300' : 'border-gray-200 hover:border-amazon-400'
            }`}
          >
            <Image
              src={image.url}
              alt={`${productName} thumbnail`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 aspect-square relative bg-white rounded-lg shadow-sm overflow-hidden">
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt || productName}
          fill
          className="object-contain p-4" // Use object-contain to avoid cropping
          sizes="(max-width: 768px) 100vw, 50vw"
          priority // Load the main image faster
        />
      </div>
    </div>
  );
};

export default ProductImageGallery;
