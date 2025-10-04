import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { reviewsAPI } from '../../services';

const ReviewDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReview = useCallback(async () => {
    try {
      setLoading(true);
      const result = await reviewsAPI.getById(id);
      setReview(result.data || result);
    } catch (error) {
      console.error('Error fetching review:', error);
      alert('Error loading review data');
      navigate('/admin/reviews');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  const handleVerificationUpdate = async (isVerified) => {
    try {
      await reviewsAPI.updateVerification(id, isVerified);
      fetchReview();
    } catch (error) {
      console.error('Error updating verification:', error);
      alert('Error updating review verification');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      try {
        await reviewsAPI.delete(id);
        navigate('/admin/reviews');
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Error deleting review');
      }
    }
  };

  const renderStars = (rating, size = 'h-5 w-5') => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarSolid
            key={star}
            className={`${size} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  const getVerificationBadge = (isVerified) => {
    return isVerified ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <CheckCircleIcon className="h-4 w-4 mr-1" />
        Verified
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        <XCircleIcon className="h-4 w-4 mr-1" />
        Unverified
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-rose)]"></div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Review not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin/reviews')}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Review Details</h1>
              <p className="text-sm text-gray-500 mt-1">
                Submitted on {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {getVerificationBadge(review.isVerified)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Review Content */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-[var(--primary-rose)] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {review.user?.name ? review.user.name.charAt(0).toUpperCase() : 'A'}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {review.user?.name || 'Anonymous Customer'}
                      </h3>
                    </div>
                    <div className="text-right">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div className="px-6 py-6">
              <div className="prose max-w-none">
                {review.comment && (
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Product Information */}
          {review.product && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reviewed Product</h3>
              
              <div className="flex items-start space-x-4">
                {review.product.images && review.product.images.length > 0 && (
                  <div className="flex-shrink-0">
                    <img
                      src={review.product.images[0].url}
                      alt={review.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">{review.product.name}</h4>
                  <p className="text-gray-600 mt-1">{review.product.description}</p>
                  
                  <div className="mt-3 flex items-center space-x-4">
                    <span className="text-lg font-bold text-[var(--primary-rose)]">
                      ₹{review.product.price?.toLocaleString()}
                    </span>
                    
                    {review.product.category && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                        {review.product.category.name}
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => navigate(`/admin/products/${review.product.id}`)}
                    className="mt-3 text-sm text-[var(--primary-rose)] hover:text-[var(--primary-rose)]/80"
                  >
                    View Product Details →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Helpful Stats */}
          {(review.helpfulCount > 0 || review.notHelpfulCount > 0) && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Feedback</h3>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">
                    {review.helpfulCount || 0} found this helpful
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <XCircleIcon className="h-5 w-5 text-red-500" />
                  <span className="text-sm text-gray-700">
                    {review.notHelpfulCount || 0} found this not helpful
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Moderation Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Moderation</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => handleVerificationUpdate(!review.isVerified)}
                className={`w-full flex items-center justify-center px-4 py-2 rounded-md ${
                  review.isVerified 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {review.isVerified ? (
                  <>
                    <XCircleIcon className="h-4 w-4 mr-2" />
                    Mark as Unverified
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Mark as Verified
                  </>
                )}
              </button>

              <button
                onClick={handleDelete}
                className="w-full flex items-center justify-center px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
              >
                <XCircleIcon className="h-4 w-4 mr-2" />
                Delete Review
              </button>
            </div>
          </div>

          {/* Review Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Review Information</h3>
            
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Review ID</dt>
                <dd className="text-gray-900 font-mono">{review.id}</dd>
              </div>
              
              <div>
                <dt className="text-gray-500">Rating</dt>
                <dd className="text-gray-900">{review.rating}/5 stars</dd>
              </div>
              
              <div>
                <dt className="text-gray-500">Customer</dt>
                <dd className="text-gray-900">{review.user?.name || 'Anonymous'}</dd>
              </div>
              
              <div>
                <dt className="text-gray-500">Verified</dt>
                <dd className="text-gray-900">
                  {review.isVerified ? (
                    <span className="text-green-600">✓ Verified</span>
                  ) : (
                    <span className="text-gray-500">Not verified</span>
                  )}
                </dd>
              </div>
              
              <div>
                <dt className="text-gray-500">Submitted</dt>
                <dd className="text-gray-900">
                  {new Date(review.createdAt).toLocaleString()}
                </dd>
              </div>
              
              <div>
                <dt className="text-gray-500">Last Updated</dt>
                <dd className="text-gray-900">
                  {new Date(review.updatedAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Additional Info */}
          {review.comment && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Comment Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Character Count</span>
                  <span className="text-sm font-medium">{review.comment.length}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailsPage;
