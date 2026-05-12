import React from 'react';
import { motion } from 'framer-motion';
import { Cookie, Settings, ShieldCheck, Database } from 'lucide-react';

const CookiePolicy: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex p-3 rounded-2xl bg-amber-50 text-amber-500 mb-6">
            <Cookie size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Cookie Policy</h1>
          <p className="text-slate-500 font-medium">Last updated: May 11, 2026</p>
        </motion.div>

        <div className="space-y-8 text-slate-600 font-medium leading-relaxed">
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Database className="text-amber-500" /> 1. What are Cookies?
            </h2>
            <p>Cookies are small text files stored on your device that help our website recognize you and remember your preferences. They are essential for a smooth login and ordering experience.</p>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Settings className="text-amber-500" /> 2. How We Use Cookies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">Essential Cookies</h4>
                <p className="text-sm">Necessary for the platform to function, such as keeping you logged in and managing your cart.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">Preference Cookies</h4>
                <p className="text-sm">Remember your theme settings and fruit preferences for faster blending.</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <ShieldCheck className="text-amber-500" /> 3. Controlling Cookies
            </h2>
            <p>You can manage your cookie preferences through our consent banner or by adjusting your browser settings. Note that disabling essential cookies may impact your ability to place orders.</p>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 text-center">
            <p className="text-slate-500">
              For more details on how we protect your data, see our 
              <a href="/privacy-policy" className="text-amber-500 font-bold ml-1">Privacy Policy</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
