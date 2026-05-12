import React from 'react';
import { Check, Zap, Calendar } from 'lucide-react';

const plans = [
  {
    name: 'Weekly Fresh',
    price: '999',
    period: 'week',
    features: ['7 Fresh Juices', 'Free Delivery', 'Customizable Blends', 'Weekly Recipe Book'],
    color: 'bg-green-500'
  },
  {
    name: 'Monthly Bliss',
    price: '3499',
    period: 'month',
    features: ['30 Fresh Juices', 'Priority Delivery', 'VIP Support', 'Monthly Gift Voucher'],
    color: 'bg-primary-500',
    popular: true
  },
  {
    name: 'Family Pack',
    price: '5999',
    period: 'month',
    features: ['60 Fresh Juices', 'Multiple Addresses', 'Nutritionist Consultation', 'Bulk Discounts'],
    color: 'bg-slate-900'
  }
];

const Subscriptions: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Juice <span className="text-primary-500">Subscriptions</span></h1>
          <p className="text-lg text-slate-600 font-medium">Never run out of your daily dose of vitamins.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative bg-white rounded-[3rem] p-10 shadow-xl border ${plan.popular ? 'border-primary-500 scale-105 z-10' : 'border-slate-100'}`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary-500 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-slate-900">₹{plan.price}</span>
                <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">/{plan.period}</span>
              </div>
              <ul className="space-y-4 mb-10">
                {plan.features.map(feat => (
                  <li key={feat} className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary-50 flex items-center justify-center text-primary-500">
                      <Check size={12} />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-2xl font-black transition-all shadow-lg ${
                plan.popular 
                  ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-primary-500/30' 
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/30'
              }`}>
                Subscribe Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
