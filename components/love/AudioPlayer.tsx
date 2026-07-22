'use client';

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, Volume1, VolumeX, Repeat, Music } from 'lucide-react';

export interface AudioPlayerRef {
  play: () => void;
  pause: () => void;
}

const AudioPlayer = forwardRef<AudioPlayerRef, {}>((props, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isLooping, setIsLooping] = useState(true);
  const [showControls, setShowControls] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useImperativeHandle(ref, () => ({
    play: () => {
      if (audioRef.current) {
        audioRef.current.play().catch((e) => console.log('Autoplay blocked', e));
        setIsPlaying(true);
      }
    },
    pause: () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    },
  }));

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = isLooping;
    }
  }, [volume, isLooping]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((e) => console.log('Playback failed', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end justify-end">
      <audio
        ref={audioRef}
        src="/audio/love-song.mp3"
        onEnded={() => {
          if (!isLooping) setIsPlaying(false);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col gap-4 w-72 mb-16 origin-bottom-right absolute bottom-0 right-0"
          >
            <div className="flex items-center justify-between">
              <div className="overflow-hidden whitespace-nowrap w-48 relative flex items-center">
                <motion.div
                  animate={{ x: [0, -60, 0] }}
                  transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                  className="inline-block text-white font-medium text-sm drop-shadow-md"
                >
                  Bizim Şarkımız 🎵
                </motion.div>
              </div>
              <button
                onClick={() => setShowControls(false)}
                className="text-white/40 hover:text-[#fb7185] transition-colors text-xs font-semibold px-2 py-1 rounded hover:bg-white/5"
              >
                Gizle
              </button>
            </div>

            <div className="flex items-center justify-between bg-[#0a0c10]/40 rounded-xl p-3 border border-white/5">
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e11d48] to-[#fb7185] flex items-center justify-center text-white hover:scale-105 transition-transform shadow-[0_0_15px_rgba(225,29,72,0.4)] flex-shrink-0"
              >
                {isPlaying ? (
                  <Pause size={20} className="fill-current" />
                ) : (
                  <Play size={20} className="fill-current ml-1" />
                )}
              </button>

              <div className="flex items-center gap-3 group flex-1 ml-4 mr-2">
                <VolumeIcon size={16} className="text-[#fef08a]/80" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#fb7185] hover:bg-white/20 transition-colors"
                />
              </div>

              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`p-2 rounded-full transition-all duration-300 flex-shrink-0 ${
                  isLooping
                    ? 'text-[#fef08a] bg-white/10 shadow-[0_0_10px_rgba(254,240,138,0.2)]'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <Repeat size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        layout
        onClick={() => setShowControls(!showControls)}
        className="w-14 h-14 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:bg-white/20 transition-colors z-10 relative group"
      >
        <motion.div
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          className="relative"
        >
          <Music
            size={24}
            className={`transition-colors duration-300 ${
              isPlaying ? 'text-[#fef08a]' : 'text-white/80 group-hover:text-white'
            }`}
          />
          {isPlaying && (
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 rounded-full border-2 border-[#fef08a]/50"
            />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
});

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;
