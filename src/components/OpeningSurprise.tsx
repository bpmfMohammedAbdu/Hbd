import { motion } from 'motion/react';

interface OpeningSurpriseProps {
  onOpen: (originX: number, originY: number) => void;
}

const NAME_LETTERS = 'ANSIF ABDELA'.split('');

export function OpeningSurprise({ onOpen }: OpeningSurpriseProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    onOpen(x, y);
  };

  return (
    <motion.section
      key="opening-surprise"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.06,
        filter: 'blur(8px)',
        transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
      }}
      className="relative z-20 flex min-h-dvh w-full flex-col items-center justify-center px-6 py-16 text-center"
    >
      {/* Subtle warm golden aureole */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45 blur-3xl sm:h-[560px] sm:w-[560px]"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,55,0.22) 0%, rgba(184,134,11,0.08) 45%, rgba(7,6,5,0) 75%)',
        }}
      />

      <div className="relative z-10 flex max-w-3xl flex-col items-center">
        {/* Delicate hairline ornament */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 h-px w-20 bg-gradient-to-r from-transparent via-[#D4AF37]/70 to-transparent"
        />

        {/* Lead-in subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-xl italic tracking-wide text-[#E8D5A7]/90 sm:text-2xl md:text-3xl"
        >
          A Special Day for Someone Special...
        </motion.p>

        {/* Staggered golden letter reveal for ANSIF ABDELA */}
        <h1
          aria-label="ANSIF ABDELA"
          className="mt-5 flex flex-wrap items-center justify-center font-display text-5xl font-semibold tracking-[0.08em] sm:mt-6 sm:text-7xl md:text-8xl"
          style={{ textWrap: 'balance' }}
        >
          {NAME_LETTERS.map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.65,
                delay: 0.55 + index * 0.055,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={
                char === ' '
                  ? 'inline-block w-4 sm:w-6'
                  : 'gold-text-gradient inline-block drop-shadow-[0_4px_24px_rgba(212,175,55,0.22)]'
              }
            >
              {char}
            </motion.span>
          ))}
        </h1>

        {/* Subtle golden divider below name */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 h-px w-32 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"
        />

        {/* Glowing Surprise Button */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-11"
        >
          <button
            type="button"
            onClick={handleClick}
            className="group relative inline-flex cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full border border-[#F5D061]/55 bg-gradient-to-b from-[#292011] via-[#1B140A] to-[#110D06] px-8 py-4 text-sm font-semibold tracking-[0.14em] text-[#FEF3C7] shadow-[0_0_38px_rgba(212,175,55,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FDE68A]/85 hover:shadow-[0_0_52px_rgba(245,208,97,0.48)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDE68A] sm:px-10 sm:py-4.5 sm:text-base whitespace-nowrap shrink-0"
          >
            {/* Hover sheen */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#FDE68A]/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
            <span className="relative z-10">OPEN YOUR SURPRISE 🎁</span>
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}
