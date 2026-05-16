import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Minus, ShoppingCart, RefreshCw, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore, MixMode } from '../store/useStore';
import JuiceGlass from '../components/JuiceGlass';
import api from '../utils/api';
import { Fruit } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const Builder: React.FC = () => {
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [category, setCategory] = useState('All');
  const [isGenerating, setIsGenerating] = useState(false);

  const { 
    ingredients, 
    addIngredient, 
    updatePercentage, 
    resetBuilder, 
    size, 
    mixMode,
    addIns,
    setBuilderSize,
    setMixMode,
    toggleAddIn,
    addToCart,
    isAuthenticated,
    clearCart,
    replaceCart
  } = useStore();

  useEffect(() => {
    const fetchFruits = async () => {
      try {
        const response = await api.get('/api/fruits/');
        if (Array.isArray(response.data)) {
          setFruits(response.data);
        }
      } catch (error) {
        console.error("Error fetching fruits:", error);
        setError("Failed to load fruits. Please check your connection to the backend.");
      } finally {
        setLoading(false);
      }
    };
    fetchFruits();
  }, []);

  const totalPercentage = useMemo(() => ingredients.reduce((sum, ing) => (sum || 0) + (ing.percentage || 0), 0), [ingredients]);

  const filteredFruits = fruits.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || f.category === category;
    return matchesSearch && matchesCategory;
  });



  const addFruit = (fruit: Fruit) => {
    if (totalPercentage >= 100 && mixMode !== 'Single') return;

    let amount = 20;

    if (mixMode === 'Single') {
      // In Single mode, clicking a fruit sets it to 100% and removes any existing
      if (ingredients.length > 0 && ingredients[0].fruitId !== fruit.id) {
         resetBuilder();
         setTimeout(() => {
           addIngredient({
             fruitId: fruit.id, name: fruit.name, color: fruit.color_hex,
             percentage: 100, pricePer100ml: fruit.price_per_100ml, caloriesPer100ml: fruit.calories_per_100ml
           });
         }, 0);
         return;
      }
      amount = 100;
    } else if (mixMode === 'Duo') {
      if (ingredients.length >= 2) return;
      amount = 50;
    } else if (mixMode === 'Trio') {
      if (ingredients.length >= 3) return;
      amount = ingredients.length === 2 ? 34 : 33; // 33 + 33 + 34 = 100
    } else {
      // Custom mode
      const remaining = 100 - totalPercentage;
      amount = Math.min(20, remaining);
    }

    addIngredient({
      fruitId: fruit.id,
      name: fruit.name,
      color: fruit.color_hex,
      percentage: amount,
      pricePer100ml: fruit.price_per_100ml,
      caloriesPer100ml: fruit.calories_per_100ml
    });
  };

  const calculation = useMemo(() => {
    let price = ingredients.reduce((sum, ing) => sum + (ing.pricePer100ml * (ing.percentage / 100)), 0);
    let calories = ingredients.reduce((sum, ing) => sum + (ing.caloriesPer100ml * (ing.percentage / 100)), 0);
    
    const sizeMultiplier = size === 'Small' ? 2.5 : size === 'Medium' ? 3.5 : 5;
    price *= sizeMultiplier;
    calories *= sizeMultiplier;

    price += addIns.length * 10;

    return { 
      price: Math.round(price), 
      calories: Math.round(calories) 
    };
  }, [ingredients, size, addIns]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const handleAddToCart = (shouldNavigate = true) => {
    const juiceId = Math.random().toString(36).substr(2, 9);
    
    if (shouldNavigate) {
      replaceCart({
        id: juiceId,
        name: `${mixMode} Blend (${ingredients.length} fruits)`,
        price: calculation.price,
        calories: calculation.calories,
        size,
        addIns,
        ingredients: [...ingredients]
      });
      if (isAuthenticated) {
        navigate('/cart', { state: { step: 'checkout' } });
      } else {
        navigate(`/auth?redirect=${encodeURIComponent('/cart?step=checkout')}`);
      }
    } else {
      addToCart({
        id: juiceId,
        name: `${mixMode} Blend (${ingredients.length} fruits)`,
        price: calculation.price,
        calories: calculation.calories,
        size,
        addIns,
        ingredients: [...ingredients]
      });
      alert('Added to Order!');
    }
  };

  const getFruitEmoji = (name: string) => {
    const emojis: Record<string, string> = {
      // Original 12
      'Apple': '🍎',
      'Mango': '🥭',
      'Orange': '🍊',
      'Strawberry': '🍓',
      'Banana': '🍌',
      'Pineapple': '🍍',
      'Kiwi': '🥝',
      'Blueberry': '🍇',
      'Pomegranate': '🍒',
      'Watermelon': '🍉',
      'Lemon': '🍋',
      'Ginger': '🌿',
      // New 18
      'Grapes': '🍇',
      'Papaya': '🍈',
      'Guava': '🍏',
      'Coconut': '🥥',
      'Litchi': '🍑',
      'Peach': '🍑',
      'Plum': '🍑',
      'Cherry': '🍒',
      'Raspberry': '🍓',
      'Pear': '🍐',
      'Lime': '🍋',
      'Grapefruit': '🍊',
      'Passion Fruit': '🍈',
      'Dragonfruit': '🌺',
      'Jackfruit': '🍈',
      'Avocado': '🥑',
      'Honeydew': '🍈',
      'Cantaloupe': '🍈',
    };
    return emojis[name] || '🍹';
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-10 space-y-12">
      
      {/* 1. TOP: Choose Fruits (Full Screen Width) */}
      <section className="bg-white rounded-[2rem] md:rounded-[3rem] p-5 md:p-12 shadow-sm border border-slate-100">
        <div className="space-y-6 md:space-y-8 mb-6 md:mb-10">
          {/* Row 1: Title & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="bg-emerald-500 p-2 md:p-2.5 rounded-xl md:rounded-2xl text-white shadow-lg shadow-emerald-500/20">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 fill-current" />
              </div>
              <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter">Choose Your Fruits</h2>
            </div>

            <div className="relative group w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search fruits..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Row 2: Categories */}
          <div className="scroll-fade-right">
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
              {[
                { name: 'All',      icon: '🥤' },
                { name: 'Tropical', icon: '🍍' },
                { name: 'Citrus',   icon: '🍊' },
                { name: 'Berry',    icon: '🍓' },
                { name: 'Melon',    icon: '🍉' },
                { name: 'Other',    icon: '🌿' },
              ].map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={clsx(
                    "flex items-center gap-1.5 px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black whitespace-nowrap transition-all border-2",
                    category === cat.name
                      ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20"
                      : "bg-white text-slate-500 border-slate-100 hover:border-slate-200 hover:text-slate-700"
                  )}
                >
                  <span className="text-base">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center">
              <RefreshCw className="w-10 h-10 text-primary-200 animate-spin mx-auto mb-4" />
              <p className="text-sm text-slate-400 font-black uppercase tracking-widest">Fetching Nature's Best...</p>
            </div>
          ) : error ? (
            <div className="col-span-full py-20 text-center">
              <div className="bg-red-50 text-red-500 p-6 rounded-[2rem] border border-red-100 max-w-md mx-auto">
                <p className="font-black uppercase tracking-widest text-xs mb-2">Connection Error</p>
                <p className="text-sm font-bold">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl text-xs font-black shadow-lg shadow-red-500/20"
                >
                  Retry
                </button>
              </div>
            </div>

          ) : filteredFruits.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-400 font-bold">No fruits found in this category</div>
          ) : filteredFruits.map(fruit => {
            const isSelected = ingredients.some(i => i.fruitId === fruit.id);
            const isDisabled = (totalPercentage >= 100 && mixMode !== 'Single') || 
                               (mixMode === 'Single' && ingredients.length === 1 && ingredients[0].fruitId !== fruit.id && totalPercentage >= 100) ||
                               (mixMode === 'Duo' && ingredients.length >= 2 && !isSelected) ||
                               (mixMode === 'Trio' && ingredients.length >= 3 && !isSelected);

            return (
              <motion.button
                key={fruit.id}
                whileHover={!isDisabled ? { scale: 1.07, y: -6 } : {}}
                whileTap={!isDisabled ? { scale: 0.95 } : {}}
                onClick={() => addFruit(fruit)}
                disabled={isDisabled}
                className={clsx(
                  "group relative rounded-[1.5rem] md:rounded-[2.5rem] p-3 md:p-5 border-2 transition-all flex flex-col items-center",
                  isSelected 
                    ? "bg-emerald-50 border-emerald-500 shadow-lg shadow-emerald-500/10"
                    : "bg-white border-slate-50 hover:border-primary-200 hover:shadow-2xl",
                  isDisabled && !isSelected && "opacity-40 cursor-not-allowed"
                )}
              >
                {/* Fruit Emoji Circle */}
                <div 
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full mb-2 md:mb-3 flex items-center justify-center text-xl md:text-3xl shadow-lg mx-auto select-none transition-transform duration-300 group-hover:scale-110"
                  style={{ 
                    background: `linear-gradient(135deg, ${fruit.color_hex}33, ${fruit.color_hex}66)`,
                    boxShadow: `0 10px 30px ${fruit.color_hex}44`
                  }}
                >
                  {getFruitEmoji(fruit.name)}
                </div>
                <div className="text-center">
                  <span className="block text-sm font-black text-slate-800 mb-1">{fruit.name}</span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">₹{fruit.price_per_100ml}</span>
                </div>
                {totalPercentage < 100 && !isDisabled && mixMode === 'Custom' && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="bg-primary-500 text-white p-1 rounded-full shadow-lg">
                        <Plus className="w-3 h-3" />
                     </div>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </section>
      
      {/* Mix Modes Switcher (Moved here for better flow) */}
      <div className="flex justify-center -mt-6">
        <div className="flex gap-2 p-1.5 bg-slate-900 rounded-[2rem] w-full max-w-md shadow-2xl border border-white/5">
          {(['Single', 'Duo', 'Trio', 'Custom'] as MixMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setMixMode(mode)}
              className={clsx(
                "flex-1 py-3 md:py-4 rounded-2xl text-xs md:text-sm font-black transition-all",
                mixMode === mode ? "bg-emerald-500 text-white shadow-lg" : "text-white/40 hover:text-white"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* 2. BOTTOM: Mixer & Recipe */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left/Center: Juice Mixer Visualizer */}
        <div className="lg:col-span-7 bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 flex flex-col items-center justify-center shadow-sm border border-slate-100 overflow-hidden relative">
           <div className="absolute top-6 md:top-8 left-6 md:left-10">
              <h3 className="text-lg md:text-2xl font-black text-slate-900 tracking-tighter">Juice Mixer</h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-32 h-2 bg-slate-50 rounded-full overflow-hidden">
                  <motion.div 
                    className={clsx("h-full", totalPercentage > 100 ? "bg-red-500" : "bg-primary-500")}
                    animate={{ width: `${Math.min(totalPercentage, 100)}%` }}
                  />
                </div>
                <span className="text-xs font-black text-primary-600">{totalPercentage}%</span>
              </div>
           </div>

           <div className="my-10">
              <JuiceGlass ingredients={ingredients} isGenerating={isGenerating} />
           </div>

           <div className="h-40 flex flex-col items-center justify-center">
              {totalPercentage === 100 && !isGenerating && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
                    <div className="flex items-baseline justify-center gap-1">
                       <span className="text-sm font-black text-primary-500">₹</span>
                       <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">{calculation.price}</span>
                    </div>
                    <button onClick={handleGenerate} className="btn-primary px-8 py-4 md:px-12 md:py-5 text-base md:text-lg">
                       <RefreshCw className="w-5 h-5 md:w-5 md:h-5" /> Mix it Up!
                    </button>
                </motion.div>
              )}
              {isGenerating && (
                <div className="text-center space-y-4">
                   <RefreshCw className="w-12 h-12 text-primary-500 animate-spin mx-auto" />
                   <p className="text-lg font-black text-slate-900">Blending Perfection...</p>
                </div>
              )}
              {totalPercentage < 100 && (
                <p className="text-slate-400 font-bold max-w-xs text-center">Add more fruits above to reach 100% and unlock your mix</p>
              )}
           </div>
        </div>

        {/* Right: Recipe & Controls */}
         <div className="lg:col-span-5 space-y-6 md:space-y-8">
            <div className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-white shadow-2xl shadow-slate-900/20">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black tracking-tight">Your Recipe</h3>
                <button onClick={resetBuilder} className="text-xs font-bold text-white/40 hover:text-red-400 transition-colors">Reset</button>
              </div>


              <div className="space-y-4 mb-10 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                <AnimatePresence mode="popLayout">
                  {ingredients.length === 0 ? (
                    <div className="py-10 text-center text-white/20 border-2 border-dashed border-white/5 rounded-[2rem]">
                      Select fruits to start your {mixMode} blend!
                    </div>
                  ) : ingredients.map(ing => (
                    <motion.div key={ing.fruitId} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-xs text-white" style={{ backgroundColor: ing.color }}>{ing.percentage}%</div>
                          <span className="font-bold">{ing.name}</span>
                       </div>
                       {mixMode === 'Custom' && (
                         <div className="flex items-center gap-2">
                            <button onClick={() => updatePercentage(ing.fruitId, -10)} className="p-2 hover:bg-white/10 rounded-lg"><Minus className="w-4 h-4" /></button>
                            <button onClick={() => updatePercentage(ing.fruitId, 10)} className="p-2 hover:bg-white/10 rounded-lg"><Plus className="w-4 h-4" /></button>
                         </div>
                       )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="space-y-6 pt-6 border-t border-white/10">
                <div className="flex gap-4">
                  {(['Small', 'Medium', 'Large'] as const).map(s => (
                    <button key={s} onClick={() => setBuilderSize(s)} className={clsx("flex-1 py-4 rounded-2xl text-xs font-black transition-all border", size === s ? "bg-white text-slate-900 border-white" : "bg-transparent text-white/40 border-white/10")}>{s}</button>
                  ))}
                </div>
                
                 <div className="flex flex-col sm:flex-row gap-4">
                   <button 
                     onClick={() => handleAddToCart(false)}
                     disabled={totalPercentage !== 100 || isGenerating}
                     className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white font-black py-5 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                   >
                     <ShoppingCart className="w-5 h-5" /> Add to Order
                   </button>
                   <button 
                     onClick={() => handleAddToCart(true)}
                     disabled={totalPercentage !== 100 || isGenerating}
                     className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:opacity-40 text-white font-black py-5 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-primary-500/20"
                   >
                     Order Now <ArrowRight className="w-5 h-5" />
                   </button>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Builder;
