'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const wishMessages = [
  "Her gece seninle uyumak istiyorum",
  "Gülüşünü bir daha görmek için her şeyi yaparım",
  "Seninle kahve içmek dünyanın en güzel şeyi",
  "Seni her gördüğümde ilk günkü gibi heyecanlanıyorum",
  "Ellerini bir daha bırakmak istemiyorum",
  "Seninle yaşlanmak en büyük hayalim",
  "Gözlerinin içine bakarak kaybolmak istiyorum",
  "Seni sevmek nefes almak kadar doğal",
  "Kalbim sadece senin adını söylüyor",
  "Seninle her yer cennet",
  "Bir ömür yetmez seni sevmeye",
  "Dünyada en çok istediğim şey senin mutluluğun",
  "Her günümüz ilk günümüz gibi olsun",
  "Seni düşününce içim kıpır kıpır oluyor",
  "Seninle paylaşılan her an mucize",
  "Sen benim en güzel şansımsın",
  "Kalbimin yarısı sende",
  "Seni sevmek bu dünyadaki en güzel macera",
  "Uyumadan önce son düşüncem hep sen",
  "Sabah gözlerimi açınca ilk aklıma sen geliyorsun",
  "Seninle geçen her gün bir hediye",
  "Sana sarılmak için yaratılmışım",
  "Sen olmadan hiçbir şeyin anlamı yok",
  "Gülüşün güneşten daha parlak",
  "Seninle aynı gökyüzüne bakmak bile güzel",
  "Kalbim seni seçti, sonsuza kadar",
  "Her nefesimde sen varsın",
  "Seninle dans etmek istiyorum ay ışığında",
  "Sen benim kayıp parçamdın",
  "Dünyalar bir olsa seni yine seçerim",
  "Gözlerin yıldızlardan güzel",
  "Sen benim evimsin",
  "Seninle her mevsim bahar",
  "Kalbimin kapısını sadece sen açabilirsin",
  "Sen benim sonsuza kadarımsın"
];

interface StarData {
  id: number;
  top: number;
  left: number;
  size: number;
  animationDelay: number;
  message: string;
}

export default function WishStars() {
  const [activeStarIndex, setActiveStarIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate stars only once on mount
  const stars: StarData[] = useMemo(() => {
    return wishMessages.map((msg, index) => {
      // Avoid edges to keep tooltips visible
      const top = 10 + Math.random() * 80;
      const left = 5 + Math.random() * 90;
      // Size between 0.375rem (w-1.5) and 0.75rem (w-3)
      const size = 6 + Math.random() * 6;
      const animationDelay = Math.random() * 5;

      return {
        id: index,
        top,
        left,
        size,
        animationDelay,
        message: msg,
      };
    });
  }, []);

  // Auto-dismiss tooltip after 4 seconds
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (activeStarIndex !== null) {
      timeoutId = setTimeout(() => {
        setActiveStarIndex(null);
      }, 4000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [activeStarIndex]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeStarIndex !== null) {
        setActiveStarIndex(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeStarIndex]);

  return (
    <section className="py-16">
      <div className="flex items-center justify-center gap-3 mb-8">
        <Star className="w-8 h-8 text-gold-400 fill-yellow-200" />
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Dilek Yıldızları ⭐</h2>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full min-h-[500px] md:min-h-[600px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#0a0c10] to-[#0d1b3e] shadow-2xl border border-white/5 cursor-crosshair mx-auto max-w-6xl"
      >
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); box-shadow: 0 0 2px rgba(255, 255, 255, 0.4); }
            50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 10px rgba(254, 240, 138, 0.8); }
          }
          @keyframes shootingStar {
            0% { transform: translateX(0) translateY(0) rotate(-45deg); opacity: 1; }
            100% { transform: translateX(-1000px) translateY(1000px) rotate(-45deg); opacity: 0; }
          }
          .shooting-star {
            position: absolute;
            top: -50px;
            right: -50px;
            width: 150px;
            height: 2px;
            background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1));
            animation: shootingStar 8s linear infinite;
            animation-delay: 3s;
          }
          .shooting-star::before {
            content: '';
            position: absolute;
            right: 0;
            top: -4px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: white;
            box-shadow: 0 0 15px 3px rgba(255,255,255,0.8);
          }
        `}} />

        {/* Shooting Star Background */}
        <div className="shooting-star"></div>

        {/* Stars */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute group z-10"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
            }}
          >
            {/* The Star Element */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setActiveStarIndex(star.id);
              }}
              className="rounded-full bg-white transition-transform cursor-pointer hover:scale-150 hover:bg-yellow-100"
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                animation: `twinkle 3s ease-in-out infinite`,
                animationDelay: `${star.animationDelay}s`,
                boxShadow: activeStarIndex === star.id ? '0 0 15px 5px rgba(254, 240, 138, 0.6)' : 'none'
              }}
            />

            {/* Message Bubble */}
            <AnimatePresence>
              {activeStarIndex === star.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: -10 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl z-50 pointer-events-none"
                >
                  <p className="text-white text-sm md:text-base font-medium text-center text-shadow-sm">
                    {star.message}
                  </p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white/20" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-rose-200/80 italic animate-pulse">
          ✨ Her yıldıza dokun, sana bir dilek fısıldasın... ✨
        </p>
      </div>
    </section>
  );
}
