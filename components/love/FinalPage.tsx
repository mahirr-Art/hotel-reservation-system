'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function FinalPage() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (isInView && !hasFiredRef.current) {
      hasFiredRef.current = true;
      
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 8,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ['#e11d48', '#fb7185', '#fef08a']
        });
        confetti({
          particleCount: 8,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ['#e11d48', '#fb7185', '#fef08a']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isInView]);

  return (
    <section 
      id="love-final" 
      ref={containerRef}
      className="py-32 px-4 min-h-screen flex flex-col items-center justify-center relative overflow-hidden z-10"
    >
      <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-16">
        
        {/* Giant Animated Heart */}
        <div className="relative w-[200px] h-[200px] flex items-center justify-center">
          {/* Glowing Aura */}
          <div className="absolute inset-0 bg-crimson blur-3xl rounded-full mix-blend-screen opacity-50 shadow-[0_0_100px_rgba(225,29,72,0.8)]" />
          
          <motion.svg
            viewBox="0 0 24 24"
            className="w-full h-full relative z-10"
            animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <defs>
              <linearGradient id="finalHeartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
            </defs>
            <path
              fill="url(#finalHeartGrad)"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </motion.svg>
        </div>

        {/* Text Content */}
        <div className="space-y-8 z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-200 bg-clip-text text-transparent leading-tight max-w-3xl mx-auto"
          >
            Seni bugün dünden, yarın bugünden daha çok seveceğim ❤️
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-4xl md:text-5xl font-semibold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          >
            İyi ki varsın.
          </motion.h2>
        </div>

        {/* Infinite Rotating Hearts */}
        <div className="relative w-40 h-40 mt-12 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-dashed border-rose-500/30 rounded-full" />
          <motion.div 
            className="w-full h-full relative"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          >
            {/* Heart 1 */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-[40px] h-[40px] text-rose-500">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
            {/* Heart 2 */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[40px] h-[40px] text-rose-500 rotate-180">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-20 flex flex-col items-center gap-6"
        >
          <p className="text-xl text-rose-200/80 italic">
            Bu sayfa seninle başladı, seninle bitmeyecek... 💕
          </p>
          <p className="text-lg text-white/50">
            Sonsuz sevgiyle, M. ❤️
          </p>
        </motion.div>
      </div>
    </section>
  );
}
