import { FX_ASSETS, VOICE_ASSETS } from './game/assets/manifest';
import { ANIMALS } from './game/content/animals';
import type { AnimalDefinition } from './game/content/animals';
import './styles.css';

interface AnimalActor {
  id: string;
  definition: AnimalDefinition;
  element: HTMLButtonElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  nextHopAt: number;
  size: number;
}

const shell = document.querySelector<HTMLElement>('#game-shell');
const gameLayer = document.querySelector<HTMLElement>('#game-container');
const soundToggle = document.querySelector<HTMLButtonElement>('#sound-toggle');
const startButton = document.querySelector<HTMLButtonElement>('#start-button');

const actors: AnimalActor[] = [];
const TARGET_VISIBLE_ACTORS = 20;
let muted = false;
let running = false;
let lastTime = 0;
let popAudio: HTMLAudioElement | null = null;
let currentVoiceAudio: HTMLAudioElement | null = null;
let audioContext: AudioContext | null = null;
let audioUnlocked = false;
const speechReady = 'speechSynthesis' in window;
let preferredSpeechVoice: SpeechSynthesisVoice | null = null;
let pendingSpeechTimeout: number | null = null;
const voicePlayers = new Map<string, HTMLAudioElement>();
const voiceReady = new Set<string>();

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const getBounds = () => {
  const rect = gameLayer?.getBoundingClientRect();
  const width = Math.max(320, rect?.width ?? window.innerWidth);
  const height = Math.max(320, rect?.height ?? window.innerHeight);

  return {
    width,
    height,
    groundY: Math.max(280, height * 0.76)
  };
};

const chooseAnimal = () => {
  const usedIds = new Set(actors.map((actor) => actor.definition.id));
  const candidates = ANIMALS.filter((animal) => !usedIds.has(animal.id));
  const pool = candidates.length > 0 ? candidates : ANIMALS;
  return pool[Math.floor(Math.random() * pool.length)];
};

const hasEnoughSpace = (x: number, y: number, size: number) =>
  actors.every((actor) => {
    const distance = Math.hypot(actor.x - x, actor.y - y);
    return distance > (actor.size + size) * 0.48;
  });

const chooseY = (definition: AnimalDefinition, height: number, groundY: number) => {
  if (definition.movementType === 'fly') {
    return randomBetween(height * 0.18, height * 0.62);
  }
  if (definition.movementType === 'hop') {
    return randomBetween(height * 0.56, groundY);
  }
  return randomBetween(height * 0.66, groundY);
};

const createActor = (definition: AnimalDefinition): AnimalActor => {
  const bounds = getBounds();
  const size = definition.size;
  const speed = randomBetween(definition.speedRange[0], definition.speedRange[1]);
  const direction = Math.random() > 0.5 ? 1 : -1;
  const element = document.createElement('button');
  const image = document.createElement('img');

  element.className = `animal animal-${definition.movementType}`;
  element.type = 'button';
  element.setAttribute('aria-label', definition.nameZh);
  element.style.width = `${size}px`;
  element.style.height = `${size}px`;

  image.alt = definition.nameZh;
  image.src = `assets/characters/${definition.id}.svg`;
  element.append(image);
  gameLayer?.append(element);

  let x = randomBetween(size * 0.55, bounds.width - size * 0.55);
  let y = chooseY(definition, bounds.height, bounds.groundY);
  for (let attempt = 0; attempt < 24 && !hasEnoughSpace(x, y, size); attempt += 1) {
    x = randomBetween(size * 0.55, bounds.width - size * 0.55);
    y = chooseY(definition, bounds.height, bounds.groundY);
  }

  const actor: AnimalActor = {
    id: `${definition.id}-${crypto.randomUUID()}`,
    definition,
    element,
    x,
    y,
    vx: speed * direction,
    vy: definition.movementType === 'fly' ? randomBetween(-10, 10) : 0,
    phase: randomBetween(0, Math.PI * 2),
    nextHopAt: randomBetween(0.4, 1.5),
    size
  };

  element.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    handleTap(actor);
  });

  return actor;
};

const maintainPopulation = () => {
  while (actors.length < TARGET_VISIBLE_ACTORS) {
    actors.push(createActor(chooseAnimal()));
  }
};

const updateActor = (actor: AnimalActor, deltaSeconds: number, elapsedSeconds: number) => {
  const bounds = getBounds();

  if (actor.definition.movementType === 'fly') {
    actor.phase += deltaSeconds * 1.5;
    actor.x += actor.vx * deltaSeconds;
    actor.y += (actor.vy + Math.sin(actor.phase) * 18) * deltaSeconds;
    if (actor.y < bounds.height * 0.18 || actor.y > bounds.height * 0.66) {
      actor.vy *= -1;
      actor.y = clamp(actor.y, bounds.height * 0.18, bounds.height * 0.66);
    }
  } else if (actor.definition.movementType === 'hop') {
    if (elapsedSeconds >= actor.nextHopAt) {
      actor.vy = -(92 + Math.random() * 36);
      actor.vx *= Math.random() > 0.22 ? 1 : -1;
      actor.nextHopAt = elapsedSeconds + 1.25 + Math.random() * 1.2;
    }
    actor.x += actor.vx * deltaSeconds;
    actor.y += actor.vy * deltaSeconds;
    actor.vy += 170 * deltaSeconds;
    if (actor.y > bounds.groundY - 18) {
      actor.y = bounds.groundY - 18;
      actor.vy = 0;
    }
  } else {
    actor.phase += deltaSeconds * 2;
    actor.x += actor.vx * deltaSeconds;
    actor.y += Math.sin(actor.phase) * 2.4 * deltaSeconds;
    actor.y = clamp(actor.y, bounds.groundY - 120, bounds.groundY + 8);
  }

  const edgePadding = actor.size * 0.5 + 16;
  if (actor.x < edgePadding || actor.x > bounds.width - edgePadding) {
    actor.x = clamp(actor.x, edgePadding, bounds.width - edgePadding);
    actor.vx *= -1;
  }

  const tilt = actor.definition.movementType === 'fly' ? Math.sin(actor.phase) * 5 : Math.sin(actor.phase) * 2;
  const flip = actor.vx < 0 ? -1 : 1;
  actor.element.style.transform = `translate3d(${actor.x - actor.size / 2}px, ${actor.y - actor.size / 2}px, 0) rotate(${tilt}deg) scaleX(${flip})`;
};

const tick = (time: number) => {
  if (!running) {
    return;
  }

  const deltaSeconds = Math.min(0.05, (time - lastTime) / 1000 || 0.016);
  lastTime = time;
  maintainPopulation();

  for (const actor of actors) {
    updateActor(actor, deltaSeconds, time / 1000);
  }

  Object.assign(window, {
    __babyBugGameState: {
      animalCount: actors.length,
      animals: actors.map((actor) => actor.definition.id)
    }
  });

  requestAnimationFrame(tick);
};

const createAudioElement = (path: string) => {
  const audio = new Audio(path);
  audio.preload = 'auto';
  audio.setAttribute('playsinline', 'true');
  audio.load();
  return audio;
};

const pickPreferredSpeechVoice = () => {
  if (!speechReady) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    return null;
  }

  const preferredNames = ['Meijia', 'Flo', 'Eddy', 'Sandy'];

  for (const preferredName of preferredNames) {
    const match = voices.find((voice) => voice.lang.toLowerCase().startsWith('zh') && voice.name.includes(preferredName));
    if (match) {
      return match;
    }
  }

  return (
    voices.find((voice) => voice.lang.toLowerCase().startsWith('zh-tw')) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith('zh')) ||
    null
  );
};

const refreshPreferredSpeechVoice = () => {
  preferredSpeechVoice = pickPreferredSpeechVoice();
};

const primeAudioElement = async (audio: HTMLAudioElement) => {
  const previousMuted = audio.muted;
  audio.muted = true;
  audio.currentTime = 0;
  try {
    await audio.play();
    audio.pause();
    audio.currentTime = 0;
  } catch {
    // iOS/Safari may reject some warm-up attempts; the later direct tap still retries.
  } finally {
    audio.muted = previousMuted;
  }
};

const prepareAudio = () => {
  if (popAudio) {
    return;
  }

  popAudio = createAudioElement(FX_ASSETS[0].path);
  popAudio.volume = 0.16;

  for (const asset of VOICE_ASSETS) {
    const audio = createAudioElement(asset.path);
    audio.addEventListener('canplaythrough', () => {
      voiceReady.add(asset.key);
    });
    audio.addEventListener('loadeddata', () => {
      voiceReady.add(asset.key);
    });
    audio.addEventListener('error', () => {
      voiceReady.delete(asset.key);
    });
    voicePlayers.set(asset.key, audio);
  }
};

const unlockAudio = async () => {
  if (audioUnlocked) {
    return;
  }

  prepareAudio();

  const AudioContextClass =
    window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (AudioContextClass) {
    audioContext ??= new AudioContextClass();
    if (audioContext.state === 'suspended') {
      try {
        await audioContext.resume();
      } catch {
        // Ignore; voice playback below is the primary channel.
      }
    }
  }

  const warmups = popAudio ? [primeAudioElement(popAudio)] : [];
  for (const audio of voicePlayers.values()) {
    warmups.push(primeAudioElement(audio));
  }
  await Promise.allSettled(warmups);
  audioUnlocked = true;
};

const playVoiceName = (audioKey: string, fallbackName: string) => {
  const voice = voicePlayers.get(audioKey);
  if (!voice || !voiceReady.has(audioKey)) {
    speakName(fallbackName);
    return;
  }

  if (pendingSpeechTimeout !== null) {
    window.clearTimeout(pendingSpeechTimeout);
    pendingSpeechTimeout = null;
  }
  window.speechSynthesis.cancel();

  currentVoiceAudio?.pause();
  currentVoiceAudio = voice;
  currentVoiceAudio.currentTime = 0;
  currentVoiceAudio.volume = 1;
  void currentVoiceAudio.play().catch(() => {
    speakName(fallbackName);
  });
};

const speakName = (nameZh: string) => {
  if (!speechReady || muted) {
    return;
  }

  if (!preferredSpeechVoice) {
    refreshPreferredSpeechVoice();
  }

  window.speechSynthesis.cancel();
  if (pendingSpeechTimeout !== null) {
    window.clearTimeout(pendingSpeechTimeout);
    pendingSpeechTimeout = null;
  }
  const utterance = new SpeechSynthesisUtterance(nameZh);
  utterance.lang = preferredSpeechVoice?.lang || 'zh-TW';
  utterance.voice = preferredSpeechVoice;
  utterance.rate = preferredSpeechVoice?.name.includes('Meijia') ? 0.68 : 0.72;
  utterance.pitch = preferredSpeechVoice?.name.includes('Meijia') ? 1 : 1.08;
  utterance.volume = 1;
  pendingSpeechTimeout = window.setTimeout(() => {
    window.speechSynthesis.speak(utterance);
    pendingSpeechTimeout = null;
  }, 110);
};

const playTone = () => {
  if (popAudio) {
    popAudio.pause();
    popAudio.currentTime = 0;
    void popAudio.play().catch(() => undefined);
    return;
  }

  const AudioContextClass =
    window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }

  audioContext ??= new AudioContextClass();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.16);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.18);
};

const handleTap = (actor: AnimalActor) => {
  actor.element.classList.remove('is-tapped');
  void actor.element.offsetWidth;
  actor.element.classList.add('is-tapped');

  if (muted) {
    return;
  }

  playTone();
  window.setTimeout(() => {
    playVoiceName(actor.definition.audioKey, actor.definition.nameZh);
  }, 110);
};

const startGame = () => {
  if (running) {
    return;
  }

  running = true;
  startButton?.classList.add('is-hidden');
  shell?.classList.add('is-running');
  maintainPopulation();
  lastTime = performance.now();
  requestAnimationFrame(tick);
  void unlockAudio();

  if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => undefined);
  }
};

const setMuted = (nextMuted: boolean) => {
  muted = nextMuted;
  if (muted && speechReady) {
    window.speechSynthesis.cancel();
  }
  if (muted) {
    currentVoiceAudio?.pause();
  }
  if (pendingSpeechTimeout !== null) {
    window.clearTimeout(pendingSpeechTimeout);
    pendingSpeechTimeout = null;
  }
  if (soundToggle) {
    soundToggle.setAttribute('aria-pressed', String(muted));
    soundToggle.setAttribute('aria-label', muted ? '打開聲音' : '關閉聲音');
    soundToggle.textContent = muted ? '🔇' : '🔊';
  }
};

startButton?.addEventListener('click', startGame);
soundToggle?.addEventListener('click', () => setMuted(!muted));

prepareAudio();
refreshPreferredSpeechVoice();
if (speechReady) {
  window.speechSynthesis.addEventListener('voiceschanged', refreshPreferredSpeechVoice);
}
setMuted(false);

if (new URLSearchParams(window.location.search).get('autostart') === '1') {
  startGame();
}
