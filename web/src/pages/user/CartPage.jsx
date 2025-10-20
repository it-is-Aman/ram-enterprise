import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { cartAPI } from "../../services";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  const userId = 59; // Demo: replace with logged-in user ID

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get(userId);
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      setUpdating((prev) => ({ ...prev, [itemId]: true }));
      await cartAPI.updateItem(userId, itemId, newQuantity);
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Error updating quantity");
    } finally {
      setUpdating((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItem = async (itemId) => {
    if (window.confirm("Remove this item from cart?")) {
      try {
        await cartAPI.removeItem(userId, itemId);
        fetchCart();
      } catch (error) {
        console.error("Error removing item:", error);
        alert("Error removing item");
      }
    }
  };

  const clearCart = async () => {
    if (window.confirm("Clear all items from cart?")) {
      try {
        await cartAPI.clear(userId);
        fetchCart();
      } catch (error) {
        console.error("Error clearing cart:", error);
        alert("Error clearing cart");
      }
    }
  };

  const calculateSubtotal = () =>
    cart?.items?.reduce((total, item) => {
      const price = item.product.price * (1 - item.product.discount / 100);
      return total + price * item.quantity;
    }, 0) || 0;

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + subtotal * 0.18; // GST 18%
  };

  const proceedToCheckout = () => {
    if (cart?.items?.length > 0) navigate("/checkout");
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#ebe9e1" }}
      >
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#e43d12]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#ebe9e1" }}>
     

      {/* Cart Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          {cart?.items?.length > 0 && (
            <button
              onClick={clearCart}
              className="text-[#e43d12] hover:underline font-medium"
            >
              Clear Cart
            </button>
          )}
        </div>

        {!cart?.items?.length ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <ShoppingBagIcon className="mx-auto h-24 w-24 text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Start shopping to add items to your cart
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-[#e43d12] text-white font-medium rounded-lg hover:bg-red-700 transition-all"
            >
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item, i) => {
                const product = item.product;
                const discountedPrice =
                  product.price * (1 - product.discount / 100);
                const itemTotal = discountedPrice * item.quantity;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-24 h-24 bg-[#ebe9e1] rounded-lg overflow-hidden flex-shrink-0">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#ebe9e1]">
                            <div className="w-8 h-8 bg-gray-300 rounded"></div>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-[#e43d12] transition-colors cursor-pointer">
                              <Link to={`/product/${product.id}`}>
                                {product.name}
                              </Link>
                            </h3>
                            <p className="text-sm text-gray-600">
                              {product.category?.name}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-gray-400 hover:text-[#e43d12] transition-colors"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <span
                              className="text-lg font-bold"
                              style={{ color: "#e43d12" }}
                            >
                              ₹{discountedPrice.toFixed(2)}
                            </span>
                            {product.discount > 0 && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{product.price.toFixed(2)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                disabled={
                                  item.quantity <= 1 || updating[item.id]
                                }
                                className="p-2 text-gray-600 hover:text-[#e43d12] disabled:opacity-50"
                              >
                                <MinusIcon className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-2 border-l border-r border-gray-300 min-w-[3rem] text-center">
                                {updating[item.id] ? "..." : item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                disabled={
                                  updating[item.id] ||
                                  item.quantity >= product.stock
                                }
                                className="p-2 text-gray-600 hover:text-[#e43d12] disabled:opacity-50"
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

                        {item.quantity >= product.stock && (
                          <p className="text-sm text-amber-600 mt-2">
                            Maximum available quantity: {product.stock}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 bg-white rounded-xl shadow-md p-6 sticky top-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span className="font-medium">
                    ₹{calculateSubtotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span className="font-medium">
                    ₹{(calculateSubtotal() * 0.18).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span style={{ color: "#e43d12" }}>
                    ₹{calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={proceedToCheckout}
                className="w-full bg-[#e43d12] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-red-700 transition-all mb-4"
              >
                Proceed to Checkout
              </button>
              <Link
                to="/products"
                className="block w-full text-center py-3 px-6 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-[#ebe9e1] transition-all"
              >
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
