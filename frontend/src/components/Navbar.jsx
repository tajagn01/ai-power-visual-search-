import React from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { FaSearch } from 'react-icons/fa';

const Navbar = () => {
  return (
    <header className="bg-black/50 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-purple-600 rounded-lg">
              <FaSearch className="text-white h-5 w-5" />
            </div>
            <span className="text-2xl font-bold text-gray-100">Searchify</span>
          </Link>

          {/* Auth controls */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              <div className="flex items-center space-x-2">
                <button className="text-gray-300 hover:text-purple-400 font-semibold transition">
                  Sign in
                </button>
                <button className="neon-button font-semibold px-4 py-2 rounded-lg">
                  Get Started
                </button>
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 