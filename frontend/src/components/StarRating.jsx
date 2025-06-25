import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

// Simple star rating component (can be in its own file)
const StarRating = ({ rating, className = "w-5 h-5" }) => {
  const numericRating = parseFloat(rating);
  if (isNaN(numericRating)) return null;

  const starElements = [];
  const roundedRating = Math.round(numericRating * 2) / 2; // Round to nearest 0.5

  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      starElements.push(<FaStar key={i} className={`${className} text-yellow-400`} />);
    } else if (i - 0.5 === roundedRating) {
      starElements.push(<FaStarHalfAlt key={i} className={`${className} text-yellow-400`} />);
    } else {
      starElements.push(<FaRegStar key={i} className={`${className} text-gray-300`} />);
    }
  }

  return (
    <div className="flex items-center">
      {starElements}
    </div>
  );
};

export default StarRating; 