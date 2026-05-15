import React from 'react';
import { useStore } from '../store/useStore';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Sparkles, User, MapPin, Phone, CreditCard, ChevronLeft, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import JuiceGlass from '../components/JuiceGlass';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, removeFromCart, updateCartQuantity, clearCart, isAuthenticated, user } = useStore();
  const [step, setStep] = React.useState<'cart' | 'checkout'>(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('step') === 'checkout' || (location.state as any)?.step === 'checkout') {
      return 'checkout';
    }
    return 'cart';
  });
  const buyNowItem = (location.state as any)?.buyNowItem;
  const displayItems = buyNowItem ? [buyNowItem] : cart;
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'UPI',
    upiId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  const [selectedItemIds, setSelectedItemIds] = React.useState<string[]>([]);

  // Initially select all items if none are selected (on first load)
  React.useEffect(() => {
    if (selectedItemIds.length === 0 && cart.length > 0) {
      setSelectedItemIds(cart.map(item => item.id));
    }
  }, [cart]);

  const toggleSelection = (id: string) => {
    setSelectedItemIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedCart = cart.filter(item => selectedItemIds.includes(item.id));

  const subtotal = displayItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const delivery = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const total = subtotal + tax + delivery;

  const [errors, setErrors] = React.useState<string[]>([]);
  const [showAlert, setShowAlert] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.username,
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  const handlePlaceOrder = async () => {
    const newErrors = [];
    if (!formData.name.trim()) newErrors.push('name');
    if (!formData.phone.trim() || formData.phone.trim().length !== 10) newErrors.push('phone');
    if (!formData.address.trim()) newErrors.push('address');

    if (formData.paymentMethod === 'UPI' && !formData.upiId.trim()) {
      newErrors.push('upiId');
    }
    if (formData.paymentMethod === 'Card') {
      if (!formData.cardNumber.trim()) newErrors.push('cardNumber');
      if (!formData.cardExpiry.trim()) newErrors.push('cardExpiry');
      if (!formData.cardCvv.trim()) newErrors.push('cardCvv');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setShowAlert(true);
      return;
    }

    setErrors([]);
    setIsPlacingOrder(true);
    try {
      // 1. Create Order in Backend
      const orderData = {
        items: displayItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          ingredients: item.ingredients.map((ing: any) => ({
            fruit: ing.fruitId,
            percentage: ing.percentage
          })),
          add_ins: item.addIns
        })),
        total_price: Math.round(total),
        status: formData.paymentMethod === 'COD' ? 'Placed' : 'Pending Payment',
        tracking_step: 0,
        delivery_address: formData.address,
        payment_method: formData.paymentMethod,
        phone: formData.phone,
        customer_name: formData.name
      };

      if (formData.paymentMethod === 'COD') {
        await api.post('/api/orders/', orderData);
        finalizeOrder();
      } else {
        // 2. Create Razorpay Order
        const paymentRes = await api.post('/api/orders/create-payment-order/', { amount: total });
        const options = {
          key: 'rzp_test_your_key', // Should be in .env
          amount: paymentRes.data.amount,
          currency: 'INR',
          name: 'JuiceJunction',
          description: 'Premium Fresh Juice',
          order_id: paymentRes.data.id,
          handler: async (response: any) => {
            // 3. Verify Payment
            try {
              await api.post('/api/orders/verify-payment/', response);
              await api.post('/api/orders/', orderData);
              finalizeOrder();
            } catch (err) {
              alert('Payment verification failed. Please contact support.');
            }
          },
          prefill: {
            name: formData.name,
            contact: formData.phone
          },
          theme: { color: '#F43F5E' }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to process order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const finalizeOrder = () => {
    selectedItemIds.forEach(id => removeFromCart(id));
    setSelectedItemIds([]);
    navigate('/orders');
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center text-slate-200 mb-8">
          <ShoppingBag className="w-16 h-16" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Your cart is empty</h2>
        <p className="text-slate-500 max-w-xs mb-10 font-medium">Looks like you haven't crafted any perfection yet.</p>
        <Link to="/builder" className="btn-primary px-12 py-5 text-lg flex items-center gap-3">
          Start Building <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-10 max-w-6xl">
      <div className="flex items-center gap-4 mb-12">
        {step === 'checkout' && (
          <button 
            onClick={() => setStep('cart')}
            className="p-3 bg-white rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-6 h-6 text-slate-900" />
          </button>
        )}
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">
          {step === 'cart' ? 'Your Order' : 'Checkout'}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {step === 'cart' ? (
              <motion.div 
                key="cart-list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {cart.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className={`bg-white rounded-[2rem] md:rounded-[1.5rem] p-5 md:p-6 border ${selectedItemIds.includes(item.id) ? 'border-primary-500 shadow-xl shadow-primary-500/10' : 'border-slate-100 opacity-60'} flex flex-col md:flex-row items-center gap-6 md:gap-8 transition-all duration-500`}
                  >
                    {step === 'cart' && (
                      <div 
                        className="cursor-pointer flex-shrink-0"
                        onClick={() => toggleSelection(item.id)}
                      >
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${selectedItemIds.includes(item.id) ? 'bg-primary-500 border-primary-500' : 'border-slate-300'}`}>
                          {selectedItemIds.includes(item.id) && <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                      </div>
                    )}
                    <div className="w-24 h-24 bg-slate-50 rounded-[1.5rem] flex items-center justify-center relative overflow-hidden pointer-events-none">
                      <div className="scale-50 origin-center flex items-center justify-center w-full h-full">
                         <JuiceGlass ingredients={item.ingredients} isMini={true} />
                      </div>
                    </div>
                    
                    <div className="flex-grow text-center md:text-left">
                      <h3 className="text-lg font-black text-slate-900 mb-2">{item.name}</h3>
                      <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
                        <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black uppercase rounded-lg border border-slate-100">{item.size}</span>
                        {item.addIns.map(addIn => (
                          <span key={addIn} className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black uppercase rounded-lg border border-orange-100">{addIn}</span>
                        ))}
                      </div>
                      <p className="text-sm text-slate-400 font-medium">{item.calories} Calories per serving</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                        <button onClick={() => updateCartQuantity(item.id, -1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center font-black text-slate-900">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, 1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="text-right min-w-[70px] md:min-w-[80px]">
                        <p className="text-lg md:text-xl font-black text-slate-900">₹{item.price * item.quantity}</p>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-4 text-slate-300 hover:text-red-500 transition-colors hover:bg-red-50 rounded-2xl"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="checkout-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-[2rem] md:rounded-[1.5rem] p-6 md:p-8 border border-slate-100 space-y-6 md:space-y-8"
              >
                <div className="space-y-4 md:space-y-6">
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-3">
                    <User className="w-5 h-5 md:w-6 h-6 text-primary-500" /> Personal Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('name') ? 'text-red-500' : 'text-slate-400'}`}>
                        Full Name {errors.includes('name') && '*'}
                      </label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({...formData, name: e.target.value});
                          if (errors.includes('name')) setErrors(errors.filter(e => e !== 'name'));
                        }}
                        placeholder="John Doe" 
                        className={`w-full px-6 py-3.5 md:py-3 bg-slate-50 border rounded-2xl md:rounded-xl focus:outline-none transition-colors text-sm ${errors.includes('name') ? 'border-red-300 bg-red-50/30' : 'border-slate-100 focus:border-primary-500'}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('phone') ? 'text-red-500' : 'text-slate-400'}`}>
                        Phone Number {errors.includes('phone') && '*'}
                      </label>
                      <div className={`relative flex items-center bg-slate-50 border rounded-2xl transition-colors ${errors.includes('phone') ? 'border-red-300 bg-red-50/30' : 'border-slate-100 focus-within:border-primary-500'}`}>
                        <span className="pl-6 text-slate-400 font-bold border-r border-slate-200 pr-3">+91</span>
                        <input 
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length <= 10) {
                              setFormData({...formData, phone: val});
                              if (errors.includes('phone')) setErrors(errors.filter(e => e !== 'phone'));
                            }
                          }}
                          maxLength={10}
                          placeholder="Enter 10-digit number" 
                          className="w-full px-4 py-3.5 md:py-3 bg-transparent focus:outline-none transition-colors text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-3">
                    <MapPin className="w-5 h-5 md:w-6 h-6 text-primary-500" /> Delivery Address
                  </h3>
                  <div className="space-y-2">
                    <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('address') ? 'text-red-500' : 'text-slate-400'}`}>
                      Full Address {errors.includes('address') && '*'}
                    </label>
                    <textarea 
                      value={formData.address}
                      onChange={(e) => {
                        setFormData({...formData, address: e.target.value});
                        if (errors.includes('address')) setErrors(errors.filter(e => e !== 'address'));
                      }}
                      placeholder="Street name, House no, Landmark..." 
                      rows={3}
                      className={`w-full px-6 py-4 md:py-3 bg-slate-50 border rounded-2xl md:rounded-xl focus:outline-none transition-colors text-sm resize-none ${errors.includes('address') ? 'border-red-300 bg-red-50/30' : 'border-slate-100 focus:border-primary-500'}`}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-3">
                    <CreditCard className="w-5 h-5 md:w-6 h-6 text-primary-500" /> Payment Method
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'UPI', value: 'UPI' },
                      { label: 'Card', value: 'Card' },
                      { label: 'Cash', value: 'COD' }
                    ].map(method => (
                      <button
                        key={method.value}
                        onClick={() => {
                          setFormData({...formData, paymentMethod: method.value});
                          // Clear payment specific errors when switching method
                          setErrors(errors.filter(e => !['upiId', 'cardNumber', 'cardExpiry', 'cardCvv'].includes(e)));
                        }}
                        className={`py-4 rounded-2xl font-black text-sm border transition-all ${formData.paymentMethod === method.value ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {formData.paymentMethod === 'UPI' && (
                      <motion.div
                        key="upi-fields"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 overflow-hidden"
                      >
                        <div className="space-y-2">
                          <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('upiId') ? 'text-red-500' : 'text-slate-400'}`}>
                            UPI ID {errors.includes('upiId') && '*'}
                          </label>
                          <input 
                            type="text" 
                            value={formData.upiId}
                            onChange={(e) => {
                              setFormData({...formData, upiId: e.target.value});
                              if (errors.includes('upiId')) setErrors(errors.filter(err => err !== 'upiId'));
                            }}
                            placeholder="username@bank" 
                            className={`w-full px-6 py-4 bg-slate-50 border rounded-2xl focus:outline-none transition-colors ${errors.includes('upiId') ? 'border-red-300 bg-red-50/30' : 'border-slate-100 focus:border-primary-500'}`}
                          />
                        </div>
                      </motion.div>
                    )}

                    {formData.paymentMethod === 'Card' && (
                      <motion.div
                        key="card-fields"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 space-y-4 overflow-hidden"
                      >
                        <div className="space-y-2">
                          <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('cardNumber') ? 'text-red-500' : 'text-slate-400'}`}>
                            Card Number {errors.includes('cardNumber') && '*'}
                          </label>
                          <input 
                            type="text" 
                            maxLength={16}
                            value={formData.cardNumber}
                            onChange={(e) => {
                              setFormData({...formData, cardNumber: e.target.value});
                              if (errors.includes('cardNumber')) setErrors(errors.filter(err => err !== 'cardNumber'));
                            }}
                            placeholder="1234 5678 9101 1121" 
                            className={`w-full px-6 py-4 bg-slate-50 border rounded-2xl focus:outline-none transition-colors ${errors.includes('cardNumber') ? 'border-red-300 bg-red-50/30' : 'border-slate-100 focus:border-primary-500'}`}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('cardExpiry') ? 'text-red-500' : 'text-slate-400'}`}>
                              Expiry {errors.includes('cardExpiry') && '*'}
                            </label>
                            <input 
                              type="text" 
                              maxLength={5}
                              value={formData.cardExpiry}
                              onChange={(e) => {
                                setFormData({...formData, cardExpiry: e.target.value});
                                if (errors.includes('cardExpiry')) setErrors(errors.filter(err => err !== 'cardExpiry'));
                              }}
                              placeholder="MM/YY" 
                              className={`w-full px-6 py-4 bg-slate-50 border rounded-2xl focus:outline-none transition-colors ${errors.includes('cardExpiry') ? 'border-red-300 bg-red-50/30' : 'border-slate-100 focus:border-primary-500'}`}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('cardCvv') ? 'text-red-500' : 'text-slate-400'}`}>
                              CVV {errors.includes('cardCvv') && '*'}
                            </label>
                            <input 
                              type="password" 
                              maxLength={4}
                              value={formData.cardCvv}
                              onChange={(e) => {
                                setFormData({...formData, cardCvv: e.target.value});
                                if (errors.includes('cardCvv')) setErrors(errors.filter(err => err !== 'cardCvv'));
                              }}
                              placeholder="123" 
                              className={`w-full px-6 py-4 bg-slate-50 border rounded-2xl focus:outline-none transition-colors ${errors.includes('cardCvv') ? 'border-red-300 bg-red-50/30' : 'border-slate-100 focus:border-primary-500'}`}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-slate-900 rounded-[2rem] md:rounded-[1.5rem] p-6 md:p-8 text-white sticky top-32 shadow-2xl shadow-slate-900/40">
            <h3 className="text-xl md:text-2xl font-black mb-6 md:mb-8 tracking-tight">Order Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-400 font-bold">
                <span>Subtotal</span>
                <span className="text-white">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-400 font-bold">
                <span>GST (5%)</span>
                <span className="text-white">₹{Math.round(tax)}</span>
              </div>
              <div className="flex justify-between text-slate-400 font-bold">
                <span>Delivery</span>
                <span className="text-white">{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
              </div>
            </div>
            
            <div className="pt-8 border-t border-white/10 mb-10">
              <div className="flex justify-between items-end">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Total Amount</span>
                <span className="text-2xl md:text-3xl font-black tracking-tighter">₹{Math.round(total)}</span>
              </div>
            </div>

            <button 
              disabled={isPlacingOrder || displayItems.length === 0}
              onClick={() => {
                if (step === 'cart') {
                  if (isAuthenticated) {
                    setStep('checkout');
                  } else {
                    navigate('/auth?redirect=/cart');
                  }
                } else {
                  handlePlaceOrder();
                }
              }}
              className={`w-full py-5 md:py-4 font-black rounded-[2rem] md:rounded-2xl text-lg md:text-xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3
                ${isPlacingOrder || displayItems.length === 0 ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-600 text-white shadow-primary-500/20'}`}
            >
              {isPlacingOrder ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full" />
                  Placing Order...
                </>
              ) : step === 'cart' ? (
                <>Checkout Now <ArrowRight className="w-6 h-6" /></>
              ) : (
                'Place Order'
              )}
            </button>
            
            <p className="text-center text-white/30 text-[10px] font-black uppercase tracking-widest mt-8">Secure Mock Payment</p>
          </div>
        </div>
      </div>
      {/* Custom Alert Modal (Premium Version) */}
      <AnimatePresence>
        {showAlert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAlert(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-[90%] max-w-sm bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] text-center overflow-hidden"
            >
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-60" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -ml-16 -mb-16 opacity-60" />

              <button 
                onClick={() => setShowAlert(false)}
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 rotate-180" />
              </button>

              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/20"
              >
                <AlertTriangle className="w-8 h-8 text-white" />
              </motion.div>

              <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tighter">Details Required</h3>
              <p className="text-xs text-slate-500 font-medium mb-6 leading-relaxed">
                We need your delivery details to get your fresh juice to the right place!
              </p>

              <div className="space-y-2 mb-8">
                {errors.map(err => {
                  const labelMap: Record<string, string> = {
                    name: 'Full Name',
                    phone: 'Phone Number',
                    address: 'Delivery Address',
                    upiId: 'UPI ID',
                    cardNumber: 'Card Number',
                    cardExpiry: 'Card Expiry',
                    cardCvv: 'Card CVV'
                  };
                  return (
                    <div key={err} className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest text-left">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      <span>{err === 'phone' ? 'Invalid Phone (10 Digits)' : `${labelMap[err] || err} is missing`}</span>
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={() => setShowAlert(false)}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl transition-all active:scale-95 shadow-xl shadow-slate-900/20 text-sm"
              >
                Complete Form
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
