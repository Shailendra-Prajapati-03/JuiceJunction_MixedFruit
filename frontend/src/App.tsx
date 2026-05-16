import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Loading from './components/Loading';
import { useStore } from './store/useStore';
import VendorLayout from './pages/vendor/VendorLayout';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Builder = lazy(() => import('./pages/Builder'));
const Gallery = lazy(() => import('./pages/Gallery'));
const RecipeDetail = lazy(() => import('./pages/RecipeDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Auth = lazy(() => import('./pages/Auth'));
const Orders = lazy(() => import('./pages/Orders'));
const Gifts = lazy(() => import('./pages/Gifts'));
const AdminMonitor = lazy(() => import('./pages/admin/AdminDashboard'));
const About = lazy(() => import('./pages/About'));
const Privacy = lazy(() => import('./pages/legal/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/legal/TermsAndConditions'));

// Vendor Pages
const VendorLogin = lazy(() => import('./pages/vendor/VendorLogin'));
const VendorRegister = lazy(() => import('./pages/vendor/VendorRegister'));
const VendorDashboard = lazy(() => import('./pages/vendor/VendorDashboard'));
const VendorOrders = lazy(() => import('./pages/vendor/VendorOrders'));
const VendorProducts = lazy(() => import('./pages/vendor/VendorProducts'));

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useStore();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

// Admin Route Component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useStore();
  if (!isAuthenticated || !user?.is_staff) return <Navigate to="/" replace />;
  return <>{children}</>;
};

// Vendor Route Component
const VendorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useStore();
  if (!isAuthenticated || !user?.is_vendor) return <Navigate to="/vendor/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="builder" element={<Builder />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="recipe/:id" element={<RecipeDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="auth" element={<Auth />} />
            <Route path="about" element={<About />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="gifts" element={<Gifts />} />
            
            {/* Protected Routes */}
            <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="dashboard" element={<Navigate to="/orders" replace />} />
            
            {/* Admin Routes */}
            <Route path="admin/monitor" element={<AdminRoute><AdminMonitor /></AdminRoute>} />
          </Route>

          {/* Vendor Routes (Standalone without main layout) */}
          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route path="/vendor/register" element={<VendorRegister />} />
          <Route path="/vendor" element={<VendorRoute><VendorLayout /></VendorRoute>}>
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="orders" element={<VendorOrders />} />
            <Route path="products" element={<VendorProducts />} />
            <Route path="settings" element={<div className="p-8">Vendor Settings (Coming Soon)</div>} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
