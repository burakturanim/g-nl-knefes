// Web Audio API synthesizer for peaceful, ambient breathing cues
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a peaceful ambient chime / singing bowl sound for breathing transition
 * @param frequency Base frequency in Hz (e.g., 432Hz for inhale, 360Hz for hold, 288Hz for exhale)
 * @param duration Duration in seconds
 */
export function playPhaseChime(type: 'inhale' | 'hold' | 'exhale' | 'complete' | 'prep') {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    let freq = 432; // Inhale pitch (uplifting)
    let duration = 1.2;

    if (type === 'hold') {
      freq = 360; // Soft grounding pitch
      duration = 0.8;
    } else if (type === 'exhale') {
      freq = 288; // Descending relaxing pitch
      duration = 1.5;
    } else if (type === 'complete') {
      freq = 528; // Harmonic resolution tone
      duration = 2.5;
    } else if (type === 'prep') {
      freq = 320;
      duration = 0.3;
    }

    // Main fundamental sine wave
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Soft overtone for singing bowl harmonic warmth
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 1.5, now); // Perfect fifth overtone

    // Envelope for gentle attack and smooth decay
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.15); // Gentle fade-in
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    gain2.gain.setValueAtTime(0.001, now);
    gain2.gain.linearRampToValueAtTime(0.03, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.8);

    osc.connect(gain);
    osc2.connect(gain2);

    gain.connect(ctx.destination);
    gain2.connect(ctx.destination);

    osc.start(now);
    osc2.start(now);

    osc.stop(now + duration);
    osc2.stop(now + duration);
  } catch (err) {
    console.warn('Audio play failed:', err);
  }
}
