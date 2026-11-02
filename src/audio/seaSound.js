// Sea music made live with the Web Audio API: rolling waves (filtered noise),
// a soft low drone, and slow pentatonic chimes with an echo. No audio files needed.
// Browsers only allow sound after a user gesture, so it always starts off.

const CHIME_NOTES = [440, 523.25, 587.33, 659.25, 783.99, 880]; // A minor pentatonic
const MASTER_VOLUME = 0.55;

let ctx = null;
let master = null;
let echo = null;
let playing = false;
let chimeTimer = 0;
const listeners = new Set();

const notify = () => listeners.forEach((listener) => listener());

function brownNoise(seconds) {
  const length = ctx.sampleRate * seconds;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    data[i] = last * 3.5;
  }
  return buffer;
}

function lfo(rate, depth, target) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = rate;
  gain.gain.value = depth;
  osc.connect(gain).connect(target);
  osc.start();
}

function buildGraph() {
  ctx = new AudioContext();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // Echo shared by the chimes and bloops.
  echo = ctx.createDelay(1);
  echo.delayTime.value = 0.42;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.38;
  echo.connect(feedback).connect(echo);
  echo.connect(master);

  // Waves: looping brown noise, low-passed, with the volume and brightness slowly swelling.
  const waves = ctx.createBufferSource();
  waves.buffer = brownNoise(6);
  waves.loop = true;
  const waveFilter = ctx.createBiquadFilter();
  waveFilter.type = 'lowpass';
  waveFilter.frequency.value = 600;
  const waveGain = ctx.createGain();
  waveGain.gain.value = 0.5;
  waves.connect(waveFilter).connect(waveGain).connect(master);
  lfo(0.09, 0.35, waveGain.gain);
  lfo(0.07, 350, waveFilter.frequency);
  waves.start();

  // Drone: two slightly detuned low notes that breathe in and out.
  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.035;
  const droneFilter = ctx.createBiquadFilter();
  droneFilter.type = 'lowpass';
  droneFilter.frequency.value = 400;
  droneFilter.connect(droneGain).connect(master);
  [110, 164.81, 110.6].forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    osc.connect(droneFilter);
    osc.start();
  });
  lfo(0.05, 0.02, droneGain.gain);
}

function tone({ freq, endFreq = freq, peak, attack, decay, type = 'sine' }) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (endFreq !== freq) osc.frequency.exponentialRampToValueAtTime(endFreq, now + attack + decay * 0.3);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);
  osc.connect(gain);
  gain.connect(master);
  gain.connect(echo);
  osc.start(now);
  osc.stop(now + attack + decay + 0.1);
}

function scheduleChime() {
  // Skip while hidden, or the queued notes would all play at once on return.
  if (!document.hidden) {
    const note = CHIME_NOTES[Math.floor(Math.random() * CHIME_NOTES.length)];
    tone({ freq: note, peak: 0.06, attack: 0.02, decay: 2.8 });
    if (Math.random() < 0.3) tone({ freq: note * 1.5, peak: 0.025, attack: 0.04, decay: 2.2 });
  }
  chimeTimer = window.setTimeout(scheduleChime, 1800 + Math.random() * 2800);
}

export async function startSea() {
  if (playing) return;
  if (!ctx) buildGraph();
  playing = true;
  notify();
  await ctx.resume();
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setTargetAtTime(MASTER_VOLUME, ctx.currentTime, 0.8);
  window.clearTimeout(chimeTimer);
  chimeTimer = window.setTimeout(scheduleChime, 1200);
}

export function stopSea() {
  if (!playing) return;
  playing = false;
  notify();
  window.clearTimeout(chimeTimer);
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
  window.setTimeout(() => {
    if (!playing) ctx.suspend();
  }, 1200);
}

export const toggleSea = () => (playing ? stopSea() : startSea());

// A short bubble "bloop" for interactions; silent unless the sea sound is on.
export function bloop(pitch = 1) {
  if (!playing) return;
  const base = 280 * pitch * (0.9 + Math.random() * 0.2);
  tone({ freq: base, endFreq: base * 2.6, peak: 0.12, attack: 0.01, decay: 0.25 });
}

export const subscribeSea = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const isSeaPlaying = () => playing;

// Pause the audio while the tab is hidden, and pick back up when it returns.
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!ctx || !playing) return;
    if (document.hidden) ctx.suspend();
    else ctx.resume();
  });
}
