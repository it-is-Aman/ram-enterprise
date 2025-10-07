import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrashIcon, 
  PlusIcon, 
  MinusIcon,
  ArrowLeftIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { cartAPI } from '../../services';

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  // For demo purposes, using userId = 1. In real app, get from auth context
  const userId = 1;

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get(userId);
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating(prev => ({ ...prev, [itemId]: true }));
      await cartAPI.updateItem(userId, itemId, newQuantity);
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Error updating quantity');
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItem = async (itemId) => {
    if (window.confirm('Remove this item from cart?')) {
      try {
        await cartAPI.removeItem(userId, itemId);
        fetchCart();
      } catch (error) {
        console.error('Error removing item:', error);
        alert('Error removing item');
      }
    }
  };

  const clearCart = async () => {
    if (window.confirm('Clear all items from cart?')) {
      try {
        await cartAPI.clear(userId);
        fetchCart();
      } catch (error) {
        console.error('Error clearing cart:', error);
        alert('Error clearing cart');
      }
    }
  };

  const calculateSubtotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.product.price * (1 - item.product.discount / 100);
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.18; // 18% GST
    return subtotal + tax;
  };

  const proceedToCheckout = () => {
    if (cart?.items?.length > 0) {
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
      </div>
    );
  }

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
              <Link to="/" className="text-2xl font-bold text-red-600">
                Rudra Exports
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-red-600">Home</Link>
              <Link to="/products" className="text-gray-700 hover:text-red-600">Products</Link>
              <Link to="/contact" className="text-gray-700 hover:text-red-600">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          {cart?.items?.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Clear Cart
            </button>
          )}
        </div>

        {!cart?.items || cart.items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBagIcon className="mx-auto h-24 w-24 text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => {
                const product = item.product;
                const discountedPrice = product.price * (1 - product.discount / 100);
                const itemTotal = discountedPrice * item.quantity;

                return (
                  <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <div className="w-8 h-8 bg-gray-300 rounded"></div>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              <Link 
                                to={`/product/${product.id}`}
                                className="hover:text-red-600 transition-colors"
                              >
                                {product.name}
                              </Link>
                            </h3>
                            <p className="text-sm text-gray-600">{product.category?.name}</p>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-bold text-red-600">
                              ₹{discountedPrice.toFixed(2)}
                            </span>
                            {product.discount > 0 && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{product.price.toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || updating[item.id]}
                                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <MinusIcon className="h-4 w-4" />
                              </button>
                              
                              <span className="px-4 py-2 border-l border-r border-gray-300 min-w-[3rem] text-center">
                                {updating[item.id] ? '...' : item.quantity}
                              </span>
                              
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={updating[item.id] || item.quantity >= product.stock}
                                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="text-right min-w-[5rem]">
                              <span className="text-lg font-semibold text-gray-900">
                                ₹{itemTotal.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Stock Warning */}
                        {item.quantity >= product.stock && (
                          <p className="text-sm text-amber-600 mt-2">
                            Maximum available quantity: {product.stock}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cart.items.length} items)</span>
                    <span className="font-medium">₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (18%)</span>
                    <span className="font-medium">₹{(calculateSubtotal() * 0.18).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-red-600">₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={proceedToCheckout}
                  className="w-full bg-red-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-red-700 transition-colors mb-4"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/products"
                  className="block w-full text-center py-3 px-6 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </Link>

                {/* Security Features */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Secure checkout with SSL</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Free shipping on all orders</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Easy returns & exchanges</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
