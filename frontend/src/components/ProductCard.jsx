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
      className="glass-card rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 group"
      style={{ animationDelay: `${index * 50}ms`, opacity: 0, animation: `fadeInUp 0.5s ease-out forwards` }}
    >
      <div className="relative h-48">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <a
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="neon-button px-4 py-2 rounded-full font-semibold"
          >
            View Details
          </a>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-100 truncate" title={product.title}>
          {product.title}
        </h3>
        <p className="text-gray-300 text-sm mt-1">{storeName}</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-bold text-gray-100">{displayPrice}</p>
          {product.rating && <StarRating rating={product.rating} />}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;