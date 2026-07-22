'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, ArrowUp } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SurpriseBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [particles, setParticles] = useState<{ id: number; color: string; x: number; y: number }[]>([]);

  useEffect(() => {
    // Shimmer particles around the box
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      color: ['#e11d48', '#fb7185', '#fef08a', '#ffffff'][Math.floor(Math.random() * 4)],
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 200,
    }));
    setParticles(newParticles);
  }, []);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    
    // Confetti
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#fb7185', '#fef08a', '#ffffff']
    });
  };

  return (
    <section id="love-surprise" className="py-24 px-4 min-h-screen flex flex-col items-center justify-center relative overflow-hidden z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Gift className="w-8 h-8 text-rose-500" />
          <h2 className="text-3xl md:text-5xl font-bold text-white">Sürpriz Kutusu 🎁</h2>
          <Gift className="w-8 h-8 text-rose-500" />
        </div>
      </motion.div>

      <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center mt-20">
        
        {/* Shimmer Particles */}
        <AnimatePresence>
          {!isOpen && particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: p.color }}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{ 
                x: p.x, 
                y: p.y, 
                opacity: [0, 0.8, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </AnimatePresence>

        {/* Gift Box Container */}
        <div 
          className="relative cursor-pointer group"
          onClick={handleOpen}
        >
          {/* Animated bounce when closed */}
          <motion.div
            animate={!isOpen ? { y: [0, -10, 0] } : { y: 0 }}
            transition={!isOpen ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : {}}
            className="relative"
          >
            {/* Box Body */}
            <div className="w-[200px] h-[160px] bg-gradient-to-br from-rose-600 to-rose-800 rounded-b-md relative shadow-2xl">
              {/* Vertical Ribbon */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-8 bg-gradient-to-b from-yellow-300 to-yellow-500 shadow-md" />
              {/* Horizontal Ribbon */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-8 bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-md" />
            </div>

            {/* Lid */}
            <motion.div 
              className="absolute -top-4 -left-2 w-[216px] h-12 bg-gradient-to-br from-rose-500 to-rose-700 rounded-sm z-20 shadow-xl"
              animate={isOpen ? { y: -80, rotate: -25 } : { y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 12 }}
            >
              {/* Lid Ribbon */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-8 bg-gradient-to-b from-yellow-200 to-yellow-400" />
              
              {/* Bow */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-6 w-16 h-8 flex justify-between">
                <div className="w-7 h-8 border-4 border-yellow-400 rounded-full skew-x-12" />
                <div className="w-7 h-8 border-4 border-yellow-400 rounded-full -skew-x-12" />
              </div>
            </motion.div>
          </motion.div>

          {/* Surprise Card (Rises when open) */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: -140, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-64 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_0_40px_rgba(225,29,72,0.6)] z-30 flex flex-col items-center text-center gap-4"
              >
                <div className="text-xl font-bold text-white">
                  Sen benim en güzel sürprizimsin ❤️
                </div>
                <p className="text-rose-100/90 text-sm">
                  Seni seviyorum, bugün, yarın, sonsuza kadar.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Burst Particles on Open */}
          <AnimatePresence>
            {isOpen && Array.from({ length: 25 }).map((_, i) => (
              <motion.div
                key={`burst-${i}`}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                style={{ backgroundColor: ['#e11d48', '#fb7185', '#fef08a', '#ffffff'][Math.floor(Math.random() * 4)] }}
                initial={{ x: "-50%", y: "-50%", scale: 1, opacity: 1 }}
                animate={{ 
                  x: `calc(-50% + ${(Math.random() - 0.5) * 300}px)`, 
                  y: `calc(-50% + ${(Math.random() - 0.5) * 300}px)`,
                  scale: 0,
                  opacity: 0,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Text Below */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-rose-300 pointer-events-none"
            >
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <ArrowUp className="w-5 h-5" />
              </motion.div>
              <span className="text-sm tracking-widest font-semibold">Hediyeni aç!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
