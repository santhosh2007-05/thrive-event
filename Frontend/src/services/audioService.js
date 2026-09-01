// CareTrack Audio Operations Engine (Web Audio API Synthesizer)
// Provides realistic operations chime tones and high-pitch medical SOS alarm siren!

class AudioService {
  constructor() {
    this.ctx = null;
    this.activeOscillators = [];
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Stop any playing emergency alarm siren sound immediately!
  stopSOSAlarm() {
    try {
      this.activeOscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {
          // Already stopped
        }
      });
      this.activeOscillators = [];
    } catch (err) {
      console.log('Error stopping SOS alarm:', err);
    }
  }

  // Play standard operational chimes
  playTone(freq, type = 'sine', duration = 0.3, vol = 0.3) {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.log('Audio tone playback error:', e);
    }
  }

  play24hReminder() {
    this.playTone(440, 'sine', 0.4, 0.2); // A4
  }

  play2hReminder() {
    this.playTone(554.37, 'sine', 0.4, 0.25); // C#5
    setTimeout(() => this.playTone(659.25, 'sine', 0.4, 0.25), 150); // E5
  }

  play30mReminder() {
    this.playTone(880, 'triangle', 0.3, 0.3); // A5
    setTimeout(() => this.playTone(880, 'triangle', 0.3, 0.3), 200);
  }

  play10mReminder() {
    this.playTone(1046.50, 'square', 0.2, 0.35); // C6
    setTimeout(() => this.playTone(1046.50, 'square', 0.2, 0.35), 120);
    setTimeout(() => this.playTone(1046.50, 'square', 0.3, 0.35), 240);
  }

  playMissedAlert() {
    this.playTone(300, 'sawtooth', 0.5, 0.4);
    setTimeout(() => this.playTone(220, 'sawtooth', 0.6, 0.4), 200);
  }

  // Extended Medical Emergency Siren Alarm with Cancellation Handle
  playSOSAlarm() {
    try {
      this.stopSOSAlarm(); // Clear previous active siren
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // 15 continuous high-pitched emergency siren cycles (~10 seconds duration)
      for (let i = 0; i < 15; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        const startTime = now + (i * 0.65);

        // Sweep from 900Hz to 1400Hz (High-Pitch Medical SOS Alarm)
        osc.frequency.setValueAtTime(900, startTime);
        osc.frequency.linearRampToValueAtTime(1400, startTime + 0.32);
        osc.frequency.linearRampToValueAtTime(900, startTime + 0.65);

        gain.gain.setValueAtTime(0.6, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.65);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        this.activeOscillators.push(osc);

        osc.start(startTime);
        osc.stop(startTime + 0.65);
      }
    } catch (e) {
      console.log('SOS Alarm playback error:', e);
    }
  }
}

export const audioService = new AudioService();
export default audioService;
