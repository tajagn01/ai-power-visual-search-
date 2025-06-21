import React, { useState, useCallback, useMemo, Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import ProductGrid from './components/ProductGrid';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { FaBolt, FaBrain, FaLock, FaFilter } from 'react-icons/fa';
import AnimatedBackground from './components/AnimatedBackground';
import FilterControls from './components/FilterControls';
import { Popover, Transition } from '@headlessui/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const SearchifyHome = ({
  handleSearch,
  handleImageSearch,
  loading,
  products,
  priceSort,
  setPriceSort,
  ratingSort,
  setRatingSort,
}) => {
  const totalProducts = products.length;

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Find what you're looking for instantly
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload your files, and search through them with our powerful AI-powered search engine. Get  results in seconds.
          </p>
          <div className="flex justify-center space-x-4">
            <button onClick={() => handleScrollTo('try-search')} className="bg-purple-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-purple-700 transition-all duration-300 text-lg active:scale-95">
              Get Started
            </button>
            <button onClick={() => handleScrollTo('features')} className="bg-white text-gray-800 font-semibold px-8 py-4 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all duration-300 text-lg active:scale-95">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Try Our Search Section */}
      <section id="try-search" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Try Our Search</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Use text for keyword search or upload an image to find visually similar products.
            </p>
          </div>
          <div className="mb-12">
            <SearchBar onSearch={handleSearch} onImageUpload={handleImageSearch} loading={loading} />
          </div>

          {loading && <div className="text-center py-12">{/* Loader */}</div>}

          {!loading && totalProducts > 0 && (
            <div>
              <div className="flex justify-start mb-6">
                <Popover className="relative">
                  <Popover.Button className="inline-flex items-center gap-x-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 transition-transform active:scale-95">
                    <FaFilter className="h-4 w-4 text-gray-500" />
                    <span>Filter</span>
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute left-0 z-10 mt-3 w-screen max-w-xs transform">
                      <div className="overflow-hidden rounded-xl shadow-lg ring-1 ring-black/5">
                        <FilterControls
                          priceSort={priceSort}
                          setPriceSort={setPriceSort}
                          ratingSort={ratingSort}
                          setRatingSort={setRatingSort}
                        />
                      </div>
                    </Popover.Panel>
                  </Transition>
                </Popover>
              </div>
              <ProductGrid products={products} />
            </div>
          )}
          
          {!loading && totalProducts === 0 && <div className="text-center py-16">{/* Empty state */}</div>}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Powerful Search Features</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Our platform offers advanced search capabilities to help you find exactly what you need.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <FaBolt className="text-4xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Get instant search results across all your documents with our optimized search engine.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <FaBrain className="text-4xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">AI-Powered</h3>
              <p className="text-gray-600">Our AI understands documents context and delivers more relevant search results.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <FaLock className="text-4xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your documents are encrypted and your searches are private. You own your data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-600">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to transform your search experience?</h2>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Join thousands of users who save time with our powerful search platform.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 active:scale-95">
              Get Started for Free
            </button>
            <button className="bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg border border-purple-500 hover:bg-purple-800 transition-all duration-300 active:scale-95">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

function App() {
  const [products, setProducts] = useState({ amazon: [], newApi: [] });
  const [loading, setLoading] = useState(false);
  const [priceSort, setPriceSort] = useState('default');
  const [ratingSort, setRatingSort] = useState('default');

  const handleSearch = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/search/text?q=${encodeURIComponent(searchTerm)}&page=1&limit=20`);
      if (!response.ok) throw new Error('Search failed');
      const responseData = await response.json();
      const amazonProducts = responseData.data?.amazon || [];
      const newApiProducts = responseData.data?.newApi || [];
      setProducts({
        amazon: amazonProducts.slice(0, 10),
        newApi: newApiProducts.slice(0, 20)
      });
    } catch (error) {
      console.error('Search error:', error);
      setProducts({ amazon: [], newApi: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleImageSearch = useCallback(async (imageFile) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', imageFile);
    try {
      const response = await fetch(`${API_BASE_URL}/api/search/image`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Image search failed');
      const responseData = await response.json();
      const amazonProducts = responseData.data?.amazon || [];
      const newApiProducts = responseData.data?.newApi || [];
      setProducts({
        amazon: amazonProducts.slice(0, 10),
        newApi: newApiProducts.slice(0, 20)
      });
    } catch (error) {
      console.error('Image search error:', error);
      setProducts({ amazon: [], newApi: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  const sortedProducts = useMemo(() => {
    let productsToSort = [...products.amazon, ...products.newApi];

    productsToSort.sort((a, b) => {
      // Primary sort: price
      if (priceSort !== 'default') {
        const priceA = parseFloat(a.price) || (priceSort === 'asc' ? Infinity : -Infinity);
        const priceB = parseFloat(b.price) || (priceSort === 'asc' ? Infinity : -Infinity);
        if (priceA !== priceB) {
          return priceSort === 'asc' ? priceA - priceB : priceB - priceA;
        }
      }
      
      // Secondary sort: rating
      if (ratingSort !== 'default') {
        const ratingA = parseFloat(a.rating) || 0;
        const ratingB = parseFloat(b.rating) || 0;
        if (ratingA !== ratingB) {
          return ratingSort === 'desc' ? ratingB - ratingA : ratingA - ratingB;
        }
      }
      return 0;
    });

    return productsToSort;
  }, [products, priceSort, ratingSort]);

  return (
    <Router>
      <div className="bg-white relative">
        <AnimatedBackground />
        <div className="relative z-10">
          <Navbar />
          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <SearchifyHome
                    handleSearch={handleSearch}
                    handleImageSearch={handleImageSearch}
                    loading={loading}
                    products={sortedProducts}
                    priceSort={priceSort}
                    setPriceSort={setPriceSort}
                    ratingSort={ratingSort}
                    setRatingSort={setRatingSort}
                  />
                }
              />
              {/* You can add other routes here if needed */}
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App; 