import React, { useState, useEffect } from 'react';
import { AppStateData, SessionConfig, SessionType, TabType } from './types';
import { loadAppState, saveAppState } from './utils/storage';
import { getTodayDateString, calculateStreak } from './utils/date';
import { SESSIONS_DATA } from './data/sessions';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TodayView } from './components/TodayView';
import { ExerciseScreen } from './components/ExerciseScreen';
import { CompletionScreen } from './components/CompletionScreen';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';

export default function App() {
  const [appData, setAppData] = useState<AppStateData>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [activeSession, setActiveSession] = useState<SessionConfig | null>(null);
  const [isCompletedScreen, setIsCompletedScreen] = useState<boolean>(false);

  const todayStr = getTodayDateString();

  // Ensure today's date record exists and handle midnight reset
  useEffect(() => {
    const checkDateReset = () => {
      const currentToday = getTodayDateString();
      setAppData((prev) => {
        if (!prev.dayHistory[currentToday]) {
          const updatedHistory = {
            ...prev.dayHistory,
            [currentToday]: {
              date: currentToday,
              sabah: false,
              ogle: false,
              aksam: false
            }
          };
          const updatedStreak = calculateStreak(updatedHistory);
          const newData: AppStateData = {
            ...prev,
            dayHistory: updatedHistory,
            streakCount: updatedStreak,
            lastActiveDate: currentToday
          };
          saveAppState(newData);
          return newData;
        }
        return prev;
      });
    };

    checkDateReset();
    const interval = setInterval(checkDateReset, 60 * 1000); // Check every minute
    window.addEventListener('focus', checkDateReset);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkDateReset);
    };
  }, []);

  // Handler to start a breathing exercise session
  const handleStartSession = (type: SessionType) => {
    setActiveSession(SESSIONS_DATA[type]);
    setIsCompletedScreen(false);
  };

  // Handler when exercise session is successfully finished
  const handleCompleteSession = () => {
    if (!activeSession) return;

    const currentToday = getTodayDateString();
    const currentTodayRecord = appData.dayHistory[currentToday] || {
      date: currentToday,
      sabah: false,
      ogle: false,
      aksam: false
    };

    const updatedTodayRecord = {
      ...currentTodayRecord,
      [activeSession.id]: true,
      completedAt: {
        ...(currentTodayRecord.completedAt || {}),
        [activeSession.id]: new Date().toISOString()
      }
    };

    const updatedHistory = {
      ...appData.dayHistory,
      [currentToday]: updatedTodayRecord
    };

    const updatedStreak = calculateStreak(updatedHistory);

    const newAppData: AppStateData = {
      ...appData,
      dayHistory: updatedHistory,
      streakCount: updatedStreak
    };

    setAppData(newAppData);
    saveAppState(newAppData);
    setIsCompletedScreen(true);
  };

  // Update Settings
  const handleUpdateSettings = (newSettings: Partial<AppStateData['settings']>) => {
    const newAppData: AppStateData = {
      ...appData,
      settings: {
        ...appData.settings,
        ...newSettings
      }
    };
    setAppData(newAppData);
    saveAppState(newAppData);
  };

  const todayRecord = appData.dayHistory[todayStr] || {
    date: todayStr,
    sabah: false,
    ogle: false,
    aksam: false
  };

  // Active Exercise Modal Render
  if (activeSession && !isCompletedScreen) {
    return (
      <ExerciseScreen
        session={activeSession}
        soundEnabled={appData.settings.soundEnabled}
        hapticEnabled={appData.settings.hapticEnabled}
        onToggleSound={() =>
          handleUpdateSettings({ soundEnabled: !appData.settings.soundEnabled })
        }
        onToggleHaptic={() =>
          handleUpdateSettings({ hapticEnabled: !appData.settings.hapticEnabled })
        }
        onComplete={handleCompleteSession}
        onClose={() => setActiveSession(null)}
      />
    );
  }

  // Active Completion Screen Render
  if (activeSession && isCompletedScreen) {
    return (
      <CompletionScreen
        session={activeSession}
        todayRecord={todayRecord}
        onContinue={() => {
          setActiveSession(null);
          setIsCompletedScreen(false);
          setActiveTab('today');
        }}
      />
    );
  }

  // Main App Shell
  return (
    <div className="min-h-screen bg-[#F0ECE1] flex items-center justify-center font-['Plus_Jakarta_Sans']">
      {/* Mobile Shell Container */}
      <div className="w-full max-w-md h-[100dvh] sm:h-[844px] bg-[#FAF7F2] sm:rounded-3xl shadow-xl flex flex-col relative overflow-hidden border border-[#E5DDD0]">
        {/* Header */}
        <Header streakCount={appData.streakCount} />

        {/* Main Tab Views */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {activeTab === 'today' && (
            <TodayView
              todayRecord={todayRecord}
              streakCount={appData.streakCount}
              onStartSession={handleStartSession}
            />
          )}

          {activeTab === 'history' && (
            <HistoryView
              dayHistory={appData.dayHistory}
              streakCount={appData.streakCount}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={appData.settings}
              onUpdateSettings={handleUpdateSettings}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
