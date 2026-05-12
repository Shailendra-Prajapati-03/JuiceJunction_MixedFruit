import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Builder from './pages/Builder';
import Gallery from './pages/Gallery';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Gifts from './pages/Gifts';
import Auth from './pages/Auth';
import VendorLogin from './pages/vendor/VendorLogin';
import VendorRegister from './pages/vendor/VendorRegister';
import VendorLayout from './pages/vendor/VendorLayout';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorProducts from './pages/vendor/VendorProducts';
import VendorOrders from './pages/vendor/VendorOrders';
import About from './pages/About';
import Support from './pages/Support';
import RecipeDetail from './pages/RecipeDetail';
import Legal from './pages/Legal';
import Subscriptions from './pages/Subscriptions';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsAndConditions from './pages/legal/TermsAndConditions';
import RefundPolicy from './pages/legal/RefundPolicy';
import CancellationPolicy from './pages/legal/CancellationPolicy';
import VendorAgreement from './pages/legal/VendorAgreement';
import CookiePolicy from './pages/legal/CookiePolicy';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="builder" element={<Builder />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="cart" element={<Cart />} />
            <Route path="orders" element={<Orders />} />
            <Route path="gifts" element={<Gifts />} />
            <Route path="auth" element={<Auth />} />
            <Route path="about" element={<About />} />
            <Route path="support" element={<Support />} />
            <Route path="legal" element={<Legal />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsAndConditions />} />
            <Route path="refund-policy" element={<RefundPolicy />} />
            <Route path="cancellation-policy" element={<CancellationPolicy />} />
            <Route path="vendor-agreement" element={<VendorAgreement />} />
            <Route path="cookie-policy" element={<CookiePolicy />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="recipe/:id" element={<RecipeDetail />} />
          </Route>
          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route path="/vendor/register" element={<VendorRegister />} />
          <Route path="/vendor" element={<VendorLayout />}>
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="products" element={<VendorProducts />} />
            <Route path="orders" element={<VendorOrders />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
