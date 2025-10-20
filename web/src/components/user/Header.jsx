import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 z-50 ${scrolled ? "bg-[#e43d12]" : "bg-[#ebe9e1]"} transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===== Main Navbar ===== */}
        <div className="flex justify-between items-center h-16 relative">
          {/* Left: Logo & Company Name */}
          <div className="flex items-center gap-3">
            <motion.img
              whileHover={{ scale: 1.1, rotate: 3 }}
              transition={{ type: "spring", stiffness: 250 }}
              src="/models/RH_logo-removebg-preview.png"
              alt="Rudra Exports Logo"
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-full border-2 border-[#e43d12] bg-white shadow-sm"
            />
            <Link
              to="/"
              className={`text-xl sm:text-2xl font-bold ${scrolled ? "text-[#ebe9e1]" : "text-[#e43d12]"} hover:text-[#f4a261] transition-colors duration-300 font-gt-america-cn-md`}
            >
              Ramhari Enterprises
            </Link>
          </div>

          {/* Center: Nav Links (Desktop Only) */}
        <nav className="hidden md:flex space-x-8">
  {[
    { label: "Products & Services", path: "/products" },
    { label: "About Us", path: "/aboutus" },
  ].map((item, i) => (
    <motion.div
      key={i}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <Link
        to={item.path}
        className={`font-bold italic ${
          scrolled ? "text-[#ebe9e1]" : "text-[#e43d12]"
        } hover:text-[#f4a261] transition-all duration-300 font-gt-america-cn-md`}
      >
        {item.label}
      </Link>
    </motion.div>
  ))}
</nav>


          {/* Right: Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/cart"
                className={`text-${scrolled ? "#ebe9e1" : "#e43d12"} hover:text-[#f4a261] transition-all duration-300 font-semibold font-gt-america-cn-md`}
              >
                Cart
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link
                to="/admin"
                className={`bg-${scrolled ? "#ebe9e1" : "#f4a261"} text-${scrolled ? "#e43d12" : "#476EAE"} px-4 py-2 rounded-full shadow-md hover:bg-white transition-all duration-300 font-semibold font-gt-america-cn-md`}
              >
                Admin
              </Link>
            </motion.div>
          </div>

          {/* ===== Mobile Menu Button ===== */}
          <button
            className="md:hidden text-[#e43d12] focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* ===== Mobile Dropdown Menu ===== */}
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 left-0 w-full bg-[#ebe9e1] text-[#e43d12] flex flex-col space-y-4 p-4 rounded-b-lg shadow-lg z-50 md:hidden"
            >
              {["Products & Services", "About Us"].map((label, i) => {
                const path = `/${label.toLowerCase().replace(/ & /g, "-").replace(/ /g, "")}`;
                return (
                  <Link
                    key={i}
                    to={path}
                    onClick={() => setMenuOpen(false)}
                    className="font-bold italic hover:text-[#f4a261] transition-colors text-base font-gt-america-cn-md"
                  >
                    {label}
                  </Link>
                );
              })}
              <hr className="border-[#e43d12]/50" />
              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="hover:text-[#f4a261] font-medium font-gt-america-cn-md"
              >
                Cart
              </Link>
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="bg-[#f4a261] text-[#e43d12] text-center py-2 rounded-full font-semibold hover:bg-white font-gt-america-cn-md"
              >
                Admin
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;