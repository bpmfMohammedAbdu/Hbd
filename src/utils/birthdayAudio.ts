// Gentle Web Audio API music-box & warm chime synthesizer for the birthday melody.
// Never autoplays before explicit user interaction.

interface MelodyNote {
  freq: number;
  duration: number;
  harmony?: number;
}

// "Happy Birthday" in F major (warm, gentle music-box register)
const HAPPY_BIRTHDAY_MELODY: MelodyNote[] = [
  // Happy birthday to you
  { freq: 261.63, duration: 0.35, harmony: 174.61 }, // C4 + F3
  { freq: 261.63, duration: 0.25 },                   // C4
  { freq: 293.66, duration: 0.55 },                   // D4
  { freq: 261.63, duration: 0.55, harmony: 174.61 }, // C4 + F3
  { freq: 349.23, duration: 0.55, harmony: 220.0 },  // F4 + A3
  { freq: 329.63, duration: 1.0, harmony: 196.0 },   // E4 + G3

  // Happy birthday to you
  { freq: 261.63, duration: 0.35, harmony: 196.0 },  // C4 + G3
  { freq: 261.63, duration: 0.25 },                   // C4
  { freq: 293.66, duration: 0.55 },                   // D4
  { freq: 261.63, duration: 0.55, harmony: 196.0 },  // C4 + G3
  { freq: 392.0, duration: 0.55, harmony: 233.08 },  // G4 + Bb3
  { freq: 349.23, duration: 1.0, harmony: 220.0 },   // F4 + A3

  // Happy birthday dear Ansif
  { freq: 261.63, duration: 0.35, harmony: 174.61 }, // C4 + F3
  { freq: 261.63, duration: 0.25 },                   // C4
  { freq: 523.25, duration: 0.55, harmony: 261.63 }, // C5 + C4
  { freq: 440.0, duration: 0.55, harmony: 220.0 },   // A4 + A3
  { freq: 349.23, duration: 0.55, harmony: 233.08 }, // F4 + Bb3
  { freq: 329.63, duration: 0.55 },                   // E4
  { freq: 293.66, duration: 0.9, harmony: 233.08 },  // D4 + Bb3

  // Happy birthday to you
  { freq: 466.16, duration: 0.35, harmony: 233.08 }, // Bb4 + Bb3
  { freq: 466.16, duration: 0.25 },                   // Bb4
  { freq: 440.0, duration: 0.55, harmony: 261.63 },  // A4 + C4
  { freq: 349.23, duration: 0.55, harmony: 196.0 },  // F4 + G3
  { freq: 392.0, duration: 0.55, harmony: 261.63 },  // G4 + C4
  { freq: 349.23, duration: 1.3, harmony: 174.61 },  // F4 + F3
];

class BirthdayAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private isMuted = true;
  private noteIndex = 0;
  private timerId: number | null = null;

  private ensureContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playBellNote(freq: number, duration: number, volume = 0.14) {
    const ctx = this.ctx;
    const master = this.masterGain;
    if (!ctx || !master) return;

    const now = ctx.currentTime;

    // Warm music-box fundamental + subtle octave shimmer
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const noteGain = ctx.createGain();
    const overtoneGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, now);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(volume, now + 0.025);
    noteGain.gain.exponentialRampToValueAtTime(0.0008, now + duration + 0.45);

    overtoneGain.gain.setValueAtTime(0.0001, now);
    overtoneGain.gain.linearRampToValueAtTime(volume * 0.18, now + 0.015);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.65);

    osc.connect(noteGain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(noteGain);
    noteGain.connect(master);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + duration + 0.5);
    overtone.stop(now + duration + 0.5);
  }

  private scheduleNextNote = () => {
    if (!this.isPlaying || this.isMuted) return;

    const note = HAPPY_BIRTHDAY_MELODY[this.noteIndex];
    this.playBellNote(note.freq, note.duration, 0.13);
    if (note.harmony) {
      this.playBellNote(note.harmony, note.duration * 1.4, 0.075);
    }

    const isEnd = this.noteIndex === HAPPY_BIRTHDAY_MELODY.length - 1;
    this.noteIndex = (this.noteIndex + 1) % HAPPY_BIRTHDAY_MELODY.length;

    const pauseMs = isEnd ? 1100 : 40;
    this.timerId = window.setTimeout(this.scheduleNextNote, note.duration * 1000 + pauseMs);
  };

  public startMusic() {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    this.isMuted = false;
    this.isPlaying = true;
    this.masterGain.gain.cancelScheduledValues(ctx.currentTime);
    this.masterGain.gain.setTargetAtTime(0.75, ctx.currentTime, 0.12);

    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.scheduleNextNote();
  }

  public setMuted(muted: boolean) {
    const ctx = this.ensureContext();
    this.isMuted = muted;

    if (!ctx || !this.masterGain) return;

    if (muted) {
      this.masterGain.gain.cancelScheduledValues(ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
      if (this.timerId !== null) {
        window.clearTimeout(this.timerId);
        this.timerId = null;
      }
    } else {
      this.isPlaying = true;
      this.masterGain.gain.cancelScheduledValues(ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(0.75, ctx.currentTime, 0.1);
      if (this.timerId === null) {
        this.scheduleNextNote();
      }
    }
  }

  public playSparkleChime() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    // Ascending warm F major 9 arpeggio chime
    const notes = [349.23, 440.0, 523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      window.setTimeout(() => {
        if (!this.isMuted) {
          this.playBellNote(freq, 0.7, 0.085);
        }
      }, idx * 70);
    });
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public dispose() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

export const birthdayAudio = new BirthdayAudioEngine();
