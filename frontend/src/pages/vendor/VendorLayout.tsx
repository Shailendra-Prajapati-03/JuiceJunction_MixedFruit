import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, Package, 
  Settings, LogOut, Bell, Menu, X, 
  Store, ChevronLeft
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const VendorLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const menuItems = [
    { name: 'Dashboard', path: '/vendor/dashboard', icon: LayoutDashboard },
    { name: 'Orders',    path: '/vendor/orders',    icon: ShoppingBag     },
    { name: 'Products',  path: '/vendor/products',  icon: Package         },
    { name: 'Settings',  path: '/vendor/settings',  icon: Settings        },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 88 }}
        className="fixed inset-y-0 left-0 bg-white border-r border-slate-100 z-50 flex flex-col transition-all duration-300"
      >
        {/* Logo Section */}
        <div className="h-24 flex items-center px-6 gap-4 overflow-hidden border-b border-slate-50">
          <div className="w-12 h-12 bg-primary-500 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary-500/20">
            JJ
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-col whitespace-nowrap"
              >
                <span className="text-lg font-black text-slate-900 tracking-tighter block leading-none">VendorHub</span>
                <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest mt-1 block">JuiceJunction</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-grow py-8 px-4 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative',
                  isActive 
                    ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/10' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <item.icon size={22} className={clsx('flex-shrink-0', isActive ? 'scale-110' : 'group-hover:scale-110 transition-transform')} />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-black uppercase tracking-widest whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!isSidebarOpen && isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary-500 rounded-l-full shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile Section */}
        <div className="p-4 border-t border-slate-50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
          >
            <LogOut size={22} className="flex-shrink-0 group-hover:rotate-12 transition-transform" />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-sm font-black uppercase tracking-widest"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main 
        className="flex-grow transition-all duration-300 min-h-screen"
        style={{ marginLeft: isSidebarOpen ? 280 : 88 }}
      >
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 bg-slate-50 text-slate-500 hover:text-primary-500 rounded-xl transition-all"
            >
              {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
               <Store size={14} className="text-primary-500" />
               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Shop Status: <span className="text-green-600">Active</span></span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2.5 text-slate-400 hover:text-slate-900 transition-all">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-white shadow-sm" />
            </button>
            <div className="h-8 w-px bg-slate-100 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900">{user?.username}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium Vendor</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 font-bold uppercase overflow-hidden">
                {user?.username[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default VendorLayout;
