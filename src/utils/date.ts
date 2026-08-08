import { DayRecord } from '../types';

// Get YYYY-MM-DD string in Turkey Time (Europe/Istanbul)
export function getTodayDateString(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(date); // Output format: YYYY-MM-DD
}

// Get full Turkish formatted date e.g. "8 Ağustos Cumartesi"
export function formatTurkishDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  
  return new Intl.DateTimeFormat('tr-TR', {
    timeZone: 'Europe/Istanbul',
    day: 'numeric',
    month: 'long',
    weekday: 'long'
  }).format(date);
}

// Get short Turkish date e.g. "8 Ağustos"
export function formatShortTurkishDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  
  return new Intl.DateTimeFormat('tr-TR', {
    timeZone: 'Europe/Istanbul',
    day: 'numeric',
    month: 'long'
  }).format(date);
}

// Get formatted time e.g. "07:30"
export function formatTurkishTime(isoString?: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('tr-TR', {
    timeZone: 'Europe/Istanbul',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Check if all 3 sessions completed for a given DayRecord
export function isDayFullyCompleted(record?: DayRecord): boolean {
  if (!record) return false;
  return record.sabah && record.ogle && record.aksam;
}

// Count completed sessions in a DayRecord (0 to 3)
export function countCompletedSessions(record?: DayRecord): number {
  if (!record) return 0;
  let count = 0;
  if (record.sabah) count++;
  if (record.ogle) count++;
  if (record.aksam) count++;
  return count;
}

// Calculate streak count from day history
export function calculateStreak(history: Record<string, DayRecord>): number {
  const today = getTodayDateString();
  let currentStreak = 0;
  
  // Check today first
  const todayRecord = history[today];
  const todayCompleted = isDayFullyCompleted(todayRecord);
  
  // Start checking backwards from today or yesterday
  let checkDate = new Date();
  
  // If today is completed, start from today. Otherwise if today is not completed yet, check if yesterday was completed
  if (!todayCompleted) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dateStr = getTodayDateString(checkDate);
    const record = history[dateStr];
    if (record && isDayFullyCompleted(record)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return currentStreak;
}

// Get previous N dates array for past days history display
export function getPastDatesArray(daysCount: number = 14): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < daysCount; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(getTodayDateString(d));
  }
  
  return dates;
}
