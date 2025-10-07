import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Admin Components
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProductsPage from './pages/admin/ProductsPage';
import AddProductPage from './pages/admin/AddProductPage';
import EditProductPage from './pages/admin/EditProductPage';
import AdminProductDetailsPage from './pages/admin/ProductDetailsPage';
import OrdersPage from './pages/admin/OrdersPage';
import OrderDetailsPage from './pages/admin/OrderDetailsPage';
import CustomersPage from './pages/admin/CustomersPage';
import CustomerDetailsPage from './pages/admin/CustomerDetailsPage';
import InquiriesPage from './pages/admin/InquiriesPage';
import InquiryDetailsPage from './pages/admin/InquiryDetailsPage';
import ReviewsPage from './pages/admin/ReviewsPage';
import ReviewDetailsPage from './pages/admin/ReviewDetailsPage';

// User Components
import HomePage from './pages/user/HomePage';
import ProductsPage from './pages/user/ProductsPage';
import ProductDetailPage from './pages/user/ProductDetailPage';
import CartPage from './pages/user/CartPage';
import CheckoutPage from './pages/user/CheckoutPage';
import OrderSuccessPage from './pages/user/OrderSuccessPage';
import ContactPage from './pages/user/ContactPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User-Facing Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Admin Pages */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/add" element={<AddProductPage />} />
          <Route path="products/:id" element={<AdminProductDetailsPage />} />
          <Route path="products/:id/edit" element={<EditProductPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/:id" element={<CustomerDetailsPage />} />
          <Route path="inquiries" element={<InquiriesPage />} />
          <Route path="inquiries/:id" element={<InquiryDetailsPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="reviews/:id" element={<ReviewDetailsPage />} />
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
