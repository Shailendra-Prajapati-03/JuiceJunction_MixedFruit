import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  Package, CheckCircle, Clock, Truck, PartyPopper,
  MapPin, CreditCard, ChevronDown, ChevronUp, RefreshCw,
  ShoppingBag, Zap, Calendar, ArrowRight, Star
} from 'lucide-react';
import api from '../utils/api';
import { Order } from '../types';
import ConfirmModal from '../components/ConfirmModal';

/* ── Tracking config ──────────────────────────────────────────────────────── */
const STEPS = [
  { label: 'Order Placed',     icon: Package,      color: 'text-slate-500' },
  { label: 'Confirmed',        icon: CheckCircle,  color: 'text-blue-500'  },
  { label: 'Preparing',        icon: Clock,        color: 'text-yellow-500'},
  { label: 'Out for Delivery', icon: Truck,        color: 'text-orange-500'},
  { label: 'Delivered',        icon: PartyPopper,  color: 'text-primary-500'},
];

const STATUS_BADGE: Record<string, string> = {
  Placed:            'bg-slate-100 text-slate-600',
  Confirmed:         'bg-blue-100 text-blue-700',
  Preparing:         'bg-yellow-100 text-yellow-700',
  'Out for Delivery':'bg-orange-100 text-orange-700',
  Delivered:         'bg-primary-100 text-primary-700',
  Cancelled:         'bg-red-100 text-red-600',
};

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, setAIChatOpen } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [liveSteps, setLiveSteps] = useState<Record<number, number>>({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get<Order[]>('/orders/');
      if (Array.isArray(res.data)) {
        setOrders(res.data.sort((a, b) => b.id - a.id));
        const initialSteps: Record<number, number> = {};
        res.data.forEach(o => {
          initialSteps[o.id] = o.tracking_step;
        });
        setLiveSteps(initialSteps);
      }
    } catch { /* error handled in UI */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!isAuthenticated) { navigate('/auth'); return; }
    fetchOrders();

    // Check for ID in URL to auto-expand
    const params = new URLSearchParams(location.search);
    const orderId = params.get('id');
    if (orderId) {
      const id = parseInt(orderId);
      setExpandedId(id);
      
      // Give time for the list to render then scroll
      setTimeout(() => {
        const element = document.getElementById(`order-card-${id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [isAuthenticated, navigate, location.search]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const completedOrders = orders.filter(o => o.status === 'Delivered');
  const totalSpent = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + parseFloat(o.total_price) : sum, 0);

  return (
    <div className="min-h-screen pb-20 bg-[#FFFBF9]">
      {/* 1. Header & Stats */}
      <div className="bg-white border-b border-slate-100 pb-12 pt-6">
        <div className="container mx-auto px-4 md:px-6 mt-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">My <span className="text-primary-500">Orders</span></h1>
              <p className="text-slate-500 font-medium mt-2">Track and manage your fresh juice deliveries.</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 w-full md:w-auto mt-6 md:mt-0">
              <div className="px-3 py-3 bg-primary-50 rounded-2xl border border-primary-100 text-center">
                <p className="text-[8px] font-black text-primary-600 uppercase tracking-widest mb-1">Spent</p>
                <p className="text-base md:text-2xl font-black text-slate-900">₹{totalSpent.toFixed(0)}</p>
              </div>
              <div className="px-3 py-3 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-1">Active</p>
                <p className="text-base md:text-2xl font-black text-slate-900">{activeOrders.length}</p>
              </div>
              <div className="px-3 py-3 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                <p className="text-[8px] font-black text-orange-600 uppercase tracking-widest mb-1">Rewards</p>
                <p className="text-base md:text-2xl font-black text-slate-900">{Math.floor(totalSpent / 50)} ✨</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-10">
        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 mb-8">
              <ShoppingBag size={64} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">No orders yet</h2>
            <p className="text-slate-500 font-medium mt-2 max-w-xs mx-auto">
              Your cart is waiting to be filled with fresh, custom blends!
            </p>
            <button 
              onClick={() => navigate('/builder')}
              className="mt-8 px-10 py-4 bg-primary-500 text-white font-black rounded-2xl shadow-xl shadow-primary-500/20 flex items-center gap-2 group"
            >
              Start Building <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Active Orders Section */}
            <div className="lg:col-span-8 space-y-6">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Zap size={14} className="text-primary-500" /> Recent Activity
              </h2>
              
              {orders.map((order, idx) => {
                const isExpanded = expandedId === order.id;
                const liveStep   = liveSteps[order.id] ?? 0;
                
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    id={`order-card-${order.id}`}
                    className={`bg-white rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
                      isExpanded ? 'border-primary-200 shadow-2xl shadow-primary-500/5' : 'border-slate-100 hover:border-slate-200 shadow-sm'
                    }`}
                  >
                    {/* Header of Card */}
                    <div 
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 cursor-pointer group"
                    >
                      <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <img 
                          src={`/images/juice${(order.id % 3) + 1}.png`} 
                          alt="Juice" 
                          className="w-14 h-14 object-contain drop-shadow-lg"
                        />
                      </div>
                      
                      <div className="flex-grow text-center md:text-left space-y-1">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                          <h3 className="text-xl font-black text-slate-900">{order.juice_name}</h3>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_BADGE[order.status] || 'bg-slate-100 text-slate-600'}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-medium text-slate-400">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                          <span className="flex items-center gap-1"><CreditCard size={12} /> {order.payment_method}</span>
                          <span className="font-black text-slate-900">₹{order.total_price}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center md:items-end gap-2">
                        {isExpanded ? <ChevronUp className="text-primary-500" /> : <ChevronDown className="text-slate-300" />}
                        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                           <div className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full animate-pulse">
                              <div className="w-1 h-1 bg-green-600 rounded-full" /> LIVE
                           </div>
                        )}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 md:px-8 pb-8 border-t border-slate-50 pt-8 bg-[#FDFDFD]"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Tracking Section */}
                            <div>
                               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Delivery Progress</h4>
                               {order.status === 'Cancelled' ? (
                                 <div className="p-6 bg-red-50 rounded-3xl border border-red-100 text-red-600 font-bold text-sm">
                                   This order was cancelled. We hope to serve you better next time!
                                 </div>
                               ) : (
                                 <div className="space-y-6">
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(liveStep / 4) * 100}%` }}
                                        className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                                      />
                                    </div>
                                    <div className="space-y-4">
                                      {STEPS.map((step, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                                            i <= liveStep ? 'bg-primary-500 text-white' : 'bg-slate-50 text-slate-300'
                                          }`}>
                                            {i < liveStep ? <CheckCircle size={16} /> : <step.icon size={16} />}
                                          </div>
                                          <span className={`text-xs font-black uppercase tracking-wider ${i === liveStep ? 'text-primary-500' : i < liveStep ? 'text-slate-900' : 'text-slate-300'}`}>
                                            {step.label}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                 </div>
                               )}
                            </div>

                            {/* Details Section */}
                            <div className="space-y-8">
                               <div>
                                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Delivery To</h4>
                                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                     <MapPin className="text-primary-500 flex-shrink-0 mt-1" size={18} />
                                     <p className="text-xs font-bold text-slate-700 leading-relaxed">{order.delivery_address}</p>
                                  </div>
                               </div>

                               <div>
                                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Actions</h4>
                                  <div className="flex flex-col gap-3">
                                    <button 
                                      onClick={() => setAIChatOpen(true)}
                                      className="w-full py-3 bg-white border border-slate-200 text-slate-900 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-colors"
                                    >
                                      Need Help?
                                    </button>
                                    {order.status !== 'Cancelled' && liveStep < 2 && (
                                      <button 
                                        onClick={() => {
                                          setSelectedOrderId(order.id);
                                          setShowCancelModal(true);
                                        }}
                                        className="w-full py-3 bg-red-50 text-red-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-red-100 transition-colors"
                                      >
                                        Cancel Order
                                      </button>
                                    )}
                                  </div>
                               </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Side Information */}
            <div className="lg:col-span-4 space-y-8">
               <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl" />
                  <div className="relative z-10 space-y-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                      <Star className="text-primary-400" size={24} />
                    </div>
                    <h3 className="text-2xl font-black leading-tight">JuiceJunction <br /> Rewards</h3>
                    <p className="text-slate-400 text-sm font-medium">You've earned <span className="text-primary-400 font-black">{Math.floor(totalSpent / 10)} points</span> on your recent health journey!</p>
                    <button className="w-full py-4 bg-primary-500 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.02] transition-all">
                       Redeem Points
                    </button>
                  </div>
               </div>

               <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Support</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">Have issues with an order? Our team is available 24/7 to help you out.</p>
                  <button 
                     onClick={() => setAIChatOpen(true)}
                     className="w-full py-3 bg-slate-50 text-slate-700 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-slate-100 transition-colors"
                  >
                     Contact Support
                  </button>
               </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={async () => {
          if (selectedOrderId) {
            try {
              await api.post(`/api/orders/${selectedOrderId}/cancel/`);

              fetchOrders();
            } catch { alert('Failed to cancel order.'); }
          }
        }}
        title="Cancel Order?"
        message="Are you sure you want to cancel this fresh blend? Once cancelled, it cannot be undone."
      />
    </div>
  );
};

export default Orders;
