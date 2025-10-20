import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  StarIcon,
  HeartIcon,
  ShareIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  TruckIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { productsAPI, reviewsAPI, cartAPI, wishlistAPI } from '../../services';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getById(id);
        setProduct(response.data);
        
        // Fetch related products
        if (response.data?.categoryId) {
          const relatedResponse = await productsAPI.getAll({
            category: response.data.category?.slug,
            limit: 8
          });
          setRelatedProducts(
            relatedResponse.data?.filter(p => p.id !== parseInt(id)) || []
          );
        }

        // Fetch reviews
        const reviewsResponse = await reviewsAPI.getProductReviews(id);
        setReviews(reviewsResponse.data?.reviews || []);
        
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      const userId=59;
      await cartAPI.addItem(userId, product.id, quantity);
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    navigate(`/checkout?productId=${product.id}&quantity=${quantity}`);
  };

  const handleWishlistToggle = async () => {
    try {
      if (isWishlisted) {
        await wishlistAPI.removeItem(1, product.id);
        setIsWishlisted(false);
      } else {
        await wishlistAPI.addItem(1, product.id);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const renderStars = (rating, totalReviews = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIconSolid
          key={i}
          className={`h-5 w-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return (
      <div className="flex items-center space-x-1">
        <div className="flex">{stars}</div>
        <span className="text-sm text-gray-600">({rating}/5)</span>
        {totalReviews > 0 && (
          <span className="text-sm text-gray-500">• {totalReviews} reviews</span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6FF99] flex items-center justify-center animate-pulse">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#476EAE] border-gray-200"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F6FF99] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#476EAE]">Product Not Found</h2>
          <p className="text-gray-700 mt-2">The product you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center px-4 py-2 bg-[#48B3AF] text-white rounded-md hover:bg-[#476EAE] transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[currentImageIndex];
  const discountedPrice = product.price * (1 - product.discount / 100);
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="min-h-screen bg-[#F6FF99]">
     

      {/* Product Details */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-square">
                {currentImage ? (
                  <img
                    src={currentImage.url}
                    alt={currentImage.alt || product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                      <p>No Image Available</p>
                    </div>
                  </div>
                )}
              </div>
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#48B3AF] text-white p-3 rounded-full hover:bg-[#A7E399]"
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#48B3AF] text-white p-3 rounded-full hover:bg-[#A7E399]"
                  >
                    <ChevronRightIcon className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-[#48B3AF]' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#48B3AF] font-medium">
                  {product.category?.name}
                </span>
                <button
                  onClick={handleWishlistToggle}
                  className="p-2 text-gray-400 hover:text-[#48B3AF] transition-colors"
                >
                  {isWishlisted ? (
                    <HeartIconSolid className="h-6 w-6 text-[#48B3AF]" />
                  ) : (
                    <HeartIcon className="h-6 w-6" />
                  )}
                </button>
              </div>
              
              <h1 className="text-3xl font-bold text-[#476EAE] mb-4">
                {product.name}
              </h1>

              {reviews.length > 0 && (
                <div className="mb-4">
                  {renderStars(Math.round(averageRating), reviews.length)}
                </div>
              )}

              <p className="text-gray-700 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="border-t border-gray-300 pt-6">
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-4xl font-bold text-[#48B3AF]">
                  ₹{discountedPrice.toFixed(2)}
                </span>
                {product.discount > 0 && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.price.toFixed(2)}
                    </span>
                    <span className="bg-[#A7E399] text-[#476EAE] px-3 py-1 rounded-full font-medium">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="flex items-center space-x-4 mb-6">
                  <span className="font-medium text-[#476EAE]">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-[#476EAE] hover:text-[#48B3AF]"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-l border-r border-gray-300 min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 text-[#476EAE] hover:text-[#48B3AF]"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                {product.stock > 0 ? (
                  <>
                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className="w-full bg-[#48B3AF] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#476EAE] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <ShoppingCartIcon className="h-6 w-6" />
                      <span>{addingToCart ? 'Adding...' : 'Add to Cart'}</span>
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="w-full bg-[#476EAE] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#48B3AF] transition-colors flex items-center justify-center space-x-2"
                    >
                      <CreditCardIcon className="h-6 w-6" />
                      <span>Buy Now</span>
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-4 px-6 rounded-xl font-semibold text-lg cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-300 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-[#476EAE]">
                  <TruckIcon className="h-5 w-5" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center space-x-2 text-[#476EAE]">
                  <ShieldCheckIcon className="h-5 w-5" />
                  <span>Quality Guaranteed</span>
                </div>
                <div className="flex items-center space-x-2 text-[#476EAE]">
                  <ShareIcon className="h-5 w-5" />
                  <span>Share Product</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-16">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#476EAE] mb-6">Customer Reviews</h2>
              <div className="space-y-6">
                {reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-[#476EAE]">{review.user?.name || 'Anonymous'}</span>
                          {review.isVerified && (
                            <span className="bg-[#A7E399] text-[#476EAE] px-2 py-0.5 rounded-full text-xs">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[#476EAE] mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group"
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    {relatedProduct.images && relatedProduct.images.length > 0 ? (
                      <img
                        src={relatedProduct.images[0].url}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#476EAE] mb-2 line-clamp-2 group-hover:text-[#48B3AF] transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-[#48B3AF]">
                        ₹{(relatedProduct.price * (1 - relatedProduct.discount / 100)).toFixed(2)}
                      </span>
                      {relatedProduct.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{relatedProduct.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetailPage;
