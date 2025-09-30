import React from 'react';
import { Menu, Search, ShoppingCart, Phone, Mail, CheckCircle } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-[var(--cream)] shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-2">
        {/* Left: Logo and Company Info */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <img src="/logo.png" alt="Rudra Exports Logo" className="h-16 w-16 object-contain" />
          {/* Company Info */}
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-[var(--text-dark)]">Rudra Exports</span>
            <span className="text-sm text-[var(--text-light)]">Faridabad, Haryana</span>
            <div className="flex items-center gap-2 mt-1">
              {/* GST */}
              <span className="flex items-center gap-1 text-sm text-[var(--text-dark)]">
                <CheckCircle className="text-green-600 h-4 w-4" /> GST No. <span className="font-bold">06CFOPR0073R1ZO</span>
              </span>
              <span className="text-[var(--text-light)]">|</span>
              {/* TrustSEAL */}
              <span className="flex items-center gap-1 text-sm text-[var(--text-dark)]">
                <CheckCircle className="text-yellow-400 h-4 w-4" /> TrustSEAL <span className="font-bold">Verified</span>
              </span>
            </div>
          </div>
        </div>
        {/* Right: Call and Email Buttons */}
        <div className="flex items-center gap-4">
          {/* Call Button */}
          <button className="flex items-center gap-2 bg-[var(--text-dark)] text-white rounded-full px-5 py-2 shadow hover:bg-[var(--primary-rose)] transition-colors">
            <Phone className="h-5 w-5" />
            <span className="font-semibold">Call 07942550832</span>
            <span className="text-xs ml-2">84% Response Rate</span>
          </button>
          {/* Email Button */}
          <button className="flex items-center gap-2 bg-[#B83218] text-white rounded-full px-5 py-2 shadow hover:bg-[var(--primary-rose)] transition-colors">
            <Mail className="h-5 w-5" />
            <span className="font-semibold">SEND EMAIL</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
