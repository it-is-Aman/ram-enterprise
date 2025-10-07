import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-red-600">
              Rudra Exports
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-red-600 transition-colors">
              Introduction
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-red-600 transition-colors">
              Products & Services
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-red-600 transition-colors">
              Contact Us
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="text-gray-700 hover:text-red-600 transition-colors"
            >
              Cart
            </Link>
            <Link
              to="/admin"
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
