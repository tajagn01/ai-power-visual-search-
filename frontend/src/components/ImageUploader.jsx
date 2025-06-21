import React, { useState, useRef } from 'react';

const ImageUploader = ({ onImageUpload, theme }) => {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      setUploading(true);
      onImageUpload(file).finally(() => {
        setUploading(false);
      });
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const clearImage = () => {
    setImagePreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      
      {!imagePreview ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : theme === 'dark'
              ? 'border-gray-600 bg-gray-700 hover:border-gray-500'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
              theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
            }`}>
              <svg
                className={`w-8 h-8 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            
            <div>
              <p className={`text-lg font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Drop an image here or click to browse
              </p>
              <p className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Supports JPG, PNG, GIF up to 10MB
              </p>
            </div>
            
            <button
              type="button"
              onClick={onButtonClick}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              📁 Choose File
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p>Analyzing image...</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onButtonClick}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-600 hover:bg-gray-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              🔄 Change Image
            </button>
            <button
              type="button"
              onClick={clearImage}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              ❌ Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader; 