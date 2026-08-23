import React, { useState } from 'react';
import { Menu, X, Search, ArrowRight } from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PL</span>
            </div>
            <span className="font-bold text-sm text-slate-900 hidden sm:inline">
              PRICE<span className="text-blue-600">LENS</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#compare" className="text-sm text-slate-600 hover:text-slate-900 transition">Compare</a>
            <a href="#history" className="text-sm text-slate-600 hover:text-slate-900 transition">Price History</a>
            <a href="#deals" className="text-sm text-slate-600 hover:text-slate-900 transition">Deals</a>
            <a href="#how" className="text-sm text-slate-600 hover:text-slate-900 transition">How It Works</a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="px-4 py-2 text-sm text-slate-700 hover:text-slate-900 transition">
              Sign In
            </button>
            <button className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition font-medium">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-3">
            <a href="#compare" className="block px-4 py-2 text-sm text-slate-600 hover:bg-gray-50 rounded-lg">Compare</a>
            <a href="#history" className="block px-4 py-2 text-sm text-slate-600 hover:bg-gray-50 rounded-lg">Price History</a>
            <a href="#deals" className="block px-4 py-2 text-sm text-slate-600 hover:bg-gray-50 rounded-lg">Deals</a>
            <a href="#how" className="block px-4 py-2 text-sm text-slate-600 hover:bg-gray-50 rounded-lg">How It Works</a>
            <div className="flex gap-2 px-4 pt-4">
              <button className="flex-1 px-4 py-2 text-sm text-slate-700 border border-slate-300 rounded-lg hover:bg-gray-50 transition">
                Sign In
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition font-medium">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
