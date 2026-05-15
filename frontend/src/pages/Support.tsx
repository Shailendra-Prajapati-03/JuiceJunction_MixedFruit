import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Mail, Truck, MessageSquare } from 'lucide-react';

const faqs = [
  { q: "How long does delivery take?", a: "Most orders are delivered within 45-60 minutes to ensure maximum freshness." },
  { q: "Are there any hidden preservatives?", a: "Never! We use 100% natural fruit and no artificial additives." },
  { q: "Can I customize my juice?", a: "Yes! Use our 'Builder' tool to create your own unique blend from 30+ fruits." },
  { q: "How do I track my order?", a: "Go to the 'Orders' section in your profile to see real-time updates." },
];

const Support: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Customer <span className="text-primary-500">Support</span></h1>
          <p className="text-lg text-slate-600 font-medium">We're here to help you stay refreshed.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-24">
          {/* Contact Form */}
          <div id="contact" className="lg:col-span-2 bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500">
                <Mail size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Send us a message</h2>
            </div>
            <form className="grid md:grid-cols-2 gap-6" onSubmit={e => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Your Name</label>
                <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Email Address</label>
                <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium" placeholder="john@example.com" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Message</label>
                <textarea rows={4} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium" placeholder="How can we help?"></textarea>
              </div>
              <button className="md:col-span-2 py-4 bg-primary-500 hover:bg-primary-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-primary-500/30">Send Message</button>
            </form>
          </div>

          {/* Quick Support */}
          <div className="space-y-6">
            <div id="delivery" className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-primary-400 mb-6">
                <Truck size={20} />
              </div>
              <h3 className="text-xl font-black mb-2">Delivery Info</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                We deliver across 15+ cities. Minimum order ₹250. Express delivery available for all custom blends.
              </p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500 mb-6">
                <MessageSquare size={20} />
              </div>
              <h3 className="text-xl font-black mb-2 text-slate-900">Live Chat</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4">
                Chat with JuiceAI, our intelligent assistant, for instant help with recipes and orders.
              </p>
              <p className="text-primary-500 font-black text-sm uppercase tracking-widest animate-bounce">
                Click the bubble below! ↓
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <section id="faqs" className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-10 justify-center">
            <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500">
              <HelpCircle size={24} />
            </div>
            <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
          </div>
          <div className="grid gap-4">
            {faqs.map((faq, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ x: 5 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
              >
                <h4 className="text-lg font-black text-slate-900 mb-2">{faq.q}</h4>
                <p className="text-slate-600 font-medium">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Support;
