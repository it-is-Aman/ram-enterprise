import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeftIcon, UserIcon, ShoppingBagIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { usersAPI } from '../../services';
import { Link, useNavigate, useParams } from 'react-router-dom';

const CustomerDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomer = useCallback(async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getById(id);
      setCustomer(response.data || response);
    } catch (error) {
      console.error('Error fetching customer:', error);
      alert('Error loading customer data');
      navigate('/admin/customers');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-rose)]"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Customer not found</p>
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
              onClick={() => navigate('/admin/customers')}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{customer.name}</h1>
              <p className="text-sm text-gray-500 mt-1">Customer ID: {customer.id}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {customer.role === 'ADMIN' ? 'Administrator' : 'Customer'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Profile */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            {/* Avatar */}
            <div className="flex items-center justify-center mb-6">
              {customer.avatar ? (
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                  <UserIcon className="h-12 w-12 text-gray-600" />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{customer.name}</h2>
              <p className="text-gray-600">{customer.email}</p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              {customer.email && (
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-900">{customer.email}</span>
                </div>
              )}
              
              {customer.phone && (
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-900">{customer.phone}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <ShoppingBagIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-900">{customer.orderCount || 0} orders</span>
              </div>
            </div>

            {/* Stats */}
            {customer.totalSpent && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{customer.totalSpent.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Total Spent</div>
                  
                  {customer.averageOrderValue && (
                    <div className="mt-2">
                      <div className="text-lg font-semibold text-gray-700">
                        ₹{customer.averageOrderValue.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">Average Order Value</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customer Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
            
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="text-sm text-gray-900">{customer.name}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900">{customer.email}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="text-sm text-gray-900">{customer.phone || 'N/A'}</dd>
              </div>
              
              {/* <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    customer.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </dd>
              </div> */}
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Registration Date</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(customer.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Order Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Statistics</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{customer.orderCount || 0}</div>
                <div className="text-sm text-gray-500">Total Orders</div>
              </div>
              
              {customer.totalSpent && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{customer.totalSpent.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Total Spent</div>
                </div>
              )}
              
              {customer.averageOrderValue && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{customer.averageOrderValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Avg Order Value</div>
                </div>
              )}
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {customer.lastOrderDate 
                    ? new Date(customer.lastOrderDate).toLocaleDateString() 
                    : 'N/A'}
                </div>
                <div className="text-sm text-gray-500">Last Order</div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          {customer.orders && customer.orders.length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {customer.orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="text-sm font-medium text-[var(--primary-rose)] hover:text-[var(--primary-rose)]/80"
                        >
                          Order #{order.orderNumber}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.items?.length || 0} items
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{order.totalAmount.toLocaleString()}
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200 text-center">
                <Link
                  to={`/admin/orders?customer=${customer.id}`}
                  className="text-sm text-[var(--primary-rose)] hover:text-[var(--primary-rose)]/80"
                >
                  View All Orders →
                </Link>
              </div>
            </div>
          )}

          {/* Addresses */}
          {customer.addresses && customer.addresses.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Addresses</h3>
              
              <div className="space-y-4">
                {customer.addresses.map((address, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{address.name}</h4>
                        <div className="text-sm text-gray-600 mt-1">
                          <div>{address.address}</div>
                          <div>{address.city}, {address.state} {address.zipCode}</div>
                          <div>{address.country}</div>
                          {address.phone && <div>Phone: {address.phone}</div>}
                        </div>
                      </div>
                      
                      {address.isDefault && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsPage;
