import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircleIcon, PrinterIcon, ShareIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("paymentId");

  return (
    <div className="min-h-screen bg-[#ebe9e1] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="bg-white rounded-2xl shadow-2xl p-8 text-center border border-[#ebe9e1]"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="mx-auto w-20 h-20 bg-[#e43d12] rounded-full flex items-center justify-center mb-6 shadow-md"
          >
            <CheckCircleIcon className="h-12 w-12 text-white" />
          </motion.div>

          {/* Success Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-[#e43d12] mb-4"
          >
            Order Placed Successfully!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-700 mb-6"
          >
            Thank you for your order. Your payment has been processed successfully and your order is being prepared.
          </motion.p>

          {/* Payment Details */}
          {paymentId && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-[#ebe9e1] rounded-lg p-4 mb-6 border border-[#e43d12]/30"
            >
              <div className="text-sm text-[#e43d12] font-medium">
                Payment ID:{" "}
                <span className="ml-2 font-mono text-[#b3300c]">{paymentId}</span>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
          >
            <Link
              to="/orders"
              className="block w-full bg-[#e43d12] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#c92f0e] transition-colors"
            >
              View Order Details
            </Link>

            <Link
              to="/products"
              className="block w-full bg-[#ebe9e1] text-[#e43d12] py-3 px-6 rounded-lg font-medium border border-[#e43d12] hover:bg-[#e43d12] hover:text-white transition-colors"
            >
              Continue Shopping
            </Link>
          </motion.div>

          {/* Additional Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center space-x-6 mt-8 pt-6 border-t border-[#ebe9e1]"
          >
            <button className="flex items-center space-x-2 text-[#e43d12] hover:text-[#c92f0e] text-sm transition-colors">
              <PrinterIcon className="h-4 w-4" />
              <span>Print Receipt</span>
            </button>
            <button className="flex items-center space-x-2 text-[#e43d12] hover:text-[#c92f0e] text-sm transition-colors">
              <ShareIcon className="h-4 w-4" />
              <span>Share</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-6"
        >
          <Link
            to="/"
            className="text-[#e43d12] hover:text-[#c92f0e] font-medium transition-colors"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
