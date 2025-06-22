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
    product_url = product.amazonUrl || product.url || '#' // Use amazonUrl as fallback for product_url
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
      className="glass-card rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1 transform-gpu cursor-pointer group flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-900">
        <img 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          src={thumbnail} 
          alt={title} 
          loading="lazy"
        />
        
        {/* Source Badge */}
        <div className="absolute top-3 left-3 bg-purple-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
          {source}
        </div>
        
        {/* External Link Icon */}
        <a 
          href={product_url}
          target="_blank"
          rel="noopener noreferrer"
          className="product-link-icon absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-purple-600"
          aria-label="View product page"
        >
          <FaExternalLinkAlt className="w-4 h-4" />
        </a>
        
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="font-bold text-lg text-gray-100 leading-tight line-clamp-2" title={title}>
          {title}
        </h3>

        {/* Spacer to push content to bottom */}
        <div className="flex-grow" />

        {/* Price and Rating Row */}
        <div className="flex justify-between items-center mt-4">
            <p className="text-gray-200 text-xl font-semibold">
              {price}
            </p>
            {rating && (
              <div className="flex items-center">
                <StarRating rating={rating} />
                <span className="text-xs text-gray-400 ml-1.5">({rating})</span>
              </div>
            )}
        </div>

        {/* Buy Button */}
        <div className="mt-4">
          <button
            onClick={() => window.open(product_url, '_blank', 'noopener,noreferrer')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
          >
            <FaShoppingCart className="w-4 h-4" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;