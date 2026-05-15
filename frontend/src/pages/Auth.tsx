import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import api from '../utils/api';
import { Droplet, Eye, EyeOff } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [verifyWith, setVerifyWith] = useState<'email' | 'phone'>('email');
  const [timer, setTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useStore();

  React.useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // For login mode, the email might be in the 'username' field
      let targetEmail = email;
      if (isLogin && username) targetEmail = username;
      else if (!isLogin && email) targetEmail = email;
      
<<<<<<< HEAD
      const res = await api.post('/api/auth/send-otp/', { email: targetEmail });
=======
      const res = await api.post('/auth/send-otp/', { email: targetEmail });
>>>>>>> 18a190e7792a47b11a997af80c50d0ff5ace506d
      setOtpSent(true);
      setTimer(60); 
      setMessage(res.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
<<<<<<< HEAD
      const res = await api.post('/api/verify-registration/', {
=======
      const res = await api.post('/verify-registration/', {
>>>>>>> 18a190e7792a47b11a997af80c50d0ff5ace506d
        username,
        password,
        email,
        phone_number: phoneNumber,
        otp_code: otpCode,
        verified_with: verifyWith
      });
      login(res.data.access, res.data.user);
      const searchParams = new URLSearchParams(window.location.search);
      const redirectPath = searchParams.get('redirect') || '/';
      const buyNowData = searchParams.get('buyNow');
      
      if (buyNowData) {
        navigate(redirectPath, { state: { step: 'checkout', buyNowItem: JSON.parse(decodeURIComponent(buyNowData)) } });
      } else {
        navigate(redirectPath);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const targetEmail = isLogin ? username : email;
<<<<<<< HEAD
      const res = await api.post('/api/auth/verify-otp/', {
=======
      const res = await api.post('/auth/verify-otp/', {
>>>>>>> 18a190e7792a47b11a997af80c50d0ff5ace506d
        email: targetEmail,
        otp_code: otpCode
      });
      login(res.data.access, res.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If OTP is already sent, handle verification
    if (otpSent) {
      if (isLogin) return handleVerifyOtp(e);
      return handleVerifyRegister(e);
    }
    
    // If we are in Register mode and OTP is NOT sent yet, send OTP
    if (!isLogin) {
      return handleRegisterSubmit(e);
    }
    
    // Standard Password Login Flow
    setError('');
    setLoading(true);
    try {
<<<<<<< HEAD
      const res = await api.post('/api/login/', { username, password });
=======
      const res = await api.post('/login/', { username, password });
>>>>>>> 18a190e7792a47b11a997af80c50d0ff5ace506d
      login(res.data.access, res.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100"
      >
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-50 rounded-2xl flex items-center justify-center mb-4">
            <Droplet className="h-6 w-6 text-primary-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Join JuiceJunction'}
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            {isLogin ? 'Sign in to access your custom blends' : 'Create an account to start blending'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className={`p-4 text-sm font-bold rounded-2xl ${error.includes('successful') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {error}
            </div>
          )}

          {message && !error && (
            <div className="p-4 text-sm font-bold rounded-2xl bg-green-50 text-green-600">
              {message}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">
                {isLogin ? 'Username, Email or Phone' : 'Username'}
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Email address</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Phone Number</label>
                  <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-500 outline-none transition-all overflow-hidden">
                    <span className="pl-4 pr-3 text-slate-400 font-bold border-r border-slate-100">+91</span>
                    <input
                      type="text"
                      required
                      placeholder="Enter 10-digit number"
                      maxLength={10}
                      className="w-full px-3 py-3 bg-transparent outline-none font-medium"
                      value={phoneNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 10) setPhoneNumber(val);
                      }}
                    />
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Verify with</label>
                  <div className="flex gap-2">
                    {['email', 'phone'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        disabled={otpSent}
                        onClick={() => setVerifyWith(type as any)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                          verifyWith === type 
                            ? 'bg-white text-primary-500 shadow-sm border border-slate-100' 
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {type.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="relative">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[38px] text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {otpSent && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    className="w-full px-4 py-3 bg-primary-50 border border-primary-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all font-black text-center text-xl tracking-widest"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                  />
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    disabled={timer > 0 || loading}
                    onClick={handleRegisterSubmit}
                    className="text-xs font-bold text-slate-500 hover:text-primary-500 transition-colors disabled:opacity-50"
                  >
                    {timer > 0 ? `Resend OTP in ${timer}s` : 'Did not receive OTP? Resend Now'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 text-white font-black py-4 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? (otpSent ? 'Verify & Sign In' : 'Sign In') : (otpSent ? 'Verify & Create Account' : 'Send Verification OTP'))}
          </button>

          {isLogin && !otpSent && (
            <div className="text-center">
              <button
                type="button"
                onClick={handleRegisterSubmit}
                className="text-sm font-bold text-primary-500 hover:text-primary-600 transition-colors"
              >
                Sign in with OTP instead
              </button>
            </div>
          )}

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-slate-500 hover:text-primary-500 transition-colors block w-full"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Auth;
