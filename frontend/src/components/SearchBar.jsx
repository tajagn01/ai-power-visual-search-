import React, { useState } from 'react'

const SearchBar = ({ onSearch, theme }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          className={`w-full px-4 py-3 pl-12 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
          }`}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className={`h-6 w-6 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
            }`}
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
      </div>
      
      <button
        type="submit"
        className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          theme === 'dark'
            ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
            : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
        }`}
      >
        🔍 Search Products
      </button>
    </form>
  )
}

export default SearchBar 