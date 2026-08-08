import { SessionConfig, SessionType } from '../types';

export const SESSIONS_DATA: Record<SessionType, SessionConfig> = {
  sabah: {
    id: 'sabah',
    title: 'SABAH NEFESİ',
    subtitle: 'Güne başlarken',
    instruction: 'Burnundan yavaşça nefes al.',
    durationMinutes: 3,
    icon: '☀️',
    pattern: {
      inhale: 4,
      holdIn: 2,
      exhale: 6,
      holdOut: 0
    }
  },
  ogle: {
    id: 'ogle',
    title: 'ÖĞLE NEFESİ',
    subtitle: 'Günün ortasında',
    instruction: 'Omuzlarını serbest bırak ve zihnini dinlendir.',
    durationMinutes: 3,
    icon: '🌤️',
    pattern: {
      inhale: 4,
      holdIn: 2,
      exhale: 6,
      holdOut: 0
    }
  },
  aksam: {
    id: 'aksam',
    title: 'AKŞAM NEFESİ',
    subtitle: 'Günü sakinleştir',
    instruction: 'Günün yorgunluğunu geride bırakmak için derin nefes ver.',
    durationMinutes: 5,
    icon: '🌙',
    pattern: {
      inhale: 4,
      holdIn: 2,
      exhale: 6,
      holdOut: 0
    }
  }
};
