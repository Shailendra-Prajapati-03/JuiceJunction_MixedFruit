import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('juicejunction-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = (type: 'all' | 'essential') => {
    localStorage.setItem('juicejunction-cookie-consent', type);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[400px] z-[100]"
        >
          <div className="bg-slate-900 text-white rounded-[2rem] p-6 shadow-2xl shadow-black/50 border border-white/10 backdrop-blur-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-500 rounded-xl">
                  <Cookie size={20} className="text-white" />
                </div>
                <h3 className="font-black text-lg tracking-tight">Cookie Consent</h3>
              </div>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">
              We use cookies to enhance your experience, analyze site traffic, and remember your custom juice blends. 
              Read our <Link to="/cookie-policy" className="text-primary-400 hover:underline">Cookie Policy</Link> for details.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleAccept('all')}
                className="w-full py-3 bg-white text-slate-900 font-black rounded-xl hover:bg-slate-100 transition-all active:scale-95 text-sm"
              >
                Accept All Cookies
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => handleAccept('essential')}
                  className="flex-1 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all active:scale-95 text-xs border border-slate-700"
                >
                  Essential Only
                </button>
                <Link
                  to="/privacy-policy"
                  className="flex items-center justify-center p-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all border border-slate-700"
                  title="Privacy Settings"
                >
                  <Shield size={16} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
