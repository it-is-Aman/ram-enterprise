import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const RelatedProducts = ({ relatedProducts = [], currentProduct }) => {
  const navigate = useNavigate();

  const goToProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <section
      className="rounded-2xl shadow-xl p-6"
      style={{ backgroundColor: "#ebe9e1" }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-xl font-bold text-[#e43d12] mb-6"
      >
        Similar Products
      </motion.h2>

      {relatedProducts.length > 0 ? (
        <div className="space-y-4">
          {relatedProducts.slice(0, 4).map((product, index) => (
            <motion.div
              key={product.id}
              onClick={() => goToProduct(product.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex items-center space-x-4 p-3 rounded-lg cursor-pointer bg-white hover:bg-[#ebe9e1]/70 transition-all group"
            >
              {/* Product Image */}
              <div className="w-16 h-16 bg-[#ebe9e1] rounded-lg overflow-hidden flex-shrink-0">
                {product.images?.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-[#ebe9e1] flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#e43d12] transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  ₹
                  {(
                    product.price *
                    (1 - (product.discount || 0) / 100)
                  ).toFixed(2)}
                </p>
                {product.discount > 0 && (
                  <span className="text-xs bg-[#e43d12]/10 text-[#e43d12] px-2 py-0.5 rounded mt-1 inline-block">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              {/* Arrow Icon */}
              <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-[#e43d12] group-hover:translate-x-1 transition-all duration-300" />
            </motion.div>
          ))}

          {/* View All Link */}
          {relatedProducts.length > 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to={`/category/${currentProduct?.category?.slug}`}
                className="block text-center text-[#e43d12] hover:underline font-medium text-sm mt-4 transition-all duration-300"
              >
                View All Similar Products
              </Link>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 py-6"
        >
          <div className="w-16 h-16 bg-[#ebe9e1] rounded-lg mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">No similar products found</p>
        </motion.div>
      )}
    </section>
  );
};

export default RelatedProducts;
