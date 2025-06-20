import React, { useRef, useState } from 'react'

const ImageUploader = ({ onImageUpload, onImagePreview, imagePreview, disabled = false }) => {
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')

  const validateFile = (file) => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Please upload only JPG or PNG files')
    }

    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB')
    }

    return true
  }

  const handleFile = (file) => {
    try {
      setError('')
      validateFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        onImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
      
      // Upload file
      onImageUpload(file)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const removeImage = () => {
    onImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-secondary-300 hover:border-primary-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!disabled ? handleButtonClick : undefined}
      >
        {/* Upload Icon */}
        <div className="mb-4">
          <svg
            className={`mx-auto h-12 w-12 ${
              dragActive ? 'text-primary-500' : 'text-secondary-400'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        {/* Upload Text */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-secondary-900">
            {dragActive ? 'Drop your image here' : 'Upload an image to search'}
          </p>
          <p className="text-sm text-secondary-500">
            Drag and drop your image here, or{' '}
            <span className="text-primary-600 font-medium">click to browse</span>
          </p>
          <p className="text-xs text-secondary-400">
            Supports JPG, PNG files up to 5MB
          </p>
        </div>
      </div>

      {/* Upload Button */}
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={disabled}
          className="bg-primary-500 hover:bg-primary-600 disabled:bg-secondary-300 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          Choose Image
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Image Preview */}
      {imagePreview && (
        <div className="mt-6">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full h-48 object-cover rounded-lg shadow-md"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-colors duration-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-sm text-secondary-600 text-center">
            Image uploaded successfully! Searching for similar products...
          </p>
        </div>
      )}
    </div>
  )
}

export default ImageUploader 