import React from 'react'

const Loader = () => {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative">
        {/* Main spinner */}
        <div className="w-16 h-16 border-4 rounded-full animate-spin border-purple-500/30 border-t-purple-500"></div>
        
        {/* Inner pulse */}
        <div className="absolute inset-0 w-16 h-16 border-2 rounded-full animate-ping border-purple-400/50"></div>

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-purple-400 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.75V6.25M17.25 6.75L16.066 7.934M19.25 12L17.75 12M17.25 17.25L16.066 16.066M12 17.75V19.25M7.934 16.066L6.75 17.25M4.75 12L6.25 12M7.934 7.934L6.75 6.75"></path>
            </svg>
        </div>
      </div>
    </div>
  )
}

export default Loader 