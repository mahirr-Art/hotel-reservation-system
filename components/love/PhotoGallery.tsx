'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ChevronLeft, ChevronRight, X } from 'lucide-react';

const galleryItems = [
  { id: 1, emoji: '❤️', caption: 'İlk buluşmamız', gradient: 'from-rose-400 to-red-500' },
  { id: 2, emoji: '🌹', caption: 'Bana aldığın ilk gül', gradient: 'from-pink-400 to-rose-600' },
  { id: 3, emoji: '💑', caption: 'O güzel akşam', gradient: 'from-fuchsia-400 to-purple-600' },
  { id: 4, emoji: '🌅', caption: 'Deniz kenarı gün batımı', gradient: 'from-orange-400 to-rose-500' },
  { id: 5, emoji: '☕', caption: 'Kahve molası', gradient: 'from-amber-400 to-orange-500' },
  { id: 6, emoji: '🎭', caption: 'Beraber izlediğimiz o oyun', gradient: 'from-indigo-400 to-cyan-400' },
  { id: 7, emoji: '🏖️', caption: 'İlk tatilimiz', gradient: 'from-cyan-400 to-blue-500' },
  { id: 8, emoji: '🌃', caption: 'Gece yürüyüşü', gradient: 'from-blue-600 to-indigo-800' },
  { id: 9, emoji: '🎄', caption: 'Yılbaşı gecesi', gradient: 'from-emerald-400 to-teal-500' },
  { id: 10, emoji: '🎂', caption: 'Doğum günün', gradient: 'from-yellow-400 to-amber-500' },
  { id: 11, emoji: '💐', caption: 'Sürpriz çiçekler', gradient: 'from-violet-400 to-fuchsia-500' },
  { id: 12, emoji: '🌸', caption: 'Bahar yürüyüşü', gradient: 'from-pink-300 to-rose-400' },
];

export default function PhotoGallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1));
  }, []);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, nextImage, prevImage]);

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-center gap-3 mb-12">
        <Camera className="w-8 h-8 text-rose-500" />
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Anılarımız 📸</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {galleryItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="flex flex-col gap-3 group cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-lg transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-rose-500/20 group-hover:border-rose-500/50">
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="absolute inset-0 flex items-center justify-center text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-300">
                {item.emoji}
              </div>
            </div>
            <p className="text-center text-sm md:text-base text-gray-300 font-medium group-hover:text-rose-400 transition-colors">
              {item.caption}
            </p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="absolute top-4 left-4 md:top-8 md:left-8 text-white/70 font-medium tracking-widest text-sm">
              {currentIndex + 1} / {galleryItems.length}
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 md:left-8 p-3 rounded-full bg-white/5 hover:bg-white/20 text-white backdrop-blur-md transition-all"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 md:right-8 p-3 rounded-full bg-white/5 hover:bg-white/20 text-white backdrop-blur-md transition-all"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div 
              className="w-full max-w-3xl flex flex-col items-center gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                  exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="w-full aspect-square md:aspect-video rounded-3xl overflow-hidden relative shadow-2xl border border-white/20"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${galleryItems[currentIndex].gradient}`} />
                  <div className="absolute inset-0 flex items-center justify-center text-8xl md:text-[12rem]">
                    {galleryItems[currentIndex].emoji}
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <AnimatePresence mode="wait">
                <motion.p
                  key={`caption-${currentIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-xl md:text-3xl text-white font-medium text-center px-4"
                >
                  {galleryItems[currentIndex].caption}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
