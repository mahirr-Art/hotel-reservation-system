'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const titleText = "Sana küçük bir sürpriz hazırladım ❤️";
  const titleWords = titleText.split(" ");

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Ambient glow container */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              "radial-gradient(circle at center, rgba(225, 29, 72, 0.05) 0%, transparent 60%)",
              "radial-gradient(circle at center, rgba(225, 29, 72, 0.15) 0%, transparent 70%)",
              "radial-gradient(circle at center, rgba(225, 29, 72, 0.05) 0%, transparent 60%)",
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="mb-8 text-rose-500 drop-shadow-[0_0_15px_rgba(251,113,133,0.5)]"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart size={64} fill="currentColor" strokeWidth={1.5} color="#fb7185" />
            </motion.div>
          </motion.div>

          <motion.h1 
            className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg flex flex-wrap justify-center gap-2"
          >
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-lg md:text-xl text-rose-200/80 mb-12 font-medium"
          >
            Bu sayfa sadece senin için...
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8, type: "spring" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="group relative px-8 py-4 rounded-full text-white font-bold text-lg shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] transition-all duration-300 flex items-center gap-3 overflow-hidden cursor-pointer pointer-events-auto"
            style={{ backgroundImage: 'linear-gradient(to right, #fb7185, #e11d48)' }}
          >
            {/* Button highlight effect */}
            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
            
            <Sparkles size={24} className="group-hover:animate-spin-slow" />
            <span>Başla</span>
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
