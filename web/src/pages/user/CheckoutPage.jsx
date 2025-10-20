import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  CreditCardIcon,
  TruckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { cartAPI, ordersAPI, productsAPI } from "../../services";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [cart, setCart] = useState(null);
  const [singleProduct, setSingleProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const productId = searchParams.get("productId");
  const quantity = parseInt(searchParams.get("quantity")) || 1;
  const checkoutMode = productId ? "single" : "cart";

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const userId = 59;

  useEffect(() => {
    if (checkoutMode === "cart") {
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
        navigate("/cart");
        return;
      }
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      navigate("/cart");
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
        quantity: quantity,
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      navigate("/products");
    } finally {
      setLoading(false);
    }
  }, [productId, quantity, navigate]);

  const getOrderItems = () => {
    if (checkoutMode === "single" && singleProduct) {
      return [
        {
          product: singleProduct,
          quantity: singleProduct.quantity,
        },
      ];
    }
    return cart?.items || [];
  };

  const calculateSubtotal = () => {
    const items = getOrderItems();
    return items.reduce((total, item) => {
      const price = item.product.price * (1 - item.product.discount / 100);
      return total + price * item.quantity;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.18;
    return subtotal + tax;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!shippingInfo.address.trim()) newErrors.address = "Address is required";
    if (!shippingInfo.city.trim()) newErrors.city = "City is required";
    if (!shippingInfo.state.trim()) newErrors.state = "State is required";
    if (!shippingInfo.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(shippingInfo.pincode)) {
      newErrors.pincode = "Invalid pincode format";
    }
    if (!shippingInfo.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(shippingInfo.phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    setProcessing(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Payment gateway failed to load. Try again.");
        return;
      }

      const totalAmount = calculateTotal();
      const orderItems = getOrderItems();

      const orderData = {
        userId,
        totalAmount,
        shippingAddress: shippingInfo.address,
        shippingCity: shippingInfo.city,
        shippingState: shippingInfo.state,
        shippingPincode: shippingInfo.pincode,
        shippingPhone: shippingInfo.phone,
        items: orderItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price * (1 - item.product.discount / 100),
        })),
      };

      const options = {
        key: "rzp_test_9999999999",
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        name: "Rudra Exports",
        description: `Order for ${orderItems.length} item(s)`,
        image: "/logo.png",
        handler: async function (response) {
          try {
            const finalOrderData = {
              ...orderData,
              paymentId: response.razorpay_payment_id,
              paymentMethod: "razorpay",
              status: "PAID",
            };

            await ordersAPI.create(finalOrderData);
            if (checkoutMode === "cart") await cartAPI.clear(userId);

            navigate(`/order-success?paymentId=${response.razorpay_payment_id}`);
          } catch (error) {
            console.error("Error creating order:", error);
            alert("Payment done but order not created. Contact support.");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: shippingInfo.phone,
        },
        notes: { address: shippingInfo.address, city: shippingInfo.city },
        theme: { color: "#e43d12" },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please retry.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ebe9e1] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#e43d12]"></div>
      </div>
    );
  }

  const orderItems = getOrderItems();
  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-[#ebe9e1]">
   

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shipping Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#ebe9e1]">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Shipping Information
              </h2>

              <form className="space-y-6">
                {["address", "city", "state", "pincode", "phone"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {field} *
                    </label>
                    {field === "address" ? (
                      <textarea
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Enter your complete address"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#e43d12] focus:border-[#e43d12] bg-[#ebe9e1] ${
                          errors.address ? "border-red-300" : "border-gray-300"
                        }`}
                      />
                    ) : (
                      <input
                        type={field === "phone" ? "tel" : "text"}
                        name={field}
                        value={shippingInfo[field]}
                        onChange={handleInputChange}
                        placeholder={`Enter ${field}`}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#e43d12] focus:border-[#e43d12] bg-[#ebe9e1] ${
                          errors[field]
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                    )}
                    {errors[field] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[field]}
                      </p>
                    )}
                  </div>
                ))}
              </form>

              {/* Security icons */}
              <div className="mt-8 pt-6 border-t border-[#ebe9e1]">
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
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#ebe9e1]">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {orderItems.map((item, index) => {
                  const product = item.product;
                  const discountedPrice =
                    product.price * (1 - product.discount / 100);
                  const itemTotal = discountedPrice * item.quantity;

                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 border border-[#ebe9e1] rounded-lg hover:shadow transition"
                    >
                      <div className="w-16 h-16 bg-[#ebe9e1] rounded-lg overflow-hidden flex-shrink-0">
                        {product.images?.length ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Img
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-[#e43d12]">
                          ₹{itemTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 border-t pt-6 border-[#ebe9e1]">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>GST (18%)</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t pt-3 border-[#ebe9e1]">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-[#e43d12]">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-[#e43d12] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <CreditCardIcon className="h-6 w-6" />
                <span>
                  {processing ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
                </span>
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our{" "}
                <span className="text-[#e43d12]">Terms of Service</span> and{" "}
                <span className="text-[#e43d12]">Privacy Policy</span>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
