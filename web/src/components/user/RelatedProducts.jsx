import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const RelatedProducts = ({ relatedProducts, currentProduct }) => {
  const navigate = useNavigate();

  const goToProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Similar Products
      </h2>
      
      {relatedProducts.length > 0 ? (
        <div className="space-y-4">
          {relatedProducts.slice(0, 4).map((product) => (
            <div
              key={product.id}
              onClick={() => goToProduct(product.id)}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-red-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">
                  ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                </p>
                {product.discount > 0 && (
                  <span className="text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
              <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
          
          {relatedProducts.length > 4 && (
            <Link
              to={`/category/${currentProduct?.category?.slug}`}
              className="block text-center text-red-600 hover:text-red-700 font-medium text-sm mt-4"
            >
              View All Similar Products
            </Link>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4"></div>
          <p className="text-sm">No similar products found</p>
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
