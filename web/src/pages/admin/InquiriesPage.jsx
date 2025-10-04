import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  EyeIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { inquiriesAPI } from '../../services';
import { useDebounce } from '../../hooks/useDebounce';

const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  });

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
        ...filters
      };
      
      const response = await inquiriesAPI.getAll(params);
      setInquiries(response.data);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, filters]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleStatusUpdate = async (inquiryId, newStatus) => {
    try {
    //   console.log(inquiryId, newStatus);
      await inquiriesAPI.updateStatus(inquiryId, newStatus);
      fetchInquiries();
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      alert('Error updating inquiry status');
    }
  };

//   const handlePriorityUpdate = async (inquiryId, newPriority) => {
//     try {
//       await inquiriesAPI.updatePriority(inquiryId, newPriority);
//       fetchInquiries();
//     } catch (error) {
//       console.error('Error updating inquiry priority:', error);
//       alert('Error updating inquiry priority');
//     }
//   };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon, text: 'Pending' },
      CONTACTED: { color: 'bg-blue-100 text-blue-800', icon: ChatBubbleLeftRightIcon, text: 'Responded' },
      FULFILLED: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, text: 'Resolved' },
      CLOSED: { color: 'bg-gray-100 text-gray-800', icon: XCircleIcon, text: 'Closed' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };

    const icons = {
      urgent: ExclamationTriangleIcon
    };

    const Icon = icons[priority];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[priority] || colors.medium}`}>
        {Icon && <Icon className="h-3 w-3 mr-1" />}
        {/* {priority.charAt(0).toUpperCase() + priority.slice(1)} */}
      </span>
    );
  };

  const getInquiryTypeColor = (type) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800',
      product: 'bg-purple-100 text-purple-800',
      order: 'bg-indigo-100 text-indigo-800',
      complaint: 'bg-red-100 text-red-800',
      suggestion: 'bg-green-100 text-green-800'
    };

    return colors[type] || colors.general;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Inquiries</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage customer inquiries and support requests
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
              placeholder="Search inquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[var(--primary-rose)] focus:border-[var(--primary-rose)]"
            />
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-rose)] focus:border-[var(--primary-rose)]"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONTACTED">Responded</option>
            <option value="FULFILLED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          {/* <select
            value={filters.priority}
            onChange={(e) => setFilters({...filters, priority: e.target.value})}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-rose)] focus:border-[var(--primary-rose)]"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select> */}

          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({ status: ''});
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Inquiries List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-rose)]"></div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {inquiries.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start space-x-4">
                    {/* Inquiry Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <ChatBubbleLeftRightIcon className="h-8 w-8 text-gray-400" />
                    </div>

                    {/* Inquiry Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {inquiry.subject}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {inquiry.message}
                          </p>
                        </div>

                        <div className="flex-shrink-0 ml-4 text-right">
                          <div className="text-sm text-gray-500">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(inquiry.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                        <span>
                          <strong>From:</strong> {inquiry.name}
                        </span>
                        <span>
                          <strong>Email:</strong> {inquiry.email}
                        </span>
                        {inquiry.phone && (
                          <span>
                            <strong>Phone:</strong> {inquiry.phone}
                          </span>
                        )}
                      </div>

                      {/* Product Info */}
                      {inquiry.product && (
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>Product:</strong> {inquiry.product.name}
                        </div>
                      )}

                      {/* Badges */}
                      <div className="mt-3 flex items-center space-x-3">
                        {getStatusBadge(inquiry.status)}
                        {getPriorityBadge(inquiry.priority)}
                        {/* {console.log(inquiry)} */}


                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getInquiryTypeColor(inquiry.type)}`}>
                          {/* {inquiry.type.charAt(0).toUpperCase() + inquiry.type.slice(1)} */}
                          
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex items-center space-x-4">
                        <Link
                          to={`/admin/inquiries/${inquiry.id}`}
                          className="inline-flex items-center text-sm text-[var(--primary-rose)] hover:text-[var(--primary-rose)]/80"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View Details
                        </Link>

                        <div className="flex items-center space-x-2">
                          <label className="text-xs text-gray-500">Status:</label>
                          <select
                            value={inquiry.status}
                            onChange={(e) => handleStatusUpdate(inquiry.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-[var(--primary-rose)] focus:border-[var(--primary-rose)]"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="CONTACTED">Responded</option>
                            <option value="FULFILLED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                          </select>
                        </div>

                        {/* <div className="flex items-center space-x-2">
                          <label className="text-xs text-gray-500">Priority:</label>
                          <select
                            value={inquiry.priority}
                            onChange={(e) => handlePriorityUpdate(inquiry.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-[var(--primary-rose)] focus:border-[var(--primary-rose)]"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No inquiries</h3>
              <p className="mt-1 text-sm text-gray-500">
                Customer inquiries will appear here when they contact you.
              </p>
            </div>
          )}

          {/* Pagination */}
          {inquiries.length > 0 && totalPages > 1 && (
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

export default InquiriesPage;
