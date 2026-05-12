import React from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, Truck, CheckCircle, MapPin, Navigation, RefreshCw } from 'lucide-react';
import api from '../utils/api';
import { Order } from '../types';
import { useStore } from '../store/useStore';

const steps = [
  { id: 1, label: 'Order Received', icon: Package },
  { id: 2, label: 'Blending Your Juice', icon: Clock },
  { id: 3, label: 'Out for Delivery', icon: Truck },
  { id: 4, label: 'Delivered', icon: CheckCircle },
];

const HomeTracking: React.FC = () => {
  const { isAuthenticated } = useStore();
  const [latestOrder, setLatestOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchLatestOrder = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get<Order[]>('/orders/');
        if (Array.isArray(res.data) && res.data.length > 0) {
          // Find the most recent active order (not cancelled)
          const active = res.data.filter(o => o.status !== 'Cancelled').sort((a, b) => b.id - a.id)[0];
          setLatestOrder(active || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestOrder();
    const interval = setInterval(fetchLatestOrder, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (loading) return null;
  if (!latestOrder) return null; // Hide if no order found

  const currentStep = latestOrder.tracking_step; // 0-4

  return (
    <section className="py-24 bg-white overflow-hidden border-t border-slate-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left: Tracking Details */}
          <div className="flex-1 w-full lg:max-w-xl">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <span className="px-4 py-1.5 bg-primary-50 text-primary-600 text-xs font-black uppercase tracking-[0.2em] rounded-full">
                  Real-time Tracking
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 tracking-tight leading-none">
                  Tracking <span className="text-primary-500">{latestOrder.juice_name}</span>
                </h2>
                <p className="text-slate-500 font-medium mt-4 text-lg">
                  Order #{latestOrder.id} is being handled with care.
                </p>
              </div>

              <div className="bg-slate-50 rounded-[3rem] p-8 border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6">
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    Live
                  </div>
                </div>

                <div className="space-y-8">
                  {steps.map((step, idx) => {
                    const isCompleted = idx < currentStep;
                    const isCurrent = idx === currentStep;
                    return (
                      <div key={step.id} className="flex gap-6 relative">
                        {idx !== steps.length - 1 && (
                          <div className={`absolute left-6 top-12 w-0.5 h-12 ${isCompleted ? 'bg-primary-500' : 'bg-slate-200'}`} />
                        )}
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 ${
                          isCompleted ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 
                          isCurrent ? 'bg-white text-primary-500 border-2 border-primary-500 shadow-xl' : 
                          'bg-white text-slate-300 border-2 border-slate-100'
                        }`}>
                          <step.icon size={20} className={isCurrent ? 'animate-bounce' : ''} />
                        </div>
                        <div className="pt-2">
                          <h4 className={`text-sm font-black uppercase tracking-widest ${isCurrent ? 'text-primary-500' : 'text-slate-900'}`}>
                            {step.label}
                          </h4>
                          <p className="text-xs text-slate-400 font-medium mt-1">
                            {isCompleted ? 'Completed' : isCurrent ? 'Active Now' : 'Pending'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-10 p-6 bg-white rounded-[2rem] border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100" alt="Rider" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-wider">Rahul (Delivery Hero)</p>
                      <p className="text-[10px] text-slate-400 font-medium">Delivering to {latestOrder.delivery_address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="text-lg font-black text-primary-500 leading-none">₹{latestOrder.total_price}</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{latestOrder.payment_method}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Realistic Map */}
          <div className="flex-1 w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[4rem] overflow-hidden shadow-2xl shadow-slate-900/10 border-8 border-white group"
            >
              <img 
                src="/realistic_delivery_map.png" 
                alt="Live Delivery Map" 
                className="w-full h-[600px] object-cover group-hover:scale-105 transition-transform duration-[10s] ease-linear"
              />
              
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
              
              {/* Floating Map Indicators */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-1/3 left-1/2 p-4 bg-white rounded-3xl shadow-2xl flex items-center gap-3 border border-slate-100"
              >
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rider Position</p>
                  <p className="text-xs font-black text-slate-900">2.4 km away</p>
                </div>
              </motion.div>

              <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery Address</p>
                      <p className="text-xs font-black text-slate-900 truncate max-w-[150px]">{latestOrder.delivery_address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-primary-500 leading-none">
                      {currentStep === 4 ? 'ARRIVED' : `${(4 - currentStep) * 10} MINS`}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Remaining</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeTracking;
