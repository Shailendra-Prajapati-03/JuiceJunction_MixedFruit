import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Leaf, Target } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-slate-900 mb-6 tracking-tight"
          >
            Squeezing the Best Out of <span className="text-primary-500">Nature</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 font-medium leading-relaxed"
          >
            JuiceJunction was born from a simple idea: that healthy living shouldn't be boring, 
            and fresh juice shouldn't be processed.
          </motion.p>
        </div>

        {/* Our Story */}
        <section id="story" className="mb-24">
          <div className="bg-white rounded-[3rem] p-12 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500">
                <Sparkles size={24} />
              </div>
              <h2 className="text-3xl font-black text-slate-900">Our Juice Story</h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                It started in a small kitchen with a passion for mixing unconventional fruits. 
                We realized that the market was full of "fresh" juices that sat on shelves for weeks. 
                JuiceJunction was created to bring the farm-to-glass experience to your doorstep, 
                with every blend customized by you.
              </p>
            </div>
            <div className="flex-1">
              <img 
                src="https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&q=80&w=800" 
                alt="Fresh Fruits" 
                className="rounded-[2.5rem] shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <motion.div 
            id="mission"
            whileHover={{ y: -5 }}
            className="bg-primary-500 p-10 rounded-[3rem] text-white space-y-6 shadow-xl shadow-primary-500/20"
          >
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Target size={28} />
            </div>
            <h2 className="text-3xl font-black">Our Mission</h2>
            <p className="text-primary-50 font-medium leading-relaxed text-lg">
              To make fresh, nutrient-dense, and delicious fruit blends accessible to everyone 
              while supporting local vendors and sustainable farming practices.
            </p>
          </motion.div>

          <motion.div 
            id="ingredients"
            whileHover={{ y: -5 }}
            className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-6 shadow-xl shadow-slate-900/20"
          >
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-primary-400">
              <Leaf size={28} />
            </div>
            <h2 className="text-3xl font-black">Fresh Ingredients</h2>
            <p className="text-slate-400 font-medium leading-relaxed text-lg">
              We source only A-grade seasonal fruits. No frozen pulps, no added sugars, 
              and absolutely zero preservatives. If it's not fresh, it's not JuiceJunction.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
