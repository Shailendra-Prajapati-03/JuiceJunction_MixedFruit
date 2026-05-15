import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  ShoppingCart, Layout as LayoutIcon, Home as HomeIcon,
  Sparkles, Package, Gift, User, LogOut, Menu, X, HelpCircle, Headphones
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import Footer from './Footer';
import NotificationDropdown from './NotificationDropdown';
import AIChat from './AIChat';
import CookieConsent from './CookieConsent';

const Layout: React.FC = () => {
  const location = useLocation();
  const { 
    cart, isAuthenticated, user, logout, 
    fetchNotifications, fetchRewards, loadCartFromBackend 
  } = useStore();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      fetchRewards();
      loadCartFromBackend();
    }
  }, [isAuthenticated]);

  const navItems = [
    { name: 'Home',    path: '/',        icon: HomeIcon    },
    { name: 'Builder', path: '/builder', icon: Sparkles    },
    { name: 'Gallery', path: '/gallery', icon: LayoutIcon  },
    { name: 'Orders',  path: '/orders',  icon: Package     },
    { name: 'Gifts',   path: '/gifts',   icon: Gift        },
  ];

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary-500 selection:text-white bg-[#FFFBF9] overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 px-2 md:px-6 py-2 md:py-6 pointer-events-none">
        <nav className="container mx-auto bg-white/95 backdrop-blur-3xl border border-white/40 rounded-2xl md:rounded-full px-4 md:px-10 py-2.5 md:py-4 flex items-center justify-between shadow-2xl shadow-black/5 pointer-events-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-lg shadow-primary-500/20 group-hover:rotate-6 transition-transform">
              JJ
            </div>
            <div className="flex-col hidden sm:flex">
              <span className="text-lg md:text-xl font-black text-slate-900 tracking-tighter leading-none">JuiceJunction</span>
              <span className="text-[8px] md:text-[10px] font-black text-primary-500 uppercase tracking-widest mt-1">Premium Blends</span>
            </div>
          </Link>

          {/* Nav links — hide on small screens, show from md */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'text-xs font-black uppercase tracking-widest transition-all hover:text-primary-500 relative py-2',
                  location.pathname === item.path ? 'text-slate-900' : 'text-slate-400'
                )}
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Support (WhatsApp) */}
            <a 
              href="https://wa.me/91XXXXXXXXXX?text=Hello%20JuiceJunction%20Support%2C%20I%20need%20help%20with%20my%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 md:p-3 bg-slate-50 rounded-xl md:rounded-2xl hover:bg-slate-100 transition-colors text-slate-600 group"
              title="Chat with Support Team"
            >
              <Headphones className="w-5 h-5 md:w-6 md:h-6 group-hover:text-primary-500 transition-colors" />
            </a>

            {/* Notification bell */}
            {isAuthenticated && <NotificationDropdown />}

            {/* Auth Button */}
            {isAuthenticated ? (
              <div className="relative group/auth">
                <button className="p-2 md:p-3 bg-slate-50 rounded-xl md:rounded-2xl hover:bg-slate-100 transition-colors flex items-center gap-2">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
                  <span className="hidden md:block text-xs font-bold text-slate-700">{user?.username}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl opacity-0 invisible group-hover/auth:opacity-100 group-hover/auth:visible transition-all">
                  <button onClick={logout} className="w-full text-left px-4 py-3 text-red-500 text-sm font-bold flex items-center gap-2 hover:bg-slate-50 rounded-2xl transition-colors">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/auth" className="p-2 md:p-3 bg-slate-50 rounded-xl md:rounded-2xl hover:bg-slate-100 transition-colors text-slate-600 flex items-center gap-2">
                <User className="w-5 h-5 md:w-6 md:h-6" />
                <span className="hidden md:block text-xs font-black uppercase tracking-widest text-slate-700">Login</span>
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              id="cart-icon"
              className="relative p-2 md:p-3 bg-slate-50 rounded-xl md:rounded-2xl hover:bg-slate-100 transition-colors group"
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-slate-600 group-hover:text-primary-500 transition-colors" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-primary-500 text-white text-[8px] md:text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow pt-16 md:pt-32">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-2 flex items-center justify-between shadow-2xl shadow-black/40">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex-1 flex flex-col items-center gap-1 group"
              >
                <div className={clsx(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
                  isActive ? 'bg-primary-500 text-white scale-105 shadow-lg shadow-primary-500/20' : 'text-slate-500'
                )}>
                  <item.icon size={18} />
                </div>
                <span className={clsx(
                  "text-[8px] font-black uppercase tracking-[0.1em] transition-colors",
                  isActive ? "text-primary-500" : "text-slate-400"
                )}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <Footer />
      <AIChat />
      <CookieConsent />
    </div>
  );
};

export default Layout;
