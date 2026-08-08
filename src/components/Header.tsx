import React from 'react';
import { Flame } from 'lucide-react';
import { formatTurkishDate, getTodayDateString } from '../utils/date';

interface HeaderProps {
  streakCount: number;
}

export const Header: React.FC<HeaderProps> = ({ streakCount }) => {
  const todayStr = getTodayDateString();
  const dateFormatted = formatTurkishDate(todayStr);

  return (
    <header className="w-full pt-6 pb-4 px-6 flex items-end justify-between border-b border-[#EBE5DB]">
      <div>
        <h1 className="text-2xl font-light font-['Outfit'] tracking-wide text-[#2A2725]">
          Nefes
        </h1>
        <p className="text-xs text-[#7A736B] font-['Plus_Jakarta_Sans'] font-medium mt-0.5">
          {dateFormatted}
        </p>
      </div>

      {streakCount > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F2EBE1] border border-[#E2D8CA] rounded-full text-xs font-medium text-[#735238]">
          <Flame className="w-3.5 h-3.5 text-[#C87D53] fill-[#C87D53]" />
          <span>{streakCount} gün</span>
        </div>
      )}
    </header>
  );
};
