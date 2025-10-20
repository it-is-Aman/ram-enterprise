import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const ProductShowcase = ({
  currentProduct,
  currentImages,
  imageIndex,
  setImageIndex,
  nextImage,
  prevImage,
}) => {
  const navigate = useNavigate();

  const goToProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (!currentProduct) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <p className="text-gray-500">No featured products available</p>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Product Image */}
      <div className="relative h-96 md:h-[28rem] bg-gray-100">
        <AnimatePresence mode="wait">
          {currentImages.length > 0 ? (
            <motion.img
              key={currentImages[imageIndex]?.url}
              src={currentImages[imageIndex]?.url}
              alt={currentImages[imageIndex]?.alt || currentProduct.name}
              className="w-full h-full object-contain"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              onError={(e) => {
                e.target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE4NVYxNzVIMTc1VjEyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIxNSAxMjVIMjI1VjE3NUgyMTVWMTI1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4=";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                <p>No Image Available</p>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Navigation Arrows */}
        {currentImages.length > 1 && (
          <>
            <motion.button
              onClick={prevImage}
              whileHover={{ scale: 1.2 }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#e43d12]/70 text-white p-2 rounded-full hover:bg-[#e43d12]/90 transition-all"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </motion.button>
            <motion.button
              onClick={nextImage}
              whileHover={{ scale: 1.2 }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#e43d12]/70 text-white p-2 rounded-full hover:bg-[#e43d12]/90 transition-all"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </motion.button>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {currentImages.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setImageIndex(idx)}
                  className={`w-3 h-3 rounded-full ${
                    idx === imageIndex ? "bg-[#e43d12]" : "bg-[#e43d12]/50"
                  }`}
                  whileHover={{ scale: 1.3 }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6 md:p-8 lg:p-12">
        <motion.h1
          className="text-2xl md:text-3xl font-bold text-[#e43d12] mb-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {currentProduct.name}
        </motion.h1>

        <motion.p
          className="text-gray-600 mb-4 line-clamp-3"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {currentProduct.description}
        </motion.p>

        {/* Price */}
        <motion.div
          className="flex flex-wrap items-center space-x-3 mb-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="text-3xl font-bold text-[#e43d12]">
            ₹{(currentProduct.price * (1 - currentProduct.discount / 100)).toFixed(2)}
          </span>
          {currentProduct.discount > 0 && (
            <>
              <span className="text-lg text-gray-500 line-through">
                ₹{currentProduct.price.toFixed(2)}
              </span>
              <span className="bg-[#F6FF99] text-[#e43d12] px-2 py-1 rounded-full text-sm font-medium">
                {currentProduct.discount}% OFF
              </span>
            </>
          )}
        </motion.div>

        {/* Product Details */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {currentProduct.material && (
            <div>
              <span className="font-medium text-[#e43d12]">Material:</span> {currentProduct.material}
            </div>
          )}
          {currentProduct.weight && (
            <div>
              <span className="font-medium text-[#e43d12]">Weight:</span> {currentProduct.weight}kg
            </div>
          )}
          {currentProduct.dimensions && (
            <div>
              <span className="font-medium text-[#e43d12]">Dimensions:</span> {currentProduct.dimensions}
            </div>
          )}
          <div>
            <span className="font-medium text-[#e43d12]">Stock:</span>{" "}
            {currentProduct.stock > 0 ? `${currentProduct.stock} available` : "Out of stock"}
          </div>
        </motion.div>

        {/* View Product Button */}
        <motion.button
          onClick={() => goToProduct(currentProduct.id)}
          className="w-full md:w-auto bg-[#e43d12] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#f37342] transition-colors flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>View Product Details</span>
          <ArrowRightIcon className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductShowcase;
