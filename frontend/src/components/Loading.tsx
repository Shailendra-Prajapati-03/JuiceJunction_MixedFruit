import React from 'react';
import { RefreshCw } from 'lucide-react';

const Loading: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFBF9]">
      <RefreshCw className="w-12 h-12 text-primary-500 animate-spin mb-4" />
      <p className="text-lg font-black text-slate-900 tracking-tighter">Loading...</p>
    </div>
  );
};

export default Loading;
