import React from 'react';
import { Check, Play, RotateCcw, Sparkles } from 'lucide-react';
import { DayRecord, SessionType } from '../types';
import { SESSIONS_DATA } from '../data/sessions';
import { countCompletedSessions, formatShortTurkishDate, getTodayDateString } from '../utils/date';

interface TodayViewProps {
  todayRecord: DayRecord;
  streakCount: number;
  onStartSession: (sessionType: SessionType) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  todayRecord,
  streakCount,
  onStartSession
}) => {
  const todayStr = getTodayDateString();
  const shortDate = formatShortTurkishDate(todayStr);
  const completedCount = countCompletedSessions(todayRecord);

  const sessionKeys: SessionType[] = ['sabah', 'ogle', 'aksam'];

  return (
    <div className="flex-1 flex flex-col px-6 py-5 overflow-y-auto max-w-md mx-auto w-full">
      {/* Top Banner */}
      <div className="mb-6 text-center sm:text-left">
        <div className="text-xs font-semibold tracking-wider text-[#8A725D] uppercase font-['Outfit'] mb-1">
          {shortDate}
        </div>
        <h2 className="text-2xl font-normal text-[#2A2725] font-['Outfit'] tracking-tight">
          Bugünün Nefes Rutini
        </h2>
        <p className="text-xs text-[#7A736B] font-['Plus_Jakarta_Sans'] mt-1">
          Günde 3 kısa seans. Kendine birkaç dakika ayır.
        </p>
      </div>

      {/* Daily Progress Bar */}
      <div className="bg-[#F4EFE6] border border-[#E5DDD0] rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between text-xs text-[#524C45] font-['Plus_Jakarta_Sans'] font-medium mb-2">
          <span>Günlük İlerleme</span>
          <span className="font-semibold text-[#5A7863]">{completedCount} / 3 seans tamamlandı</span>
        </div>
        <div className="w-full h-2 bg-[#E5DDD0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#5A7863] transition-all duration-500 ease-out rounded-full"
            style={{ width: `${(completedCount / 3) * 100}%` }}
          />
        </div>

        {/* Completed status callout */}
        {completedCount === 3 && (
          <div className="mt-3 pt-2.5 border-t border-[#E5DDD0] flex items-center gap-2 text-xs text-[#4A6853] font-medium">
            <Sparkles className="w-4 h-4 text-[#5A7863]" />
            <span>Tebrikler! Bugünkü tüm nefes seanslarını tamamladın.</span>
          </div>
        )}
      </div>

      {/* Streak Banner if active */}
      {streakCount > 0 && (
        <div className="mb-6 p-3.5 bg-[#FAF1E8] border border-[#EAC8B0] rounded-2xl flex items-center gap-3 text-xs text-[#824E2A]">
          <span className="text-xl">🔥</span>
          <div>
            <div className="font-semibold text-[#6E3C1B]">{streakCount} Günlük Seri</div>
            <div className="text-[#885A39] text-[11px] mt-0.5">
              {streakCount} gündür nefes rutinini aksatmadın. Harika bir alışkanlık!
            </div>
          </div>
        </div>
      )}

      {/* 3 Main Sessions List */}
      <div className="space-y-3.5 mb-6">
        {sessionKeys.map((key) => {
          const session = SESSIONS_DATA[key];
          const isCompleted = todayRecord[key];

          return (
            <div
              key={key}
              className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                isCompleted
                  ? 'bg-[#F2F7F3] border-[#C2DEC9]'
                  : 'bg-[#FBF9F5] border-[#E8E2D8] shadow-xs hover:border-[#D1C7BD]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="text-2xl mt-0.5">{session.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#2A2725] font-['Outfit'] tracking-wide uppercase">
                      {session.id === 'sabah' ? 'Sabah' : session.id === 'ogle' ? 'Öğle' : 'Akşam'}
                    </h3>
                    <span className="text-[11px] text-[#8C847A] font-normal">
                      ({session.durationMinutes} dk)
                    </span>
                  </div>
                  <p className="text-xs text-[#7A736B] font-['Plus_Jakarta_Sans'] mt-0.5">
                    {session.subtitle}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#4A6853]">
                        <Check className="w-3.5 h-3.5 text-[#5A7863]" /> Tamamlandı
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#A0988E]">Henüz başlamadı</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isCompleted ? (
                  <button
                    onClick={() => onStartSession(key)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-[#E0EFE4] text-[#3B5B44] hover:bg-[#D2E7D7] transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Tekrar
                  </button>
                ) : (
                  <button
                    onClick={() => onStartSession(key)}
                    className="flex items-center gap-1 px-4 py-2 rounded-full text-xs font-medium bg-[#5A7863] text-white hover:bg-[#4A6652] active:scale-95 transition-all shadow-xs"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Başla
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Gentle Mindfulness Quote */}
      <div className="mt-auto pt-4 text-center border-t border-[#EBE5DB]">
        <p className="text-xs italic text-[#999084] font-['Plus_Jakarta_Sans'] font-light">
          “Derin bir nefes al, ana geri dön.”
        </p>
      </div>
    </div>
  );
};
