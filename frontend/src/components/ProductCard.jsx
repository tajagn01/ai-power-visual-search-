import React from 'react';
import StarRating from './StarRating';
import { FaExternalLinkAlt, FaShoppingCart } from 'react-icons/fa';

// Utility to format price as INR
function formatINR(price) {
  const num = parseFloat((price || '').toString().replace(/[^\d.]/g, ''));
  if (isNaN(num)) return '₹--';
  return '₹' + num.toLocaleString('en-IN');
}

// Utility to extract platform from URL
function getPlatform(url, brand) {
  if (!url && brand) return brand;
  if (!url) return 'Unknown';
  const lower = url.toLowerCase();
  if (lower.includes('amazon')) return 'Amazon';
  if (lower.includes('flipkart')) return 'Flipkart';
  if (lower.includes('myntra')) return 'Myntra';
  if (lower.includes('meesho')) return 'Meesho';
  if (lower.includes('ajio')) return 'Ajio';
  if (lower.includes('reliancedigital')) return 'Reliance Digital';
  if (lower.includes('croma')) return 'Croma';
  return brand || 'Other';
}

const ProductCard = ({ product, compareMode, selectedProducts, setSelectedProducts }) => {
  // Handle different field names from backend
  const {
    title = 'Product Title Not Available',
    thumbnail = 'https://picsum.photos/300/300?random=1',
    price = 'Price not available',
    rating = null,
    brand = '',
    product_url = product.amazonUrl || product.url || product.product_url || '#',
    description = product.description || ''
  } = product;

  const platform = getPlatform(product_url, brand);

  const handleCardClick = (e) => {
    // Prevent card click if a button or the link icon is clicked
    if (e.target.closest('button, a')) {
      e.stopPropagation();
      return;
    }
    window.open(product_url, '_blank', 'noopener,noreferrer');
  };
  
  // Comparison selection logic
  const isSelected = selectedProducts?.some((p) => p.id === product.id);
  const handleSelect = (e) => {
    e.stopPropagation();
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="glass-card rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1 transform-gpu cursor-pointer group flex flex-col h-full max-w-xs w-full mx-auto p-1 min-w-0"
    >
      {/* Platform Badge */}
      <div className="absolute top-2 right-2 z-10">
        <span className="bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          {platform}
        </span>
      </div>
      {/* Comparison Checkbox */}
      {compareMode && (
        <div className="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelect}
            className="w-5 h-5 accent-pink-500 rounded focus:ring-2 focus:ring-pink-400"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
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
          <p className="text-gray-200 text-base font-semibold">{formatINR(price)}</p>
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
            {platform && platform !== 'Other' ? `Buy on ${platform}` : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;


// // // Alright, this is the product card component to show individual products.
// // Might revisit later to clean up the button logic.

// import React from 'react';
// import StarRating from './StarRating'; // Custom star component, reusing it here.
// import { FaExternalLinkAlt, FaShoppingCart } from 'react-icons/fa';

// // A little redundant destructuring here but it's clearer when reading quickly
// const ProductCard = ({ product }) => {
//     // Just unpacking product fields, giving fallbacks where things might break
//     const {
//         title = 'Product Title Not Available',
//         thumbnail = 'https://picsum.photos/300/300?random=42', // switched random image for variety
//         price = 'Price not available',
//         rating = null,
//         // Decided to call this shopName instead of 'source', just feels more natural to me
//         shopName = product.brand || 'Store',
//         // Could have shortened this, but wanted to be explicit
//         productLink = product.amazonUrl || product.url || '#',
//         description = product.description || '' // Might be empty, that's fine
//     } = product;

//     // For debugging later if needed
//     // console.log('Product loaded:', title);

//     // Handles what happens when user clicks the card
//     const handleCardClick = (e) => {
//         // Block the card click if the button or link icon was clicked
//         if (e.target.closest('button, a')) {
//             // stopping event from bubbling up to card
//             e.stopPropagation();
//             return;
//         }
//         // Open product link in new tab
//         window.open(productLink, '_blank', 'noopener,noreferrer');
//     };

//     // Decided to add a simple formatter for the button text, could probably simplify
//     const getButtonLabel = () => {
//         if (!shopName) return 'Buy Now';

//         const lowerName = shopName.toLowerCase();
//         if (lowerName.includes('flip')) return 'Buy on Flipkart';
//         if (lowerName.includes('amazon')) return 'Buy on Amazon';
//         if (lowerName.includes('myntra')) return 'Buy on Myntra';
//         if (lowerName.includes('meesho')) return 'Buy on Meesho';
//         return Buy on ${shopName}; // fallback option
//     };

//     return (
//         <div
//             onClick={handleCardClick}
//             className="glass-card rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1 transform-gpu cursor-pointer group flex flex-col h-full max-w-xs w-full mx-auto p-1 min-w-0"
//         >
//             {/* Product Image Section */}
//             <div className="relative w-full aspect-[3/4] bg-gray-900 overflow-hidden">
//                 <img
//                     className="w-full h-full object-contain bg-white"
//                     src={thumbnail}
//                     alt={title}
//                     loading="lazy"
//                 />

//                 {/* External Link Button */}
//                 <a
//                     href={productLink}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="product-link-icon absolute top-3 right-3 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-purple-600"
//                     aria-label="View product page"
//                 >
//                     <FaExternalLinkAlt className="w-3 h-3" />
//                 </a>

//                 {/* Fancy hover overlay - makes the card feel alive */}
//                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
//             </div>

//             {/* Card Details Section */}
//             <div className="p-2 flex flex-col flex-grow min-w-0">
//                 {/* Product Title */}
//                 <h3 className="font-bold text-xs text-gray-100 leading-tight truncate" title={title}>
//                     {title}
//                 </h3>

//                 {/* Product Description */}
//                 {description && (
//                     <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{description}</p>
//                 )}

//                 {/* Spacer to push price to bottom */}
//                 <div className="flex-grow" />

//                 {/* Price and Rating Section */}
//                 <div className="mt-2 flex flex-col items-start">
//                     {/* Price Display */}
//                     <p className="text-gray-200 text-base font-semibold">{price}</p>

//                     {/* Star Rating if available */}
//                     {rating && (
//                         <div className="flex items-center mt-1">
//                             <StarRating rating={rating} className="w-3 h-3 md:w-4 md:h-4" />
//                             {/* Minor detail: wrapping rating in parentheses */}
//                             <span className="text-xs text-gray-400 ml-1">({rating})</span>
//                         </div>
//                     )}
//                 </div>

//                 {/* Buy Button */}
//                 <div className="mt-2">
//                     <button
//                         onClick={() => window.open(productLink, '_blank', 'noopener,noreferrer')}
//                         className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-2 rounded-lg text-xs"
//                     >
//                         {getButtonLabel()}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductCard;