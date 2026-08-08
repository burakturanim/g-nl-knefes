/**
 * Trigger subtle haptic vibration if supported on device
 */
export function triggerHaptic(pattern: 'soft' | 'double' | 'complete' = 'soft') {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      if (pattern === 'soft') {
        navigator.vibrate(25);
      } else if (pattern === 'double') {
        navigator.vibrate([20, 40, 20]);
      } else if (pattern === 'complete') {
        navigator.vibrate([30, 60, 30, 60, 50]);
      }
    } catch {
      // Ignore if not supported
    }
  }
}
