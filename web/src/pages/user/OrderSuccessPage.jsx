import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircleIcon, PrinterIcon, ShareIcon } from '@heroicons/react/24/solid';

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('paymentId');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. Your payment has been processed successfully and your order is being prepared.
          </p>

          {/* Payment Details */}
          {paymentId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm">
                <span className="text-gray-600">Payment ID:</span>
                <span className="ml-2 font-mono text-gray-900">{paymentId}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to="/orders"
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-block"
            >
              View Order Details
            </Link>
            
            <Link
              to="/products"
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors inline-block"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Additional Actions */}
          <div className="flex justify-center space-x-6 mt-8 pt-6 border-t border-gray-200">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm">
              <PrinterIcon className="h-4 w-4" />
              <span>Print Receipt</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm">
              <ShareIcon className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
