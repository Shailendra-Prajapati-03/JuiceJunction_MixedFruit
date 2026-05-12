import React, { useState, useEffect } from 'react';
import { ShoppingCart, RefreshCw, Sparkles, Plus, Star } from 'lucide-react';
import api from '../utils/api';
import { Recipe } from '../types';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import JuiceGlass from '../components/JuiceGlass';

const Gallery: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const { addToCart, setIngredients, setBuilderSize } = useStore();
  const navigate = useNavigate();

  const categories = [
    { name: 'All',      icon: '🥤' },
    { name: 'Tropical', icon: '🍍' },
    { name: 'Citrus',   icon: '🍊' },
    { name: 'Berry',    icon: '🍓' },
    { name: 'Melon',    icon: '🍉' },
    { name: 'Other',    icon: '🌿' },
  ];

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await api.get('/recipes/');
        if (Array.isArray(response.data)) {
          setRecipes(response.data);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const handleCustomize = (recipe: Recipe) => {
    const builderIngredients = recipe.ingredients.map((ri: any) => ({
      fruitId: ri.fruit,
      name: ri.fruit_name,
      color: ri.fruit_color,
      percentage: ri.percentage,
      pricePer100ml: '0.00', // fallback
      caloriesPer100ml: 0 // fallback
    }));
    setIngredients(builderIngredients);
    setBuilderSize('Medium');
    navigate('/builder');
  };

  const handleAddToCart = (recipe: Recipe) => {
    addToCart({
      id: Math.random().toString(36).substr(2, 9),
      name: recipe.name,
      price: recipe.base_price,
      calories: 250,
      size: 'Medium',
      addIns: [],
      ingredients: recipe.ingredients.map((ri: any) => ({
        fruitId: ri.fruit,
        name: ri.fruit_name,
        color: ri.fruit_color,
        percentage: ri.percentage,
        pricePer100ml: '0.00',
        caloriesPer100ml: 0
      }))
    });
  };

  const filteredRecipes = activeCategory === 'All'
    ? recipes
    : recipes; // Category filtering disabled due to backend omitting category in nested serializer

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-12 h-12 text-primary-500 animate-spin mb-4" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading fresh blends...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10 bg-[#FFF9F6] min-h-screen">
      {/* Category Header */}
      <div className="mb-12">
        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Browse by Category</h2>
        <div className="scroll-fade-right">
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={clsx(
                  "flex items-center gap-3 px-6 py-3 rounded-full font-bold text-sm transition-all whitespace-nowrap shadow-sm border",
                  activeCategory === cat.name
                    ? "bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/30"
                    : "bg-white text-slate-600 border-white hover:border-slate-200"
                )}
              >
                <span className="text-lg">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Signature Blends */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-1.5 rounded-lg text-white">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Signature Blends</h2>
          </div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {filteredRecipes.length} Blends
          </span>
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-bold">
            No blends found in this category
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-24 pt-12">
            {filteredRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative bg-white rounded-[2.5rem] pt-20 pb-6 px-6 shadow-sm hover:shadow-2xl transition-all duration-500 text-center flex flex-col items-center group border border-slate-50"
              >
                {/* Floating Image */}
                <div 
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                  className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full p-1 bg-white shadow-xl group-hover:scale-110 transition-transform duration-500 overflow-hidden cursor-pointer"
                >
                  <img
                    src={`/images/recipes/${recipe.name.toLowerCase().replace(/\s+/g, '-')}.png`}
                    alt={recipe.name}
                    className="w-full h-full object-cover rounded-full bg-slate-50"
                    onError={(e) => {
                      e.currentTarget.src = `/images/juice${(index % 3) + 1}.png`;
                    }}
                  />
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-black text-slate-900 leading-tight mb-2 group-hover:text-primary-500 transition-colors">{recipe.name}</h3>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed line-clamp-2 px-2">
                    {recipe.description}
                  </p>
                </div>

                <div className="mt-auto w-full">
                  <div className="flex items-baseline justify-center gap-1 mb-4">
                    <span className="text-sm font-black text-primary-500">₹</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">{recipe.base_price}</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleAddToCart(recipe)}
                      className="w-full bg-primary-500 hover:bg-primary-600 text-white font-black py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" /> Add to Cart
                    </button>
                    <button
                      onClick={() => handleCustomize(recipe)}
                      className="w-full text-slate-400 hover:text-primary-500 text-[10px] font-black uppercase tracking-widest transition-colors py-1"
                    >
                      Customize it
                    </button>
                  </div>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-1 bg-primary-50 text-primary-600 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                  <Star className="w-2.5 h-2.5 fill-current" /> BEST
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
