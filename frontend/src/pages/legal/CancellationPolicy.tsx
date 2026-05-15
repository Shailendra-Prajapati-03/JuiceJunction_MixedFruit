import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, Clock, AlertCircle, Info } from 'lucide-react';

const CancellationPolicy: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex p-3 rounded-2xl bg-red-50 text-red-500 mb-6">
            <XCircle size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Cancellation Policy</h1>
          <p className="text-slate-500 font-medium">Last updated: May 11, 2026</p>
        </motion.div>

        <div className="space-y-8 text-slate-600 font-medium leading-relaxed">
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Clock className="text-red-500" /> 1. Cancellation Window
            </h2>
            <p>Because our juices are made fresh for each order, the window for cancellation is limited:</p>
            <div className="mt-6 p-6 rounded-2xl bg-red-50 border border-red-100">
              <p className="font-bold text-red-700 flex items-center gap-2">
                <AlertCircle size={18} /> Orders can only be cancelled within 5 minutes of placement.
              </p>
            </div>
            <p className="mt-4 text-sm italic">Once a vendor starts preparing your blend, the order cannot be cancelled.</p>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Info className="text-red-500" /> 2. Vendor Cancellations
            </h2>
            <p>In rare cases, a vendor may need to cancel an order due to out-of-stock ingredients or high demand. In such events:</p>
            <ul className="list-disc pl-6 space-y-4 mt-4">
              <li>You will be notified immediately via the app.</li>
              <li>A full refund will be processed automatically to your source account.</li>
            </ul>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 text-center">
            <p className="text-slate-500">
              Need to cancel an order? Go to your 
              <a href="/orders" className="text-red-500 font-bold ml-1">Order History</a> 
              within the first 5 minutes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
