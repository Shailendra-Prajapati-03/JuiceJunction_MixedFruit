import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface Ingredient {
  fruitId: number;
  name: string;
  color: string;
  percentage: number;
}

interface JuiceGlassProps {
  ingredients: Ingredient[];
  isGenerating?: boolean;
  isMini?: boolean;
}

const JuiceGlass: React.FC<JuiceGlassProps> = ({ ingredients, isGenerating = false, isMini = false }) => {
  const totalPercentage = useMemo(() => ingredients.reduce((sum, ing) => sum + ing.percentage, 0), [ingredients]);

  // Reverse ingredients so they stack from bottom to top in the DOM
  const stackedIngredients = [...ingredients].reverse();

  return (
    <div 
      className={clsx(
        "relative flex flex-col items-center justify-center p-4 select-none transition-transform duration-700 w-[300px] h-[450px]",
        isMini ? "scale-50 md:scale-75" : "scale-100"
      )}
    >
      {/* Container for the entire Cup (Straw, Dome, Glass, Liquid) */}
      <div className="relative w-[220px] h-[380px] flex flex-col items-center drop-shadow-2xl">
        
        {/* Soft realistic cast shadow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-8 bg-black/20 blur-xl rounded-[100%] pointer-events-none" />

        {/* 1. STRAW (Back Layer) */}
        {/* We place the bottom of the straw behind the liquid, top sticks out */}
        <div className="absolute top-[10px] left-1/2 -translate-x-4 w-4 h-[350px] rotate-[-5deg] origin-bottom rounded-full overflow-hidden shadow-sm z-0 bg-zinc-900">
           {/* Black Straw Highlights */}
           <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-black/80" />
        </div>

        {/* 2. LIQUID CONTAINER (Clipped to cup shape) */}
        {/* Cup body outline: Top at y=130px, Bottom at y=360px */}
        <div 
          className="absolute top-[130px] w-[150px] h-[230px] z-10 overflow-hidden rounded-b-xl"
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%)',
          }}
        >
          {/* Empty cup back wall reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />

          {/* Liquid Layers */}
          <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-end bg-white/5 backdrop-blur-sm">
            <AnimatePresence mode="popLayout">
              {stackedIngredients.map((ing, index) => {
                const height = `${ing.percentage}%`;
                
                return (
                  <motion.div
                    key={`${ing.fruitId}-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: height, opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="w-full relative flex-shrink-0"
                    style={{ zIndex: 10 - index }}
                  >
                    {/* Main liquid color with fruit texture simulation */}
                    <div 
                      className="absolute inset-0"
                      style={{ 
                        backgroundColor: ing.color,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15' mix-blend-mode='multiply'/%3E%3C/svg%3E")`,
                        boxShadow: `inset 0 -15px 20px rgba(0,0,0,0.2), inset 0 10px 15px rgba(255,255,255,0.2)`
                      }}
                    />

                    {/* Edge Shadows for 3D Cylinder Effect */}
                    <div className="absolute top-0 bottom-0 left-0 w-[15%] bg-gradient-to-r from-black/30 to-transparent mix-blend-multiply" />
                    <div className="absolute top-0 bottom-0 right-0 w-[20%] bg-gradient-to-l from-black/40 to-transparent mix-blend-multiply" />
                    
                    {/* Fruit Seeds/Pulp */}
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full bg-black/30 mix-blend-overlay"
                        style={{ 
                          width: Math.random() * 4 + 2 + 'px',
                          height: Math.random() * 4 + 2 + 'px',
                          left: `${10 + Math.random() * 80}%`,
                          top: `${10 + Math.random() * 80}%`
                        }}
                      />
                    ))}

                    {/* Top liquid surface reflection */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-white/20 rounded-full blur-[1px] transform -translate-y-1" />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* 3. SVG OVERLAY (Dome Lid, Cup Rim, Plastic Glare) */}
        {/* Positioned exactly over the container */}
        <div className="absolute inset-0 z-30 pointer-events-none flex justify-center">
          <svg width="220" height="380" viewBox="0 0 220 380" fill="none" xmlns="http://www.w3.org/2000/svg">
            
            {/* DOME LID */}
            {/* Dome Arc */}
            <path d="M35 130 C 35 30, 185 30, 185 130" fill="url(#domeGradient)" fillOpacity="0.4" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
            {/* Dome Glare/Reflection */}
            <path d="M50 110 C 50 50, 140 40, 150 60" stroke="url(#glareGradient)" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.9" filter="blur(2px)"/>
            
            {/* CUP RIM (Thick plastic rim separating dome and cup) */}
            <ellipse cx="110" cy="130" rx="77" ry="6" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.9)" strokeWidth="2"/>
            <ellipse cx="110" cy="132" rx="77" ry="6" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>

            {/* CUP BODY OUTLINE & GLARE */}
            {/* Left Edge */}
            <line x1="35" y1="130" x2="57.5" y2="360" stroke="rgba(255,255,255,0.6)" strokeWidth="3"/>
            {/* Right Edge */}
            <line x1="185" y1="130" x2="162.5" y2="360" stroke="rgba(255,255,255,0.6)" strokeWidth="3"/>
            
            {/* Bottom Edge Curve */}
            <path d="M57.5 360 Q 110 370 162.5 360" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="4"/>
            <path d="M57.5 360 Q 110 370 162.5 360" fill="rgba(255,255,255,0.2)"/>

            {/* Main Plastic Glare (Left) */}
            <path d="M45 140 L 65 350 L 75 350 L 55 140 Z" fill="url(#glareGradient)" opacity="0.8" filter="blur(2px)"/>
            {/* Secondary Glare (Right) */}
            <path d="M175 140 L 155 350" stroke="rgba(255,255,255,0.5)" strokeWidth="4" strokeLinecap="round" opacity="0.6" filter="blur(1px)"/>

            {/* Premium Logo (JuiceJunction Brand) */}
            <g transform="translate(110, 240)" opacity="0.9">
              <circle cx="0" cy="0" r="28" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeDasharray="3 3"/>
              <circle cx="0" cy="0" r="23" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1"/>
              <text x="0" y="2" fontFamily="sans-serif" fontSize="9" fontWeight="900" fill="white" textAnchor="middle" style={{textShadow: '0px 1px 3px rgba(0,0,0,0.3)'}}>JUICE</text>
              <text x="0" y="11" fontFamily="sans-serif" fontSize="7" fontWeight="bold" fill="white" textAnchor="middle" style={{textShadow: '0px 1px 3px rgba(0,0,0,0.3)'}}>JUNCTION</text>
            </g>

            <defs>
              <linearGradient id="domeGradient" x1="35" y1="30" x2="185" y2="130" gradientUnits="userSpaceOnUse">
                <stop stopColor="white" stopOpacity="0.9"/>
                <stop offset="0.5" stopColor="white" stopOpacity="0.1"/>
                <stop offset="1" stopColor="white" stopOpacity="0.5"/>
              </linearGradient>
              <linearGradient id="glareGradient" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                <stop stopColor="white" stopOpacity="1"/>
                <stop offset="1" stopColor="white" stopOpacity="0"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Percentage Indicator Badge */}
      <motion.div 
        animate={{ 
          scale: totalPercentage === 100 ? [1, 1.05, 1] : 1,
        }}
        transition={{ repeat: totalPercentage === 100 ? Infinity : 0, duration: 2 }}
        className={clsx(
          "absolute right-0 md:right-4 top-1/2 -translate-y-1/2 px-4 py-2 rounded-2xl text-[10px] font-black border shadow-xl backdrop-blur-md transition-all z-50",
          totalPercentage === 100 ? "bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/40" : "bg-white/90 text-slate-700 border-slate-200"
        )}
      >
        {totalPercentage}% FULL
      </motion.div>

      {/* Pouring Animation */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: '120%', opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-4 bg-white/80 blur-[2px] z-50 rounded-full"
            style={{
              background: `linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.2))`,
              boxShadow: `0 0 15px rgba(255,255,255,0.8)`
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default JuiceGlass;

