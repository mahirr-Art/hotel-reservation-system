"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import confetti from "canvas-confetti";

const REASONS = [
  "Gülüşün kalbimi eritiyor", "Sarılman dünyanın en güzel hissi", "Her mesajın günümü aydınlatıyor", "Gözlerin beni büyülüyor", "Sesin kulaklarımda müzik gibi",
  "Dokunuşun her şeyi güzelleştiriyor", "Yanındayken zamanın nasıl geçtiğini anlamıyorum", "Kokuun beni sarhoş ediyor", "Benimle paylaştığın her an çok değerli", "Seni düşününce gülümsüyorum",
  "Kalbim sadece senin için atıyor", "Hayallerimizin ortak olması", "Birlikte gülmek her şeye değer", "Sana her baktığımda aşık oluyorum", "Ellerini tutmak huzur veriyor",
  "Yanında olmak evde olmak gibi", "Saçlarını okşamak en sevdiğim şey", "Birlikte uyumak dünyanın en güzel hissi", "Sabah ilk seni düşünüyorum", "Gece son düşüncem sen oluyorsun",
  "Beni olduğum gibi seviyorsun", "Her kavgamız bizi güçlendiriyor", "Birlikte yemek yapmak çok eğlenceli", "Film izlerken sarılman", "Beni güldüren esprilerin",
  "Her zaman yanımda olman", "Kötü günlerimde beni teselli etmen", "Başarılarımla gurur duyman", "Bana inanman ve güvenmen", "Küçük sürprizlerin",
  "Birlikte müzik dinlemek", "Seninle dans etmek", "Birlikte yürüyüş yapmak", "Gün batımı izlemek seninle", "Birlikte hayal kurmak",
  "Seninle seyahat planları yapmak", "Birlikte kahve içmek", "Bana şarkı söylemen", "Fotoğraflarımız", "Birlikte gülümsediğimiz anlar",
  "Seninle tartışıp barışmak", "İlk buluşmamızı hatırlamak", "Seni gördüğümde kalbimin hızlanması", "Mesajlaşırken saatlerin uçması", "Video aramalarımız",
  "Birbirimize olan sadakatimiz", "Seni her gün daha çok sevmem", "Geleceğimiz için birlikte çalışmamız", "Birlikte büyümemiz", "Her zorluğun üstesinden gelmemiz",
  "Sana sarılınca her şeyin düzelmesi", "Gülüşünün bulaşıcı olması", "Bana sabırlı olman", "Beni dinlemen", "Fikirlerime değer vermen",
  "Her konuda dürüst olman", "Bana güven vermen", "Sevgin koşulsuz olması", "Bana ilham vermen", "Daha iyi biri olmamı sağlaman",
  "Seninle olan her anın özel olması", "Gözlerindeki sevgiyi görmek", "Bana yazdığın mesajlar", "Birlikte çay içmek", "Kış günlerinde battaniyeye sarılmak",
  "Birlikte yağmur izlemek", "Seninle sessizliğin bile güzel olması", "Birbirimizi tamamlamamız", "Aynı şeylere gülmemiz", "Birbirimizin en iyi arkadaşı olmamız",
  "Seni her gördüğümde mutlu olmam", "Ayrıyken bile yakın hissetmem", "Seninle paylaşılan bir gülümseme", "Birlikte büyük hayaller kurmak", "Küçük anlara bile anlam katman",
  "Her sabah günaydın mesajın", "Her gece iyi geceler demen", "Seninle çıktığımız yolculuklar", "Beraber keşfettiğimiz yerler", "İlk el ele tutuşmamız",
  "İlk öpücüğümüz", "Sana baktığımda gördüğüm gelecek", "Birlikte yaşlanma hayalim", "Seninle kuracağımız yuva", "Her gün seni seçmem",
  "Sen olduğun için", "Kalbimin tek sahibi olman", "Bana verdiğin huzur", "Seninle geçen her saniye", "Gülüşünün sesini duymak",
  "Birlikte ağlamak bile güzel", "Beni en çok sen anlıyorsun", "Hayatımın anlamı olman", "Seni sevmenin kolay olması", "Her bakışında eriyorum",
  "Rüyalarıma girmen", "Seninle olan gelecek planlarımız", "Beni tamamlaman", "Her şeye rağmen birbirimizi seçmemiz", "Sen, sadece sen olduğun için seni seviyorum ❤️"
];

export default function Reasons100() {
  const [flippedCards, setFlippedCards] = useState<boolean[]>(new Array(100).fill(false));
  const [showCelebration, setShowCelebration] = useState(false);

  const flippedCount = flippedCards.filter(Boolean).length;

  useEffect(() => {
    if (flippedCount === 100 && !showCelebration) {
      setShowCelebration(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#e11d48", "#fb7185", "#fef08a", "#ffffff"]
      });
    }
  }, [flippedCount, showCelebration]);

  const toggleCard = (index: number) => {
    const newFlipped = [...flippedCards];
    newFlipped[index] = !newFlipped[index];
    setFlippedCards(newFlipped);
  };

  const revealAll = () => {
    setFlippedCards(new Array(100).fill(true));
  };

  return (
    <section className="min-h-screen bg-[#0a0c10] py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-8 h-8" style={{ color: "#e11d48", fill: "#e11d48" }} />
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Seni Sevmemin 100 Sebebi ❤️</h2>
          </div>
          
          <div className="max-w-md mx-auto bg-white/5 p-4 rounded-2xl border border-rose-900/30 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-rose-200 font-medium">{flippedCount} / 100 Sebep Açıldı</span>
              <button
                onClick={revealAll}
                className="text-xs px-3 py-1 bg-rose-500/20 hover:bg-rose-500/40 text-rose-100 rounded-full transition-colors border border-rose-500/30"
              >
                Tümünü Aç
              </button>
            </div>
            <div className="h-3 bg-black/50 rounded-full overflow-hidden">
              <motion.div 
                className="h-full rounded-full"
                style={{ backgroundImage: "linear-gradient(to right, #fb7185, #e11d48)" }}
                initial={{ width: 0 }}
                animate={{ width: `${(flippedCount / 100) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {REASONS.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (index % 10) * 0.05 }}
              className="relative h-40 group cursor-pointer"
              style={{ perspective: "1000px" }}
              onClick={() => toggleCard(index)}
            >
              <div
                className="w-full h-full relative transition-transform duration-700 hover:shadow-[0_0_15px_rgba(251,113,133,0.3)] rounded-xl"
                style={{
                  transformStyle: "preserve-3d",
                  transform: flippedCards[index] ? "rotateY(180deg)" : "rotateY(0deg)"
                }}
              >
                {/* Front side */}
                <div 
                  className="absolute inset-0 w-full h-full bg-white/5 border border-rose-900/40 rounded-xl flex flex-col items-center justify-center p-4 backdrop-blur-sm"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <Heart className="w-8 h-8 text-rose-400/50 mb-2" />
                  <span className="text-2xl font-bold text-rose-200/70">#{index + 1}</span>
                </div>

                {/* Back side */}
                <div 
                  className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center p-4 rounded-xl backdrop-blur-sm text-center shadow-lg ${index === 99 ? 'bg-gradient-to-br from-rose-900/80 to-[#e11d48] border-2 border-[#fef08a]' : 'bg-gradient-to-br from-[#1a0a0a] to-[#0d0515] border border-rose-500/50'}`}
                  style={{ 
                    backfaceVisibility: "hidden", 
                    transform: "rotateY(180deg)",
                  }}
                >
                  <p className={`text-rose-100 ${index === 99 ? 'font-bold text-lg text-[#fef08a]' : 'text-sm font-medium'}`}>
                    {reason}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-b from-[#1a0a0a] to-[#0d0515] p-8 md:p-12 rounded-3xl border border-[#fef08a]/50 shadow-[0_0_50px_rgba(254,240,138,0.2)] max-w-2xl text-center relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#fef08a] to-transparent" />
              <Heart className="w-16 h-16 mx-auto mb-6" style={{ color: "#e11d48", fill: "#e11d48" }} />
              <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">100 sebep bile yetmez seni sevmeye... ❤️</h3>
              <p className="text-xl md:text-2xl text-rose-200 font-serif italic">Sen benim her şeyimsin.</p>
              
              <button 
                onClick={() => setShowCelebration(false)}
                className="mt-8 px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-full font-medium transition-colors"
              >
                Kapat
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
