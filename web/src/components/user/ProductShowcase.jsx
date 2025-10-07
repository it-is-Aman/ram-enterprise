import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const ProductShowcase = ({ 
  currentProduct, 
  currentImages, 
  imageIndex, 
  setImageIndex, 
  nextImage, 
  prevImage 
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
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Product Image */}
      <div className="relative h-96 bg-gray-100">
        {currentImages.length > 0 ? (
          <>
            <img
              src={currentImages[imageIndex]?.url}
              alt={currentImages[imageIndex]?.alt || currentProduct.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE4NVYxNzVIMTc1VjEyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIxNSAxMjVIMjI1VjE3NUgyMTVWMTI1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4=';
              }}
            />
            
            {/* Image Navigation */}
            {currentImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {currentImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === imageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto mb-4"></div>
              <p>No Image Available</p>
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {currentProduct.name}
            </h1>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {currentProduct.description}
            </p>
            
            {/* Price */}
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-3xl font-bold text-red-600">
                ₹{(currentProduct.price * (1 - currentProduct.discount / 100)).toFixed(2)}
              </span>
              {currentProduct.discount > 0 && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{currentProduct.price.toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                    {currentProduct.discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
              {currentProduct.material && (
                <div>
                  <span className="font-medium">Material:</span> {currentProduct.material}
                </div>
              )}
              {currentProduct.weight && (
                <div>
                  <span className="font-medium">Weight:</span> {currentProduct.weight}kg
                </div>
              )}
              {currentProduct.dimensions && (
                <div>
                  <span className="font-medium">Dimensions:</span> {currentProduct.dimensions}
                </div>
              )}
              <div>
                <span className="font-medium">Stock:</span> {currentProduct.stock > 0 ? `${currentProduct.stock} available` : 'Out of stock'}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => goToProduct(currentProduct.id)}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 group"
            >
              <span>View Product Details</span>
              <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShowcase;
