import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Loading from './components/Loading';
import { useStore } from './store/useStore';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Builder = lazy(() => import('./pages/Builder'));
const Gallery = lazy(() => import('./pages/Gallery'));
const RecipeDetail = lazy(() => import('./pages/RecipeDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Auth = lazy(() => import('./pages/Auth'));
const Orders = lazy(() => import('./pages/Orders'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Gifts = lazy(() => import('./pages/Gifts'));
const AdminMonitor = lazy(() => import('./pages/AdminMonitor'));
const About = lazy(() => import('./pages/About'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

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
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="admin/monitor" element={<AdminRoute><AdminMonitor /></AdminRoute>} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
