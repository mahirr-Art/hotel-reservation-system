'use client';

import React, { useMemo, useEffect } from 'react';

export default function FloatingBackground() {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes love-twinkle {
        0%, 100% { opacity: 0.3; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.2); }
      }
      @keyframes love-float {
        0% { transform: translateY(0) rotate(0deg); }
        100% { transform: translateY(-120vh) rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);
  const stars = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      delay: `${Math.random() * 3}s`,
      duration: `${Math.random() * 2 + 2}s`
    }));
  }, []);

  const hearts = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      bottom: `-${Math.random() * 20 + 10}%`,
      size: `${Math.random() * 20 + 10}px`,
      opacity: Math.random() * 0.3 + 0.1,
      delay: `${Math.random() * 10}s`,
      duration: `${Math.random() * 10 + 15}s`
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0a0c10]">
      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(225,29,72,0.05)_0%,_rgba(10,12,16,1)_100%)]"></div>

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationName: 'love-twinkle',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}

      {/* Hearts */}
      {hearts.map((heart) => (
        <div
          key={`heart-${heart.id}`}
          className="absolute text-rose-500"
          style={{
            left: heart.left,
            bottom: heart.bottom,
            fontSize: heart.size,
            opacity: heart.opacity,
            animationName: 'love-float',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDelay: heart.delay,
            animationDuration: heart.duration,
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
}
