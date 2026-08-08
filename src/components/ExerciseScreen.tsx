import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, Pause, Play, Smartphone } from 'lucide-react';
import { PhaseType, SessionConfig } from '../types';
import { BreathingVisual } from './BreathingVisual';
import { playPhaseChime } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface ExerciseScreenProps {
  session: SessionConfig;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  onToggleSound: () => void;
  onToggleHaptic: () => void;
  onComplete: () => void;
  onClose: () => void;
}

export const ExerciseScreen: React.FC<ExerciseScreenProps> = ({
  session,
  soundEnabled,
  hapticEnabled,
  onToggleSound,
  onToggleHaptic,
  onComplete,
  onClose
}) => {
  // Phase 1: Preparation (3, 2, 1)
  const [prepSeconds, setPrepSeconds] = useState<number>(3);
  const [isPreparing, setIsPreparing] = useState<boolean>(true);

  // Phase 2: Active Breathing Cycle State
  const [currentPhase, setCurrentPhase] = useState<PhaseType>('inhale');
  const [phaseSecondsRemaining, setPhaseSecondsRemaining] = useState<number>(session.pattern.inhale);
  const [phaseProgress, setPhaseProgress] = useState<number>(0); // 0.0 to 1.0

  // Total Exercise Duration Tracker
  const totalSeconds = session.durationMinutes * 60;
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Audio/Haptic ref to avoid re-triggering repeatedly during frame render
  const lastPhaseRef = useRef<PhaseType>('inhale');

  // Preparation Countdown Effect
  useEffect(() => {
    if (!isPreparing) return;

    if (prepSeconds > 0) {
      const timer = setTimeout(() => {
        if (soundEnabled) playPhaseChime('prep');
        setPrepSeconds((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsPreparing(false);
      // Start exercise
      if (soundEnabled) playPhaseChime('inhale');
      if (hapticEnabled) triggerHaptic('soft');
    }
  }, [isPreparing, prepSeconds, soundEnabled, hapticEnabled]);

  // Main Breathing Cycle Engine Effect
  useEffect(() => {
    if (isPreparing || isPaused) return;

    // Tick interval every 100ms for ultra smooth progress bar and countdown
    const TICK_MS = 100;
    const interval = setInterval(() => {
      setElapsedSeconds((prevElapsed) => {
        const nextElapsed = prevElapsed + TICK_MS / 1000;

        // Check if full session complete
        if (nextElapsed >= totalSeconds) {
          clearInterval(interval);
          if (soundEnabled) playPhaseChime('complete');
          if (hapticEnabled) triggerHaptic('complete');
          onComplete();
          return totalSeconds;
        }

        return nextElapsed;
      });

      // Advance Phase Countdown and Progress
      setPhaseSecondsRemaining((prevSeconds) => {
        const nextSeconds = prevSeconds - TICK_MS / 1000;

        if (nextSeconds <= 0.05) {
          // Time to switch phase!
          let nextPhase: PhaseType = 'holdIn';
          let duration = session.pattern.holdIn;

          if (currentPhase === 'inhale') {
            if (session.pattern.holdIn > 0) {
              nextPhase = 'holdIn';
              duration = session.pattern.holdIn;
            } else {
              nextPhase = 'exhale';
              duration = session.pattern.exhale;
            }
          } else if (currentPhase === 'holdIn') {
            nextPhase = 'exhale';
            duration = session.pattern.exhale;
          } else if (currentPhase === 'exhale') {
            if (session.pattern.holdOut > 0) {
              nextPhase = 'holdOut';
              duration = session.pattern.holdOut;
            } else {
              nextPhase = 'inhale';
              duration = session.pattern.inhale;
            }
          } else if (currentPhase === 'holdOut') {
            nextPhase = 'inhale';
            duration = session.pattern.inhale;
          }

          // Trigger audio & haptics for phase shift
          if (lastPhaseRef.current !== nextPhase) {
            lastPhaseRef.current = nextPhase;
            if (soundEnabled) {
              playPhaseChime(nextPhase === 'inhale' ? 'inhale' : nextPhase === 'exhale' ? 'exhale' : 'hold');
            }
            if (hapticEnabled) {
              triggerHaptic(nextPhase === 'inhale' ? 'soft' : 'double');
            }
          }

          setCurrentPhase(nextPhase);
          setPhaseProgress(0);
          return duration;
        } else {
          // Calculate current phase total duration
          let duration = session.pattern.inhale;
          if (currentPhase === 'holdIn') duration = session.pattern.holdIn;
          if (currentPhase === 'exhale') duration = session.pattern.exhale;
          if (currentPhase === 'holdOut') duration = session.pattern.holdOut;

          const progress = 1 - nextSeconds / duration;
          setPhaseProgress(Math.min(1, Math.max(0, progress)));
          return nextSeconds;
        }
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [isPreparing, isPaused, currentPhase, totalSeconds, session, soundEnabled, hapticEnabled, onComplete]);

  // Format MM:SS display
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getPhaseTotalDuration = (p: PhaseType) => {
    if (p === 'inhale') return session.pattern.inhale;
    if (p === 'holdIn') return session.pattern.holdIn;
    if (p === 'exhale') return session.pattern.exhale;
    return session.pattern.holdOut || 1;
  };

  // Preparation Screen Overlay
  if (isPreparing) {
    return (
      <div className="fixed inset-0 z-50 bg-[#FAF7F2] flex flex-col items-center justify-between py-12 px-6 max-w-md mx-auto w-full">
        <button
          onClick={onClose}
          className="self-end p-2.5 text-[#8C847A] hover:text-[#2A2725] rounded-full hover:bg-[#F2EBE1] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center my-auto">
          <div className="text-3xl mb-3">{session.icon}</div>
          <h2 className="text-xl font-light font-['Outfit'] text-[#2A2725] tracking-widest uppercase">
            Hazır mısın?
          </h2>
          <p className="text-xs text-[#7A736B] font-['Plus_Jakarta_Sans'] mt-2 max-w-xs">
            {session.instruction}
          </p>

          <div className="mt-10 text-7xl font-extralight font-['Outfit'] text-[#5A7863] animate-pulse">
            {prepSeconds}
          </div>
        </div>

        <div className="text-xs text-[#A0988E] font-['Plus_Jakarta_Sans'] font-light">
          Derin ve rahat bir duruşa geç
        </div>
      </div>
    );
  }

  // Active Exercise Screen
  return (
    <div className="fixed inset-0 z-50 bg-[#FAF7F2] flex flex-col justify-between py-6 px-6 max-w-md mx-auto w-full select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between w-full">
        <button
          onClick={onClose}
          className="p-2 text-[#8C847A] hover:text-[#2A2725] rounded-full hover:bg-[#F2EBE1] transition-colors"
          title="Çıkış"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <span className="text-xs font-semibold font-['Outfit'] text-[#8A725D] uppercase tracking-wider">
            {session.title}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-full transition-colors ${
              soundEnabled ? 'text-[#5A7863] bg-[#EBF2EC]' : 'text-[#A0988E] hover:bg-[#F2EBE1]'
            }`}
            title={soundEnabled ? 'Ses Açık' : 'Ses Kapalı'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Haptic Toggle */}
          <button
            onClick={onToggleHaptic}
            className={`p-2 rounded-full transition-colors ${
              hapticEnabled ? 'text-[#5A7863] bg-[#EBF2EC]' : 'text-[#A0988E] hover:bg-[#F2EBE1]'
            }`}
            title={hapticEnabled ? 'Titreşim Açık' : 'Titreşim Kapalı'}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Breathing Visual */}
      <div className="my-auto w-full">
        <BreathingVisual
          phase={currentPhase}
          secondsRemaining={Math.ceil(phaseSecondsRemaining)}
          totalPhaseDuration={getPhaseTotalDuration(currentPhase)}
          phaseProgress={phaseProgress}
        />
      </div>

      {/* Bottom Progress & Controls */}
      <div className="w-full flex flex-col items-center gap-4">
        {/* Total Time Progress Bar */}
        <div className="w-full">
          <div className="flex items-center justify-between text-xs text-[#7A736B] font-['Plus_Jakarta_Sans'] mb-1.5 px-1">
            <span>Süre</span>
            <span>
              {formatTime(elapsedSeconds)} / {formatTime(totalSeconds)}
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#E5DDD0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#5A7863] transition-all duration-300 rounded-full"
              style={{ width: `${Math.min(100, (elapsedSeconds / totalSeconds) * 100)}%` }}
            />
          </div>
        </div>

        {/* Play/Pause Button */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="w-14 h-14 rounded-full bg-[#5A7863] text-white flex items-center justify-center shadow-md hover:bg-[#4A6652] active:scale-95 transition-all"
            title={isPaused ? 'Devam Et' : 'Duraklat'}
          >
            {isPaused ? (
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            ) : (
              <Pause className="w-6 h-6 fill-current" />
            )}
          </button>
        </div>

        {isPaused && (
          <span className="text-xs text-[#8A725D] font-['Plus_Jakarta_Sans'] font-medium animate-pulse">
            Egzersiz Duraklatıldı
          </span>
        )}
      </div>
    </div>
  );
};
