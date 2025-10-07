import React, { useState, useEffect, useCallback } from 'react';
import { StarIcon, UserCircleIcon, EyeIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { reviewsAPI } from '../../services';

const RatingsReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 4.6,
    totalReviews: 87,
    ratingDistribution: {
      5: 64,
      4: 19,
      3: 3,
      2: 2,
      1: 12
    }
  });
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [visibleReviews, setVisibleReviews] = useState(3);

  const fetchReviewsData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch recent reviews across all products
      const reviewsResponse = await reviewsAPI.getAll({ limit: 20, sortBy: 'createdAt', order: 'desc' });
      const reviewsData = reviewsResponse.data || [];
      
      // Calculate stats from the data
      if (reviewsData.length > 0) {
        const totalReviews = reviewsData.length;
        const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = (totalRating / totalReviews).toFixed(1);
        
        const distribution = reviewsData.reduce((acc, review) => {
          acc[review.rating] = (acc[review.rating] || 0) + 1;
          return acc;
        }, {});

        setStats({
          averageRating: parseFloat(averageRating),
          totalReviews,
          ratingDistribution: {
            5: distribution[5] || 0,
            4: distribution[4] || 0,
            3: distribution[3] || 0,
            2: distribution[2] || 0,
            1: distribution[1] || 0
          }
        });
      }
      
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Use fallback sample data
      setSampleData();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviewsData();
  }, [fetchReviewsData]);

  const setSampleData = () => {
    const sampleReviews = [
      {
        id: 1,
        rating: 5,
        comment: "Excellent product quality! The copper vessels are beautifully crafted and arrived in perfect condition. Highly recommend!",
        user: { name: "Neha" },
        product: { name: "Copper Vessels" },
        createdAt: "2025-08-16",
        isVerified: true,
        location: "Jalandhar, Punjab"
      },
      {
        id: 2,
        rating: 4,
        comment: "Great product! The copper bottle gift set is perfect for gifting. Good quality and fast delivery.",
        user: { name: "Faisal" },
        product: { name: "Copper Bottle Gift Set" },
        createdAt: "2025-08-17",
        isVerified: true,
        location: "Moradabad, Uttar Pradesh"
      },
      {
        id: 3,
        rating: 5,
        comment: "Outstanding bar accessories! Perfect for home bar setup. The quality exceeded my expectations.",
        user: { name: "Pratyuni Mali" },
        product: { name: "Bar Accessories" },
        createdAt: "2025-02-14",
        isVerified: true,
        location: "Mumbai, Maharashtra"
      }
    ];
    setReviews(sampleReviews);
  };

  const renderStars = (rating, size = 'w-5 h-5') => {
    return [...Array(5)].map((_, index) => (
      <div key={index}>
        {index < rating ? (
          <StarIcon className={`${size} text-yellow-400`} />
        ) : (
          <StarOutlineIcon className={`${size} text-gray-300`} />
        )}
      </div>
    ));
  };

  const getPercentage = (count, total) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  const filteredReviews = selectedFilter === 'all' 
    ? reviews 
    : reviews.filter(review => review.rating === parseInt(selectedFilter));

  const userSatisfactionMetrics = [
    { label: 'Response', percentage: 85, color: 'bg-green-500' },
    { label: 'Quality', percentage: 83, color: 'bg-green-500' },
    { label: 'Delivery', percentage: 91, color: 'bg-green-600' }
  ];

  if (loading) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ratings & Reviews
          </h2>
          <p className="text-lg text-gray-600">
            See what our customers are saying about our products
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rating Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
              {/* Overall Rating */}
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  {stats.averageRating}
                  <span className="text-lg text-gray-500">/5</span>
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
                <p className="text-gray-600">
                  Reviewed by {stats.totalReviews} Users
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-3 mb-6">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.ratingDistribution[star] || 0;
                  const percentage = getPercentage(count, stats.totalReviews);
                  return (
                    <div key={star} className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700 w-3">
                        {star}★
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-10">
                        {percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* User Satisfaction */}
              <div className="border-t pt-6">
                <div className="flex items-center mb-4">
                  <UserCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium text-gray-900">User Satisfaction</span>
                </div>
                <div className="space-y-3">
                  {userSatisfactionMetrics.map((metric, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{metric.label}</span>
                        <span className="font-medium">{metric.percentage}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className={`${metric.color} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${metric.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === 'all'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Reviews ({stats.totalReviews})
                </button>
                {[5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    onClick={() => setSelectedFilter(star.toString())}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedFilter === star.toString()
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {star}★ ({stats.ratingDistribution[star] || 0})
                  </button>
                ))}
              </div>

              {/* Most Relevant Reviews Header */}
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Most Relevant Reviews
              </h3>

              {/* Reviews */}
              <div className="space-y-6">
                {filteredReviews.slice(0, visibleReviews).map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-semibold text-lg">
                          {review.user?.name?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>

                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {review.user?.name || 'Anonymous User'}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {review.location || 'Verified Purchase'} • {new Date(review.createdAt).toLocaleDateString('en-GB')}
                            </p>
                          </div>
                          {review.isVerified && (
                            <div className="flex items-center bg-green-50 px-2 py-1 rounded-full">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                              <span className="text-xs text-green-700 font-medium">Verified</span>
                            </div>
                          )}
                        </div>

                        {/* Product Name */}
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Product Name:</span> {review.product?.name}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center mb-3">
                          {renderStars(review.rating, 'w-4 h-4')}
                        </div>

                        {/* Review Text */}
                        {review.comment && (
                          <p className="text-gray-700 leading-relaxed mb-3">
                            {review.comment}
                          </p>
                        )}

                        {/* Review Metrics */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <EyeIcon className="w-4 h-4" />
                            <span>Response</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full ml-1"></div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>Quality</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full ml-1"></div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>Delivery</span>
                            <div className="w-2 h-2 bg-green-600 rounded-full ml-1"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View More Button */}
              {filteredReviews.length > visibleReviews && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setVisibleReviews(prev => prev + 3)}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    View More Reviews
                  </button>
                </div>
              )}

              {filteredReviews.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No reviews found for the selected filter.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RatingsReviewsSection;
