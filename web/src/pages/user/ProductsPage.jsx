import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useViewportScroll,
} from "framer-motion";
import { productsAPI, categoriesAPI } from "../../services";
import { useDebounce } from "../../hooks/useDebounce";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get("minPrice") || "",
    max: searchParams.get("maxPrice") || "",
  });
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "createdAt");
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page")) || 1);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // =========================
  // FLOATING + SCROLL ANIMATION
  // =========================
  const { scrollY } = useViewportScroll();
  const floatY = useMotionValue(0);
  const smoothY = useSpring(floatY, { stiffness: 60, damping: 20 });
  const smoothScale = useSpring(1, { stiffness: 40, damping: 15 });
  const smoothOpacity = useSpring(1, { stiffness: 40, damping: 15 });
  const scrollTranslate = useTransform(scrollY, [0, 500], [0, -150]); // scroll-based move

  useEffect(() => {
    const interval = setInterval(() => {
      floatY.set(Math.sin(Date.now() / 1000) * 10);
      smoothScale.set(1 + Math.sin(Date.now() / 2000) * 0.02);
      smoothOpacity.set(0.95 + Math.sin(Date.now() / 2500) * 0.05);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        setCategories(response.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 12,
          ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
          ...(selectedCategory && { category: selectedCategory }),
          ...(priceRange.min && { minPrice: priceRange.min }),
          ...(priceRange.max && { maxPrice: priceRange.max }),
          sortBy: sortBy.split("-")[0],
          sortOrder: sortBy.split("-")[1] || "desc",
        };
        const response = await productsAPI.getAll(params);
        setProducts(response.data || []);
        setTotalPages(response.pagination?.totalPages || 1);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, debouncedSearchTerm, selectedCategory, priceRange, sortBy]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
    if (selectedCategory) params.set("category", selectedCategory);
    if (priceRange.min) params.set("minPrice", priceRange.min);
    if (priceRange.max) params.set("maxPrice", priceRange.max);
    if (sortBy !== "createdAt") params.set("sort", sortBy);
    if (currentPage !== 1) params.set("page", currentPage.toString());
    setSearchParams(params);
  }, [debouncedSearchTerm, selectedCategory, priceRange, sortBy, currentPage, setSearchParams]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setSortBy("createdAt");
    setCurrentPage(1);
  };

  // Product Card
  const renderProductCard = (product) => {
    const discountedPrice = product.price * (1 - product.discount / 100);
    return (
      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          to={`/product/${product.id}`}
          className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
        >
          <div className="aspect-square bg-[#ebe9e1] overflow-hidden relative">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
              </div>
            )}

            {product.discount > 0 && (
              <div className="absolute top-3 left-3 bg-[#e43d12] text-white px-2 py-1 rounded-full text-sm font-bold">
                {product.discount}% OFF
              </div>
            )}
          </div>

          <div className="p-5">
            <span className="text-xs text-[#e43d12] font-semibold uppercase">
              {product.category?.name}
            </span>
            <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-[#e43d12] transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center space-x-2 mb-3">
              <span className="text-xl font-bold text-[#e43d12]">
                ₹{discountedPrice.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
              {product.material && (
                <span className="bg-[#ebe9e1] px-2 py-1 rounded text-xs">
                  {product.material}
                </span>
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#ebe9e1]"
    >
      {/* =======================
           HEADER SECTION
      ======================= */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden bg-[#ebe9e1]">
        {/* Expanding Circle Ripple */}
        <motion.div
          id="circleAnimation"
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 0, opacity: 0 }}
        >
          <motion.div
            className="bg-[#e43d12] rounded-full"
            style={{ width: 180, height: 180 }}
            animate={{
              scale: [0, 1.5, 3],
              opacity: [0.5, 0.3, 0],
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Floating Bottle Image */}
        <motion.img
          src="/models/wisky.png"
          alt="Bottle"
          className="absolute w-[35%] md:w-[30%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{
            y: useTransform([smoothY, scrollTranslate], (y, s) => y + s),
            scale: smoothScale,
            opacity: smoothOpacity,
            rotate: useTransform(scrollY, [0, 1000], [0, 15]),
          }}
          onClick={() => {
            const circle = document.getElementById("circleAnimation");
            if (circle) {
              circle.animate(
                [
                  { transform: "scale(0)", opacity: 0 },
                  { transform: "scale(1.5)", opacity: 0.3 },
                  { transform: "scale(3)", opacity: 0 },
                ],
                { duration: 1000, easing: "ease-in-out" }
              );
            }
            const section = document.getElementById("productGrid");
            if (section) section.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* Animated Text */}
        <motion.h1
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-[10rem] md:text-[20rem] font-bold italic text-[#e43d12] z-20 pointer-events-none"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          PRODUCT
        </motion.h1>

        <motion.h2
          className="absolute top-[65%] left-1/2 transform -translate-x-1/2 text-[3rem] md:text-[9rem] font-semibold text-[#e43d12] z-20 pointer-events-none"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        >
          COLLECTION
        </motion.h2>
      </div>

      {/* =======================
           PRODUCT SECTION
      ======================= */}
      <div
        id="productGrid"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
            <p className="text-gray-600 mt-2">
              Explore our exclusive handcrafted collection
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <FunnelIcon className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`lg:w-80 space-y-6 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-[#e43d12] mb-6">
                Filters
              </h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e43d12] focus:border-[#e43d12]"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e43d12] focus:border-[#e43d12]"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e43d12] focus:border-[#e43d12]"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e43d12] focus:border-[#e43d12]"
                  />
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="w-full bg-[#ebe9e1] text-gray-800 py-2 px-4 rounded-lg hover:bg-[#e43d12] hover:text-white transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
                  >
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              >
                {products.map(renderProductCard)}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-white rounded-full mx-auto mb-6 flex items-center justify-center">
                  <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-[#e43d12] text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductsPage;
