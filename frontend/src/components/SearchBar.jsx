import React, { useState, useRef } from 'react';
import { FaSearch, FaCamera, FaTimes } from 'react-icons/fa';

const SearchBar = ({ onSearch, onImageUpload, loading }) => {
  const [query, setQuery] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);
  
  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !imagePreview) {
      onSearch(query.trim());
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      onImageUpload(file);
    }
  };

  const triggerImageUpload = () => {
    imageInputRef.current.click();
  };
  
  const clearImage = () => {
    setImagePreview(null);
    if(imageInputRef.current) {
        imageInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleTextSubmit} className="max-w-2xl mx-auto">
      <div className="relative flex items-center w-full glass-card rounded-full border-2 border-purple-500/30 focus-within:ring-2 focus-within:ring-purple-400 focus-within:border-purple-400 transition-all text-lg">
        <input
          type="file"
          ref={imageInputRef}
          onChange={handleImageChange}
          className="hidden"
          accept="image/*"
        />
        
        {imagePreview ? (
          <div className="flex items-center w-full pl-2 pr-2 py-2">
            <div className="relative">
                <img src={imagePreview} alt="upload preview" className="w-12 h-12 rounded-full object-cover" />
                {loading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                )}
            </div>
            <span className="ml-4 text-base truncate text-gray-300">Image selected for search</span>
            <button
                type="button"
                onClick={clearImage}
                className="ml-auto p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-100 transition-colors"
                aria-label="Clear image"
            >
                <FaTimes className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search with text or upload an image..."
              className="w-full pl-5 pr-28 py-3.5 bg-transparent border-none focus:outline-none text-base text-gray-100 placeholder-gray-400"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                type="button"
                onClick={triggerImageUpload}
                className="p-2 rounded-full text-gray-400 hover:text-purple-400 hover:bg-purple-500/20 transition-colors"
                aria-label="Upload an image"
              >
                <FaCamera className="w-5 h-5" />
              </button>
              <button
                type="submit"
                className="ml-2 p-2 rounded-full text-gray-400 hover:text-purple-400 hover:bg-purple-500/20 transition-colors"
                aria-label="Search with text"
              >
                <FaSearch className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  );
};

export default SearchBar; 