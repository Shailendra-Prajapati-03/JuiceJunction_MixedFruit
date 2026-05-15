import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, CheckCircle, HelpCircle, Ban } from 'lucide-react';

const RefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex p-3 rounded-2xl bg-orange-50 text-orange-500 mb-6">
            <RefreshCw size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Refund Policy</h1>
          <p className="text-slate-500 font-medium">Last updated: May 11, 2026</p>
        </motion.div>

        <div className="space-y-8 text-slate-600 font-medium leading-relaxed">
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <CheckCircle className="text-orange-500" /> 1. Eligibility for Refunds
            </h2>
            <p>Our priority is your satisfaction. You are eligible for a refund if:</p>
            <ul className="list-disc pl-6 space-y-4 mt-4">
              <li>The product received is damaged or tampered with.</li>
              <li>The wrong items were delivered.</li>
              <li>The quality does not meet our standard (must be reported within 30 minutes of delivery).</li>
            </ul>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Ban className="text-orange-500" /> 2. Non-Refundable Situations
            </h2>
            <ul className="list-disc pl-6 space-y-4 mt-4">
              <li>Orders that have already been prepared and are out for delivery.</li>
              <li>Incorrect address provided by the user.</li>
              <li>Change of mind after the order is confirmed.</li>
            </ul>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <HelpCircle className="text-orange-500" /> 3. How to Request a Refund
            </h2>
            <p>To request a refund, please contact us via the "Support" button in the app or email us with your order ID and a photo of the product issue. Approved refunds will be processed back to your original payment method within 5-7 business days.</p>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 text-center">
            <p className="text-slate-500">
              Questions? Email 
              <a href="mailto:support@juicejunction.com" className="text-orange-500 font-bold ml-1">support@juicejunction.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
