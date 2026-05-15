import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Clock, CheckCircle, Truck, 
  MapPin, Phone, MessageSquare, ChevronRight,
  Filter, Search, AlertCircle
} from 'lucide-react';
import api from '../../utils/api';

interface Order {
  id: number;
  customer_name: string;
  juice_name: string;
  total_price: string;
  status: string;
  delivery_address: string;
  payment_method: string;
  created_at: string;
  tracking_step: number;
}

const VendorOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/vendor/orders/');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await api.post(`/api/vendor/orders/${id}/update_status/`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredOrders = orders.filter(o => filter === 'All' || o.status === filter);

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shop <span className="text-primary-500">Orders</span></h1>
          <p className="text-slate-500 font-medium mt-1">Manage and track your customers' fresh juice orders.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
          {['All', 'Placed', 'Preparing', 'Out for Delivery', 'Delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === status ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-48 bg-slate-100 rounded-[2.5rem] animate-pulse" />)
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white py-20 rounded-[2.5rem] border border-slate-100 text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 mb-4">
                <ShoppingBag size={40} />
             </div>
             <h3 className="text-xl font-black text-slate-900">No {filter !== 'All' ? filter : ''} orders yet</h3>
             <p className="text-slate-500 font-medium mt-2">New orders will appear here as customers buy your blends.</p>
          </div>
        ) : filteredOrders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all overflow-hidden"
          >
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                {/* Order Identity */}
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500 flex-shrink-0">
                    <ShoppingBag size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-black text-slate-900">Order #{order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        order.status === 'Placed' ? 'bg-blue-50 text-blue-600' :
                        order.status === 'Preparing' ? 'bg-yellow-50 text-yellow-600' :
                        order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-400">{order.juice_name}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs font-bold text-slate-500">
                      <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary-500" /> {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="flex items-center gap-1.5 font-black text-slate-900">₹{order.total_price}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="flex flex-col sm:flex-row gap-8 lg:border-l lg:border-slate-50 lg:pl-8">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Customer</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 font-bold text-xs uppercase">
                        {order.customer_name[0]}
                      </div>
                      <span className="text-sm font-black text-slate-700">{order.customer_name}</span>
                    </div>
                  </div>
                  <div className="space-y-3 max-w-[200px]">
                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Address</h4>
                    <div className="flex items-start gap-2 text-xs font-bold text-slate-500 leading-relaxed">
                      <MapPin size={14} className="text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{order.delivery_address}</span>
                    </div>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="flex flex-col gap-3 min-w-[180px]">
                  {order.status === 'Placed' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'Preparing')}
                      className="w-full py-3 bg-primary-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-primary-500/20 hover:scale-[1.02] transition-all"
                    >
                      Accept & Prepare
                    </button>
                  )}
                  {order.status === 'Preparing' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'Out for Delivery')}
                      className="w-full py-3 bg-orange-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all"
                    >
                      Ready for Pick-up
                    </button>
                  )}
                  {order.status === 'Out for Delivery' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'Delivered')}
                      className="w-full py-3 bg-green-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-green-500/20 hover:scale-[1.02] transition-all"
                    >
                      Mark as Delivered
                    </button>
                  )}
                  <div className="flex gap-2">
                    <button className="flex-1 py-2.5 bg-slate-50 text-slate-600 font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5">
                      <Phone size={12} /> Call
                    </button>
                    <button className="flex-1 py-2.5 bg-slate-50 text-slate-600 font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5">
                      <MessageSquare size={12} /> Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VendorOrders;
