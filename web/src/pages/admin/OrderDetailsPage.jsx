import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, TruckIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { ordersAPI } from '../../services';

const OrderDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getById(id);
      setOrder(response.data || response);
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Error loading order data');
      navigate('/admin/orders');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === order.status) return;
    
    let trackingNumber = order.trackingNumber;
    if (newStatus === 'SHIPPED' && !trackingNumber) {
      trackingNumber = prompt('Enter tracking number:');
      if (!trackingNumber) return;
    }

    try {
      await ordersAPI.updateStatus(id, newStatus, trackingNumber);
      fetchOrder();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon, text: 'Pending' },
      PAID: { color: 'bg-blue-100 text-blue-800', icon: CheckCircleIcon, text: 'Paid' },
      PROCESSING: { color: 'bg-purple-100 text-purple-800', icon: ClockIcon, text: 'Processing' },
      SHIPPED: { color: 'bg-indigo-100 text-indigo-800', icon: TruckIcon, text: 'Shipped' },
      DELIVERED: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, text: 'Delivered' },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircleIcon, text: 'Cancelled' },
      REFUNDED: { color: 'bg-gray-100 text-gray-800', icon: XCircleIcon, text: 'Refunded' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="h-4 w-4 mr-1" />
        {config.text}
      </span>
    );
  };

//   const getPaymentStatusBadge = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       paid: 'bg-green-100 text-green-800',
//       failed: 'bg-red-100 text-red-800',
//       refunded: 'bg-gray-100 text-gray-800'
//     };

//     return (
//       <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[status] || colors.pending}`}>
//         {/* {status.charAt(0).toUpperCase() + status.slice(1)} */}
//       </span>
//     );
//   };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-rose)]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Order not found</p>
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
              onClick={() => navigate('/admin/orders')}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Order #{order.orderNumber}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {getStatusBadge(order.status)}
            {/* {getPaymentStatusBadge(order.paymentStatus)} */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {order.items?.map((item, index) => (
                <div key={index} className="p-6 flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-16 h-16">
                    {item.product?.images && item.product.images.length > 0 ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {item.product?.name || 'Product not found'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      Price: ₹{item.price?.toLocaleString()}
                    </p>
                  </div>

                  {/* Total */}
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{(order.total - order.shippingCost).toLocaleString()}</span>
                </div>
                
                {order.shippingCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">₹{order.shippingCost.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-lg font-medium border-t border-gray-200 pt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Update Order Status</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED','REFUNDED'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    order.status === status
                      ? 'bg-[var(--primary-rose)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {order.trackingNumber && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <TruckIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-blue-800">
                    Tracking Number: {order.trackingNumber}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
            
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Customer</dt>
                <dd className="text-sm text-gray-900">
                  {order.user?.name || order.shippingAddress?.name || 'Guest'}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900">
                  {order.user?.email || order.shippingAddress?.email || 'N/A'}
                </dd>
              </div>
              
              {order.user?.phone && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="text-sm text-gray-900">{order.user.phone}</dd>
                </div>
              )}

              {order.user && (
                <div className="pt-3 border-t border-gray-200">
                  <Link
                    to={`/admin/customers/${order.user.id}`}
                    className="text-sm text-[var(--primary-rose)] hover:text-[var(--primary-rose)]/80"
                  >
                    View Customer Details →
                  </Link>
                </div>
              )}
            </dl>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
              
              <div className="text-sm text-gray-900 space-y-1">
                <div>{order.shippingAddress.name}</div>
                <div>{order.shippingAddress.address}</div>
                <div>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </div>
                <div>{order.shippingAddress.country}</div>
                {order.shippingAddress.phone && (
                  <div className="pt-2 border-t border-gray-200 text-gray-600">
                    Phone: {order.shippingAddress.phone}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Actions</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-rose)] focus:border-[var(--primary-rose)]"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
            
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                <dd className="text-sm text-gray-900">{order.paymentMethod || 'N/A'}</dd>
              </div>
              
              {/* <div>
                <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                <dd className="text-sm text-gray-900">{getPaymentStatusBadge(order.paymentStatus)}</dd>
              </div> */}
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                <dd className="text-lg font-semibold text-gray-900">₹{order.totalAmount.toLocaleString()}</dd>
              </div>
            </dl>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
            
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Order ID</dt>
                <dd className="text-gray-900 font-mono">{order.id}</dd>
              </div>
              
              <div>
                <dt className="text-gray-500">Order Number</dt>
                <dd className="text-gray-900 font-mono">{order.orderNumber}</dd>
              </div>
              
              <div>
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                </dd>
              </div>
              
              <div>
                <dt className="text-gray-500">Last Updated</dt>
                <dd className="text-gray-900">
                  {new Date(order.updatedAt).toLocaleDateString()} at {new Date(order.updatedAt).toLocaleTimeString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
