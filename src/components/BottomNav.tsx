import React from 'react';
import { Home, Calendar, Settings } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'today' as TabType, label: 'Bugün', icon: Home },
    { id: 'history' as TabType, label: 'Geçmiş', icon: Calendar },
    { id: 'settings' as TabType, label: 'Ayarlar', icon: Settings },
  ];

  return (
    <nav className="w-full bg-[#FAF7F2] border-t border-[#EBE5DB] px-6 py-2 pb-6 flex items-center justify-around z-20">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 transition-colors duration-200 py-1 px-4 rounded-xl ${
              isActive ? 'text-[#5A7863]' : 'text-[#8C847A] hover:text-[#524C45]'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.7]'}`} />
            <span className={`text-[11px] font-['Plus_Jakarta_Sans'] ${isActive ? 'font-semibold' : 'font-normal'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
