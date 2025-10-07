import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRightIcon, EyeIcon } from '@heroicons/react/24/outline';
import { categoriesAPI, productsAPI } from '../../services';

const CategoriesSection = () => {
  const navigate = useNavigate();
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoriesWithProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch all categories
        const categoriesResponse = await categoriesAPI.getAll();
        const categories = categoriesResponse.data || [];

        // Fetch random products for each category
        const categoriesWithProductsData = await Promise.all(
          categories.map(async (category) => {
            try {
              const productsResponse = await productsAPI.getAll({
                category: category.slug,
                limit: 4 // Get 4 products per category
              });
              
              // Shuffle products to get random selection
              const products = (productsResponse.data || []).sort(() => 0.5 - Math.random());
              
              return {
                ...category,
                products: products.slice(0, 3) // Show only 3 products per category
              };
            } catch (error) {
              console.error(`Error fetching products for category ${category.name}:`, error);
              return {
                ...category,
                products: []
              };
            }
          })
        );

        // Filter categories that have products and shuffle them
        const validCategories = categoriesWithProductsData
          .filter(cat => cat.products.length > 0)
          .sort(() => 0.5 - Math.random())
          .slice(0, 6); // Show max 6 categories

        setCategoriesWithProducts(validCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesWithProducts();
  }, []);

  const goToProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const refreshCategories = () => {
    // Re-fetch to get different random products
    const fetchAgain = async () => {
      try {
        setLoading(true);
        
        const categoriesResponse = await categoriesAPI.getAll();
        const categories = categoriesResponse.data || [];

        const categoriesWithProductsData = await Promise.all(
          categories.map(async (category) => {
            try {
              const productsResponse = await productsAPI.getAll({
                category: category.slug,
                limit: 10 // Get more products to have better randomization
              });
              
              const products = (productsResponse.data || []).sort(() => 0.5 - Math.random());
              
              return {
                ...category,
                products: products.slice(0, 3)
              };
            } catch {
              return {
                ...category,
                products: []
              };
            }
          })
        );

        const validCategories = categoriesWithProductsData
          .filter(cat => cat.products.length > 0)
          .sort(() => 0.5 - Math.random())
          .slice(0, 6);

        setCategoriesWithProducts(validCategories);
      } catch (error) {
        console.error('Error refreshing categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgain();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl h-96"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Products & Services
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          Explore our diverse range of high-quality products across different categories
        </p>
        <button
          onClick={refreshCategories}
          className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          <span>Refresh Products</span>
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categoriesWithProducts.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Category Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
              <h3 className="text-xl font-bold text-white">{category.name}</h3>
              {category.description && (
                <p className="text-red-100 text-sm mt-1 line-clamp-2">
                  {category.description}
                </p>
              )}
            </div>

            {/* Products Grid */}
            <div className="p-6">
              <div className="space-y-4 mb-6">
                {category.products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => goToProduct(product.id)}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yOCAyOEgzNlYzNkgyOFYyOFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <div className="w-8 h-8 bg-gray-300 rounded"></div>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-red-600 transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm font-semibold text-red-600">
                          ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                        </span>
                        {product.discount > 0 && (
                          <>
                            <span className="text-xs text-gray-500 line-through">
                              ₹{product.price.toFixed(2)}
                            </span>
                            <span className="text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded">
                              {product.discount}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* View Icon */}
                    <EyeIcon className="h-4 w-4 text-gray-400 group-hover:text-red-600 transition-colors" />
                  </div>
                ))}
              </div>

              {/* View All Button */}
              <Link
                to={`/products?category=${category.slug}`}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 group"
              >
                <span>View All {category.name}</span>
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      {categoriesWithProducts.length > 0 && (
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            <span>View All Products</span>
            <ArrowRightIcon className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </section>
  );
};

export default CategoriesSection;
