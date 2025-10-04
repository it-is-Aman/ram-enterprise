import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  EyeIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ShoppingBagIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { usersAPI } from '../../services';
import { useDebounce } from '../../hooks/useDebounce';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    // isActive: '',
    hasOrders: ''
  });

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
        ...filters
      };
      
      const response = await usersAPI.getAll(params);
      setCustomers(response.data);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, filters]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

//   const handleStatusToggle = async (customerId, currentStatus) => {
//     try {
//       await usersAPI.updateStatus(customerId, !currentStatus);
//       fetchCustomers();
//     } catch (error) {
//       console.error('Error updating customer status:', error);
//       alert('Error updating customer status');
//     }
//   };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage customer accounts and view their order history
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
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[var(--primary-rose)] focus:border-[var(--primary-rose)]"
            />
          </div>
          
          {/* <select
            value={filters.isActive}
            onChange={(e) => setFilters({...filters, isActive: e.target.value})}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-rose)] focus:border-[var(--primary-rose)]"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select> */}

          <select
            value={filters.hasOrders}
            onChange={(e) => setFilters({...filters, hasOrders: e.target.value})}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-rose)] focus:border-[var(--primary-rose)]"
          >
            <option value="">All Customers</option>
            <option value="true">With Orders</option>
            <option value="false">No Orders</option>
          </select>

          {/* <button
            onClick={() => {
              setSearchTerm('');
              setFilters({ isActive: '', hasOrders: '' });
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Clear Filters
          </button> */}
        </div>
      </div>

      {/* Customers Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-rose)]"></div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {customers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {customers.map((customer) => (
                <div key={customer.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  {/* Customer Avatar */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex-shrink-0">
                      {customer.avatar ? (
                        <img
                          src={customer.avatar}
                          alt={customer.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {customer.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ID: {customer.id}
                      </p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-3">
                    {customer.email && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <EnvelopeIcon className="h-4 w-4" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                    )}
                    
                    {customer.phone && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <PhoneIcon className="h-4 w-4" />
                        <span>{customer.phone}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ShoppingBagIcon className="h-4 w-4" />
                      <span>{customer.orderCount || 0} orders</span>
                    </div>

                    <div className="text-sm text-gray-500">
                      Joined: {new Date(customer.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      {/* <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </span> */}

                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/admin/customers/${customer.id}`}
                          className="p-2 text-gray-400 hover:text-gray-600"
                          title="View Details"
                        >
                          <EyeIcon className="h-5 w-5" />
                          View Details

                        </Link>
                        
                        {/* <button
                          onClick={() => handleStatusToggle(customer.id, customer.isActive)}
                          className={`px-3 py-1 text-xs font-medium rounded ${
                            customer.isActive
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                          title={customer.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {customer.isActive ? 'Deactivate' : 'Activate'}
                        </button> */}
                      </div>
                    </div>
                  </div>

                  {/* Customer Stats */}
                  {customer.totalSpent && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-sm">
                        <span className="text-gray-500">Total Spent: </span>
                        <span className="font-medium text-gray-900">
                          ₹{customer.totalSpent.toLocaleString()}
                        </span>
                      </div>
                      
                      {customer.averageOrderValue && (
                        <div className="text-sm mt-1">
                          <span className="text-gray-500">Avg. Order: </span>
                          <span className="font-medium text-gray-900">
                            ₹{customer.averageOrderValue.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No customers</h3>
              <p className="mt-1 text-sm text-gray-500">
                Customers will appear here when they register or place orders.
              </p>
            </div>
          )}

          {/* Pagination */}
          {customers.length > 0 && totalPages > 1 && (
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

export default CustomersPage;
