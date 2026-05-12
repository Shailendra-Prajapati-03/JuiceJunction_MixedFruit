import React from 'react';
import { motion } from 'framer-motion';
import { Handshake, Gavel, Briefcase, DollarSign } from 'lucide-react';

const VendorAgreement: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-500 mb-6">
            <Handshake size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Vendor Agreement</h1>
          <p className="text-slate-500 font-medium">Last updated: May 11, 2026</p>
        </motion.div>

        <div className="space-y-8 text-slate-600 font-medium leading-relaxed">
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Briefcase className="text-emerald-500" /> 1. Marketplace Participation
            </h2>
            <p>This agreement outlines the terms under which vendors can list and sell products on the JuiceJunction marketplace. Vendors are responsible for maintaining high-quality standards and providing accurate shop information.</p>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <DollarSign className="text-emerald-500" /> 2. Commission & Payments
            </h2>
            <ul className="list-disc pl-6 space-y-4 mt-4">
              <li>JuiceJunction charges a fixed percentage commission on every successful sale.</li>
              <li>Payments to vendors are processed on a weekly cycle after deducting commissions and taxes.</li>
              <li>Vendors must provide valid bank details for automated settlements.</li>
            </ul>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Gavel className="text-emerald-500" /> 3. Quality & Compliance
            </h2>
            <p>Vendors must comply with all local food safety regulations (e.g., FSSAI). JuiceJunction reserves the right to suspend any vendor who fails to meet hygiene standards or repeatedly receives negative customer feedback.</p>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 text-center">
            <p className="text-slate-500 font-medium italic">
              By registering as a vendor, you acknowledge that you have read and agreed to these terms in their entirety.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default VendorAgreement;
