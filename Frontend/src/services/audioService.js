// CareTrack Healthcare Audio Notification Engine using Web Audio API
// Synthesizes clean operational tones without external audio file dependencies.

class AudioNotificationService {
  constructor() {
    this.audioCtx = null;
    this.enabled = true;
    this.volume = 0.6; // 0.0 to 1.0
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  setEnabled(state) {
    this.enabled = !!state;
  }

  playTone(freq, type = 'sine', duration = 0.2, delay = 0) {
    if (!this.enabled || this.volume <= 0) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      gain.gain.setValueAtTime(0.01, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(this.volume * 0.25, ctx.currentTime + delay + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // Sound 1: 24h Before (Visual only or subtle gentle tone)
  play24hReminder() {
    this.playTone(523.25, 'sine', 0.15, 0); // C5
  }

  // Sound 2: 2h Before (Short notification tone)
  play2hReminder() {
    this.playTone(587.33, 'sine', 0.15, 0); // D5
    this.playTone(659.25, 'sine', 0.2, 0.12); // E5
  }

  // Sound 3: 30m Before (Short two-tone alert)
  play30mReminder() {
    this.playTone(659.25, 'sine', 0.12, 0); // E5
    this.playTone(783.99, 'sine', 0.25, 0.12); // G5
  }

  // Sound 4: 10m Before (Noticeable alert tone)
  play10mReminder() {
    this.playTone(880, 'triangle', 0.15, 0); // A5
    this.playTone(880, 'triangle', 0.15, 0.15); // A5
    this.playTone(1046.50, 'triangle', 0.3, 0.30); // C6
  }

  // Sound 5: Appointment Missed Alert (Distinct operations warning tone)
  playMissedAlert() {
    this.playTone(440, 'sawtooth', 0.15, 0); // A4
    this.playTone(349.23, 'sawtooth', 0.25, 0.15); // F4
  }

  // Test sound function for settings panel
  testSound() {
    this.play10mReminder();
  }
}

export const audioService = new AudioNotificationService();
export default audioService;
