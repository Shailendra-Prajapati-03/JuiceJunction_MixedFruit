import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, MapPin, Navigation, Clock, Package, CheckCircle2 } from 'lucide-react';
import { Order } from '../types';

const LiveTrackingWidget: React.FC<{ order: Order }> = ({ order }) => {
  const [progress, setProgress] = useState(0);
  
  // Simulate truck movement on map
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 0.5));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { label: 'Order Placed', time: '10:30 AM', status: 'done' },
    { label: 'Preparing', time: '10:45 AM', status: 'done' },
    { label: 'On the Way', time: '11:05 AM', status: 'active' },
    { label: 'Delivered', time: '--:--', status: 'pending' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden max-w-2xl mx-auto"
    >
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${order.status === 'Cancelled' ? 'bg-red-50 text-red-500' : 'bg-primary-50 text-primary-500'}`}>
              {order.status === 'Cancelled' ? 'Order Cancelled' : 'Live Tracking'}
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-2">Order #{order.id}</h3>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400">{order.status === 'Cancelled' ? 'Status' : 'Estimated Arrival'}</p>
            <p className={`text-xl font-black ${order.status === 'Cancelled' ? 'text-red-500' : 'text-slate-900'}`}>
              {order.status === 'Cancelled' ? 'Stopped' : '12 mins'}
            </p>
          </div>
        </div>

        {/* Map Simulation */}
        <div className="relative h-48 bg-slate-50 rounded-[2rem] border border-slate-100 mb-8 overflow-hidden">
          {/* Decorative Map Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-0 w-full h-px bg-slate-300 transform -rotate-12" />
            <div className="absolute top-2/3 left-0 w-full h-px bg-slate-300 transform rotate-6" />
            <div className="absolute left-1/4 top-0 h-full w-px bg-slate-300 transform rotate-12" />
            <div className="absolute left-2/3 top-0 h-full w-px bg-slate-300 transform -rotate-6" />
          </div>

          {/* Path */}
          <svg className="absolute inset-0 w-full h-full p-8" viewBox="0 0 400 100">
            <path 
              d="M 20 50 Q 100 20 200 50 T 380 50" 
              fill="none" 
              stroke="#e2e8f0" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeDasharray="8 8"
            />
            <motion.path 
              d="M 20 50 Q 100 20 200 50 T 380 50" 
              fill="none" 
              stroke="#22c55e" 
              strokeWidth="4" 
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </svg>

          {/* Location Pins */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-slate-100">
              <Package className="w-4 h-4 text-slate-400" />
            </div>
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2">
            <div className="w-10 h-10 bg-primary-500 rounded-full shadow-lg shadow-primary-500/30 flex items-center justify-center border-4 border-white">
              <MapPin className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Moving Truck */}
          <motion.div 
            style={{ 
              position: 'absolute',
              left: `${progress}%`,
              top: '50%',
              translateY: '-50%',
              translateX: '-50%'
            }}
            className="z-20"
          >
            <div className="w-10 h-10 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-100">
              <Navigation className="w-5 h-5 text-primary-500 transform rotate-90" />
            </div>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-4 gap-4">
          {steps.map((step, idx) => (
            <div key={idx} className="text-center">
              <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 
                ${step.status === 'done' ? 'bg-primary-500 text-white' : 
                  step.status === 'active' ? 'bg-primary-50 text-primary-500 border-2 border-primary-500' : 
                  'bg-slate-50 text-slate-300'}`}
              >
                {step.status === 'done' ? <CheckCircle2 className="w-5 h-5" /> : 
                 step.status === 'active' ? <Truck className="w-5 h-5" /> : 
                 <Clock className="w-5 h-5" />}
              </div>
              <p className={`text-[10px] font-black uppercase tracking-tighter ${step.status === 'pending' ? 'text-slate-300' : 'text-slate-900'}`}>
                {step.label}
              </p>
              <p className="text-[9px] font-bold text-slate-400">{step.time}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-slate-900 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Driver" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Your Pilot</p>
            <p className="text-sm font-bold text-white">Rahul Sharma</p>
          </div>
        </div>
        <button className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-black rounded-xl transition-all active:scale-95 shadow-lg shadow-primary-500/20">
          Call Pilot
        </button>
      </div>
    </motion.div>
  );
};

export default LiveTrackingWidget;
