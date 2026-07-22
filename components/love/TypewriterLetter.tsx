"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Pause, Play, SkipForward, Heart } from "lucide-react";

const LETTER_TEXT = `Canım Benim,

Seni tanıdığım günden beri hayatımın en güzel sayfaları yazılmaya başladı. Seninle geçen her an, kalbimde bir yıldız gibi parlıyor.

Gülüşün güneşim, bakışların huzurum, varlığın en büyük şansım. Seni sevmek, bu dünyadaki en kolay ve en güzel şey.

Bazen kelimeler yetmiyor seni anlatmaya. Ama bil ki, her nefesimde sen varsın. Her düşüncemde sen varsın. Her hayalimde sen varsın.

Seninle uyumak istediğim daha milyonlarca gece, seninle gülebileceğim milyonlarca şaka, seninle paylaşabileceğim milyonlarca an var.

Bu mektubu okurken yüzünde bir gülümseme beliriyorsa, işte tam olarak bunu hissetmeni istiyordum.

Sonsuza kadar seninle...`;

export default function TypewriterLetter() {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isTyping && displayedText.length < LETTER_TEXT.length) {
      intervalId = setInterval(() => {
        setDisplayedText((prev) => {
          const nextChar = LETTER_TEXT[prev.length];
          return prev + nextChar;
        });
      }, 40);
    } else if (displayedText.length === LETTER_TEXT.length) {
      setIsFinished(true);
      setIsTyping(false);
    }

    return () => clearInterval(intervalId);
  }, [isTyping, displayedText]);

  const toggleTyping = () => {
    if (!isFinished) {
      setIsTyping(!isTyping);
    }
  };

  const skipToEnd = () => {
    setDisplayedText(LETTER_TEXT);
    setIsFinished(true);
    setIsTyping(false);
  };

  return (
    <section className="min-h-screen bg-[#0a0c10] py-20 px-4 relative overflow-hidden flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full mx-auto relative z-10">
        <div className="flex items-center justify-center gap-3 mb-10">
          <Mail className="text-rose-500 w-8 h-8" />
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Sana Mektubum 💌</h2>
        </div>

        <div className="bg-gradient-to-br from-[#1a0a0a] to-[#0d0515] border border-rose-900/30 rounded-2xl p-8 md:p-12 shadow-[0_0_40px_rgba(225,29,72,0.1)] relative">
          
          <div className="min-h-[400px] font-serif text-lg md:text-xl text-rose-100/90 leading-relaxed whitespace-pre-wrap">
            {displayedText}
            {!isFinished && (
              <span className="animate-pulse inline-block w-2 h-5 bg-rose-500/80 ml-1 align-middle" />
            )}
          </div>

          <div className="mt-8 flex justify-end gap-4 border-t border-rose-900/30 pt-6">
            {!isFinished && (
              <>
                <button
                  onClick={toggleTyping}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-rose-200 transition-colors border border-rose-900/50"
                >
                  {isTyping ? <Pause size={18} /> : <Play size={18} />}
                  <span className="text-sm">{isTyping ? "Durdur" : "Devam Et"}</span>
                </button>
                <button
                  onClick={skipToEnd}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors border border-rose-500/30"
                >
                  <SkipForward size={18} />
                  <span className="text-sm">Tümünü Göster</span>
                </button>
              </>
            )}
          </div>

          <AnimatePresence>
            {isFinished && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mt-12 text-center"
              >
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent flex-1" />
                  <Heart className="text-rose-500 w-5 h-5 fill-rose-500 animate-pulse" />
                  <div className="h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent flex-1" />
                </div>
                <p className="italic text-xl text-rose-200 mb-4 font-serif">Sonsuza kadar senin,</p>
                <p className="text-4xl text-[#fef08a] font-serif" style={{ textShadow: "0 0 20px rgba(254,240,138,0.5)" }}>M.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {isFinished && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                opacity: 0,
                y: "100vh",
                x: `${Math.random() * 100}vw`,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                opacity: [0, 1, 0],
                y: "-20vh",
                x: `${Math.random() * 100}vw`,
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            >
              <Heart className="text-rose-500/30 w-8 h-8 fill-rose-500/30" />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
