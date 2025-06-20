import React from 'react'

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-2xl flex flex-col items-center justify-center">
      {/* Spinner */}
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-primary-400 rounded-full animate-pulse"></div>
      </div>
      
      {/* Loading Text */}
      <p className="mt-4 text-lg font-medium text-secondary-700">{text}</p>
      
      {/* Dots Animation */}
      <div className="flex space-x-1 mt-2">
        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  )
}

export default Loader 