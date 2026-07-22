'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Heart } from 'lucide-react';

interface PasswordScreenProps {
  onUnlock: () => void;
}

export default function PasswordScreen({ onUnlock }: PasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [shakeKey, setShakeKey] = useState(0);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (status === 'success') return;

    const validPasswords = ['2508', '25.08', '25082023', '25.08.2023'];

    if (validPasswords.includes(password)) {
      setStatus('success');
      setTimeout(() => {
        onUnlock();
      }, 1500);
    } else {
      setStatus('error');
      setShakeKey((prev) => prev + 1);
      setTimeout(() => {
        setPassword('');
        setStatus('idle');
      }, 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-[#0a0c10]/80">
      <motion.div
        key={shakeKey}
        animate={status === 'error' ? { x: [-20, 20, -20, 20, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-col items-center text-center space-y-6 relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-5 rounded-full ${
              status === 'success'
                ? 'bg-green-500/20 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                : 'bg-[#e11d48]/20 text-[#fb7185]'
            }`}
          >
            {status === 'success' ? (
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1.2 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <Unlock size={32} />
              </motion.div>
            ) : (
              <Lock size={32} />
            )}
          </motion.div>

          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] tracking-tight">
              Şifreyi Gir 🔒
            </h2>
            <p className="text-white/70 font-medium">
              Tanışma tarihimizi hatırlıyor musun?
            </p>
          </div>

          <div className="w-full space-y-4">
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tarih gir..."
                className={`w-full bg-[#0a0c10]/60 border ${
                  status === 'error'
                    ? 'border-red-500/50'
                    : status === 'success'
                    ? 'border-green-500/50'
                    : 'border-white/10 focus:border-[#fb7185]/50'
                } rounded-xl px-5 py-4 text-white text-center text-lg tracking-widest placeholder-white/20 outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(251,113,133,0.15)]`}
                disabled={status === 'success'}
              />
            </div>

            <div className="h-6 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {status === 'error' && (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="text-red-400 text-sm font-medium"
                  >
                    Hmm, bu değildi... Tekrar dene ❤️
                  </motion.p>
                )}
                {status === 'success' && (
                  <motion.p
                    key="success"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="text-green-400 text-sm font-medium"
                  >
                    Hoş geldin aşkım ❤️
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => handleSubmit()}
              disabled={status === 'success' || !password}
              className="w-full bg-gradient-to-r from-[#e11d48] to-[#fb7185] hover:from-[#be123c] hover:to-[#e11d48] text-white font-semibold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_0_20px_rgba(225,29,72,0.3)] active:scale-[0.98]"
            >
              <span className="tracking-wide">Giriş Yap</span>
              <Heart className="w-5 h-5 group-hover:scale-125 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
