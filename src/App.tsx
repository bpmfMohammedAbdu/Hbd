import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import {
  GoldenParticlesCanvas,
  type GoldenParticlesHandle,
} from './components/GoldenParticlesCanvas';
import { OpeningSurprise } from './components/OpeningSurprise';
import { FloatingBalloons } from './components/FloatingBalloons';
import { BirthdayCake } from './components/BirthdayCake';
import { GiftBoxSurprise } from './components/GiftBoxSurprise';
import { birthdayAudio } from './utils/birthdayAudio';

const BIRTHDAY_WISHES = [
  'May every sunrise bring you quiet joy and bold inspiration.',
  'May every milestone ahead shine brighter than the last.',
  'May laughter, peace, and warmth surround you all year long.',
];

export default function App() {
  const [hasOpened, setHasOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [celebrationCount, setCelebrationCount] = useState(0);
  const particlesRef = useRef<GoldenParticlesHandle | null>(null);

  useEffect(() => {
    return () => {
      birthdayAudio.dispose();
    };
  }, []);

  const handleOpenSurprise = (originX: number, originY: number) => {
    // Fire golden explosion from button and launch grand confetti shower
    particlesRef.current?.burstAt(originX, originY, 95);
    particlesRef.current?.launchConfettiCelebration(130);

    // Start gentle music box melody on explicit user gesture
    birthdayAudio.startMusic();
    setIsMuted(false);

    window.setTimeout(() => {
      setHasOpened(true);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 260);
  };

  const handleToggleAudio = () => {
    if (!hasOpened && isMuted) {
      birthdayAudio.startMusic();
      setIsMuted(false);
      return;
    }
    const nextMuted = !isMuted;
    birthdayAudio.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  const handleCelebrateAgain = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    particlesRef.current?.burstAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 85);
    particlesRef.current?.launchConfettiCelebration(140);
    birthdayAudio.playSparkleChime();
    setCelebrationCount((prev) => prev + 1);
  };

  const handleSparkleAt = (x: number, y: number) => {
    particlesRef.current?.burstAt(x, y, 65);
    birthdayAudio.playSparkleChime();
  };

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-[#070605] text-[#FAF3E3]">
      {/* Warm ambient background lighting layers */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,175,55,0.12) 0%, rgba(184,134,11,0.03) 48%, rgba(7,6,5,0) 78%), radial-gradient(ellipse 60% 45% at 50% 100%, rgba(212,175,55,0.09) 0%, rgba(7,6,5,0) 72%)',
        }}
      />

      {/* Persistent Particle & Confetti Canvas */}
      <GoldenParticlesCanvas ref={particlesRef} confettiRainActive={hasOpened} />

      {/* Visible Mute / Unmute Audio Control */}
      <div className="fixed right-4 top-4 z-40 sm:right-6 sm:top-6">
        <button
          type="button"
          onClick={handleToggleAudio}
          aria-label={isMuted ? 'Unmute birthday music' : 'Mute birthday music'}
          aria-pressed={!isMuted}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#120E09]/85 px-4 py-2.5 text-xs font-medium tracking-wider text-[#F6E2B3] backdrop-blur-md transition-all duration-200 hover:border-[#F5D061]/70 hover:bg-[#1C160E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D061] whitespace-nowrap shrink-0"
        >
          {isMuted ? (
            <>
              <VolumeX className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
              <span>Sound Off</span>
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4 text-[#FDE68A]" aria-hidden="true" />
              <span>Music On</span>
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!hasOpened ? (
          <OpeningSurprise key="gate" onOpen={handleOpenSurprise} />
        ) : (
          <motion.main
            key="celebration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 mx-auto flex w-full max-w-5xl flex-col items-center px-5 pb-24 pt-20 sm:px-8 sm:pt-24"
          >
            {/* Floating 3D-style Gold & Champagne Balloons */}
            <FloatingBalloons onBalloonTap={handleSparkleAt} />

            {/* 1. Main Birthday Celebration Hero */}
            <section className="relative flex w-full flex-col items-center text-center">
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-xs font-medium uppercase tracking-[0.28em] text-[#D4AF37]/90 sm:text-sm"
              >
                Celebrating a Remarkable Soul
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 22, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.95, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="gold-text-gradient mt-4 max-w-3xl font-display text-4xl font-bold tracking-[0.04em] sm:text-6xl md:text-7xl"
                style={{ textWrap: 'balance' }}
              >
                HAPPY BIRTHDAY, ANSIF! 🎂
              </motion.h1>

              {/* Animated Birthday Cake with Glowing Candles */}
              <div className="mt-4 w-full sm:mt-6">
                <BirthdayCake onWishSparkle={handleSparkleAt} />
              </div>

              {/* Smoothly Appearing Birthday Wishes */}
              <div className="mt-10 flex max-w-xl flex-col items-center gap-3">
                {BIRTHDAY_WISHES.map((wish, idx) => (
                  <motion.p
                    key={wish}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.75,
                      delay: 0.65 + idx * 0.22,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="font-display text-lg italic tracking-wide text-[#E7D5AE]/90 sm:text-xl"
                  >
                    {wish}
                  </motion.p>
                ))}
              </div>
            </section>

            {/* Hairline Golden Separator */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.9 }}
              className="my-16 h-px w-40 bg-gradient-to-r from-transparent via-[#D4AF37]/45 to-transparent sm:my-20"
            />

            {/* 2. Heartfelt Birthday Message Card */}
            <motion.section
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl"
              aria-label="Birthday message for Ansif Abdela"
            >
              <div className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-gradient-to-b from-[#15110B]/95 to-[#0D0A06]/95 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.65)] sm:p-12">
                {/* Soft inner top golden glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FDE68A]/55 to-transparent"
                />

                <p className="text-center font-sans text-base leading-[1.85] text-[#F5ECD7]/95 sm:text-lg">
                  Today is all about you! May your new year of life bring you endless happiness,
                  success, unforgettable memories, and beautiful opportunities. Keep smiling, keep
                  growing, and keep being amazing. You deserve all the good things life has to
                  offer.
                </p>

                <div className="mt-8 flex flex-col items-center">
                  <span className="mb-5 h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
                  <p className="gold-text-gradient text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">
                    Happy Birthday, Ansif Abdela! 🎉❤️
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Hairline Golden Separator */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.9 }}
              className="my-16 h-px w-40 bg-gradient-to-r from-transparent via-[#D4AF37]/45 to-transparent sm:my-20"
            />

            {/* 3. Interactive Gift Box Surprise */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl"
              aria-label="Interactive birthday gift box"
            >
              <GiftBoxSurprise onRevealBurst={handleSparkleAt} />
            </motion.section>

            {/* Hairline Golden Separator */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.9 }}
              className="my-16 h-px w-40 bg-gradient-to-r from-transparent via-[#D4AF37]/45 to-transparent sm:my-20"
            />

            {/* 4. Final Celebration */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center"
            >
              <h2
                className="gold-text-gradient font-display text-3xl font-bold tracking-[0.06em] sm:text-5xl"
                style={{ textWrap: 'balance' }}
              >
                MAKE THIS YEAR LEGENDARY!
              </h2>

              <motion.button
                type="button"
                onClick={handleCelebrateAgain}
                key={celebrationCount}
                whileTap={{ scale: 0.96 }}
                className="mt-8 inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border border-[#F5D061]/60 bg-gradient-to-b from-[#2B2111] via-[#1B140A] to-[#110D06] px-8 py-4 text-sm font-semibold tracking-[0.14em] text-[#FEF3C7] shadow-[0_0_32px_rgba(212,175,55,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FDE68A]/85 hover:shadow-[0_0_46px_rgba(245,208,97,0.44)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDE68A] sm:px-10 sm:text-base whitespace-nowrap shrink-0"
              >
                <span>CELEBRATE AGAIN 🎉</span>
              </motion.button>

              <p className="mt-10 text-xs tracking-[0.2em] text-[#9E8B63]">
                Crafted with warmth for Ansif Abdela
              </p>
            </motion.section>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
