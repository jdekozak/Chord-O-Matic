
import { BASE_FREQUENCIES } from '../constants';
import { ChordPosition } from '../types';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private songGain: GainNode | null = null;
  private clickGain: GainNode | null = null;
  
  // Store volume state so it persists if set before init
  private _songVolume: number = 0.75;
  private _clickVolume: number = 0.75;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create independent gain buses
      this.songGain = this.ctx.createGain();
      this.songGain.gain.value = this._songVolume;
      this.songGain.connect(this.ctx.destination);

      this.clickGain = this.ctx.createGain();
      this.clickGain.gain.value = this._clickVolume;
      this.clickGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setSongVolume(volume: number) {
    this._songVolume = Math.max(0, Math.min(1, volume));
    if (this.songGain) {
      this.songGain.gain.value = this._songVolume;
    }
  }

  setClickVolume(volume: number) {
    this._clickVolume = Math.max(0, Math.min(1, volume));
    if (this.clickGain) {
      this.clickGain.gain.value = this._clickVolume;
    }
  }

  playChord(position: ChordPosition, duration: number = 0.5) {
    if (!this.ctx) this.init();
    const now = this.ctx!.currentTime;

    position.frets.forEach((fret, stringIndex) => {
      if (fret === 'x') return;

      const baseFreq = BASE_FREQUENCIES[stringIndex];
      const freq = baseFreq * Math.pow(2, Number(fret) / 12);
      
      // Slight arpeggiation for realism (0.02s between strings)
      this.playNote(freq, now + stringIndex * 0.02, duration); 
    });
  }

  playClick(isDownbeat: boolean = false) {
    if (!this.ctx) this.init();
    const now = this.ctx!.currentTime;
    
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isDownbeat ? 1000 : 800, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    
    osc.connect(gain);
    // Connect to Click Bus instead of destination directly
    if (this.clickGain) {
        gain.connect(this.clickGain);
    } else {
        gain.connect(this.ctx!.destination);
    }
    
    osc.start(now);
    osc.stop(now + 0.06);
  }

  private playNote(frequency: number, startTime: number, duration: number) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle'; // Triangle wave for a fuller, softer guitar-like tone
    osc.frequency.setValueAtTime(frequency, startTime);

    // Volume Envelope Settings
    const peakVolume = 0.15; // Max volume relative to the bus
    const attackTime = 0.02; // How fast it reaches peak
    const releaseTime = 0.1; // How fast it fades at the end
    
    // Ensure duration is valid and covers at least attack + release
    const effectiveDuration = Math.max(duration, attackTime + releaseTime + 0.1);

    // 1. Start at 0
    gain.gain.setValueAtTime(0, startTime);
    
    // 2. Attack: Ramp to peak volume quickly
    gain.gain.linearRampToValueAtTime(peakVolume, startTime + attackTime);
    
    // 3. Sustain: Decay slowly to 60% of peak volume over the duration of the note
    // This keeps the sound audible ("long") for the entire bar/duration
    gain.gain.linearRampToValueAtTime(peakVolume * 0.6, startTime + effectiveDuration - releaseTime);
    
    // 4. Release: Quick fade out at the very end to avoid clicking
    gain.gain.linearRampToValueAtTime(0, startTime + effectiveDuration);

    osc.connect(gain);
    
    // Connect to Song Bus instead of destination directly
    if (this.songGain) {
        gain.connect(this.songGain);
    } else {
        gain.connect(this.ctx.destination);
    }

    osc.start(startTime);
    // Stop oscillator slightly after volume hits 0
    osc.stop(startTime + effectiveDuration + 0.1);
  }
}

export const audioEngine = new AudioEngine();
