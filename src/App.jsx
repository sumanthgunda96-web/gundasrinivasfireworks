import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { ProductProvider } from './context/ProductContext';
import { ContentProvider } from './context/ContentContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
import TestSheets from './pages/TestSheets';

// Admin imports
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminContent from './pages/admin/AdminContent';

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <ProductProvider>
          <ContentProvider>
            <CartProvider>
              <Router>
                <Routes>
                  {/* Public Routes */}
                  <Route
                    path="/*"
                    element={
                      <div className="flex flex-col min-h-screen">
                        <Navbar />
                        <main className="flex-grow">
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                            <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
                            <Route path="/my-orders" element={<MyOrders />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/test-sheets" element={<TestSheets />} />
                          </Routes>
                        </main>
                        <Footer />
                      </div>
                    }
                  />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="content" element={<AdminContent />} />
                  </Route>
                </Routes>
              </Router>
            </CartProvider>
          </ContentProvider>
        </ProductProvider>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;
