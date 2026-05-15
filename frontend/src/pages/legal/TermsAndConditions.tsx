import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertTriangle, Scale } from 'lucide-react';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-500 mb-6">
            <FileText size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Terms & Conditions</h1>
          <p className="text-slate-500 font-medium">Last updated: May 11, 2026</p>
        </motion.div>

        <div className="space-y-8 text-slate-600 font-medium leading-relaxed">
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <CheckCircle className="text-blue-500" /> 1. Acceptance of Terms
            </h2>
            <p>By accessing or using the JuiceJunction platform, you agree to be bound by these Terms and Conditions. If you do not agree to all of these terms, do not use our services.</p>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Scale className="text-blue-500" /> 2. Use of the Service
            </h2>
            <ul className="list-disc pl-6 space-y-4 mt-4">
              <li><span className="font-bold text-slate-900">Eligibility:</span> You must be at least 18 years old to create an account or use our services.</li>
              <li><span className="font-bold text-slate-900">Account Security:</span> You are responsible for all activity that occurs under your account. OTP verification is mandatory for security.</li>
              <li><span className="font-bold text-slate-900">Order Accuracy:</span> Users must ensure that all order details, including custom juice percentages, are correct before final submission.</li>
            </ul>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <AlertTriangle className="text-blue-500" /> 3. Limitation of Liability
            </h2>
            <p>JuiceJunction acts as a marketplace connecting vendors and customers. We are not liable for any direct, indirect, incidental, or consequential damages resulting from the use of our platform or products purchased through it.</p>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 text-center">
            <p className="text-slate-500">
              For any clarification regarding these terms, please reach out to 
              <a href="mailto:legal@juicejunction.com" className="text-blue-500 font-bold ml-1">legal@juicejunction.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
