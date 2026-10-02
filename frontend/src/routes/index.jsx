import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import { ProtectedRoute, AdminRoute, GuestRoute } from './guards';

// Public pages
import HomePage from '../pages/Home';
import VegetablesPage from '../pages/Vegetables';
import BasketsPage from '../pages/Baskets';
import CartPage from '../pages/Cart';
import CheckoutPage from '../pages/Checkout';
import SubscriptionsPage from '../pages/Subscriptions';
import AboutPage from '../pages/About';
import ContactPage from '../pages/Contact';
import HowItWorksPage from '../pages/HowItWorks';

// Auth pages
import LoginPage from '../pages/auth/Login';
import RegisterPage from '../pages/auth/Register';

// Customer pages
import DashboardPage from '../pages/customer/Dashboard';
import MyOrdersPage from '../pages/customer/MyOrders';
import MySubscriptionsPage from '../pages/customer/MySubscriptions';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminTrialRequests from '../pages/admin/AdminTrialRequests';
import AdminCustomers from '../pages/admin/AdminCustomers';
import AdminDeliveries from '../pages/admin/AdminDeliveries';
import AdminReviews from '../pages/admin/AdminReviews';

// Lazy stubs for pages not yet fully built
const Stub = ({ name }) => (
  <div className="py-20 text-center page-container">
    <div className="text-5xl mb-4">🚧</div>
    <h2 className="text-xl font-bold text-gray-900 mb-2">{name}</h2>
    <p className="text-gray-500">Coming soon</p>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* Main site */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/vegetables" element={<VegetablesPage />} />
        <Route path="/baskets" element={<BasketsPage />} />
        <Route path="/basket" element={<CartPage />} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/trial" element={<HomePage />} />

        {/* Auth */}
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        {/* Customer */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
        <Route path="/my-orders/:id" element={<ProtectedRoute><Stub name="Order Detail" /></ProtectedRoute>} />
        <Route path="/my-subscriptions" element={<ProtectedRoute><MySubscriptionsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Stub name="My Profile" /></ProtectedRoute>} />

        {/* Legal */}
        <Route path="/privacy" element={<Stub name="Privacy Policy" />} />
        <Route path="/terms" element={<Stub name="Terms & Conditions" />} />
        <Route path="/refund-policy" element={<Stub name="Refund Policy" />} />

        {/* 404 */}
        <Route path="*" element={<Stub name="Page Not Found" />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="trial-requests" element={<AdminTrialRequests />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<Stub name="Categories Management" />} />
        <Route path="baskets" element={<Stub name="Baskets Management" />} />
        <Route path="subscriptions" element={<Stub name="Subscriptions Management" />} />
        <Route path="deliveries" element={<AdminDeliveries />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="reviews" element={<AdminReviews />} />
      </Route>
    </Routes>
  );
}
