import React from 'react';

const FilterControls = ({
  priceSort,
  setPriceSort,
  ratingSort,
  setRatingSort,
}) => {
  return (
    <div className="p-4 space-y-4 bg-black/60 backdrop-blur-md border border-white/10 shadow-xl rounded-xl">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-100">Sort by Price</label>
        <select
          value={priceSort}
          onChange={(e) => setPriceSort(e.target.value)}
          className="w-full rounded-md border-purple-500/30 bg-black/30 text-gray-100 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm backdrop-blur-md"
        >
          <option value="default" className="bg-gray-800">Default</option>
          <option value="asc" className="bg-gray-800">Low to High</option>
          <option value="desc" className="bg-gray-800">High to Low</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-100">Sort by Rating</label>
        <select
          value={ratingSort}
          onChange={(e) => setRatingSort(e.target.value)}
          className="w-full rounded-md border-purple-500/30 bg-black/30 text-gray-100 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm backdrop-blur-md"
        >
          <option value="default" className="bg-gray-800">Default</option>
          <option value="asc" className="bg-gray-800">Low to High</option>
          <option value="desc" className="bg-gray-800">High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default FilterControls; 