export type SessionType = 'sabah' | 'ogle' | 'aksam';

export type PhaseType = 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

export interface BreathPattern {
  inhale: number;   // seconds
  holdIn: number;   // seconds
  exhale: number;   // seconds
  holdOut: number;  // seconds
}

export interface SessionConfig {
  id: SessionType;
  title: string;
  subtitle: string;
  instruction: string;
  durationMinutes: number;
  icon: string;
  pattern: BreathPattern;
}

export interface DayRecord {
  date: string; // YYYY-MM-DD in Europe/Istanbul timezone
  sabah: boolean;
  ogle: boolean;
  aksam: boolean;
  completedAt?: {
    sabah?: string;
    ogle?: string;
    aksam?: string;
  };
}

export interface UserSettings {
  remindersEnabled: boolean;
  morningTime: string;
  middayTime: string;
  eveningTime: string;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  dailyGoal: number; // e.g. 3
}

export interface AppStateData {
  dayHistory: Record<string, DayRecord>;
  settings: UserSettings;
  streakCount: number;
  lastActiveDate: string;
}

export type TabType = 'today' | 'history' | 'settings';
