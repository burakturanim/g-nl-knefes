import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { DayRecord, SessionConfig } from '../types';
import { countCompletedSessions } from '../utils/date';

interface CompletionScreenProps {
  session: SessionConfig;
  todayRecord: DayRecord;
  onContinue: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  session,
  todayRecord,
  onContinue
}) => {
  const completedCount = countCompletedSessions(todayRecord);
  const isAllDone = completedCount === 3;

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF7F2] flex flex-col items-center justify-between py-12 px-6 max-w-md mx-auto w-full text-center select-none">
      <div className="w-full" />

      {/* Center Celebration Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center max-w-xs"
      >
        <div className="w-20 h-20 rounded-full bg-[#EBF2EC] text-[#5A7863] flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle2 className="w-10 h-10 stroke-[1.5]" />
        </div>

        <h2 className="text-3xl font-light font-['Outfit'] text-[#2A2725] tracking-wide mb-2">
          Harika.
        </h2>

        <p className="text-sm text-[#6E675F] font-['Plus_Jakarta_Sans'] mb-6">
          Bugünkü <span className="font-medium text-[#2A2725]">{session.subtitle.toLowerCase()}</span> nefes seansını tamamladın.
        </p>

        {/* Completion Status Pill */}
        <div className="w-full bg-[#F4EFE6] border border-[#E5DDD0] rounded-2xl p-4 mb-4 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4A6853] font-['Plus_Jakarta_Sans'] mb-2">
            <Sparkles className="w-4 h-4 text-[#5A7863]" />
            <span>✓ {session.title} tamamlandı</span>
          </div>

          <div className="text-xs text-[#7A736B] font-['Plus_Jakarta_Sans'] flex justify-between items-center mt-2 pt-2 border-t border-[#E5DDD0]">
            <span>Bugün Toplam:</span>
            <span className="font-semibold text-[#2A2725]">{completedCount} / 3 Seans</span>
          </div>
        </div>

        {isAllDone && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-3 bg-[#E8F1EA] border border-[#C2DEC9] rounded-xl text-xs text-[#3B5B44] font-medium"
          >
            🎉 Harika! Bugünkü tüm nefes rutinini tamamladın. Zihnini dinlendirdiğin için teşekkürler.
          </motion.div>
        )}
      </motion.div>

      {/* Continue Action Button */}
      <div className="w-full max-w-xs pt-6">
        <button
          onClick={onContinue}
          className="w-full py-3.5 px-6 rounded-full bg-[#5A7863] text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#4A6652] active:scale-95 transition-all shadow-sm"
        >
          <span>Devam Et</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
