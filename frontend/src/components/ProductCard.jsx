import React from 'react';
import StarRating from './StarRating';

const ProductCard = ({ product, theme }) => {
  if (!product) {
    return null;
  }

  // Fallback for price if it's not a valid number or not available
  const displayPrice = product.price && product.price !== 'Price not available'
    ? `₹${product.price}`
    : 'Price not available';

  const productUrl = product.url || '#';
  const storeName = product.brand || 'the store';

  return (
    <div className={`group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="relative h-60">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className={`text-lg font-semibold mb-2 line-clamp-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
          {product.title}
        </h3>

        <div className="flex items-center mb-3">
          <StarRating rating={product.rating} />
          <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {product.rating ? `${parseFloat(product.rating).toFixed(1)}` : 'No rating'}
            {product.reviews_count ? ` (${product.reviews_count})` : ''}
          </span>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
              <span className="text-lg font-normal">--&gt; </span>{displayPrice}
            </p>
          </div>

          <a
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View on {storeName}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;