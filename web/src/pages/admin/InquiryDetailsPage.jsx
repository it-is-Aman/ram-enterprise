import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, ChatBubbleLeftRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { inquiriesAPI } from '../../services';

const InquiryDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responseLoading, setResponseLoading] = useState(false);
  const [response, setResponse] = useState('');

  const fetchInquiry = useCallback(async () => {
    try {
      setLoading(true);
      const result = await inquiriesAPI.getById(id);
      setInquiry(result.data || result);
    } catch (error) {
      console.error('Error fetching inquiry:', error);
      alert('Error loading inquiry data');
      navigate('/admin/inquiries');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchInquiry();
  }, [fetchInquiry]);

  const handleStatusUpdate = async (newStatus) => {
    try {
        console.log(id, newStatus);
      await inquiriesAPI.updateStatus(id, newStatus);
      fetchInquiry();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating inquiry status');
    }
  };

  const handleSendResponse = async () => {
    if (!response.trim()) return;
    
    try {
      setResponseLoading(true);
      await inquiriesAPI.sendResponse(id, response);
      setResponse('');
      fetchInquiry();
      alert('Response sent successfully!');
    } catch (error) {
      console.error('Error sending response:', error);
      alert('Error sending response');
    } finally {
      setResponseLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      CONTACTED: { color: 'bg-blue-100 text-blue-800', text: 'Contacted' },
      FULFILLED: { color: 'bg-green-100 text-green-800', text: 'Fulfilled' },
      CLOSED: { color: 'bg-gray-100 text-gray-800', text: 'Closed' }
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
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

  if (!inquiry) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Inquiry not found</p>
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
              onClick={() => navigate('/admin/inquiries')}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Inquiry Details</h1>
              <p className="text-sm text-gray-500 mt-1">
                Received on {new Date(inquiry.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {getStatusBadge(inquiry.status)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Inquiry Message */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-start space-x-4">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-gray-400 mt-1" />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">{inquiry.productName}</h2>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>From: {inquiry.name}</span>
                    <span>Email: {inquiry.email}</span>
                    {inquiry.phone && <span>Phone: {inquiry.phone}</span>}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-6">
              <div className="prose max-w-none">
                {inquiry.message && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Message</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
                  </div>
                )}

                {inquiry.quantity && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Inquiry Details</h4>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Quantity:</span> {inquiry.quantity} units
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Response Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Send Response</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Response Message
              </label>
              <textarea
                rows={4}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-rose)] focus:border-[var(--primary-rose)]"
                placeholder="Enter your response to the customer..."
              />
              <div className="mt-3 flex items-center space-x-3">
                <button
                  onClick={handleSendResponse}
                  disabled={!response.trim() || responseLoading}
                  className="px-4 py-2 bg-[var(--primary-rose)] text-white rounded-md hover:bg-[var(--primary-rose)]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {responseLoading ? 'Sending...' : 'Send Response'}
                </button>
                
                <button
                  onClick={() => setResponse('')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
            
            <div className="space-y-4">
              {/* Status Update */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={inquiry.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-rose)] focus:border-[var(--primary-rose)]"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="FULFILLED">Fulfilled</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              {/* Contact Customer */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Customer</h4>
                <div className="space-y-2">
                  <a
                    href={`mailto:${inquiry.email}?subject=Re: ${inquiry.productName}&body=Hello ${inquiry.name},%0A%0A`}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 text-center"
                  >
                    Send Email
                  </a>
                  
                  {inquiry.phone && (
                    <a
                      href={`tel:${inquiry.phone}`}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 text-center"
                    >
                      Call Customer
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Inquiry Information</h3>
            
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Inquiry ID</dt>
                <dd className="text-gray-900 font-mono">{inquiry.id}</dd>
              </div>
              
              <div>
                <dt className="text-gray-500">Product</dt>
                <dd className="text-gray-900">{inquiry.productName}</dd>
              </div>
              
              <div>
                <dt className="text-gray-500">Customer Name</dt>
                <dd className="text-gray-900">{inquiry.name}</dd>
              </div>
              
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="text-gray-900">{inquiry.email}</dd>
              </div>
              
              {inquiry.phone && (
                <div>
                  <dt className="text-gray-500">Phone</dt>
                  <dd className="text-gray-900">{inquiry.phone}</dd>
                </div>
              )}
              
              {inquiry.quantity && (
                <div>
                  <dt className="text-gray-500">Quantity</dt>
                  <dd className="text-gray-900">{inquiry.quantity} units</dd>
                </div>
              )}
              
              <div>
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-900">
                  {new Date(inquiry.createdAt).toLocaleString()}
                </dd>
              </div>
              
              <div>
                <dt className="text-gray-500">Last Updated</dt>
                <dd className="text-gray-900">
                  {new Date(inquiry.updatedAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetailsPage;
