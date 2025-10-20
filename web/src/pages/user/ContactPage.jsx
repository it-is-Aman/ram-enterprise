import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const ContactInfoCard = ({ icon: Icon, title, lines, bgColor }) => (
  <div className={`flex items-start space-x-4 p-4 rounded-lg ${bgColor}`}>
    <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center flex-shrink-0">
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <h3 className="font-semibold text-white">{title}</h3>
      {lines.map((line, idx) => (
        <p key={idx} className="text-white/80">{line}</p>
      ))}
    </div>
  </div>
);

const BusinessDetailsCard = ({ details }) => (
  <div className="bg-[#e43d12] rounded-2xl shadow-xl p-6 text-white">
    <h2 className="text-xl font-semibold mb-4">Business Details</h2>
    <div className="grid grid-cols-1 gap-4">
      {details.map((item, idx) => (
        <div key={idx} className="bg-white bg-opacity-20 rounded-lg p-3">
          <div className="font-medium mb-1">{item.title}</div>
          <div className="text-white">{item.value}</div>
        </div>
      ))}
    </div>
  </div>
);

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const { name, email, phone, subject, message } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    let newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!emailRegex.test(email)) newErrors.email = "Invalid email address";
    if (phone && !phoneRegex.test(phone)) newErrors.phone = "Invalid phone number";
    if (!subject) newErrors.subject = "Subject is required";
    if (!message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log('Contact form submitted:', formData);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
    }, 3000);
  };

  const businessDetails = [
    { title: 'Nature of Business', value: 'Trader, Retailer' },
    { title: 'GST Registration Date', value: '24-06-2018' },
    { title: 'Import Export Code (IEC)', value: 'AOHPR4902E' },
    { title: 'Annual Turnover', value: 'Rs. 2-5 Crore' },
  ];

  return (
    <div className="min-h-screen bg-[#ebe9e1] text-[#333]">
    

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-[#e43d12]">Get in Touch</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Have questions about our products? We’re here to help. Contact us and we’ll respond soon.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#e43d12]/20">
            <h2 className="text-2xl font-semibold mb-6 text-[#e43d12]">Send us a Message</h2>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#e43d12] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#e43d12]">Message Sent!</h3>
                <p>Thank you for contacting us. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name *"
                    className="w-full px-4 py-3 rounded-lg border border-[#e43d12]/30 bg-[#ebe9e1] text-[#333] focus:outline-none focus:ring-2 focus:ring-[#e43d12]"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address *"
                    className="w-full px-4 py-3 rounded-lg border border-[#e43d12]/30 bg-[#ebe9e1] text-[#333] focus:outline-none focus:ring-2 focus:ring-[#e43d12]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 rounded-lg border border-[#e43d12]/30 bg-[#ebe9e1] text-[#333] focus:outline-none focus:ring-2 focus:ring-[#e43d12]"
                  />
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#e43d12]/30 bg-[#ebe9e1] text-[#333] focus:outline-none focus:ring-2 focus:ring-[#e43d12]"
                  >
                    <option value="">Select Subject *</option>
                    <option value="product-inquiry">Product Inquiry</option>
                    <option value="bulk-order">Bulk Order</option>
                    <option value="support">Customer Support</option>
                    <option value="partnership">Business Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Type your message *"
                  className="w-full px-4 py-3 rounded-lg border border-[#e43d12]/30 bg-[#ebe9e1] text-[#333] focus:outline-none focus:ring-2 focus:ring-[#e43d12]"
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-[#e43d12] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#c2320f] transition-colors"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <ContactInfoCard
              icon={BuildingOfficeIcon}
              title="Company"
              lines={["Rudra Exports", "Exporter, Supplier & Trader of Bar Accessories"]}
              bgColor="bg-[#e43d12]"
            />
            <ContactInfoCard
              icon={MapPinIcon}
              title="Address"
              lines={["123 Business District", "Mumbai, Maharashtra - 400001", "India"]}
              bgColor="bg-[#e43d12]"
            />
            <ContactInfoCard
              icon={PhoneIcon}
              title="Phone"
              lines={["+91 98765 43210", "+91 98765 43211"]}
              bgColor="bg-[#e43d12]"
            />
            <ContactInfoCard
              icon={EnvelopeIcon}
              title="Email"
              lines={["info@rudraexports.com", "sales@rudraexports.com"]}
              bgColor="bg-[#e43d12]"
            />
            <ContactInfoCard
              icon={ClockIcon}
              title="Business Hours"
              lines={["Mon - Sat: 9:00 AM - 6:00 PM", "Sunday: Closed"]}
              bgColor="bg-[#e43d12]"
            />
            <BusinessDetailsCard details={businessDetails} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
