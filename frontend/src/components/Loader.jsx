import React from 'react'

const Loader = ({ theme = 'light' }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Main spinner */}
        <div className={`w-12 h-12 border-4 rounded-full animate-spin ${
          theme === 'dark' 
            ? 'border-gray-600 border-t-blue-500' 
            : 'border-gray-300 border-t-blue-600'
        }`}></div>
        
        {/* Inner pulse */}
        <div className={`absolute inset-0 w-12 h-12 border-2 rounded-full animate-ping ${
          theme === 'dark' 
            ? 'border-blue-400' 
            : 'border-blue-500'
        }`}></div>
      </div>
    </div>
  )
}

export default Loader 