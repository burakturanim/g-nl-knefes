import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PhaseType } from '../types';

interface BreathingVisualProps {
  phase: PhaseType;
  secondsRemaining: number;
  totalPhaseDuration: number;
  phaseProgress: number; // 0.0 to 1.0 within current phase
}

export const BreathingVisual: React.FC<BreathingVisualProps> = ({
  phase,
  secondsRemaining,
  totalPhaseDuration,
  phaseProgress
}) => {
  // Determine fill height percentage based on phase progress
  // Inhale: 0% -> 100%
  // Hold: 100%
  // Exhale: 100% -> 0%
  let fillPercentage = 0;
  if (phase === 'inhale') {
    fillPercentage = Math.min(100, Math.max(0, phaseProgress * 100));
  } else if (phase === 'holdIn') {
    fillPercentage = 100;
  } else if (phase === 'exhale') {
    fillPercentage = Math.min(100, Math.max(0, (1 - phaseProgress) * 100));
  } else {
    fillPercentage = 0;
  }

  // Calculate indicator dot position on the equilateral triangle path
  // Triangle vertices:
  // Top: (180, 50)
  // Bottom-Right: (310, 275)
  // Bottom-Left: (50, 275)
  //
  // Inhale: Left side (50,275) -> Top (180,50)
  // Hold: Top (180,50) with small pulse
  // Exhale: Right side Top (180,50) -> Bottom-Right (310,275)
  let dotX = 50;
  let dotY = 275;

  if (phase === 'inhale') {
    dotX = 50 + (180 - 50) * phaseProgress;
    dotY = 275 + (50 - 275) * phaseProgress;
  } else if (phase === 'holdIn') {
    dotX = 180;
    dotY = 50;
  } else if (phase === 'exhale') {
    dotX = 180 + (310 - 180) * phaseProgress;
    dotY = 50 + (275 - 50) * phaseProgress;
  } else {
    dotX = 310 + (50 - 310) * phaseProgress;
    dotY = 275;
  }

  // Phase Title & Subtitle text
  let phaseText = 'NEFES AL';
  let phaseSub = 'Burnundan yavaşça nefes al';
  let arrowDirection: 'up' | 'down' | 'none' = 'up';

  if (phase === 'inhale') {
    phaseText = 'NEFES AL';
    phaseSub = 'Burnundan yavaşça nefes al';
    arrowDirection = 'up';
  } else if (phase === 'holdIn') {
    phaseText = 'TUT';
    phaseSub = 'Sakin kal ve nefesini tut';
    arrowDirection = 'none';
  } else if (phase === 'exhale') {
    phaseText = 'NEFES VER';
    phaseSub = 'Yavaşça nefesini dışarı bırak';
    arrowDirection = 'down';
  } else if (phase === 'holdOut') {
    phaseText = 'DINLEN';
    phaseSub = 'Bedenini gevşet';
    arrowDirection = 'none';
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto px-4 py-2">
      {/* Phase Label & Instruction */}
      <div className="text-center h-16 flex flex-col justify-center mb-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <span className="text-xl sm:text-2xl font-semibold tracking-widest text-[#2A2725] font-['Outfit'] uppercase">
              {phaseText}
            </span>
            <span className="text-xs sm:text-sm text-[#6E675F] mt-1 font-['Plus_Jakarta_Sans']">
              {phaseSub}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Interactive Illustration Container */}
      <div className="relative w-[320px] h-[300px] flex items-center justify-center">
        {/* Animated Arrows on sides during inhale/exhale */}
        {arrowDirection === 'up' && (
          <>
            <motion.div
              animate={{ y: [8, -8, 8], opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute left-2 text-[#5A7863] text-lg font-bold"
            >
              ↑
            </motion.div>
            <motion.div
              animate={{ y: [8, -8, 8], opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute right-2 text-[#5A7863] text-lg font-bold"
            >
              ↑
            </motion.div>
          </>
        )}

        {arrowDirection === 'down' && (
          <>
            <motion.div
              animate={{ y: [-8, 8, -8], opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute left-2 text-[#5A7863] text-lg font-bold"
            >
              ↓
            </motion.div>
            <motion.div
              animate={{ y: [-8, 8, -8], opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute right-2 text-[#5A7863] text-lg font-bold"
            >
              ↓
            </motion.div>
          </>
        )}

        {/* SVG Drawing Canvas */}
        <svg
          viewBox="0 0 360 320"
          className="w-full h-full overflow-visible drop-shadow-sm"
        >
          <defs>
            {/* Clip path defining the nose / airway shape */}
            <clipPath id="noseClip">
              {/* Detailed anatomical airway contour based on standard nasal illustration */}
              <path d="M 180,85 C 172,110 152,185 138,208 C 130,220 120,225 110,222 C 102,219 102,208 112,202 C 132,192 152,150 180,118 C 208,150 228,192 248,202 C 258,208 258,219 250,222 C 240,225 230,220 222,208 C 208,185 188,110 180,85 Z" />
            </clipPath>

            {/* Gradient for air/breath fluid fill */}
            <linearGradient id="breathGradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#C87D53" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#E29568" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#F2B38B" stopOpacity="0.75" />
            </linearGradient>

            {/* Soft shadow filter for geometry */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Geometric Equilateral Triangle Path */}
          <polygon
            points="180,50 310,275 50,275"
            fill="none"
            stroke="#E5DDD3"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Subtle vertex guides */}
          <circle cx="180" cy="50" r="3" fill="#D1C7BD" />
          <circle cx="310" cy="275" r="3" fill="#D1C7BD" />
          <circle cx="50" cy="275" r="3" fill="#D1C7BD" />

          {/* 2. Nose Outline Background */}
          <path
            d="M 180,85 C 172,110 152,185 138,208 C 130,220 120,225 110,222 C 102,219 102,208 112,202 C 132,192 152,150 180,118 C 208,150 228,192 248,202 C 258,208 258,219 250,222 C 240,225 230,220 222,208 C 208,185 188,110 180,85 Z"
            fill="#F2ECE4"
            stroke="#633923"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* 3. Liquid / Breath Fill inside Nose Contour using clipPath */}
          <g clipPath="url(#noseClip)">
            {/* Animated filling rectangle moving up/down */}
            <rect
              x="80"
              y={230 - (fillPercentage / 100) * 150}
              width="200"
              height="160"
              fill="url(#breathGradient)"
              className="transition-all duration-300 ease-out"
            />

            {/* Surface wave effect for breath fluid */}
            {fillPercentage > 5 && fillPercentage < 98 && (
              <path
                d={`M 80,${230 - (fillPercentage / 100) * 150} Q 130,${
                  226 - (fillPercentage / 100) * 150
                } 180,${230 - (fillPercentage / 100) * 150} T 280,${
                  230 - (fillPercentage / 100) * 150
                }`}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                opacity="0.6"
              />
            )}
          </g>

          {/* 4. Indicator Dot moving on Triangle Guide Path */}
          <g transform={`translate(${dotX}, ${dotY})`}>
            {/* Outer pulse circle */}
            <circle
              r="10"
              fill="#5A7863"
              opacity="0.2"
              className="animate-ping"
            />
            {/* Inner solid green dot */}
            <circle
              r="6"
              fill="#5A7863"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          </g>
        </svg>
      </div>

      {/* Countdown Display */}
      <div className="flex flex-col items-center justify-center mt-2">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={secondsRemaining}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-5xl font-light font-['Outfit'] text-[#2A2725] tracking-tight"
          >
            {secondsRemaining}s
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
