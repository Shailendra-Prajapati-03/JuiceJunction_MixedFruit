import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Store, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const VendorRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    shop_name: '',
    owner_name: '',
    address: '',
    gst_number: '',
    fssai_license: '',
    agreed_to_terms: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [verifyWith, setVerifyWith] = useState<'email' | 'phone'>('email');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreed_to_terms) {
      setError('You must agree to the Vendor Marketplace Terms & Conditions.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const identifier = verifyWith === 'email' ? formData.email : formData.phone_number;
      if (!otpSent) {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/send-otp/`, { email: identifier });
        setOtpSent(true);
        setMessage(`Verification OTP sent to your ${verifyWith}.`);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/verify-registration/`, {
          ...formData,
          is_vendor: true,
          otp_code: otpCode
        });
        setSuccess(true);
        setTimeout(() => {
          navigate('/vendor/login');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your vendor account has been created. Please wait for an administrator to approve your account before logging in.
          </p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-500 mb-4">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Become a Vendor</h2>
          <p className="text-gray-500 mt-2">Start selling your juices today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {message && !error && (
          <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-lg flex items-center gap-2">
            <CheckCircle2 size={20} />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="flex items-center rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-orange-500 transition-all overflow-hidden bg-white">
              <span className="px-3 py-2 bg-gray-50 text-gray-400 font-bold border-r border-gray-200 text-sm">+91</span>
              <input
                type="text"
                name="phone_number"
                required
                placeholder="Enter 10-digit number"
                maxLength={10}
                value={formData.phone_number}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 10) setFormData({...formData, phone_number: val});
                }}
                className="w-full px-4 py-2 bg-transparent outline-none"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Verify with</label>
            <div className="flex gap-2">
              {['email', 'phone'].map((type) => (
                <button
                  key={type}
                  type="button"
                  disabled={otpSent}
                  onClick={() => setVerifyWith(type as any)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    verifyWith === type 
                      ? 'bg-white text-orange-500 shadow-sm border border-gray-100' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Business Details</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                <input
                  type="text"
                  name="shop_name"
                  required
                  value={formData.shop_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Full Name</label>
                <input
                  type="text"
                  name="owner_name"
                  required
                  value={formData.owner_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                <textarea
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST Number (Optional)</label>
                  <input
                    type="text"
                    name="gst_number"
                    value={formData.gst_number}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">FSSAI License (Optional)</label>
                  <input
                    type="text"
                    name="fssai_license"
                    value={formData.fssai_license}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {otpSent && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter 6-Digit OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-orange-200 focus:border-orange-500 text-center font-bold text-xl tracking-widest outline-none"
              />
            </motion.div>
          )}

          <div className="pt-4 flex items-start gap-3">
            <input
              type="checkbox"
              id="agreed_to_terms"
              name="agreed_to_terms"
              required
              checked={formData.agreed_to_terms}
              onChange={handleChange}
              className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="agreed_to_terms" className="text-sm text-gray-600 leading-tight">
              I agree to the <Link to="/vendor-agreement" className="text-orange-500 font-bold hover:underline">Vendor Marketplace Terms & Conditions</Link> and will comply with all food safety regulations.
            </label>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white font-semibold py-4 px-6 rounded-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (otpSent ? 'Verify & Create Account' : 'Send Verification OTP')}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already a vendor?{' '}
          <Link to="/vendor/login" className="text-orange-500 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default VendorRegister;
