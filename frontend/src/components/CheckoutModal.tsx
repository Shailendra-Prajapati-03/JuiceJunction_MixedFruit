import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, User, CreditCard, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  juiceData: {
    name: string;
    price: number;
    calories: number;
    size: string;
    addIns: string[];
    ingredients: any[];
  };
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, juiceData }) => {
  const { user, isAuthenticated, clearCart, removeFromCart } = useStore();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.username || '',
    phone: user?.phone || '',
    address: '',
    paymentMethod: 'COD' as 'COD' | 'UPI' | 'Card'
  });

  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.username,
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  const validate = () => {
    const newErrors = [];
    if (!formData.name.trim()) newErrors.push('name');
    if (!formData.phone.trim() || formData.phone.trim().length !== 10) newErrors.push('phone');
    if (!formData.address.trim()) newErrors.push('address');
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;

    setIsPlacingOrder(true);
    try {
      const orderData = {
        juice_name: juiceData.name,
        items: [{
          name: juiceData.name,
          price: juiceData.price,
          quantity: 1,
          size: juiceData.size,
          ingredients: juiceData.ingredients.map((ing: any) => ({
            fruit: ing.fruitId,
            percentage: ing.percentage
          })),
          add_ins: juiceData.addIns
        }],
        total_price: Math.round(juiceData.price * 1.05 + (juiceData.price > 500 ? 0 : 40)), // Price + 5% GST + Delivery
        status: formData.paymentMethod === 'COD' ? 'Placed' : 'Pending Payment',
        tracking_step: 0,
        delivery_address: formData.address,
        payment_method: formData.paymentMethod,
        phone: formData.phone,
        customer_name: formData.name
      };

      if (formData.paymentMethod === 'COD') {
        await api.post('/api/orders/', orderData);
        setOrderSuccess(true);
        setTimeout(() => {
          onClose();
          navigate('/orders');
        }, 2000);
      } else {
        // Razorpay logic (Simplified for this modal)
        const total = orderData.total_price;
        const paymentRes = await api.post('/api/orders/create-payment-order/', { amount: total });
        
        const options = {
          key: 'rzp_test_your_key', // In real app use process.env.VITE_RAZORPAY_KEY
          amount: paymentRes.data.amount,
          currency: 'INR',
          name: 'JuiceJunction',
          description: juiceData.name,
          order_id: paymentRes.data.id,
          handler: async (response: any) => {
            try {
              await api.post('/api/orders/verify-payment/', response);
              await api.post('/api/orders/', orderData);
              setOrderSuccess(true);
              setTimeout(() => {
                onClose();
                navigate('/orders');
              }, 2000);
            } catch (err) {
              alert('Payment verification failed.');
            }
          },
          prefill: {
            name: formData.name,
            contact: formData.phone
          },
          theme: { color: '#10B981' }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          {orderSuccess ? (
            <div className="p-12 text-center space-y-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Order Placed!</h3>
              <p className="text-slate-500 font-medium">Redirecting you to tracking page...</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Quick Checkout</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Order directly from here</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
                {/* Order Summary Mini */}
                <div className="bg-emerald-50 rounded-2xl p-4 flex items-center justify-between border border-emerald-100">
                  <div>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Selected Blend</p>
                    <p className="text-sm font-black text-slate-900">{juiceData.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Total</p>
                    <p className="text-lg font-black text-slate-900">₹{Math.round(juiceData.price * 1.05 + (juiceData.price > 500 ? 0 : 40))}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold"
                          placeholder="Your Name"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="tel"
                          value={formData.phone}
                          maxLength={10}
                          onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold"
                          placeholder="10-digit number"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Delivery Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                      <textarea 
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        rows={2}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold resize-none"
                        placeholder="House No, Street, Landmark..."
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['COD', 'UPI', 'Card'] as const).map(method => (
                        <button
                          key={method}
                          onClick={() => setFormData({...formData, paymentMethod: method})}
                          className={`py-3 rounded-xl text-[10px] font-black transition-all border ${formData.paymentMethod === method ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {errors.length > 0 && (
                  <div className="bg-red-50 p-3 rounded-xl flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Please fill all details correctly</span>
                  </div>
                )}
              </div>

              {/* Footer Button */}
              <div className="p-6 md:p-8 bg-slate-50/50 border-t border-slate-100">
                <button 
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isPlacingOrder ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Confirm Order <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
