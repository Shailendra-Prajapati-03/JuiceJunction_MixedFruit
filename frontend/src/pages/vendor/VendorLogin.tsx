import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { useStore } from '../../store/useStore';
import { Store, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const VendorLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useStore((state) => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/vendor/login/', {
        username,
        password,
      });
      // In a real app, we'd also decode the JWT to check if is_vendor, or backend returns it
      login(response.data.access, { username, is_vendor: true });
      navigate('/vendor/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-500 mb-4">
            <Store size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Vendor Portal</h2>
          <p className="text-gray-500 mt-2">Manage your juice shop</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
          >
            Sign In <ArrowRight size={20} />
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Want to become a vendor?{' '}
          <Link to="/vendor/register" className="text-orange-500 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default VendorLogin;
