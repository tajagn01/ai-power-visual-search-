import React from 'react';

const FilterControls = ({
  priceSort,
  setPriceSort,
  ratingSort,
  setRatingSort,
}) => {
  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-6">
      <h3 className="text-xl font-bold text-gray-800">Filters</h3>

      {/* Price Sort */}
      <div className="space-y-2">
        <label
          htmlFor="price-sort"
          className="text-sm font-semibold text-gray-700"
        >
          Sort by Price
        </label>
        <select
          id="price-sort"
          value={priceSort}
          onChange={(e) => setPriceSort(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        >
          <option value="default">Default</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      {/* Rating Sort */}
      <div className="space-y-2">
        <label
          htmlFor="rating-sort"
          className="text-sm font-semibold text-gray-700"
        >
          Sort by Rating
        </label>
        <select
          id="rating-sort"
          value={ratingSort}
          onChange={(e) => setRatingSort(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        >
          <option value="default">Default</option>
          <option value="desc">High to Low</option>
          <option value="asc">Low to High</option>
        </select>
      </div>
    </div>
  );
};

export default FilterControls; 