// Sonidos sintetizados con la Web Audio API (sin assets externos / sin copyright).

let ctx: AudioContext | null = null;

const getCtx = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (AC) ctx = new AC();
  }
  return ctx;
};

interface ToneOpts {
  freq: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
}

const tone = ({ freq, duration, type = 'square', gain = 0.08, delay = 0 }: ToneOpts) => {
  const ac = getCtx();
  if (!ac) return;
  const start = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(gain, start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(start);
  osc.stop(start + duration);
};

export const sfx = {
  start() {
    tone({ freq: 523.25, duration: 0.12 });
    tone({ freq: 659.25, duration: 0.12, delay: 0.1 });
    tone({ freq: 783.99, duration: 0.18, delay: 0.2 });
  },
  tick() {
    tone({ freq: 880, duration: 0.06, gain: 0.05 });
  },
  correct() {
    tone({ freq: 659.25, duration: 0.1 });
    tone({ freq: 783.99, duration: 0.1, delay: 0.1 });
    tone({ freq: 1046.5, duration: 0.25, delay: 0.2 });
  },
  wrong() {
    tone({ freq: 196, duration: 0.25, type: 'sawtooth', gain: 0.07 });
    tone({ freq: 146.83, duration: 0.35, type: 'sawtooth', gain: 0.07, delay: 0.15 });
  },
  reveal() {
    tone({ freq: 392, duration: 0.08 });
    tone({ freq: 587.33, duration: 0.08, delay: 0.07 });
    tone({ freq: 880, duration: 0.3, delay: 0.14 });
  },
  resume() {
    const ac = getCtx();
    if (ac && ac.state === 'suspended') void ac.resume();
  },
};
