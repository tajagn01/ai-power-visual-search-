import React from 'react';
import StarRating from './StarRating';
import { FaExternalLinkAlt, FaShoppingCart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  // Handle different field names from backend
  const { 
    title = 'Product Title Not Available', 
    thumbnail = 'https://picsum.photos/300/300?random=1', 
    price = 'Price not available', 
    rating = null, 
    source = product.brand || 'Store', // Use brand as fallback for source
    product_url = product.amazonUrl || product.url || '#', // Use amazonUrl as fallback for product_url
    description = product.description || '' // Use description as fallback for description
  } = product;

  const handleCardClick = (e) => {
    // Prevent card click if a button or the link icon is clicked
    if (e.target.closest('button, a')) {
      e.stopPropagation();
      return;
    }
    window.open(product_url, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div
      onClick={handleCardClick}
      className="glass-card rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1 transform-gpu cursor-pointer group flex flex-col h-full max-w-xs w-full mx-auto p-1 min-w-0"
    >
      {/* Image Section */}
      <div className="relative w-full aspect-[3/4] bg-gray-900 overflow-hidden">
        <img
          className="w-full h-full object-contain bg-white"
          src={thumbnail}
          alt={title}
          loading="lazy"
        />
        
        {/* External Link Icon */}
        <a
          href={product_url}
          target="_blank"
          rel="noopener noreferrer"
          className="product-link-icon absolute top-3 right-3 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-purple-600"
          aria-label="View product page"
        >
          <FaExternalLinkAlt className="w-3 h-3" />
        </a>
        
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="p-2 flex flex-col flex-grow min-w-0">
        {/* Title */}
        <h3 className="font-bold text-xs text-gray-100 leading-tight truncate" title={title}>
          {title}
        </h3>
        {description && (
          <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{description}</p>
        )}

        {/* Spacer to push content to bottom */}
        <div className="flex-grow" />

        {/* Price and Rating Row */}
        <div className="mt-2 flex flex-col items-start">
          <p className="text-gray-200 text-base font-semibold">{price}</p>
          {rating && (
            <div className="flex items-center mt-1">
              <StarRating rating={rating} className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs text-gray-400 ml-1">({rating})</span>
            </div>
          )}
        </div>

        {/* Buy Button */}
        <div className="mt-2">
          <button
            onClick={() => window.open(product_url, '_blank', 'noopener,noreferrer')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-2 rounded-lg text-xs"
          >
            {source && source.toLowerCase().includes('flip') ? 'Buy on Flipkart'
              : source && source.toLowerCase().includes('amazon') ? 'Buy on Amazon'
              : source && source.toLowerCase().includes('myntra') ? 'Buy on Myntra'
              : source && source.toLowerCase().includes('meesho') ? 'Buy on Meesho'
              : source ? `Buy on ${source}`
              : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;