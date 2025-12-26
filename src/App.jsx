import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BusinessProvider } from './context/BusinessContext';
import StoreShell from './layouts/StoreShell';
import PlatformHome from './pages/PlatformHome';

// Pages & Components imports
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderTracking from './pages/OrderTracking';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import Products from './components/Products';
import About from './components/About';
import Contact from './components/Contact';
import CreateStore from './pages/CreateStore';
import CreateBusinessAccount from './pages/CreateBusinessAccount';
import PlatformAdminDashboard from './pages/PlatformAdminDashboard';
import BusinessLogin from './pages/BusinessLogin';
import TestSheets from './pages/TestSheets';

// Admin imports
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminContent from './pages/admin/AdminContent';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Platform Landing */}
          {/* Platform Landing */}
          <Route path="/" element={<PlatformHome />} />

          {/* Seller Auth Routes */}
          <Route path="/a2z/seller/login" element={<BusinessLogin />} />
          <Route path="/a2z/seller/create-account" element={<CreateBusinessAccount />} />

          {/* SUPER ADMIN ROUTE */}
          <Route path="/a2z/platform/admin" element={<PlatformAdminDashboard />} />

          {/* Buyer Auth Routes */}
          <Route path="/a2z/buyer/login" element={<Login />} />
          <Route path="/a2z/buyer/register" element={<Register />} />

          <Route path="/a2z/forgot-password" element={<ForgotPassword />} />

          {/* Business/Store Routes */}
          {/* We wrap everything in BusinessProvider so the slug is available */}
          <Route path="/a2z/:businessSlug" element={
            <BusinessProvider>
              <StoreShell />
            </BusinessProvider>
          }>
            <Route index element={<Home />} />

            {/* Auth Routes within Store Context */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />

            {/* Store Functionality */}
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="order-tracking/:orderId" element={<OrderTracking />} />
            <Route path="my-orders" element={<MyOrders />} />
            <Route path="profile" element={<Profile />} />
            <Route path="products" element={<Products />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="test-sheets" element={<TestSheets />} />

            {/* Store Admin Routes */}
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="content" element={<AdminContent />} />
            </Route>

            {/* Catch all for store 404s? or just redirect to store home */}
            <Route path="*" element={<Navigate to="" replace />} />
          </Route>

          {/* Fallback for global 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
