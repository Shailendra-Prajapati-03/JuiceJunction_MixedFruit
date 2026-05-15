import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, ShieldCheck, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Recipe, Order } from '../types';

const VideoCard: React.FC<{ video: any, index: number }> = ({ video, index }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    // Ensure video starts playing if possible
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log("Autoplay blocked:", err);
        setIsPlaying(false);
      });
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onClick={togglePlay}
      className="relative group rounded-[1.2rem] overflow-hidden h-40 md:h-52 bg-slate-100 shadow-md border border-slate-200/50 cursor-pointer"
    >
      <video 
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster={video.poster}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      >
        <source src={video.url} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
          {isPlaying ? (
            <div className="flex gap-1">
              <div className="w-1.5 h-4 bg-white rounded-full" />
              <div className="w-1.5 h-4 bg-white rounded-full" />
            </div>
          ) : (
            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
          )}
        </div>
      </div>
      <div className="absolute bottom-3 left-4">
        <h4 className="text-xs font-black text-white drop-shadow-md uppercase tracking-wider">{video.label}</h4>
      </div>
    </motion.div>
  );
};

const Home: React.FC = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
<<<<<<< HEAD
        const response = await api.get('/api/recipes/');
=======
        const response = await api.get('/recipes/');
>>>>>>> 18a190e7792a47b11a997af80c50d0ff5ace506d
        if (Array.isArray(response.data)) {
          setFeaturedRecipes(response.data.slice(0, 6));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <div className="space-y-6 md:space-y-12">
      {/* 1. Hero Section */}
      <section className="container mx-auto px-4 md:px-6 pt-4 md:pt-10">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full border border-primary-100"
            >
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-xs font-black text-primary-600 uppercase tracking-widest">Freshly Squeezed Daily</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] md:leading-none tracking-tighter"
            >
              Craft Your <br className="hidden sm:block" />
              <span className="text-primary-500">Perfect</span> Sip.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm md:text-base text-slate-500 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed"
            >
              Experience the world's first interactive juice builder. Pick your fruits, watch the magic happen, and get it delivered in minutes.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <Link to="/builder" className="btn-primary px-6 py-3 text-sm md:px-8 md:py-4 md:text-base group w-full sm:w-auto justify-center">
                Start Building <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/gallery" className="px-6 py-3 text-sm md:text-base font-black text-slate-600 hover:text-slate-900 transition-colors">
                Explore Menu
              </Link>
            </motion.div>
          </div>

          <div className="flex-1 relative flex items-center justify-center overflow-hidden lg:overflow-visible">
            <div className="absolute w-[120%] h-[120%] bg-primary-100 rounded-full blur-[120px] opacity-20 -z-10" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative z-10 w-full"
            >
              <img 
                src="/images/hero.png" 
                alt="Premium Juice Blend" 
                className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
              />
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/5 blur-2xl rounded-[100%] -z-10" />
              <motion.div 
                animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 left-0 text-5xl filter drop-shadow-lg opacity-80"
              >🍓</motion.div>
              <motion.div 
                animate={{ y: [0, 15, 0], x: [0, -5, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 right-0 text-4xl filter drop-shadow-lg opacity-80"
              >🍋</motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* 2. Demo Videos Section */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[
            { 
              url: 'https://cdn.pixabay.com/video/2021/07/24/82602-580137800_large.mp4', 
              label: 'Vibrant Extraction',
              poster: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80'
            },
            { 
              url: 'https://cdn.pixabay.com/video/2023/02/13/150470-798441308_large.mp4', 
              label: 'Flash Blending',
              poster: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'
            },
            { 
              url: 'https://cdn.pixabay.com/video/2025/07/25/293519_large.mp4', 
              label: 'Masterful Mix-Up',
              poster: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80'
            }
          ].map((video, i) => (
            <VideoCard key={i} video={video} index={i} />
          ))}
        </div>
      </section>

      {/* 3. Popular Glass Options */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <span className="text-primary-500 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] mb-2 md:mb-3 block">Recommended for You</span>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter mb-3 md:mb-4">Popular Glass Options</h2>
          <div className="w-10 md:w-12 h-1 bg-primary-500 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {featuredRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center group"
            >
              <Link to={`/recipe/${recipe.id}`} className="mb-4 md:mb-5 w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-500 border-4 border-white">
                <img 
                  src={`/images/recipes/${recipe.name.toLowerCase().replace(/\s+/g, '-')}.png`} 
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `/images/juice${(index % 3) + 1}.png`;
                  }}
                />
              </Link>

              <div className="text-center space-y-2 mt-3 w-full px-2">
                <h3 className="text-base font-black text-slate-900 group-hover:text-primary-500 transition-colors leading-tight">{recipe.name}</h3>
                
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="flex gap-1">
                      {recipe.ingredients.map(ri => (
                        <div 
                          key={ri.id} 
                          className="w-2 h-2 rounded-full border border-white shadow-sm" 
                          style={{ backgroundColor: ri.fruit_color }}
                          title={ri.fruit_name}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{recipe.ingredients.length} FRUITS</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight px-4 line-clamp-1">
                    {recipe.ingredients.map(ri => ri.fruit_name).join(' • ')}
                  </p>
                </div>
                
                <div className="flex items-center justify-center gap-6 w-full pt-2 border-t border-slate-100/50 mt-2">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-[10px] font-black text-primary-500">₹</span>
                    <span className="text-xl font-black text-slate-900 tracking-tighter">{recipe.base_price}</span>
                  </div>
                  <Link 
                    to={`/recipe/${recipe.id}`} 
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-black hover:bg-primary-500 transition-all active:scale-95 shadow-md"
                  >
                    View Details <ShoppingCart className="w-2.5 h-2.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. CTA Section */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="bg-primary-500 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-primary-500/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -ml-48 -mb-48" />
          
          {/* Floating Decorative Fruits */}
          <motion.div animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-6 left-6 md:top-10 md:left-10 text-3xl md:text-5xl opacity-40 select-none">🍍</motion.div>
          <motion.div animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity, delay: 1 }} className="absolute bottom-6 right-6 md:bottom-10 md:right-10 text-3xl md:text-5xl opacity-40 select-none">🍎</motion.div>
          <motion.div animate={{ x: [0, 10, 0], y: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, delay: 2 }} className="absolute top-1/2 left-10 md:left-24 text-2xl md:text-4xl opacity-30 select-none hidden sm:block">🍇</motion.div>
          <motion.div animate={{ x: [0, -10, 0], y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 0.5 }} className="absolute top-1/4 right-10 md:right-24 text-2xl md:text-4xl opacity-30 select-none hidden sm:block">🥭</motion.div>
          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute bottom-1/4 left-1/4 text-xl opacity-20 select-none hidden lg:block">🍓</motion.div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-6 md:space-y-8">
            <h2 className="text-2xl md:text-4xl font-black tracking-tighter leading-[1.1] md:leading-[1.0]">Ready to build your <br /> own masterpiece?</h2>
            <p className="text-primary-100 text-sm md:text-base font-medium">Join 50,000+ juice lovers crafting their daily doses of health.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/builder" className="w-full sm:w-auto px-8 py-4 bg-white text-primary-600 rounded-full font-black text-lg hover:shadow-2xl transition-all active:scale-95">
                Go to Builder
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* 4. How It Works (Last) */}
      <section className="bg-white pt-10 pb-8">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-2xl mx-auto mb-8 space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">How It Works</h2>
            <p className="text-slate-400 font-medium text-sm">Three simple steps to your perfect refreshment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: Zap, title: 'Pick Fruits', desc: 'Select from 30+ fresh seasonal fruits to create your base.' },
              { icon: Sparkles, title: 'Live Mix', desc: 'Watch your juice being layered and blended in real-time.' },
              { icon: ShieldCheck, title: 'Quick Delivery', desc: 'Sip your perfection in under 30 minutes, ice-cold.' }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-4 group"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all duration-500 rotate-3 group-hover:-rotate-3 shadow-sm group-hover:shadow-xl group-hover:shadow-primary-500/20">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">{step.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
