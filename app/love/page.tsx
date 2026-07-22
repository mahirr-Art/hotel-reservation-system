'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FloatingBackground from '@/components/love/FloatingBackground';
import WelcomeScreen from '@/components/love/WelcomeScreen';
import PasswordScreen from '@/components/love/PasswordScreen';
import AudioPlayer from '@/components/love/AudioPlayer';
import LoveMap from '@/components/love/LoveMap';
import CountdownTimer from '@/components/love/CountdownTimer';
import TypewriterLetter from '@/components/love/TypewriterLetter';
import Reasons100 from '@/components/love/Reasons100';
import PhotoGallery from '@/components/love/PhotoGallery';
import WishStars from '@/components/love/WishStars';
import SurpriseBox from '@/components/love/SurpriseBox';
import FinalPage from '@/components/love/FinalPage';
import Navbar from '@/components/love/Navbar';

type AppStage = 'welcome' | 'password' | 'content';

export default function LovePage() {
  const [stage, setStage] = useState<AppStage>('welcome');
  const [showAudio, setShowAudio] = useState(false);

  const handleStart = useCallback(() => {
    setStage('password');
  }, []);

  const handleUnlock = useCallback(() => {
    setStage('content');
    setShowAudio(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: '#0a0c10' }}>
      {/* Global floating background */}
      <FloatingBackground />

      <AnimatePresence mode="wait">
        {/* Stage 1: Welcome Screen */}
        {stage === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
          >
            <WelcomeScreen onStart={handleStart} />
          </motion.div>
        )}

        {/* Stage 2: Password Screen */}
        {stage === 'password' && (
          <motion.div
            key="password"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
          >
            <PasswordScreen onUnlock={handleUnlock} />
          </motion.div>
        )}

        {/* Stage 3: Main Content */}
        {stage === 'content' && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Navbar */}
            <Navbar />

            {/* All sections with smooth scroll targets */}
            <div className="space-y-8 md:space-y-16">
              {/* Love Map */}
              <section id="love-map" className="px-4 md:px-8 lg:px-16 pt-8">
                <LoveMap />
              </section>

              {/* Countdown Timer */}
              <section id="love-countdown" className="px-4 md:px-8 lg:px-16">
                <CountdownTimer />
              </section>

              {/* Love Letter */}
              <section id="love-letter" className="px-4 md:px-8 lg:px-16">
                <TypewriterLetter />
              </section>

              {/* 100 Reasons */}
              <section id="love-reasons" className="px-4 md:px-8 lg:px-16">
                <Reasons100 />
              </section>

              {/* Photo Gallery */}
              <section id="love-gallery" className="px-4 md:px-8 lg:px-16">
                <PhotoGallery />
              </section>

              {/* Wish Stars */}
              <section id="love-stars" className="px-4 md:px-8 lg:px-16">
                <WishStars />
              </section>

              {/* Surprise Box */}
              <section id="love-surprise" className="px-4 md:px-8 lg:px-16">
                <SurpriseBox />
              </section>

              {/* Final Page */}
              <section id="love-final" className="px-4 md:px-8 lg:px-16 pb-16">
                <FinalPage />
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Player - shows after unlock */}
      {showAudio && <AudioPlayer />}
    </div>
  );
}
