import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  CreditCardIcon,
  TruckIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { cartAPI, ordersAPI, productsAPI } from '../../services';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [cart, setCart] = useState(null);
  const [singleProduct, setSingleProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Checkout mode: 'cart' or 'single'
  const productId = searchParams.get('productId');
  const quantity = parseInt(searchParams.get('quantity')) || 1;
  const checkoutMode = productId ? 'single' : 'cart';

  // Form data
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  // For demo purposes, using userId = 1
  const userId = 1;

  useEffect(() => {
    if (checkoutMode === 'cart') {
      fetchCart();
    } else {
      fetchSingleProduct();
    }
  }, [checkoutMode, fetchCart, fetchSingleProduct]);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get(userId);
      if (!response.data?.items || response.data.items.length === 0) {
        navigate('/cart');
        return;
      }
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  }, [userId, navigate]);

  const fetchSingleProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(productId);
      setSingleProduct({
        ...response.data,
        quantity: quantity
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  }, [productId, quantity, navigate]);

  const getOrderItems = () => {
    if (checkoutMode === 'single' && singleProduct) {
      return [{
        product: singleProduct,
        quantity: singleProduct.quantity
      }];
    }
    return cart?.items || [];
  };

  const calculateSubtotal = () => {
    const items = getOrderItems();
    return items.reduce((total, item) => {
      const price = item.product.price * (1 - item.product.discount / 100);
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.18; // 18% GST
    return subtotal + tax;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!shippingInfo.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!shippingInfo.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!shippingInfo.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!shippingInfo.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(shippingInfo.pincode)) {
      newErrors.pincode = 'Invalid pincode format';
    }
    if (!shippingInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(shippingInfo.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    setProcessing(true);
    
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load payment gateway. Please try again.');
        return;
      }

      const totalAmount = calculateTotal();
      const orderItems = getOrderItems();

      // Create order data
      const orderData = {
        userId: userId,
        totalAmount: totalAmount,
        shippingAddress: shippingInfo.address,
        shippingCity: shippingInfo.city,
        shippingState: shippingInfo.state,
        shippingPincode: shippingInfo.pincode,
        shippingPhone: shippingInfo.phone,
        items: orderItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price * (1 - item.product.discount / 100)
        }))
      };

      // For demo purposes, we'll simulate the order creation
      // In real implementation, you would:
      // 1. Create order on backend first
      // 2. Get Razorpay order ID from backend
      // 3. Use that order ID in Razorpay options

      const options = {
        key: 'rzp_test_9999999999', // Replace with your Razorpay key
        amount: Math.round(totalAmount * 100), // Amount in paise
        currency: 'INR',
        name: 'Rudra Exports',
        description: `Order for ${orderItems.length} item(s)`,
        image: '/logo.png', // Your logo
        handler: async function (response) {
          try {
            // Payment successful, create order
            const finalOrderData = {
              ...orderData,
              paymentId: response.razorpay_payment_id,
              paymentMethod: 'razorpay',
              status: 'PAID'
            };

            await ordersAPI.create(finalOrderData);

            // Clear cart if checkout from cart
            if (checkoutMode === 'cart') {
              await cartAPI.clear(userId);
            }

            // Redirect to success page
            navigate(`/order-success?paymentId=${response.razorpay_payment_id}`);
          } catch (error) {
            console.error('Error creating order:', error);
            alert('Payment successful but order creation failed. Please contact support.');
          }
        },
        prefill: {
          name: 'Customer Name', // You can get this from user profile
          email: 'customer@example.com',
          contact: shippingInfo.phone
        },
        notes: {
          address: shippingInfo.address,
          city: shippingInfo.city
        },
        theme: {
          color: '#DC2626' // Red color matching your theme
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const orderItems = getOrderItems();
  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-red-600">Checkout</h1>
            </div>
            <div className="text-sm text-gray-600">
              Secure Checkout
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shipping Information Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Address *
                  </label>
                  <textarea
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.address ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your complete address"
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        errors.city ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="City"
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        errors.state ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="State"
                    />
                    {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={shippingInfo.pincode}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        errors.pincode ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="123456"
                    />
                    {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="1234567890"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>
                </div>
              </form>

              {/* Security Features */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                    <span>Secure SSL</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TruckIcon className="h-5 w-5 text-green-600" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCardIcon className="h-5 w-5 text-green-600" />
                    <span>Safe Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {orderItems.map((item, index) => {
                  const product = item.product;
                  const discountedPrice = product.price * (1 - product.discount / 100);
                  const itemTotal = discountedPrice * item.quantity;

                  return (
                    <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <div className="w-6 h-6 bg-gray-300 rounded"></div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium text-red-600">₹{itemTotal.toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 border-t pt-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-red-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-red-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <CreditCardIcon className="h-6 w-6" />
                <span>
                  {processing ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
                </span>
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our Terms of Service and Privacy Policy.
                Your payment will be processed securely through Razorpay.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
