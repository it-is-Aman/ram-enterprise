import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductsPage from './pages/admin/ProductsPage';
import AddProductPage from './pages/admin/AddProductPage';
import EditProductPage from './pages/admin/EditProductPage';
import ProductDetailsPage from './pages/admin/ProductDetailsPage';
import OrdersPage from './pages/admin/OrdersPage';
import OrderDetailsPage from './pages/admin/OrderDetailsPage';
import CustomersPage from './pages/admin/CustomersPage';
import CustomerDetailsPage from './pages/admin/CustomerDetailsPage';
import InquiriesPage from './pages/admin/InquiriesPage';
import InquiryDetailsPage from './pages/admin/InquiryDetailsPage';
import ReviewsPage from './pages/admin/ReviewsPage';
import ReviewDetailsPage from './pages/admin/ReviewDetailsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to admin dashboard */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
          {/* Admin Pages */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/add" element={<AddProductPage />} />
            <Route path="products/:id" element={<ProductDetailsPage />} />
            <Route path="products/:id/edit" element={<EditProductPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/:id" element={<CustomerDetailsPage />} />
            <Route path="inquiries" element={<InquiriesPage />} />
            <Route path="inquiries/:id" element={<InquiryDetailsPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="reviews/:id" element={<ReviewDetailsPage />} />
          </Route>        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
