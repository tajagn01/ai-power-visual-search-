import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageUploader from './components/ImageUploader';
import SearchBar from './components/SearchBar';
import ProductGrid from './components/ProductGrid';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Home = ({ theme, handleSearch, handleImageSearch, loading, products }) => {
  const amazonProducts = products?.amazon || [];
  const newApiProducts = products?.newApi || [];
  const totalProducts = amazonProducts.length + newApiProducts.length;

  return (
    <>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className={`text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          AI Product Finder
        </h1>
        <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Discover products from Amazon and other retailers using AI-powered search
        </p>
      </div>

      {/* Search Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Text Search */}
          <div className={`p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              🔍 Text Search
            </h2>
            <SearchBar onSearch={handleSearch} theme={theme} />
          </div>

          {/* Image Search */}
          <div className={`p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              📸 Image Search
            </h2>
            <ImageUploader onImageUpload={handleImageSearch} theme={theme} />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <Loader theme={theme} />
          <p className={`mt-4 text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Searching for products...
          </p>
        </div>
      )}

      {/* Results Section */}
      {!loading && totalProducts > 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="space-y-12">
            {/* Amazon Products */}
            {amazonProducts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    🛒 Amazon Products ({amazonProducts.length})
                  </h2>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
                  }`}>
                    Prime Ready
                  </div>
                </div>
                <ProductGrid products={amazonProducts} theme={theme} />
              </div>
            )}

            {/* Other Sites Products */}
            {newApiProducts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    🌐 Other Sites ({newApiProducts.length})
                  </h2>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    Multi-Store
                  </div>
                </div>
                <ProductGrid products={newApiProducts} theme={theme} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && totalProducts === 0 && (
        <div className="text-center py-16">
          <div className={`text-6xl mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`}>
            🔍
          </div>
          <h3 className={`text-2xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Ready to discover products?
          </h3>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Use the search bar above or upload an image to get started
          </p>
        </div>
      )}
    </>
  );
};

const Features = ({ theme }) => (
  <div className="text-center py-16">
    <h1 className={`text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Features</h1>
    <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
      Our product finder is packed with amazing features.
    </p>
  </div>
);

const About = ({ theme }) => (
  <div className="text-center py-16">
    <h1 className={`text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>About Us</h1>
    <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
      We are a team dedicated to helping you find the best products online.
    </p>
  </div>
);

function App() {
  const [products, setProducts] = useState({ amazon: [], newApi: [] });
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('light');

  const handleSearch = useCallback(async (searchTerm) => {
    setLoading(true);
    console.log('🔍 Starting text search for:', searchTerm);
    try {
      const response = await fetch(`http://localhost:5000/api/search/text?q=${encodeURIComponent(searchTerm)}&page=1&limit=20`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const responseData = await response.json();
      console.log('📦 Received response from backend:', responseData);
      
      // Extract products from the nested data structure
      const data = responseData.data || responseData;
      console.log('📦 Extracted data:', data);
      console.log('📊 Amazon products count:', data?.amazon?.length || 0);
      console.log('📊 New API products count:', data?.newApi?.length || 0);
      
      // Limit to 10 products from Amazon and 20 from other sites
      const limitedData = {
        amazon: (data?.amazon || []).slice(0, 10),
        newApi: (data?.newApi || []).slice(0, 20)
      };
      
      setProducts(limitedData);
    } catch (error) {
      console.error('❌ Search error:', error);
      setProducts({ amazon: [], newApi: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleImageSearch = useCallback(async (imageFile) => {
    setLoading(true);
    console.log('📸 Starting image search for:', imageFile.name);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch('http://localhost:5000/api/search/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Image search failed');
      }

      const responseData = await response.json();
      console.log('📦 Received response from backend:', responseData);
      
      // Extract products from the nested data structure
      const data = responseData.data || responseData;
      console.log('📦 Extracted data:', data);
      console.log('📊 Amazon products count:', data?.amazon?.length || 0);
      console.log('📊 New API products count:', data?.newApi?.length || 0);
      
      // Limit to 10 products from Amazon and 20 from other sites
      const limitedData = {
        amazon: (data?.amazon || []).slice(0, 10),
        newApi: (data?.newApi || []).slice(0, 20)
      };
      
      setProducts(limitedData);
    } catch (error) {
      console.error('❌ Image search error:', error);
      setProducts({ amazon: [], newApi: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const totalProducts = products?.amazon.length + products?.newApi.length || 0;

  return (
    <Router>
      <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        
        <main className="container mx-auto px-6 sm:px-8 lg:px-12 py-8">
          <Routes>
            <Route path="/" element={
              <Home 
                theme={theme}
                handleSearch={handleSearch}
                handleImageSearch={handleImageSearch}
                loading={loading}
                products={products}
              />
            }/>
            <Route path="/features" element={<Features theme={theme} />} />
            <Route path="/about" element={<About theme={theme} />} />
          </Routes>
        </main>

        <Footer theme={theme} />
      </div>
    </Router>
  );
}

export default App; 