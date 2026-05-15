import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, ShoppingBag, Star, Clock, 
  Flame, Leaf, ShieldCheck, Heart, Share2
} from 'lucide-react';
import api from '../utils/api';
import { Recipe } from '../types';
import { useStore } from '../store/useStore';

const RecipeDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isAuthenticated, clearCart } = useStore();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<'Small' | 'Medium' | 'Large'>('Medium');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await api.get<Recipe>(`/api/recipes/${id}/`);
        setRecipe(res.data);
      } catch (err) {
        console.error("Failed to fetch recipe", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleAddToCart = (shouldNavigate: boolean) => {
    if (!recipe) return;

    const sizeMultiplier = selectedSize === 'Small' ? 0.8 : selectedSize === 'Large' ? 1.3 : 1;
    const finalPrice = parseFloat(recipe.base_price) * sizeMultiplier;

    const juiceItem = {
      id: `recipe-${recipe.id}-${selectedSize}-${Date.now()}`,
      name: recipe.name,
      price: finalPrice,
      calories: 150 * sizeMultiplier,
      size: selectedSize,
      addIns: [],
      ingredients: recipe.ingredients.map(ing => ({
        fruitId: ing.fruit,
        name: ing.fruit_name,
        color: ing.fruit_color,
        percentage: ing.percentage,
        pricePer100ml: 0,
        caloriesPer100ml: 0
      }))
    };

    if (shouldNavigate) {
      // Direct checkout for "Order Now"
      const buyNowItem = { ...juiceItem, quantity: 1 };
      if (isAuthenticated) {
        navigate('/cart', { state: { step: 'checkout', buyNowItem } });
      } else {
        navigate(`/auth?redirect=${encodeURIComponent('/cart?step=checkout')}&buyNow=${encodeURIComponent(JSON.stringify(buyNowItem))}`, { state: { step: 'checkout', buyNowItem } });
      }
    } else {
      addToCart(juiceItem);
      alert('Added to Cart!');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBF9]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full" />
    </div>
  );

  if (!recipe) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFBF9] p-6 text-center">
      <h2 className="text-2xl font-black text-slate-900 mb-4">Recipe not found</h2>
      <button onClick={() => navigate('/')} className="px-8 py-3 bg-primary-500 text-white font-black rounded-2xl">Back to Home</button>
    </div>
  );

  return (
    <div className="min-h-screen pt-4 md:pt-8 pb-20 bg-[#FFFBF9]">
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: Product Image & Preview */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-square bg-white rounded-[3rem] shadow-2xl flex items-center justify-center p-12 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-50" />
               <motion.img 
                 src={recipe.image || `/images/recipes/${recipe.name.toLowerCase().replace(/\s+/g, '-')}.png`} 
                 alt={recipe.name}
                 onError={(e) => {
                   e.currentTarget.src = `/images/juice${(recipe.id % 3) + 1}.png`;
                 }}
                 className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative z-10"
                 whileHover={{ scale: 1.05, rotate: 2 }}
               />
               
               {/* Decorative elements */}
               <div className="absolute top-8 left-8 flex flex-col gap-3 z-20">
                  <div className="px-4 py-2 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-sm flex items-center gap-2">
                     <Star className="text-yellow-400 fill-yellow-400" size={16} />
                     <span className="text-xs font-black text-slate-900">4.9 (120+)</span>
                  </div>
                  <div className="px-4 py-2 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-sm flex items-center gap-2">
                     <Flame className="text-orange-500" size={16} />
                     <span className="text-xs font-black text-slate-900">150 kcal</span>
                  </div>
               </div>

               <div className="absolute bottom-8 right-8 z-20">
                  <button className="p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-sm text-slate-400 hover:text-red-500 transition-colors">
                     <Heart size={24} />
                  </button>
               </div>
            </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary-100 text-primary-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Signature Blend</span>
                <span className="flex items-center gap-1 text-slate-400 text-xs font-bold"><Clock size={14} /> Ready in 5 min</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">{recipe.name}</h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                {recipe.description}
              </p>
            </div>

            {/* Ingredients */}
            <div className="space-y-6">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Leaf size={14} className="text-green-500" /> Key Ingredients
               </h3>
               <div className="flex flex-wrap gap-4">
                  {recipe.ingredients.map((ing, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
                       <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: ing.fruit_color }} />
                       <span className="text-sm font-black text-slate-700">{ing.fruit_name} <span className="text-slate-300 ml-1">{ing.percentage}%</span></span>
                    </div>
                  ))}
               </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-6">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Size</h3>
               <div className="flex gap-4">
                  {(['Small', 'Medium', 'Large'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`flex-1 py-4 rounded-2xl border-2 transition-all font-black text-sm ${
                        selectedSize === s 
                        ? 'border-primary-500 bg-primary-50 text-primary-600 shadow-lg shadow-primary-500/10' 
                        : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
               </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center gap-4 w-full border-t border-slate-100">
               <div className="text-center md:text-left min-w-[120px]">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Price</p>
                  <p className="text-3xl font-black text-slate-900">₹{(parseFloat(recipe.base_price) * (selectedSize === 'Small' ? 0.8 : selectedSize === 'Large' ? 1.3 : 1)).toFixed(2)}</p>
               </div>
               
               <div className="flex flex-col sm:flex-row gap-4 w-full">
                 <button 
                   onClick={() => handleAddToCart(false)}
                   className="flex-1 py-4 bg-white border-2 border-slate-100 hover:border-primary-500 hover:bg-primary-50 text-slate-600 hover:text-primary-600 font-black rounded-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                 >
                   <ShoppingBag size={18} />
                   Add to Cart
                 </button>
                 <button 
                   onClick={() => handleAddToCart(true)}
                   className="flex-1 py-4 bg-primary-500 hover:bg-primary-600 text-white font-black rounded-xl shadow-xl shadow-primary-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                 >
                   Order Now
                 </button>
               </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-between pt-6">
               <div className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck size={18} className="text-green-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">100% Organic</span>
               </div>
               <div className="flex items-center gap-2 text-slate-400">
                  <Share2 size={18} className="text-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Share Blend</span>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
