import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  EyeIcon,
  MagnifyingGlassIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { reviewsAPI } from '../../services';
import { useDebounce } from '../../hooks/useDebounce';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    rating: '',
    isVerified: ''
  });

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
        ...(filters.rating && { rating: parseInt(filters.rating) }),
        ...(filters.isVerified && { isVerified: filters.isVerified === 'true' })
      };
      
      const response = await reviewsAPI.getAll(params);
      setReviews(response.data);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, filters]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleVerificationToggle = async (reviewId, currentStatus) => {
    try {
      await reviewsAPI.updateVerification(reviewId, !currentStatus);
      fetchReviews();
    } catch (error) {
      console.error('Error updating review verification:', error);
      alert('Error updating review verification');
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewsAPI.delete(reviewId);
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Error deleting review');
      }
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIconSolid
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Reviews</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage customer product reviews and ratings
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[var(--primary-rose)] focus:border-[var(--primary-rose)]"
            />
          </div>
          
          <select
            value={filters.rating}
            onChange={(e) => setFilters({...filters, rating: e.target.value})}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-rose)] focus:border-[var(--primary-rose)]"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <select
            value={filters.isVerified}
            onChange={(e) => setFilters({...filters, isVerified: e.target.value})}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-rose)] focus:border-[var(--primary-rose)]"
          >
            <option value="">All Reviews</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({ rating: '', isVerified: '' });
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-rose)]"></div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {reviews.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <div key={review.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      {review.product?.images && review.product.images.length > 0 ? (
                        <img
                          src={review.product.images[0].url}
                          alt={review.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Review Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {renderStars(review.rating)}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              review.isVerified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {review.isVerified ? 'Verified' : 'Unverified'}
                            </span>
                          </div>

                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {review.product?.name || 'Product not found'}
                          </h3>

                          <p className="text-gray-700 mb-3">
                            {review.comment}
                          </p>

                          {/* Customer Info */}
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>
                              <strong>Customer:</strong> {review.user?.name || 'Anonymous'}
                            </div>
                            <div>
                              <strong>Date:</strong> {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                            {review.isVerified && (
                              <div className="flex items-center space-x-1">
                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                <span className="text-green-600 text-xs">Verified Review</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-shrink-0 text-right">
                          <div className="text-sm text-gray-500">
                            ID: {review.id}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex items-center space-x-4">
                        <Link
                          to={`/admin/reviews/${review.id}`}
                          className="inline-flex items-center text-sm text-[var(--primary-rose)] hover:text-[var(--primary-rose)]/80"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View Details
                        </Link>

                        <button
                          onClick={() => handleVerificationToggle(review.id, review.isVerified)}
                          className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                            review.isVerified
                              ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {review.isVerified ? (
                            <>
                              <XCircleIcon className="h-3 w-3 mr-1" />
                              Unverify
                            </>
                          ) : (
                            <>
                              <CheckCircleIcon className="h-3 w-3 mr-1" />
                              Verify
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(review.id)}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 hover:bg-red-200"
                        >
                          <TrashIcon className="h-3 w-3 mr-1" />
                          Delete
                        </button>

                        <Link
                          to={`/admin/products/${review.productId}`}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          View Product
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <StarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews</h3>
              <p className="mt-1 text-sm text-gray-500">
                Customer reviews will appear here when they rate products.
              </p>
            </div>
          )}

          {/* Pagination */}
          {reviews.length > 0 && totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
