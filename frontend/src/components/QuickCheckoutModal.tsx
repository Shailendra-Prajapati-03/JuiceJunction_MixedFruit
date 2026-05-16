import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, User, CreditCard, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import api from '../utils/api';

interface Ingredient {
  fruitId: number;
  name: string;
  color: string;
  percentage: number;
  pricePer100ml: number;
  caloriesPer100ml: number;
}

interface QuickCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  juiceName: string;
  price: number;
  calories: number;
  size: 'Small' | 'Medium' | 'Large';
  addIns: string[];
  ingredients: Ingredient[];
  userName?: string;
  userPhone?: string;
}

const PAYMENT_METHODS = [
  { label: 'Cash on Delivery', value: 'COD', icon: '💵' },
  { label: 'UPI', value: 'UPI', icon: '📱' },
  { label: 'Card', value: 'Card', icon: '💳' },
];

const QuickCheckoutModal: React.FC<QuickCheckoutModalProps> = ({
  isOpen,
  onClose,
  juiceName,
  price,
  calories,
  size,
  addIns,
  ingredients,
  userName = '',
  userPhone = '',
}) => {
  const tax = price * 0.05;
  const delivery = price > 500 ? 0 : 40;
  const total = Math.round(price + tax + delivery);

  const [name, setName] = useState(userName);
  const [phone, setPhone] = useState(userPhone);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [upiId, setUpiId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPlacing, setIsPlacing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name required';
    if (!phone.trim() || phone.trim().length !== 10) newErrors.phone = '10-digit number required';
    if (!address.trim()) newErrors.address = 'Address required';
    if (paymentMethod === 'UPI' && !upiId.trim()) newErrors.upiId = 'UPI ID required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setIsPlacing(true);
    try {
      const orderData = {
        juice_name: juiceName,
        items: [{
          name: juiceName,
          price,
          quantity: 1,
          size,
          ingredients: ingredients.map(ing => ({
            fruit: ing.fruitId,
            percentage: ing.percentage,
          })),
          add_ins: addIns,
        }],
        total_price: total,
        status: paymentMethod === 'COD' ? 'Placed' : 'Pending Payment',
        tracking_step: 0,
        delivery_address: address,
        payment_method: paymentMethod,
        phone,
        customer_name: name,
      };

      if (paymentMethod === 'COD') {
        const res = await api.post('/api/orders/', orderData);
        setOrderId(res.data.id);
        setIsSuccess(true);
      } else {
        // Razorpay flow
        const paymentRes = await api.post('/api/orders/create-payment-order/', { amount: total });
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_your_key',
          amount: paymentRes.data.amount,
          currency: 'INR',
          name: 'JuiceJunction',
          description: juiceName,
          order_id: paymentRes.data.id,
          handler: async (response: any) => {
            try {
              await api.post('/api/orders/verify-payment/', response);
              const res = await api.post('/api/orders/', { ...orderData, status: 'Placed' });
              setOrderId(res.data.id);
              setIsSuccess(true);
            } catch {
              alert('Payment verification failed. Please contact support.');
            }
          },
          prefill: { name, contact: phone },
          theme: { color: '#10b981' },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="relative w-full sm:max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] overflow-hidden max-h-[95vh] flex flex-col"
          >
            {/* Pill handle (mobile) */}
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-3 sm:hidden flex-shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-slate-100 flex-shrink-0">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Quick Checkout</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Order instantly, no extra steps</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success State */}
            {isSuccess ? (
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Order Placed! 🎉</h3>
                <p className="text-slate-500 text-sm font-medium mb-2">
                  Your fresh juice is being crafted.
                </p>
                {orderId && (
                  <p className="text-xs text-slate-400 font-bold mb-8">Order ID: #{orderId}</p>
                )}
                <button
                  onClick={() => { onClose(); window.location.href = '/orders'; }}
                  className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Track My Order <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                {/* Scrollable Form */}
                <div className="flex-1 overflow-y-auto">
                  {/* Order Summary Strip */}
                  <div className="mx-6 mt-5 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-1">Your Juice</p>
                      <p className="text-sm font-black text-slate-900">{juiceName}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{size} · {ingredients.length} Fruits · {calories} kcal</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-slate-900">₹{total}</p>
                      <p className="text-[10px] text-slate-400 font-bold">incl. GST{delivery === 0 ? ' + Free Delivery' : ` + ₹${delivery} delivery`}</p>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Name */}
                    <div>
                      <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        <User className="w-3 h-3" /> Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
                        placeholder="Enter your name"
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-400 transition-colors ${errors.name ? 'border-red-300 bg-red-50' : 'border-slate-100'}`}
                      />
                      {errors.name && <p className="text-red-500 text-xs font-bold mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        <Phone className="w-3 h-3" /> Phone Number
                      </label>
                      <div className={`flex items-center bg-slate-50 border rounded-xl transition-colors ${errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-100 focus-within:border-emerald-400'}`}>
                        <span className="pl-4 pr-3 text-slate-400 font-bold text-sm border-r border-slate-200">+91</span>
                        <input
                          type="tel"
                          value={phone}
                          maxLength={10}
                          onChange={e => { const v = e.target.value.replace(/\D/g, ''); if (v.length <= 10) { setPhone(v); setErrors(p => ({ ...p, phone: '' })); } }}
                          placeholder="10-digit number"
                          className="w-full px-3 py-3 bg-transparent text-sm font-medium focus:outline-none"
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs font-bold mt-1">{errors.phone}</p>}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        <MapPin className="w-3 h-3" /> Delivery Address
                      </label>
                      <textarea
                        value={address}
                        onChange={e => { setAddress(e.target.value); setErrors(p => ({ ...p, address: '' })); }}
                        placeholder="House no, Street, Landmark..."
                        rows={2}
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-400 transition-colors resize-none ${errors.address ? 'border-red-300 bg-red-50' : 'border-slate-100'}`}
                      />
                      {errors.address && <p className="text-red-500 text-xs font-bold mt-1">{errors.address}</p>}
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        <CreditCard className="w-3 h-3" /> Payment
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {PAYMENT_METHODS.map(m => (
                          <button
                            key={m.value}
                            onClick={() => setPaymentMethod(m.value)}
                            className={`py-3 rounded-xl text-xs font-black flex flex-col items-center gap-1 border-2 transition-all ${paymentMethod === m.value ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}
                          >
                            <span className="text-lg">{m.icon}</span>
                            {m.label === 'Cash on Delivery' ? 'Cash' : m.label}
                          </button>
                        ))}
                      </div>

                      {paymentMethod === 'UPI' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3"
                        >
                          <input
                            type="text"
                            value={upiId}
                            onChange={e => { setUpiId(e.target.value); setErrors(p => ({ ...p, upiId: '' })); }}
                            placeholder="username@upi"
                            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-400 transition-colors ${errors.upiId ? 'border-red-300 bg-red-50' : 'border-slate-100'}`}
                          />
                          {errors.upiId && <p className="text-red-500 text-xs font-bold mt-1">{errors.upiId}</p>}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                {/* CTA Footer */}
                <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex-shrink-0 bg-white">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacing}
                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 text-white font-black rounded-2xl transition-all active:scale-95 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-3 text-lg"
                  >
                    {isPlacing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        Place Order · ₹{total}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-widest mt-3">
                    🔒 Secure · Instant Confirmation
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickCheckoutModal;
