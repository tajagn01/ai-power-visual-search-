import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FaSearch, FaCamera, FaChevronDown, FaBolt, FaBrain, FaLock, FaArrowRight, FaFilter, FaTimes, FaUser, FaSignOutAlt, FaMicrophone, FaSpinner, FaRobot, FaBars } from 'react-icons/fa';
import NET from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';
import { Popover, Transition } from '@headlessui/react';
import ProductGrid from './ProductGrid';
import Loader from './Loader';
import FilterControls from './FilterControls';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth, useUser, useClerk } from '@clerk/clerk-react';
import MouseFollower from './MouseFollower';
import { useNavigate } from 'react-router-dom';
import { fetchCategoryImage } from '../services/api';

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const vantaRef = useRef(null);
  const vantaEffectRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [priceSort, setPriceSort] = useState('default');
  const [ratingSort, setRatingSort] = useState('default');
  const [filters, setFilters] = useState({
    price: { min: 0, max: 100000 },
    rating: 0,
    brands: [],
    stores: [],
  });

  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const words = ['search', 'match'];
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [typing, setTyping] = useState(true);

  const placeholderExamples = [
    'headphones',
    'wireless mouse',
    'gaming laptop',
    'DSLR camera',
    'Bluetooth speaker',
    'Nike shoes',
  ];
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [placeholderText, setPlaceholderText] = useState('');
  const [typingPlaceholder, setTypingPlaceholder] = useState(true);

  const [compareMode, setCompareMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categoryKeywords = {
    pickUp: ['laptop', 'macbook', 'hp laptop', 'apple macbook'],
    keepShopping: [
      { keyword: "men's wrist watch", label: "Men's wrist watches" },
      { keyword: "men's running shoes", label: "Men's running shoes" },
      { keyword: 'pc headset', label: 'PC headsets' },
      { keyword: 'smart watch', label: 'Smart watches' },
    ],
    deals: ['sneakers', 'adidas shoes', 'blue shoes', 'running shoes'],
  };

  const [categoryImages, setCategoryImages] = useState({ pickUp: [], keepShopping: [], deals: [] });
  const [categoryLoading, setCategoryLoading] = useState(true);

  // Vanta.js initialization
  useEffect(() => {
    vantaEffectRef.current = NET({
      el: vantaRef.current,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 500.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0xffffff,
      backgroundColor: 0x0,
      points: 10.00,
      maxDistance: 2.00,
      spacing: 17.00,
      showLines: true,
      lineColor: 0xffffff,
      lineWidth: 0.5,
      lineOpacity: 0.4,
      pointSize: 3,
      pointOpacity: 0.8,
      vertexColors: false,
    });

    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, []);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsImageUploaded(true);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setImageFile(null);
  };

  const clearImage = () => {
    setImagePreview(null);
    setIsImageUploaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setImageFile(null);
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search is not supported in this browser.');
      return;
    }
    if (!recognitionRef.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }
    setIsListening(true);
    recognitionRef.current.start();
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() && !isImageUploaded) return;

    setLoading(true);
    setProducts([]);

    try {
      let response;
      if (isImageUploaded && imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://ai-power-visual-search.onrender.com'}/api/search/image`, {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://ai-power-visual-search.onrender.com'}/api/search?q=${encodeURIComponent(searchQuery)}`);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle both nested and flat response structures
      const amazonProducts = data.data?.amazon || data.amazon || [3];
      const newApiProducts = data.data?.newApi || data.newApi || [10];

      const combinedProducts = [...amazonProducts, ...newApiProducts];

      setProducts(combinedProducts);

      if (combinedProducts.length > 0) {
        setTimeout(() => scrollToSection('results-section'), 100);
      }

    } catch (error) {
      console.error('Search error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const availableFilters = useMemo(() => {
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
    const stores = [...new Set(products.map(p => p.source).filter(Boolean))];
    const pricesArr = products.map(p => parseFloat(p.price?.toString().replace(/[^\d.]/g, ''))).filter(v => !isNaN(v));
    const prices = pricesArr.length > 0 ? { min: Math.min(...pricesArr), max: Math.max(...pricesArr) } : { min: 0, max: 100000 };
    return { brands, stores, prices };
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let productsToProcess = [...products];

    // Apply filters
    productsToProcess = productsToProcess.filter(p => {
      const price = parseFloat(p.price?.toString().replace(/[^\d.]/g, '')) || 0;
      const rating = parseFloat(p.rating) || 0;

      if (price < filters.price.min || price > filters.price.max) return false;
      if (rating < filters.rating) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
      if (filters.stores.length > 0 && !filters.stores.includes(p.source)) return false;

      return true;
    });

    // Price sort
    if (priceSort !== 'default') {
      productsToProcess.sort((a, b) => {
        const priceA = parseFloat(a.price?.toString().replace(/[^\d.]/g, '')) || 0;
        const priceB = parseFloat(b.price?.toString().replace(/[^\d.]/g, '')) || 0;
        return priceSort === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }

    // Rating sort
    if (ratingSort !== 'default') {
      productsToProcess.sort((a, b) => {
        const ratingA = parseFloat(a.rating) || 0;
        const ratingB = parseFloat(b.rating) || 0;
        return ratingSort === 'desc' ? ratingB - ratingA : ratingA - ratingB;
      });
    }

    return productsToProcess;
  }, [products, filters, priceSort, ratingSort]);

  const recommendedSearches = useMemo(() => {
    if (products.length === 0) return [];
    
    const commonWords = ['for', 'with', 'and', 'the', 'in', 'a', 'of', 'to'];
    const titleWords = products.flatMap(p => (p.title ? p.title.toLowerCase() : '').split(/\s+/));
    
    const wordCounts = titleWords.reduce((acc, word) => {
      if (word.length > 3 && !commonWords.includes(word) && isNaN(word)) {
        acc[word] = (acc[word] || 0) + 1;
      }
      return acc;
    }, {});
    
    return Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);
  }, [products]);

  const handleRecommendedSearch = (term) => {
    setSearchQuery(term);
    // Directly submit the search form
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
      searchForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  useEffect(() => {
    let timeout;
    const currentWord = words[wordIdx];
    if (typing) {
      if (displayed.length < currentWord.length) {
        timeout = setTimeout(() => {
          setDisplayed(currentWord.slice(0, displayed.length + 1));
        }, 120);
      } else {
        timeout = setTimeout(() => setTyping(false), 1200);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(currentWord.slice(0, displayed.length - 1));
        }, 70);
      } else {
        setTyping(true);
        setWordIdx((wordIdx + 1) % words.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, wordIdx]);

  // Typewriter effect for placeholder
  useEffect(() => {
    let timeout;
    const currentWord = placeholderExamples[placeholderIdx];
    if (typingPlaceholder) {
      if (placeholderText.length < currentWord.length) {
        timeout = setTimeout(() => {
          setPlaceholderText(currentWord.slice(0, placeholderText.length + 1));
        }, 90);
      } else {
        timeout = setTimeout(() => setTypingPlaceholder(false), 1200);
      }
    } else {
      if (placeholderText.length > 0) {
        timeout = setTimeout(() => {
          setPlaceholderText(currentWord.slice(0, placeholderText.length - 1));
        }, 50);
      } else {
        setTypingPlaceholder(true);
        setPlaceholderIdx((placeholderIdx + 1) % placeholderExamples.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [placeholderText, typingPlaceholder, placeholderIdx]);

  const handleOpenComparison = () => {
    if (selectedProducts.length >= 2) {
      setShowComparison(true);
    }
  };

  const handleCloseComparison = () => {
    setShowComparison(false);
    setSelectedProducts([]);
    setCompareMode(false); // Exit compare mode after comparison
  };

  const toggleCompareMode = () => {
    setCompareMode((prev) => !prev);
    setSelectedProducts([]); // Clear selection when toggling
    setShowComparison(false); // Always close modal when toggling mode
  };

  useEffect(() => {
    let isMounted = true;
    async function loadImages() {
      setCategoryLoading(true);
      const pickUp = await Promise.all(categoryKeywords.pickUp.map(k => fetchCategoryImage(k)));
      const keepShopping = await Promise.all(categoryKeywords.keepShopping.map(k => fetchCategoryImage(k.keyword)));
      const deals = await Promise.all(categoryKeywords.deals.map(k => fetchCategoryImage(k)));
      if (isMounted) {
        setCategoryImages({ pickUp, keepShopping, deals });
        setCategoryLoading(false);
      }
    }
    loadImages();
    return () => { isMounted = false; };
  }, []);

  return (
    <>
      <MouseFollower />
      {/* Vanta.js Background - Full Page */}
      <div
        ref={vantaRef}
        className="fixed inset-0 w-full h-full overflow-x-hidden"
        style={{ zIndex: 0 }}
      />

      <main className="relative z-10 flex flex-col min-h-screen overflow-x-hidden">
        {/* Navigation Bar */}
        <nav className="top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-600 rounded-lg shadow-lg">
                  <FaSearch className="text-white h-5 w-5" />
                </div>
                <span className="text-2xl font-bold text-white">Searchify</span>
              </div>

              {/* Center nav options */}
              <div className="hidden md:flex items-center gap-8">
                <button onClick={() => scrollToSection('home-section')} className="text-white/80 hover:text-white font-medium transition-colors">Home</button>
                <button onClick={() => scrollToSection('features-section')} className="text-white/80 hover:text-white font-medium transition-colors">Features</button>
                <button onClick={() => scrollToSection('about-section')} className="text-white/80 hover:text-white font-medium transition-colors">About</button>
                <button onClick={() => scrollToSection('contact-section')} className="text-white/80 hover:text-white font-medium transition-colors">Contact</button>
              </div>

              {/* Actions and Hamburger */}
              <div className="flex items-center gap-2">
                {/* Actions (Sign In/Profile) */}
                <div className="flex items-center md:space-x-4">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="hidden md:block bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 hover:scale-105">
                        Sign In
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <div className="relative hidden md:block" ref={userMenuRef}>
                      <button
                        className="flex items-center gap-2 bg-purple-600/30 rounded-full px-4 py-2 text-white font-semibold text-lg backdrop-blur-md border border-purple-400/40 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                        onClick={() => setUserMenuOpen((open) => !open)}
                        aria-haspopup="true"
                        aria-expanded={userMenuOpen}
                        type="button"
                      >
                        Hi! {user?.firstName || user?.username || 'User'}
                        <FaUser className="w-5 h-5 text-purple-200" />
                      </button>
                      {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg py-2 z-50 border border-purple-200/40">
                          <button
                            onClick={() => {
                              openUserProfile();
                              setUserMenuOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-purple-100 rounded-t-xl transition-colors"
                            type="button"
                          >
                            Profile
                          </button>
                          <button
                            onClick={async () => {
                              await signOut();
                              window.location.href = '/';
                            }}
                            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-purple-100 rounded-b-xl transition-colors"
                            type="button"
                          >
                            Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  </SignedIn>
                </div>
                {/* Hamburger menu for mobile */}
                <button
                  className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
                  onClick={() => setMobileMenuOpen((open) => !open)}
                  aria-label="Open menu"
                >
                  {mobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 flex flex-col items-center justify-start pt-24 md:hidden">
            <button
              className="absolute top-6 right-6 text-white text-3xl p-2 rounded-full hover:bg-white/10 focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
            <button onClick={() => { scrollToSection('home-section'); setMobileMenuOpen(false); }} className="text-white text-xl py-3 w-full text-center hover:bg-purple-700 transition">Home</button>
            <button onClick={() => { scrollToSection('features-section'); setMobileMenuOpen(false); }} className="text-white text-xl py-3 w-full text-center hover:bg-purple-700 transition">Features</button>
            <button onClick={() => { scrollToSection('about-section'); setMobileMenuOpen(false); }} className="text-white text-xl py-3 w-full text-center hover:bg-purple-700 transition">About</button>
            <button onClick={() => { scrollToSection('contact-section'); setMobileMenuOpen(false); }} className="text-white text-xl py-3 w-full text-center hover:bg-purple-700 transition">Contact</button>
            <div className="mt-8 w-full flex justify-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 hover:scale-105 text-lg">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        )}

        <div className="flex-grow">
          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center px-6 pt-16">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 md:p-12 max-w-4xl w-full text-center">
              {/* Hero Content */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Find products fast with visual{' '}
                <span
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 min-w-[80px]"
                >
                  {displayed}
                  {displayed.length === words[wordIdx].length && '...'}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Upload your files and search through them with our powerful AI-powered search engine.
                Get results in seconds with lightning-fast performance.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <button
                  onClick={() => navigate('/chat')}
                  className="group bg-purple-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 hover:bg-purple-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/25 flex items-center"
                >
                  <img src="/image/robot_630426.png" alt="Robot" className="inline-block mr-2 h-7 w-7" />
                  Chat with AI
                </button>

                <button
                  onClick={() => scrollToSection('search-section')}
                  className="group border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm flex items-center"
                >
                  <FaSearch className="inline-block mr-2" />
                  Search
                </button>
              </div>

              {/* Scroll Indicator */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={() => scrollToSection('search-section')}
                  className="text-white/70 hover:text-white transition-colors duration-300 animate-bounce"
                  aria-label="Scroll down"
                >
                  <FaChevronDown className="h-6 w-6" />
                </button>
              </div>
            </div>
          </section>

          {/* Search Section */}
          <section id="search-section" className="py-20 px-6 transition-all duration-500">
            <div className="container mx-auto max-w-4xl">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 md:p-12 z-50">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Try Our Search</h2>
                  <p className="text-lg text-gray-300">
                    Use text for keyword search or upload an image to find visually similar products.
                  </p>
                </div>

                {/* Search Form */}
                <form
                  onSubmit={handleSearch}
                  id="search-form"
                  className="max-w-2xl mx-auto relative"
                  role="search"
                  aria-label="Product search"
                >
                  <div
                    className={
                      `relative flex items-center w-full bg-white/10 backdrop-blur-sm rounded-full border-2 border-purple-500/30 focus-within:ring-4 focus-within:ring-purple-400/40 focus-within:border-purple-400 transition-all duration-300 shadow-xl overflow-hidden` +
                      (loading ? ' opacity-80 pointer-events-none' : '')
                    }
                    style={{
                      boxShadow: '0 2px 32px 0 #a78bfa33, 0 1.5px 8px 0 #c026d355',
                      background: 'linear-gradient(90deg, rgba(168,139,250,0.13) 0%, rgba(192,38,211,0.10) 100%)',
                    }}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                      accept="image/*"
                      tabIndex={-1}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                      <FaSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    {isImageUploaded ? (
                      <div className="flex items-center w-full pl-14 pr-24 py-3 relative">
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="upload preview"
                            className="w-10 h-10 rounded-full object-cover border-2 border-purple-400 shadow-md"
                          />
                          <button
                            type="button"
                            onClick={clearImage}
                            className="absolute -top-2 -right-2 p-1 bg-black/70 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                            aria-label="Remove image"
                            style={{ zIndex: 2 }}
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="ml-4 text-gray-300 flex-1">
                          Image selected for search
                        </span>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Search for ${placeholderText}`}
                        className="w-full pl-14 pr-24 py-4 bg-transparent border-none focus:outline-none text-white placeholder-gray-400 text-base md:text-lg"
                        aria-label="Search for products"
                        autoComplete="off"
                        disabled={loading}
                      />
                    )}
                    <div className="absolute right-14 flex items-center">
                      <button
                        type="button"
                        onClick={triggerImageUpload}
                        className="p-3 rounded-full text-gray-400 hover:text-purple-400 hover:bg-purple-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
                        aria-label="Upload image"
                        tabIndex={0}
                      >
                        <FaCamera className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleVoiceSearch}
                        className={`ml-2 p-3 rounded-full ${isListening ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-purple-400 hover:bg-purple-500/20'} transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400`}
                        aria-label="Voice search"
                        title="Voice search"
                        tabIndex={0}
                      >
                        <FaMicrophone className="h-5 w-5" />
                      </button>
                    </div>
                    <button
                      type="submit"
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-3 bg-purple-600 border border-white z-50 rounded-full text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 hover:bg-purple-700 hover:scale-110 active:scale-100 ${loading ? 'animate-spin-slow' : ''}`}
                      aria-label="Search"
                      tabIndex={0}
                      disabled={loading}
                    >
                      {loading ? <FaSpinner className="h-5 w-5 animate-spin" /> : <FaArrowRight className="h-5 w-5" />}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </section>

          {/* Search Results Section */}
          <section id="results-section" className="py-20 px-6 transition-all duration-500">
            <div className="container mx-auto max-w-7xl">
              {loading && <Loader />}
              {!loading && products.length > 0 && (
                <>
                  <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Search Results</h2>
                    <div className="flex items-center gap-4">
                      <button
                        className={`bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-all duration-300 text-sm ${compareMode ? 'ring-2 ring-pink-400' : ''}`}
                        onClick={toggleCompareMode}
                      >
                        {compareMode ? 'Cancel' : 'Compare'}
                      </button>
                      {compareMode && (
                        <button
                          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-all duration-300 text-sm"
                          onClick={handleOpenComparison}
                          disabled={selectedProducts.length < 2}
                        >
                          Compare Selected ({selectedProducts.length})
                        </button>
                      )}
                      <Popover className="relative">
                        <Popover.Button className="neon-button inline-flex items-center gap-x-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-transform active:scale-95">
                          <FaFilter className="h-4 w-4 text-gray-300" />
                          <span>Filter</span>
                        </Popover.Button>
                        <Transition
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="absolute right-0 z-10 mt-3 w-screen max-w-xs transform">
                            <div className="glass-card overflow-hidden rounded-xl">
                              <FilterControls
                                priceSort={priceSort}
                                setPriceSort={setPriceSort}
                                ratingSort={ratingSort}
                                setRatingSort={setRatingSort}
                                filters={filters}
                                setFilters={setFilters}
                                availableFilters={availableFilters}
                              />
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </Popover>
                    </div>
                  </div>
                  <ProductGrid
                    products={filteredAndSortedProducts}
                    compareMode={compareMode}
                    selectedProducts={selectedProducts}
                    setSelectedProducts={setSelectedProducts}
                  />
                  {showComparison && compareMode && selectedProducts.length >= 2 && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                      <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl w-full relative max-h-[80vh] overflow-y-auto">
                        <button
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                          onClick={handleCloseComparison}
                          aria-label="Close"
                        >
                          &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Product Comparison</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto">
                          {selectedProducts.map((product, idx) => (
                            <div key={product.id || idx} className="bg-gray-100 rounded-lg p-4 shadow flex flex-col items-center">
                              <img src={product.thumbnail || product.image || 'https://picsum.photos/200'} alt={product.title} className="w-24 h-24 object-contain mb-2" />
                              <div className="font-semibold text-gray-800 text-center mb-1">{product.title}</div>
                              <div className="text-sm text-gray-500 mb-1">{product.brand || product.source}</div>
                              <div className="text-purple-600 font-bold mb-1">₹{(product.price || '').toString().replace(/[^\d.]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                              <div className="text-xs text-gray-400 text-center line-clamp-2">{product.description}</div>
                              <a href={product.url || product.product_url || product.amazonUrl || '#'} target="_blank" rel="noopener noreferrer" className="mt-2 text-xs text-blue-500 underline">View Product</a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {recommendedSearches.length > 0 && (
                    <div className="mt-12 text-center">
                      <h3 className="text-xl font-semibold text-white mb-4">Recommended for you</h3>
                      <div className="flex flex-wrap justify-center gap-3">
                        {recommendedSearches.map(term => (
                          <button
                            key={term}
                            onClick={() => handleRecommendedSearch(term)}
                            className="bg-gray-800/60 hover:bg-purple-600/50 border border-purple-500/30 text-white font-medium py-2 px-4 rounded-full transition-all duration-300"
                          >
                            {term.charAt(0).toUpperCase() + term.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Features Section */}
          <section id="features-section" className="py-20 px-6">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Search Features</h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Our platform offers advanced search capabilities to help you find exactly what you need.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-purple-500/30 shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 hover:bg-purple-500/10 group relative overflow-hidden">
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/30 to-pink-400/10 blur-2xl opacity-40 pointer-events-none z-0" />
                  <div className="w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6 mx-auto z-10 relative">
                    <FaBolt className="text-purple-400 h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 text-center z-10 relative">Lightning Fast</h3>
                  <p className="text-gray-300 text-center z-10 relative">
                    Get instant search results across all your documents with our optimized search engine.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-purple-500/30 shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 hover:bg-purple-500/10 group relative overflow-hidden">
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/30 to-pink-400/10 blur-2xl opacity-40 pointer-events-none z-0" />
                  <div className="w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6 mx-auto z-10 relative">
                    <FaBrain className="text-purple-400 h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 text-center z-10 relative">AI-Powered</h3>
                  <p className="text-gray-300 text-center z-10 relative">
                    Our AI understands document context and delivers more relevant search results.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-purple-500/30 shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 hover:bg-purple-500/10 group relative overflow-hidden">
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/30 to-pink-400/10 blur-2xl opacity-40 pointer-events-none z-0" />
                  <div className="w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6 mx-auto z-10 relative">
                    <FaLock className="text-purple-400 h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 text-center z-10 relative">Secure & Private</h3>
                  <p className="text-gray-300 text-center z-10 relative">
                    Your documents are encrypted and your searches are private. You own your data.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-6">
            <div className="container mx-auto max-w-4xl text-center">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
                <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of users who are already using our powerful search platform.
                </p>
                <button
                  onClick={() => scrollToSection('search-section')}
                  className="bg-purple-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 hover:bg-purple-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/25"
                >
                  Start Searching Now
                  <FaArrowRight className="inline-block ml-2" />
                </button>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about-section" className="py-20 px-6">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">About Us</h2>
              <p className="text-lg text-gray-300 mb-6">
                Searchify is an AI-powered product search platform designed to help you find the best products quickly and easily. Our mission is to make shopping smarter, faster, and more enjoyable by leveraging advanced AI, visual search, and seamless user experience.
              </p>
              <p className="text-gray-400">
                Built by passionate developers and designers, Searchify combines the latest in AI technology with a beautiful, intuitive interface. We're always working to improve and add new features—thank you for being part of our journey!
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact-section" className="py-20 px-6">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-lg text-gray-300 mb-8">
                Have questions, feedback, or need support? Fill out the form below or reach out to us directly!
              </p>
              <form className="max-w-xl mx-auto flex flex-col gap-4 text-left">
                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-lg bg-black/40 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <input type="email" placeholder="Your Email" className="w-full px-4 py-3 rounded-lg bg-black/40 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <textarea placeholder="Your Message" rows={4} className="w-full px-4 py-3 rounded-lg bg-black/40 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg self-center">Send Message</button>
              </form>
              <div className="mt-8 flex flex-col items-center gap-2">
                <span className="text-gray-400">Or contact us directly:</span>
                <a href="mailto:support@searchify.com" className="text-purple-400 hover:underline text-lg">support@searchify.com</a>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline text-lg">@searchify on Twitter</a>
              </div>
            </div>
          </section>
        </div>


        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/10">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <FaSearch className="text-white h-5 w-5" />
                </div>
                <span className="text-xl font-bold text-white">Searchify</span>
              </div>

              <div className="flex items-center space-x-6 text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} Searchify. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowAuthModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Sign Up or Log In</h2>
            <p className="mb-6 text-gray-700">You must be signed in to use the search feature.</p>
            <SignInButton mode="modal">
              <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 w-full">
                Sign Up / Log In
              </button>
            </SignInButton>
          </div>
        </div>
      )}
    </>
  );
};

export default LandingPage; 
