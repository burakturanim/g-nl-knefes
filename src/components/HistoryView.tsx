import React from 'react';
import { Check, Flame, Trophy, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { DayRecord } from '../types';
import {
  countCompletedSessions,
  formatTurkishDate,
  getPastDatesArray,
  getTodayDateString,
  isDayFullyCompleted
} from '../utils/date';

interface HistoryViewProps {
  dayHistory: Record<string, DayRecord>;
  streakCount: number;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ dayHistory, streakCount }) => {
  const pastDates = getPastDatesArray(14); // Last 14 days
  const todayStr = getTodayDateString();

  // Calculate totals
  let totalSessions = 0;
  let totalFullyCompletedDays = 0;

  (Object.values(dayHistory) as DayRecord[]).forEach((record) => {
    totalSessions += countCompletedSessions(record);
    if (isDayFullyCompleted(record)) {
      totalFullyCompletedDays++;
    }
  });

  // Calculate estimated total minutes (Avg 3.6 mins per session)
  const totalMinutes = Math.round(totalSessions * 3.6);

  return (
    <div className="flex-1 flex flex-col px-6 py-5 overflow-y-auto max-w-md mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-normal text-[#2A2725] font-['Outfit'] tracking-tight">
          Nefes Geçmişi
        </h2>
        <p className="text-xs text-[#7A736B] font-['Plus_Jakarta_Sans'] mt-1">
          Geçmiş günlerde yaptığın nefes seansları ve istatistiklerin.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <div className="bg-[#F4EFE6] border border-[#E5DDD0] rounded-2xl p-3 flex flex-col items-center text-center">
          <Flame className="w-4 h-4 text-[#C87D53] mb-1" />
          <span className="text-lg font-light font-['Outfit'] text-[#2A2725]">
            {streakCount}
          </span>
          <span className="text-[10px] text-[#7A736B] font-['Plus_Jakarta_Sans'] mt-0.5">
            Gün Seri
          </span>
        </div>

        <div className="bg-[#F4EFE6] border border-[#E5DDD0] rounded-2xl p-3 flex flex-col items-center text-center">
          <Trophy className="w-4 h-4 text-[#5A7863] mb-1" />
          <span className="text-lg font-light font-['Outfit'] text-[#2A2725]">
            {totalSessions}
          </span>
          <span className="text-[10px] text-[#7A736B] font-['Plus_Jakarta_Sans'] mt-0.5">
            Toplam Seans
          </span>
        </div>

        <div className="bg-[#F4EFE6] border border-[#E5DDD0] rounded-2xl p-3 flex flex-col items-center text-center">
          <Clock className="w-4 h-4 text-[#8A725D] mb-1" />
          <span className="text-lg font-light font-['Outfit'] text-[#2A2725]">
            {totalMinutes}
          </span>
          <span className="text-[10px] text-[#7A736B] font-['Plus_Jakarta_Sans'] mt-0.5">
            Dakika
          </span>
        </div>
      </div>

      {/* Daily Logs List */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-[#524C45] font-['Plus_Jakarta_Sans'] mb-1">
          <CalendarIcon className="w-3.5 h-3.5 text-[#5A7863]" />
          <span>Son Günler</span>
        </div>

        {pastDates.map((dateStr) => {
          const record = dayHistory[dateStr] || {
            date: dateStr,
            sabah: false,
            ogle: false,
            aksam: false
          };

          const isToday = dateStr === todayStr;
          const completedCount = countCompletedSessions(record);
          const isFullyDone = isDayFullyCompleted(record);

          return (
            <div
              key={dateStr}
              className={`p-3.5 rounded-2xl border transition-all ${
                isFullyDone
                  ? 'bg-[#F2F7F3] border-[#C2DEC9]'
                  : isToday
                  ? 'bg-[#FBF9F5] border-[#D9D1C5]'
                  : 'bg-[#FAF7F2] border-[#E8E2D8]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#2A2725] font-['Plus_Jakarta_Sans']">
                    {formatTurkishDate(dateStr)}
                  </span>
                  {isToday && (
                    <span className="text-[10px] bg-[#E8E2D8] text-[#524C45] px-2 py-0.5 rounded-full font-medium">
                      Bugün
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#7A736B] font-medium font-['Plus_Jakarta_Sans']">
                  {completedCount} / 3
                </span>
              </div>

              {/* Sessions breakdown pills */}
              <div className="grid grid-cols-3 gap-2 text-[11px] font-['Plus_Jakarta_Sans']">
                {/* Sabah */}
                <div
                  className={`flex items-center justify-center gap-1 py-1 px-2 rounded-lg border ${
                    record.sabah
                      ? 'bg-[#E0EFE4] text-[#3B5B44] border-[#B6D8BD]'
                      : 'bg-[#F2EBE1] text-[#90887E] border-[#E5DDD0]'
                  }`}
                >
                  <span>☀️ Sabah</span>
                  {record.sabah && <Check className="w-3 h-3 text-[#5A7863]" />}
                </div>

                {/* Öğle */}
                <div
                  className={`flex items-center justify-center gap-1 py-1 px-2 rounded-lg border ${
                    record.ogle
                      ? 'bg-[#E0EFE4] text-[#3B5B44] border-[#B6D8BD]'
                      : 'bg-[#F2EBE1] text-[#90887E] border-[#E5DDD0]'
                  }`}
                >
                  <span>🌤️ Öğle</span>
                  {record.ogle && <Check className="w-3 h-3 text-[#5A7863]" />}
                </div>

                {/* Akşam */}
                <div
                  className={`flex items-center justify-center gap-1 py-1 px-2 rounded-lg border ${
                    record.aksam
                      ? 'bg-[#E0EFE4] text-[#3B5B44] border-[#B6D8BD]'
                      : 'bg-[#F2EBE1] text-[#90887E] border-[#E5DDD0]'
                  }`}
                >
                  <span>🌙 Akşam</span>
                  {record.aksam && <Check className="w-3 h-3 text-[#5A7863]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
