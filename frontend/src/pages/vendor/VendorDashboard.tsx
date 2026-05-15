import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, ShoppingBag, Package, AlertCircle, 
  ArrowUpRight, Users, DollarSign, Clock 
} from 'lucide-react';
import api from '../../utils/api';
import { useStore } from '../../store/useStore';

interface Analytics {
  total_orders: number;
  total_revenue: number;
  active_products: number;
  pending_orders: number;
  recent_orders: any[];
}

const VendorDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useStore();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/api/vendors/analytics/');
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 animate-pulse space-y-6">
    <div className="h-32 bg-slate-100 rounded-3xl" />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-100 rounded-2xl" />)}
    </div>
  </div>;

  const stats = [
    { label: 'Total Revenue', value: `₹${analytics?.total_revenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Orders', value: analytics?.total_orders, icon: ShoppingBag, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Active Products', value: analytics?.active_products, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Orders', value: analytics?.pending_orders, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, <span className="text-primary-500">{user?.username}</span> 👋
          </h1>
          <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">
            Here's what's happening with your shop today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 text-sm">
            Export Report
          </button>
          <button className="px-5 py-2.5 bg-primary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 hover:scale-105 transition-all flex items-center gap-2 text-sm">
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <TrendingUp className="text-slate-300 w-4 h-4" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-xl md:text-2xl font-black text-slate-900">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart Area (Mockup) */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-900">Revenue Analytics</h3>
            <select className="bg-slate-50 border-none rounded-xl text-xs font-bold px-4 py-2 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-4">
            {[65, 40, 80, 50, 90, 70, 45].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  className="w-full bg-slate-50 rounded-t-2xl group-hover:bg-primary-500 transition-all relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                </motion.div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Side List */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-900">Recent Orders</h3>
            <button className="text-primary-500 font-bold text-xs hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {analytics?.recent_orders.length === 0 ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                  <AlertCircle size={32} />
                </div>
                <p className="text-sm font-medium text-slate-400">No orders yet</p>
              </div>
            ) : (
              analytics?.recent_orders.map((order, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 text-primary-500 transition-colors">
                    <ShoppingBag size={20} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-black text-slate-900 line-clamp-1">#{order.id} {order.juice_name}</h4>
                    <p className="text-xs font-medium text-slate-400">₹{order.total_price} • {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <ArrowUpRight className="text-slate-300 group-hover:text-primary-500 transition-colors" size={18} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
