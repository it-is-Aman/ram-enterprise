import React, { useState } from "react";
import { PhoneIcon, EnvelopeIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { inquiriesAPI } from "../../services";

const ProductInquirySection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    productName: "",
    quantity: 1,
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await inquiriesAPI.create(formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", productName: "", quantity: 1, message: "" });
    } catch (error) {
      console.error(error);
      setError("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="bg-gradient-to-r from-[#e43d12] via-[#f37342] to-[#ffa07a] py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="w-16 h-16 bg-[#e43d12] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#e43d12] mb-4">Thank You!</h3>
            <p className="text-gray-700 mb-6">
              Your inquiry has been submitted successfully. We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-[#e43d12] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#f37342] transition-colors animate-bounce"
            >
              Submit Another Inquiry
            </button>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-r from-[#f37342] via-[#e43d12] to-[#ffa07a] py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 animate-pulse">
            Tell Us What Are You Looking For?
          </h2>
          <p className="text-white text-lg max-w-2xl mx-auto">
            Can't find what you're looking for? Let us know your requirements and we'll help you find the perfect product.
          </p>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 lg:p-12 space-y-6"
            >
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-shake">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#e43d12] mb-2">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e43d12] focus:border-[#e43d12] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#e43d12] mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e43d12] focus:border-[#e43d12] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#e43d12] mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e43d12] focus:border-[#e43d12] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#e43d12] mb-2">Quantity Required</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    min="1"
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e43d12] focus:border-[#e43d12] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e43d12] mb-2">Product/Service Required *</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Copper Water Bottle"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e43d12] focus:border-[#e43d12] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e43d12] mb-2">Additional Requirements</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Kindly Describe Your Requirement"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e43d12] focus:border-[#e43d12] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#e43d12] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#f37342] disabled:bg-[#ffa07a] transition-colors flex items-center justify-center space-x-2 animate-pulse"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>Send Enquiry</span>
                    <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  </>
                )}
              </button>
            </motion.form>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-[#e43d12] via-[#f37342] to-[#ffa07a] p-8 lg:p-12 flex flex-col justify-center space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-4 animate-pulse">Get Personalized Assistance</h3>
                <p className="text-white">Our experts will help you find the perfect products for your requirements. Customized solutions for all your bar accessory needs.</p>
              </div>

              <div className="space-y-4">
                {[ 
                  { icon: PhoneIcon, title: "Quick Response", desc: "We respond within 24 hours" },
                  { icon: EnvelopeIcon, title: "Expert Consultation", desc: "Professional product guidance" },
                  { icon: ChatBubbleLeftRightIcon, title: "Custom Solutions", desc: "Tailored to your specific needs" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center animate-pulse">
                      <item.icon className="h-6 w-6 text-[#e43d12]" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="text-white text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-lg p-4 border-l-4 border-[#e43d12] animate-pulse">
                <p className="text-sm text-[#e43d12]">
                  <span className="font-medium">Note:</span> All inquiries are handled with complete confidentiality.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductInquirySection;
