import React from 'react';
import StarRating from './StarRating';

const ProductCard = ({ product, index }) => {
  if (!product) {
    return null;
  }

  const displayPrice = product.price && product.price !== 'Price not available' 
    ? `₹${product.price}` 
    : 'Price not available';
    
  // Unify the URL property and provide a fallback
  const productUrl = product.url || product.amazonUrl || '#';
  
  // Use 'brand' as the primary source, fallback to 'source'
  const storeName = product.brand || product.source || 'Store';

  return (
    <div 
      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col"
    >
      <div className="relative h-60 bg-gray-50 flex items-center justify-center p-4">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2 h-12">
          {product.title}
        </h3>

        <div className="flex items-center mb-3">
          <StarRating rating={product.rating} />
          <span className="ml-2 text-sm text-gray-600">
            {product.rating ? `${parseFloat(product.rating).toFixed(1)}` : 'No rating'}
            {product.reviews_count ? ` (${product.reviews_count})` : ''}
          </span>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-baseline justify-between mb-4">
            <p className="text-2xl font-bold text-purple-600">
              {displayPrice}
            </p>
             <span className="text-xs font-semibold uppercase text-gray-400">{storeName}</span>
          </div>

          <a
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-purple-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 active:scale-95"
          >
            View on {storeName}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;