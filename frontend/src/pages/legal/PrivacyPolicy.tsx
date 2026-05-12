import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Server } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex p-3 rounded-2xl bg-primary-50 text-primary-500 mb-6">
            <Shield size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-slate-500 font-medium">Last updated: May 11, 2026</p>
        </motion.div>

        <div className="space-y-8">
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Eye className="text-primary-500" /> 1. Information We Collect
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed">
              <p>We collect information you provide directly to us when you create an account, place an order, or communicate with us. This includes:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Name, email address, and phone number.</li>
                <li>Delivery address and location data.</li>
                <li>Order history and preferences.</li>
                <li>Payment transaction identifiers (we do not store card details).</li>
              </ul>
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Server className="text-primary-500" /> 2. How We Use Your Data
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed">
              <p>JuiceJunction uses your information to provide, maintain, and improve our services, including:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Processing and delivering your fresh juice orders.</li>
                <li>Verifying your identity via OTP for secure login.</li>
                <li>Sending order status updates and notifications.</li>
                <li>Analyzing usage patterns to enhance the marketplace experience.</li>
              </ul>
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Lock className="text-primary-500" /> 3. Data Security
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed">
              <p>We implement industry-standard security measures to protect your personal information. Your data is stored on secure servers, and sensitive information like passwords is encrypted using modern hashing algorithms.</p>
              <p className="mt-4 font-bold text-slate-900">Note: We never sell your personal data to third parties.</p>
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 text-center">
            <p className="text-slate-500 font-medium">
              If you have any questions about this Privacy Policy, please contact our support team at 
              <a href="mailto:privacy@juicejunction.com" className="text-primary-500 font-bold ml-1">privacy@juicejunction.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
