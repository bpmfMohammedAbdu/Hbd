import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface GiftBoxSurpriseProps {
  onRevealBurst: (x: number, y: number) => void;
}

export function GiftBoxSurprise({ onRevealBurst }: GiftBoxSurpriseProps) {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenGift = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    if (!isOpened) {
      setIsOpened(true);
    }
    onRevealBurst(x, y);
  };

  return (
    <div className="relative flex flex-col items-center text-center">
      {/* Subtle ambient golden glow behind the gift box */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-700"
        style={{
          opacity: isOpened ? 0.75 : 0.4,
          background:
            'radial-gradient(circle, rgba(245,208,97,0.28) 0%, rgba(212,175,55,0.08) 50%, rgba(7,6,5,0) 75%)',
        }}
      />

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7 }}
        className="mb-8 text-xs font-medium uppercase tracking-[0.26em] text-[#D4AF37]/85"
      >
        {isOpened ? 'A Golden Promise' : 'Tap the Gift to Unwrap'}
      </motion.p>

      {/* Interactive Luxury Gift Box */}
      <button
        type="button"
        onClick={handleOpenGift}
        aria-label={isOpened ? 'Replay golden gift sparkle' : 'Open your birthday gift box'}
        className="group relative flex h-48 w-52 cursor-pointer flex-col items-center justify-end pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDE68A]/70 rounded-2xl"
      >
        {/* Radiant inner light beam when opened */}
        <AnimatePresence>
          {isOpened && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0.3 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden="true"
              className="pointer-events-none absolute bottom-24 left-1/2 h-36 w-36 -translate-x-1/2 origin-bottom rounded-full blur-xl"
              style={{
                background:
                  'radial-gradient(circle at bottom, rgba(254,243,199,0.72) 0%, rgba(245,208,97,0.32) 45%, rgba(212,175,55,0) 80%)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Gift Box Lid + Bow */}
        <motion.div
          animate={
            isOpened
              ? { y: -42, x: 14, rotate: 16, opacity: 0.92 }
              : { y: [0, -3, 0], rotate: 0 }
          }
          transition={
            isOpened
              ? { type: 'spring', stiffness: 170, damping: 14 }
              : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
          }
          className="relative z-20 flex flex-col items-center"
        >
          {/* Satin Gold Bow */}
          <div className="relative -mb-1 flex items-end justify-center">
            <div className="h-7 w-9 -rotate-18 rounded-tl-full rounded-tr-full rounded-bl-full border-2 border-[#FEF3C7]/70 bg-gradient-to-br from-[#FDE68A] via-[#D4AF37] to-[#8C6211] shadow-[0_0_16px_rgba(245,208,97,0.55)]" />
            <div className="z-10 -mx-2 h-4 w-4 rounded-full border border-[#FFFBEB]/80 bg-gradient-to-b from-[#FEF3C7] to-[#B8860B] shadow-md" />
            <div className="h-7 w-9 rotate-18 rounded-tl-full rounded-tr-full rounded-br-full border-2 border-[#FEF3C7]/70 bg-gradient-to-bl from-[#FDE68A] via-[#D4AF37] to-[#8C6211] shadow-[0_0_16px_rgba(245,208,97,0.55)]" />
          </div>

          {/* Box Lid */}
          <div className="relative h-8 w-44 rounded-md border border-[#F5D061]/50 bg-gradient-to-b from-[#2A2218] to-[#17120C] shadow-[0_10px_25px_rgba(0,0,0,0.65),0_0_24px_rgba(212,175,55,0.22)]">
            {/* Lid Horizontal Gold Ribbon */}
            <div className="absolute left-1/2 top-0 h-full w-7 -translate-x-1/2 bg-gradient-to-r from-[#B8860B] via-[#FDE68A] to-[#B8860B] shadow-[0_0_14px_rgba(245,208,97,0.45)]" />
          </div>
        </motion.div>

        {/* Gift Box Base */}
        <div className="relative z-10 -mt-1 h-28 w-40 rounded-b-lg border border-[#D4AF37]/35 bg-gradient-to-b from-[#1C160F] via-[#120E09] to-[#0A0805] shadow-[0_22px_45px_rgba(0,0,0,0.8),inset_0_1px_12px_rgba(253,230,138,0.1)] transition-shadow duration-300 group-hover:shadow-[0_22px_50px_rgba(212,175,55,0.22)]">
          {/* Vertical Satin Gold Ribbon */}
          <div className="absolute left-1/2 top-0 h-full w-7 -translate-x-1/2 bg-gradient-to-r from-[#9E7119] via-[#F5D061] to-[#9E7119] shadow-[0_0_18px_rgba(245,208,97,0.35)]" />
          {/* Horizontal Accent Trim */}
          <div className="absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 bg-gradient-to-r from-[#8C6211]/70 via-[#FDE68A]/85 to-[#8C6211]/70" />
        </div>
      </button>

      {/* Revealed Message */}
      <div className="mt-8 min-h-[72px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isOpened ? (
            <motion.div
              key="gift-message"
              initial={{ opacity: 0, y: 18, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl"
            >
              <p className="gold-text-gradient font-display text-2xl font-semibold italic tracking-wide sm:text-4xl">
                "Your best days are still ahead of you! ✨"
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="gift-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="text-sm text-[#D6C59E]"
            >
              A hidden keepsake awaits inside
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
