'use client';

import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';

const LoveMapInner = dynamic(() => import('./LoveMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] md:h-[450px] bg-white/5 rounded-2xl animate-pulse flex items-center justify-center">
      <p className="text-white/50">Harita yükleniyor...</p>
    </div>
  ),
});

export default function LoveMap() {
  return (
    <div className="w-full max-w-4xl mx-auto backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-rose-500/20 rounded-xl">
          <MapPin className="text-rose-400 w-6 h-6" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          Aşk Haritası <span className="text-2xl inline-block">🌍</span>
        </h2>
      </div>

      <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg mb-6">
        <LoveMapInner />
      </div>

      <div className="text-center mt-6">
        <h3 className="text-xl md:text-2xl font-medium text-white/90 flex items-center justify-center gap-2">
          <span className="text-rose-500 animate-pulse">❤️</span> 
          Aramızdaki mesafe sadece haritada.
          <span className="text-rose-500 animate-pulse">❤️</span>
        </h3>
      </div>
    </div>
  );
}
