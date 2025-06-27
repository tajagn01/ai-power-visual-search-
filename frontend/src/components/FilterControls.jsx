import React from 'react';
import StarRating from './StarRating';

function formatINR(amount) {
  if (typeof amount !== 'number') amount = parseFloat(amount);
  if (isNaN(amount)) return '';
  return '₹' + amount.toLocaleString('en-IN');
}

const FilterControls = ({
  priceSort,
  setPriceSort,
  ratingSort,
  setRatingSort,
  filters,
  setFilters,
  availableFilters,
}) => {
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleCheckboxChange = (filterType, value) => {
    const currentValues = filters[filterType];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    handleFilterChange(filterType, newValues);
  };

  // Calculate min/max price from products if available
  let minPrice = 0, maxPrice = 100000;
  if (availableFilters && availableFilters.prices) {
    minPrice = availableFilters.prices.min;
    maxPrice = availableFilters.prices.max;
  }

  return (
    <div className="p-4 space-y-6 bg-black/70 backdrop-blur-md border border-white/10 shadow-xl rounded-xl text-white">
      
      {/* Sort Controls */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-100">Sort By</h3>
        <div className="flex gap-2">
          <select value={priceSort} onChange={(e) => setPriceSort(e.target.value)} className="w-full rounded-md border-purple-500/30 bg-black/40 text-gray-100 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm backdrop-blur-md">
            <option value="default" className="bg-gray-800">Price: Default</option>
            <option value="asc" className="bg-gray-800">Price: Low to High</option>
            <option value="desc" className="bg-gray-800">Price: High to Low</option>
          </select>
          <select value={ratingSort} onChange={(e) => setRatingSort(e.target.value)} className="w-full rounded-md border-purple-500/30 bg-black/40 text-gray-100 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm backdrop-blur-md">
            <option value="default" className="bg-gray-800">Rating: Default</option>
            <option value="asc" className="bg-gray-800">Rating: Low to High</option>
            <option value="desc" className="bg-gray-800">Rating: High to Low</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-100">Filter By</h3>
        
        {/* Price Range */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Price Range: <span className="font-bold text-purple-300">{formatINR(filters.price.min)} - {formatINR(filters.price.max)}</span></label>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step="100"
            value={filters.price.max > maxPrice ? maxPrice : filters.price.max}
            onChange={(e) => handleFilterChange('price', { ...filters.price, max: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Minimum Rating</label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button key={star} onClick={() => handleFilterChange('rating', star)} className={`p-1 rounded-full ${filters.rating >= star ? 'bg-yellow-400/30' : ''}`}>
                <StarRating rating={star} />
              </button>
            ))}
             <button onClick={() => handleFilterChange('rating', 0)} className="text-xs text-gray-400 hover:text-white">Clear</button>
          </div>
        </div>

        {/* Brands */}
        {availableFilters.brands.length > 0 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Brands</label>
            <div className="max-h-24 overflow-y-auto space-y-1 pr-2">
              {availableFilters.brands.map(brand => (
                <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleCheckboxChange('brands', brand)}
                    className="w-4 h-4 rounded accent-purple-500 bg-gray-700 border-gray-600"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Stores */}
        {availableFilters.stores.length > 0 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Stores</label>
            <div className="max-h-24 overflow-y-auto space-y-1 pr-2">
              {availableFilters.stores.map(store => (
                <label key={store} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.stores.includes(store)}
                    onChange={() => handleCheckboxChange('stores', store)}
                    className="w-4 h-4 rounded accent-purple-500 bg-gray-700 border-gray-600"
                  />
                  <span>{store}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterControls; 