'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Mail, Heart, Camera, Star, Gift, Infinity as InfinityIcon } from 'lucide-react';

const SECTIONS = [
  { id: 'love-map', name: 'Harita', icon: MapPin },
  { id: 'love-countdown', name: 'Sayaç', icon: Clock },
  { id: 'love-letter', name: 'Mektup', icon: Mail },
  { id: 'love-reasons', name: 'Sebepler', icon: Heart },
  { id: 'love-gallery', name: 'Galeri', icon: Camera },
  { id: 'love-stars', name: 'Yıldızlar', icon: Star },
  { id: 'love-surprise', name: 'Sürpriz', icon: Gift },
  { id: 'love-final', name: 'Final', icon: InfinityIcon },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<string>('');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  useEffect(() => {
    const observers = new Map();

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
        observers.set(id, element);
      }
    });

    return () => {
      observers.forEach((element) => observer.unobserve(element));
    };
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-3">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full py-4 px-2 flex flex-col items-center gap-4">
        {SECTIONS.map((section) => {
          const isActive = activeSection === section.id;
          const Icon = section.icon;

          return (
            <div 
              key={section.id}
              className="relative group flex items-center"
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              {/* Tooltip */}
              <AnimatePresence>
                {hoveredSection === section.id && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 5 }}
                    className="absolute right-8 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm border border-white/10 text-white text-sm font-medium whitespace-nowrap flex items-center gap-2 pointer-events-none"
                  >
                    <Icon className="w-4 h-4 text-rose-400" />
                    {section.name}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dot */}
              <button
                onClick={() => scrollTo(section.id)}
                className="p-2 focus:outline-none flex items-center justify-center relative"
                aria-label={`Scroll to ${section.name}`}
              >
                <motion.div
                  whileHover={{ scale: 1.25 }}
                  animate={isActive ? { scale: 1.25 } : { scale: 1 }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#e11d48]' 
                      : 'bg-transparent border border-white/30 hover:border-white/60'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
