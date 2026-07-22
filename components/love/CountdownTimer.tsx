'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function CountdownTimer() {
  const targetDate = new Date('2026-08-25T00:00:00+03:00').getTime();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isComplete: true
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isComplete: false
      };
    };

    // Set initial time
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) return null;

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  const timeUnits = [
    { label: 'Gün', value: timeLeft.days },
    { label: 'Saat', value: timeLeft.hours },
    { label: 'Dakika', value: timeLeft.minutes },
    { label: 'Saniye', value: timeLeft.seconds }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto backdrop-blur-md bg-[#0a0c10] bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-[#e11d48] to-rose-500"></div>
      
      <div className="flex items-center gap-3 mb-8 justify-center md:justify-start">
        <div className="p-2 bg-[#e11d48]/20 rounded-xl">
          <Clock className="text-[#fb7185] w-6 h-6" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          Kavuşma Sayacı <span className="text-2xl inline-block">⏳</span>
        </h2>
      </div>

      {timeLeft.isComplete ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10"
        >
          <h3 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#fb7185] to-[#e11d48] mb-4">
            Kavuştuk! 🎉❤️
          </h3>
          <p className="text-xl text-white/70">Artık mesafeler bitti.</p>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            {timeUnits.map((unit, index) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="backdrop-blur bg-white/5 border border-white/10 rounded-2xl p-6 text-center flex flex-col items-center justify-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#e11d48]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={unit.value}
                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.2, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-rose-100 to-[#fb7185] tracking-tight"
                  >
                    {formatNumber(unit.value)}
                  </motion.span>
                </AnimatePresence>
                
                <span className="text-white/50 text-sm md:text-base uppercase tracking-widest mt-2 font-medium">
                  {unit.label}
                </span>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-lg md:text-xl font-medium text-white/80 flex items-center justify-center gap-2">
              Sana sarılmama kalan süre 
              <span className="text-[#e11d48] animate-pulse">❤️</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
