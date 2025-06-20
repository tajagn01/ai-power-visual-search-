import React, { useState } from 'react'

const SearchBar = ({ onSearch, disabled = false }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim() && !disabled) {
      onSearch(query.trim())
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for products..."
            disabled={disabled}
            className="w-full px-4 py-4 pl-12 pr-20 text-lg border-2 border-secondary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-200 disabled:bg-secondary-100 disabled:cursor-not-allowed shadow-sm"
          />
          
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <svg 
              className="h-6 w-6 text-secondary-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          
          {/* Search Button */}
          <button
            type="submit"
            disabled={disabled || !query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-500 hover:bg-primary-600 disabled:bg-secondary-300 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            Search
          </button>
        </div>
      </form>
      
      {/* Search Tips */}
      <div className="mt-4 text-center">
        <p className="text-sm text-secondary-500">
          Try searching for: headphones, phone, laptop, camera, or any product you're looking for
        </p>
      </div>
    </div>
  )
}

export default SearchBar 