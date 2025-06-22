import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaSearch, FaCamera, FaChevronDown, FaBolt, FaBrain, FaLock, FaArrowRight } from 'react-icons/fa';
import NET from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const vantaRef = useRef(null);
  const vantaEffectRef = useRef(null);

  // Vanta.js initialization
  useEffect(() => {
    vantaEffectRef.current = NET({
      el: vantaRef.current,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0xffffff,
      backgroundColor: 0x0,
      points: 4.00,
      maxDistance: 2.00,
      spacing: 17.00,
      showLines: true,
      lineColor: 0xffffff,
      lineWidth: 0.5,
      lineOpacity: 0.4,
      pointSize: 3,
      pointOpacity: 0.8,
    });

    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, []);

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
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setImagePreview(null);
    setIsImageUploaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() || isImageUploaded) {
      console.log('Searching for:', searchQuery);
      // Add your search logic here
    }
  };

  return (
    <>
      {/* Vanta.js Background - Full Page */}
      <div 
        ref={vantaRef} 
        className="fixed inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />
      
      <main className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-600 rounded-lg shadow-lg">
                  <FaSearch className="text-white h-5 w-5" />
                </div>
                <span className="text-2xl font-bold text-white">Searchify</span>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 hover:scale-105">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex-grow">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-6 pt-16">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 md:p-12 max-w-4xl w-full text-center">
                {/* Hero Content */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Find what you're looking for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    instantly
                </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Upload your files and search through them with our powerful AI-powered search engine. 
                Get results in seconds with lightning-fast performance.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <button 
                    onClick={() => scrollToSection('search-section')}
                    className="group bg-purple-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 hover:bg-purple-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/25"
                >
                    Get Started
                    <FaArrowRight className="inline-block ml-2 transition-transform group-hover:translate-x-1" />
                </button>
                
                <button 
                    onClick={() => scrollToSection('features-section')}
                    className="group border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm"
                >
                    Learn More
                    <FaArrowRight className="inline-block ml-2 transition-transform group-hover:translate-x-1" />
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
            <section id="search-section" className="py-20 px-6">
            <div className="container mx-auto max-w-4xl">
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 md:p-12">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Try Our Search</h2>
                    <p className="text-lg text-gray-300">
                    Use text for keyword search or upload an image to find visually similar products.
                    </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                    <div className="relative flex items-center w-full bg-white/10 backdrop-blur-sm rounded-full border-2 border-purple-500/30 focus-within:ring-2 focus-within:ring-purple-400 focus-within:border-purple-400 transition-all">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                    />
                    
                    {isImageUploaded ? (
                        <div className="flex items-center w-full pl-4 pr-4 py-3">
                        <div className="relative">
                            <img src={imagePreview} alt="upload preview" className="w-10 h-10 rounded-full object-cover" />
                        </div>
                        <span className="ml-4 text-gray-300 flex-1">Image selected for search</span>
                        <button
                            type="button"
                            onClick={clearImage}
                            className="p-2 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                            ✕
                        </button>
                        </div>
                    ) : (
                        <>
                        <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                            <FaSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search with text or upload an image..."
                            className="w-full pl-14 pr-28 py-4 bg-transparent border-none focus:outline-none text-white placeholder-gray-400"
                        />
                        <div className="absolute right-2 flex items-center space-x-2">
                            <button
                            type="button"
                            onClick={triggerImageUpload}
                            className="p-2 rounded-full text-gray-400 hover:text-purple-400 hover:bg-purple-500/20 transition-colors"
                            aria-label="Upload image"
                            >
                            <FaCamera className="h-5 w-5" />
                            </button>
                            <button
                            type="submit"
                            className="p-2 rounded-full text-gray-400 hover:text-purple-400 hover:bg-purple-500/20 transition-colors"
                            aria-label="Search"
                            >
                            <FaSearch className="h-5 w-5" />
                            </button>
                        </div>
                        </>
                    )}
                    </div>
                </form>
                </div>
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
                <div className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6 mx-auto">
                    <FaBolt className="text-purple-400 h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4 text-center">Lightning Fast</h3>
                    <p className="text-gray-300 text-center">
                    Get instant search results across all your documents with our optimized search engine.
                    </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6 mx-auto">
                    <FaBrain className="text-purple-400 h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4 text-center">AI-Powered</h3>
                    <p className="text-gray-300 text-center">
                    Our AI understands document context and delivers more relevant search results.
                    </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6 mx-auto">
                    <FaLock className="text-purple-400 h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4 text-center">Secure & Private</h3>
                    <p className="text-gray-300 text-center">
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
    </>
  );
};

export default LandingPage; 