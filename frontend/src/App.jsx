import React, { useState } from 'react'
import SearchBar from './components/SearchBar'
import ImageUploader from './components/ImageUploader'
import ProductGrid from './components/ProductGrid'
import Loader from './components/Loader'
import { searchByText, searchByImage } from './services/api'

function App() {
  const [searchMode, setSearchMode] = useState('text') // 'text' or 'image'
  const [searchQuery, setSearchQuery] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [products, setProducts] = useState({ amazon: [], newApi: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)

  const handleTextSearch = async (query) => {
    if (!query.trim()) return
    
    setLoading(true)
    setError(null)
    setSearchQuery(query)
    setImagePreview(null) // Clear image preview when doing text search
    setPage(1)
    
    try {
      const results = await searchByText(query, 1)
      setProducts(results)
    } catch (err) {
      setError(err.message || 'Failed to search products')
      setProducts({ amazon: [], newApi: [] })
    } finally {
      setLoading(false)
    }
  }

  const handleImageSearch = async (file) => {
    setLoading(true)
    setError(null)
    setSearchQuery('')
    setPage(1)
    
    try {
      const results = await searchByImage(file)
      setProducts(results)
    } catch (err) {
      setError(err.message || 'Image upload failed - try again')
      setProducts({ amazon: [], newApi: [] })
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = async () => {
    if (loading || !searchQuery) return
    
    setLoading(true)
    const nextPage = page + 1
    
    try {
      const newResults = await searchByText(searchQuery, nextPage)
      setProducts(prev => ({
        amazon: [...prev.amazon, ...newResults.amazon],
        newApi: [...prev.newApi, ...newResults.newApi]
      }))
      setPage(nextPage)
    } catch (err) {
      setError(err.message || 'Failed to load more products')
    } finally {
      setLoading(false)
    }
  }

  const handleImagePreview = (preview) => {
    setImagePreview(preview)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-800 mb-2">
            Product Search
          </h1>
          <p className="text-secondary-600">
            Search for products by text or upload an image
          </p>
        </div>

        {/* Search Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setSearchMode('text')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                searchMode === 'text'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-secondary-600 hover:text-primary-600'
              }`}
            >
              Text Search
            </button>
            <button
              onClick={() => setSearchMode('image')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                searchMode === 'image'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-secondary-600 hover:text-primary-600'
              }`}
            >
              Image Search
            </button>
          </div>
        </div>

        {/* Search Interface */}
        <div className="max-w-4xl mx-auto mb-8">
          {searchMode === 'text' ? (
            <SearchBar onSearch={handleTextSearch} disabled={loading} />
          ) : (
            <ImageUploader 
              onImageUpload={handleImageSearch}
              onImagePreview={handleImagePreview}
              imagePreview={imagePreview}
              disabled={loading}
            />
          )}
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Loader />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {(products.amazon.length > 0 || products.newApi.length > 0) && (
          <div className="max-w-7xl mx-auto">
            {products.amazon.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Amazon Products ({products.amazon.length})</h2>
                <ProductGrid products={products.amazon} />
              </div>
            )}
            {products.newApi.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Other Sites ({products.newApi.length})</h2>
                <ProductGrid products={products.newApi} />
              </div>
            )}
            {searchMode === 'text' && searchQuery && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  {loading ? 'Loading...' : 'Load More Products'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && products.amazon.length === 0 && products.newApi.length === 0 && (searchQuery || imagePreview) && (
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <svg className="mx-auto h-12 w-12 text-secondary-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                No products found
              </h3>
              <p className="text-secondary-600">
                Try adjusting your search terms or upload a different image.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App 