import React from 'react';
import { Shield, FileText, RefreshCcw } from 'lucide-react';

const Legal: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Legal <span className="text-primary-500">Center</span></h1>
          <p className="text-lg text-slate-600 font-medium">Transparency and trust are our main ingredients.</p>
        </div>

        <div className="space-y-12">
          {/* Privacy Policy */}
          <section id="privacy" className="bg-white rounded-[3rem] p-12 shadow-xl border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500">
                <Shield size={24} />
              </div>
              <h2 className="text-3xl font-black text-slate-900">Privacy Policy</h2>
            </div>
            <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed">
              <p className="mb-4">At JuiceJunction, we take your privacy seriously. This policy describes how we collect, use, and handle your personal information.</p>
              <h4 className="text-slate-900 font-black mt-6 mb-2">1. Information Collection</h4>
              <p>We collect information such as your name, email address, phone number, and delivery address when you create an account or place an order.</p>
              <h4 className="text-slate-900 font-black mt-6 mb-2">2. Use of Information</h4>
              <p>Your data is used solely to process orders, personalize your experience, and send important updates about our services.</p>
            </div>
          </section>

          {/* Terms & Conditions */}
          <section id="terms" className="bg-white rounded-[3rem] p-12 shadow-xl border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                <FileText size={24} />
              </div>
              <h2 className="text-3xl font-black text-slate-900">Terms & Conditions</h2>
            </div>
            <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed">
              <p className="mb-4">By using JuiceJunction, you agree to comply with the following terms and conditions of use.</p>
              <h4 className="text-slate-900 font-black mt-6 mb-2">1. Account Security</h4>
              <p>You are responsible for maintaining the confidentiality of your account and password. OTP verification is required for all new registrations.</p>
              <h4 className="text-slate-900 font-black mt-6 mb-2">2. Product Freshness</h4>
              <p>Our juices are made to order. We recommend consuming them within 2 hours of delivery for the best experience.</p>
            </div>
          </section>

          {/* Refund Policy */}
          <section id="refund" className="bg-white rounded-[3rem] p-12 shadow-xl border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                <RefreshCcw size={24} />
              </div>
              <h2 className="text-3xl font-black text-slate-900">Refund Policy</h2>
            </div>
            <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed">
              <p className="mb-4">We want you to be 100% happy with your blend. If something isn't right, we'll fix it.</p>
              <h4 className="text-slate-900 font-black mt-6 mb-2">1. Quality Issues</h4>
              <p>If you receive a product that does not meet our quality standards, please contact us within 30 minutes of delivery for a full refund or replacement.</p>
              <h4 className="text-slate-900 font-black mt-6 mb-2">2. Cancellations</h4>
              <p>Orders can be cancelled within 5 minutes of placement. Once production begins, cancellations are not possible.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Legal;
