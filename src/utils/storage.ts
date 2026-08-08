import { AppStateData, UserSettings, DayRecord } from '../types';
import { getTodayDateString, calculateStreak } from './date';

const STORAGE_KEY = 'nefes_app_data_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  remindersEnabled: false,
  morningTime: '07:00',
  middayTime: '13:00',
  eveningTime: '21:00',
  soundEnabled: false, // Default silent as requested
  hapticEnabled: true,
  dailyGoal: 3
};

export function loadAppState(): AppStateData {
  const today = getTodayDateString();
  const defaultTodayRecord: DayRecord = {
    date: today,
    sabah: false,
    ogle: false,
    aksam: false
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        dayHistory: { [today]: defaultTodayRecord },
        settings: DEFAULT_SETTINGS,
        streakCount: 0,
        lastActiveDate: today
      };
    }

    const data: Partial<AppStateData> = JSON.parse(raw);
    const dayHistory = data.dayHistory || {};
    
    // Ensure today's entry exists
    if (!dayHistory[today]) {
      dayHistory[today] = defaultTodayRecord;
    }

    const settings = { ...DEFAULT_SETTINGS, ...(data.settings || {}) };
    const streakCount = calculateStreak(dayHistory);

    return {
      dayHistory,
      settings,
      streakCount,
      lastActiveDate: today
    };
  } catch (err) {
    console.warn('Failed to load storage state:', err);
    return {
      dayHistory: { [today]: defaultTodayRecord },
      settings: DEFAULT_SETTINGS,
      streakCount: 0,
      lastActiveDate: today
    };
  }
}

export function saveAppState(data: AppStateData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to save storage state:', err);
  }
}
