import { useState } from 'react';
import { motion } from 'motion/react';

interface BirthdayCakeProps {
  onWishSparkle?: (x: number, y: number) => void;
}

const CANDLE_POSITIONS = [
  { id: 0, left: '24%', height: 'h-11', delay: '0s' },
  { id: 1, left: '37%', height: 'h-13', delay: '0.35s' },
  { id: 2, left: '50%', height: 'h-14', delay: '0.15s' },
  { id: 3, left: '63%', height: 'h-13', delay: '0.5s' },
  { id: 4, left: '76%', height: 'h-11', delay: '0.25s' },
];

export function BirthdayCake({ onWishSparkle }: BirthdayCakeProps) {
  const [flareKey, setFlareKey] = useState(0);

  const handleCakeInteract = (e: React.MouseEvent<HTMLButtonElement>) => {
    setFlareKey((k) => k + 1);
    if (onWishSparkle) {
      const rect = e.currentTarget.getBoundingClientRect();
      onWishSparkle(rect.left + rect.width / 2, rect.top + 36);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto flex w-full max-w-[320px] flex-col items-center pt-10 sm:max-w-[360px]"
    >
      {/* Warm golden candlelight ambient aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 h-56 w-72 -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(253,224,71,0.22) 0%, rgba(212,175,55,0.1) 48%, rgba(7,6,5,0) 76%)',
        }}
      />

      <motion.button
        type="button"
        onClick={handleCakeInteract}
        aria-label="Tap the birthday cake to make a golden wish"
        key={flareKey}
        animate={flareKey > 0 ? { scale: [1, 1.03, 1] } : undefined}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="group relative flex w-full cursor-pointer flex-col items-center rounded-3xl pb-2 pt-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D061]/60"
      >
        {/* Candles Layer */}
        <div className="relative z-20 h-14 w-44 sm:w-52">
          {CANDLE_POSITIONS.map((candle) => (
            <div
              key={candle.id}
              style={{ left: candle.left }}
              className="absolute bottom-0 -translate-x-1/2 flex flex-col items-center"
            >
              {/* Soft warm halo */}
              <div
                aria-hidden="true"
                style={{ animationDelay: candle.delay }}
                className="animate-flame-halo pointer-events-none absolute -top-6 left-1/2 h-12 w-12 rounded-full bg-amber-300/30 blur-md"
              />

              {/* Glowing Flame */}
              <div
                aria-hidden="true"
                style={{ animationDelay: candle.delay }}
                className="animate-candle-flame absolute -top-6 left-1/2 h-6 w-3.5 rounded-t-full rounded-b-[45%] bg-gradient-to-t from-[#F59E0B] via-[#FDE047] to-[#FFFBEB] shadow-[0_0_14px_rgba(253,224,71,0.95)]"
              >
                <div className="absolute bottom-1 left-1/2 h-2.5 w-1.5 -translate-x-1/2 rounded-full bg-white/95" />
              </div>

              {/* Wick */}
              <div className="h-1.5 w-0.5 bg-[#4B3619]" />

              {/* Candle Body with Golden Diagonal Stripes */}
              <div
                className={`w-2.5 sm:w-3 ${candle.height} rounded-t-sm border-x border-[#FDE68A]/35 shadow-inner`}
                style={{
                  background:
                    'repeating-linear-gradient(135deg, #FDE68A 0px, #FDE68A 4px, #A16207 4px, #A16207 8px)',
                }}
              />
            </div>
          ))}
        </div>

        {/* Upper Cake Tier (Dark Velvet + Gold Drip) */}
        <div className="relative z-10 h-16 w-44 rounded-t-2xl border border-[#D4AF37]/30 bg-gradient-to-b from-[#2A2016] via-[#1A130D] to-[#120D09] shadow-[inset_0_2px_12px_rgba(253,230,138,0.16)] sm:h-18 sm:w-52">
          {/* Gold Frosting Top Cap & Drips */}
          <div className="relative h-4 w-full rounded-t-2xl bg-gradient-to-r from-[#C69320] via-[#F5D061] to-[#B8860B] shadow-sm">
            <div className="absolute -bottom-2.5 left-4 h-4 w-3 rounded-b-full bg-gradient-to-b from-[#EAB308] to-[#B8860B]" />
            <div className="absolute -bottom-4 left-12 h-5 w-3.5 rounded-b-full bg-gradient-to-b from-[#F5D061] to-[#C69320]" />
            <div className="absolute -bottom-2 left-24 h-3 w-3 rounded-b-full bg-gradient-to-b from-[#EAB308] to-[#B8860B]" />
            <div className="absolute -bottom-3.5 right-10 h-4.5 w-3 rounded-b-full bg-gradient-to-b from-[#F5D061] to-[#C69320]" />
            <div className="absolute -bottom-2 right-3 h-3 w-2.5 rounded-b-full bg-gradient-to-b from-[#EAB308] to-[#B8860B]" />
          </div>

          {/* Subtle golden pearl border at base of top tier */}
          <div className="absolute bottom-1 left-0 right-0 flex justify-around px-2">
            {Array.from({ length: 9 }).map((_, idx) => (
              <span
                key={idx}
                className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-[#FFFBEB] to-[#C69320] shadow-[0_0_4px_rgba(245,208,97,0.7)]"
              />
            ))}
          </div>
        </div>

        {/* Lower Cake Tier */}
        <div className="relative z-10 -mt-0.5 h-20 w-60 rounded-t-xl border border-[#D4AF37]/35 bg-gradient-to-b from-[#231A12] via-[#150F0A] to-[#0E0A06] shadow-[0_14px_30px_rgba(0,0,0,0.65),inset_0_2px_10px_rgba(253,230,138,0.12)] sm:h-22 sm:w-68">
          {/* Gold Frosting Rim */}
          <div className="relative h-3.5 w-full rounded-t-xl bg-gradient-to-r from-[#B8860B] via-[#F6D365] to-[#A16207]">
            <div className="absolute -bottom-3 left-6 h-4 w-3.5 rounded-b-full bg-gradient-to-b from-[#F5D061] to-[#A16207]" />
            <div className="absolute -bottom-2 left-18 h-3 w-3 rounded-b-full bg-gradient-to-b from-[#EAB308] to-[#92620A]" />
            <div className="absolute -bottom-4 left-1/2 h-5 w-3.5 -translate-x-1/2 rounded-b-full bg-gradient-to-b from-[#FDE68A] to-[#B8860B]" />
            <div className="absolute -bottom-2.5 right-14 h-3.5 w-3 rounded-b-full bg-gradient-to-b from-[#F5D061] to-[#A16207]" />
            <div className="absolute -bottom-2 right-5 h-3 w-3 rounded-b-full bg-gradient-to-b from-[#EAB308] to-[#92620A]" />
          </div>

          {/* Center gold monogram crest */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs tracking-[0.26em] text-[#F5D061]/85">
            <span className="h-px w-6 bg-gradient-to-r from-transparent to-[#D4AF37]/70" />
            <span className="font-display text-sm italic tracking-[0.18em]">Ansif</span>
            <span className="h-px w-6 bg-gradient-to-l from-transparent to-[#D4AF37]/70" />
          </div>

          {/* Bottom golden pearls */}
          <div className="absolute bottom-1 left-0 right-0 flex justify-around px-2">
            {Array.from({ length: 13 }).map((_, idx) => (
              <span
                key={idx}
                className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-[#FFFBEB] to-[#B8860B] shadow-[0_0_5px_rgba(245,208,97,0.65)]"
              />
            ))}
          </div>
        </div>

        {/* Luxury Gold Pedestal Stand */}
        <div className="relative z-0 flex flex-col items-center">
          <div className="h-2.5 w-72 rounded-full bg-gradient-to-r from-[#855E12] via-[#FDE68A] to-[#855E12] shadow-[0_6px_22px_rgba(212,175,55,0.3)] sm:w-80" />
          <div className="h-5 w-12 bg-gradient-to-r from-[#5B3E09] via-[#D4AF37] to-[#5B3E09]" />
          <div className="h-2 w-32 rounded-t-full bg-gradient-to-r from-[#6B4A0D] via-[#F5D061] to-[#6B4A0D] shadow-[0_4px_16px_rgba(212,175,55,0.2)]" />
        </div>
      </motion.button>
    </motion.div>
  );
}
