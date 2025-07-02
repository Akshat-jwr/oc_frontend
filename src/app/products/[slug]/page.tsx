import React from 'react';
import { notFound } from 'next/navigation';
import { publicService } from '@/lib/api';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import AddToCartForm from '@/components/product/AddToCartForm';
import TrustBadges from '@/components/ui/TrustBadges';
import { Product } from '@/types';
import ProductSection from '@/components/home/ProductSection';
import ProductReviews from '@/components/reviews/ProductReviews';
import ProductInfoClient from '@/components/product/ProductInfoClient';

export const dynamic = 'force-dynamic';

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const product = await publicService.getProductById(slug);
    return product;
  } catch (error) {
    console.error(`Failed to fetch product with slug "${slug}":`, error);
    return null;
  }
}

interface ProductPageProps {
  params: { slug: string };
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  // ✅ FIXED: Define reviews from product data
  const reviews = product.reviews || [];

  const relatedProducts = await publicService.getRelatedProducts(product._id, 6).catch(() => []);

  return (
    <div className="bg-gray-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductImageGallery images={product.images} productName={product.name} />
          <div className="flex flex-col space-y-6">
            {/* ✅ FIXED: Now reviews is properly defined */}
            <>
  {/* Server-side component for initial render */}
  {/* <ProductInfo product={product} /> */}
  {/* Client-side component for live updates - will hydrate over the server component */}
  <ProductInfoClient product={product} initialReviews={reviews} />
</>
            <AddToCartForm product={product} />
            <TrustBadges />
          </div>
        </div>

        <div className="mt-16 bg-white p-6 md:p-8 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Product Details</h3>
          <div 
            className="prose max-w-none text-gray-600"
            dangerouslySetInnerHTML={{ __html: product.description }} 
          />
          {Object.keys(product.specifications || {}).length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Specifications</h4>
              <ul className="divide-y divide-gray-200">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <li key={key} className="py-3 grid grid-cols-3 gap-4">
                    <span className="text-sm font-medium text-gray-600">{key}</span>
                    <span className="text-sm text-gray-800 col-span-2">{String(value)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div id="reviews" className="mt-16">
          {/* ✅ FIXED: Using the same reviews variable */}
          <ProductReviews product={product} initialReviews={reviews} />
        </div>
        
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <ProductSection title="You Might Also Like" products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
