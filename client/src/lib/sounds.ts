// Star Wars-inspired UI sounds synthesized via Web Audio API.
// No audio files needed — everything is generated in-browser.

let _ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!_ctx) {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    _ctx = new Ctx();
  }
  if (_ctx.state === "suspended") _ctx.resume();
  return _ctx;
}

// Lightsaber ignite — rising sawtooth hum
export function playMenuOpen() {
  const a = ac(); if (!a) return;
  const t = a.currentTime;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.connect(gain); gain.connect(a.destination);
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(70, t);
  osc.frequency.exponentialRampToValueAtTime(420, t + 0.2);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.09, t + 0.03);
  gain.gain.setValueAtTime(0.09, t + 0.16);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
  osc.start(t); osc.stop(t + 0.3);
}

// Lightsaber retract — falling hum
export function playMenuClose() {
  const a = ac(); if (!a) return;
  const t = a.currentTime;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.connect(gain); gain.connect(a.destination);
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(420, t);
  osc.frequency.exponentialRampToValueAtTime(70, t + 0.2);
  gain.gain.setValueAtTime(0.09, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
  osc.start(t); osc.stop(t + 0.25);
}

// Soft nav click — metallic tap
export function playNavClick() {
  const a = ac(); if (!a) return;
  const t = a.currentTime;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.connect(gain); gain.connect(a.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(680, t);
  osc.frequency.exponentialRampToValueAtTime(300, t + 0.07);
  gain.gain.setValueAtTime(0.07, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
  osc.start(t); osc.stop(t + 0.09);
}

// Settings toggle — rising (on) or falling (off) blip
export function playToggle(on: boolean) {
  const a = ac(); if (!a) return;
  const t = a.currentTime;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.connect(gain); gain.connect(a.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(on ? 480 : 360, t);
  osc.frequency.exponentialRampToValueAtTime(on ? 820 : 200, t + 0.055);
  gain.gain.setValueAtTime(0.08, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
  osc.start(t); osc.stop(t + 0.08);
}

// R2-D2 three-note chirp — used for card/profile open
export function playR2Chirp() {
  const a = ac(); if (!a) return;
  const t = a.currentTime;
  ([
    [0,    900,  1500],
    [0.09, 1200,  620],
    [0.17,  820, 1700],
  ] as [number, number, number][]).forEach(([delay, f0, f1]) => {
    const osc = a.createOscillator();
    const gain = a.createGain();
    osc.connect(gain); gain.connect(a.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(f0, t + delay);
    osc.frequency.exponentialRampToValueAtTime(f1, t + delay + 0.07);
    gain.gain.setValueAtTime(0.065, t + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.075);
    osc.start(t + delay); osc.stop(t + delay + 0.08);
  });
}
