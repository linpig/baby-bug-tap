import { FX_ASSETS, VOICE_ASSETS } from './game/assets/manifest';
import { MODE_ITEMS, MODE_LABELS } from './game/content/animals';
import type { AnimalDefinition, GameMode } from './game/content/animals';
import './styles.css';

interface AnimalActor {
  animElapsed: number;
  currentFrame: number;
  id: string;
  definition: AnimalDefinition;
  element: HTMLButtonElement;
  footprint: number;
  height: number;
  visual: HTMLElement;
  width: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  nextHopAt: number;
  size: number;
}

const applySpriteFrame = (actor: AnimalActor) => {
  const animation = actor.definition.animation;
  if (!animation) {
    return;
  }

  const frameProgress = animation.frames === 1 ? 0 : (actor.currentFrame / (animation.frames - 1)) * 100;
  const offsetY = animation.frameOffsetsY?.[actor.currentFrame] ?? 0;
  const tilt = animation.frameTilts?.[actor.currentFrame] ?? 0;

  actor.visual.style.backgroundPositionX = `${frameProgress}%`;
  actor.visual.style.transform = `translate3d(0, ${offsetY}px, 0) rotate(${tilt}deg)`;
};

const shell = document.querySelector<HTMLElement>('#game-shell');
const gameLayer = document.querySelector<HTMLElement>('#game-container');
const soundToggle = document.querySelector<HTMLButtonElement>('#sound-toggle');
const homeButton = document.querySelector<HTMLButtonElement>('#home-button');
const modePanel = document.querySelector<HTMLElement>('#mode-panel');
const modeButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.mode-option'));
const startButton = document.querySelector<HTMLButtonElement>('#start-button');

document.addEventListener('dragstart', (event) => {
  event.preventDefault();
});

const actors: AnimalActor[] = [];
const TARGET_VISIBLE_BY_MODE: Record<GameMode, number> = {
  animals: 20,
  letters: 18,
  numbers: 14
};
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
let currentMode: GameMode | null = null;

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const resolveAssetUrl = (path: string) => new URL(path, document.baseURI).toString();

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

const getCurrentDefinitions = () => (currentMode ? MODE_ITEMS[currentMode] : []);

const chooseItem = () => {
  const definitions = getCurrentDefinitions();
  const usedIds = new Set(actors.map((actor) => actor.definition.id));
  const candidates = definitions.filter((animal) => !usedIds.has(animal.id));
  const pool = candidates.length > 0 ? candidates : definitions;
  return pool[Math.floor(Math.random() * pool.length)];
};

const hasEnoughSpace = (x: number, y: number, width: number, height: number) =>
  actors.every((actor) => {
    const minGapX = (actor.width + width) * 0.5 + 12;
    const minGapY = (actor.height + height) * 0.5 + 10;
    return Math.abs(actor.x - x) > minGapX || Math.abs(actor.y - y) > minGapY;
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
  const width = Math.round(size * (definition.renderScale?.x ?? 1));
  const height = Math.round(size * (definition.renderScale?.y ?? 1));
  const footprint = Math.max(width, height);
  const speed = randomBetween(definition.speedRange[0], definition.speedRange[1]);
  const direction = Math.random() > 0.5 ? 1 : -1;
  const element = document.createElement('button');
  let visual: HTMLElement;

  element.className = `animal animal-${definition.movementType}`;
  element.type = 'button';
  element.draggable = false;
  element.setAttribute('aria-label', definition.nameZh);
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;

  if (definition.animation) {
    const sprite = document.createElement('span');
    sprite.className = 'animal-sprite';
    sprite.style.setProperty('--frames', String(definition.animation.frames));
    sprite.style.setProperty('--sprite-url', `url("${resolveAssetUrl(definition.animation.path)}")`);
    visual = sprite;
  } else if (definition.displayText) {
    const text = document.createElement('span');
    text.className = 'animal-text';
    text.textContent = definition.displayText;
    text.dataset.style = definition.textStyle || 'sky';
    visual = text;
  } else {
    const image = document.createElement('img');
    image.alt = definition.nameZh;
    image.src = resolveAssetUrl(`assets/characters/${definition.id}.svg`);
    image.draggable = false;
    image.addEventListener('dragstart', (event) => {
      event.preventDefault();
    });
    visual = image;
  }

  element.append(visual);
  gameLayer?.append(element);

  let x = randomBetween(width * 0.55, bounds.width - width * 0.55);
  let y = chooseY(definition, bounds.height, bounds.groundY);
  for (let attempt = 0; attempt < 40 && !hasEnoughSpace(x, y, width, height); attempt += 1) {
    x = randomBetween(width * 0.55, bounds.width - width * 0.55);
    y = chooseY(definition, bounds.height, bounds.groundY);
  }

  const actor: AnimalActor = {
    animElapsed: randomBetween(0, 0.4),
    currentFrame: 0,
    id: `${definition.id}-${crypto.randomUUID()}`,
    definition,
    element,
    footprint,
    height,
    visual,
    width,
    x,
    y,
    vx: speed * direction,
    vy: definition.movementType === 'fly' ? randomBetween(-10, 10) : 0,
    phase: randomBetween(0, Math.PI * 2),
    nextHopAt: randomBetween(0.4, 1.5),
    size
  };

  if (definition.animation) {
    applySpriteFrame(actor);
  }

  element.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    handleTap(actor);
  });
  element.addEventListener('dragstart', (event) => {
    event.preventDefault();
  });

  return actor;
};

const maintainPopulation = () => {
  if (!currentMode) {
    return;
  }

  while (actors.length < TARGET_VISIBLE_BY_MODE[currentMode]) {
    actors.push(createActor(chooseItem()));
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

  const edgePadding = actor.width * 0.5 + 16;
  if (actor.x < edgePadding || actor.x > bounds.width - edgePadding) {
    actor.x = clamp(actor.x, edgePadding, bounds.width - edgePadding);
    actor.vx *= -1;
  }

  const tilt = actor.definition.movementType === 'fly' ? Math.sin(actor.phase) * 5 : Math.sin(actor.phase) * 2;
  const flip = actor.definition.displayText ? 1 : actor.vx < 0 ? -1 : 1;
  actor.element.style.transform = `translate3d(${actor.x - actor.width / 2}px, ${actor.y - actor.height / 2}px, 0) rotate(${tilt}deg) scaleX(${flip})`;

  if (actor.definition.animation) {
    actor.animElapsed += deltaSeconds;
    const nextFrame = Math.floor(actor.animElapsed * actor.definition.animation.fps) % actor.definition.animation.frames;
    if (nextFrame !== actor.currentFrame) {
      actor.currentFrame = nextFrame;
      applySpriteFrame(actor);
    }
  }
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
  const audio = new Audio(resolveAssetUrl(path));
  audio.preload = 'auto';
  audio.setAttribute('playsinline', 'true');
  audio.load();
  return audio;
};

const pickPreferredSpeechVoice = (lang: string) => {
  if (!speechReady) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    return null;
  }

  const normalizedLang = lang.toLowerCase();
  const preferredNames = normalizedLang.startsWith('en') ? ['Samantha', 'Alex', 'Daniel'] : ['Meijia', 'Flo', 'Eddy', 'Sandy'];

  for (const preferredName of preferredNames) {
    const match = voices.find(
      (voice) => voice.lang.toLowerCase().startsWith(normalizedLang.slice(0, 2)) && voice.name.includes(preferredName)
    );
    if (match) {
      return match;
    }
  }

  return voices.find((voice) => voice.lang.toLowerCase().startsWith(normalizedLang)) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith(normalizedLang.slice(0, 2))) ||
    null;
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

const playVoiceName = (audioKey: string, fallbackText: string, speechLang = 'zh-TW') => {
  const voice = voicePlayers.get(audioKey);
  if (!voice || !voiceReady.has(audioKey)) {
    speakText(fallbackText, speechLang);
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
    speakText(fallbackText, speechLang);
  });
};

const speakText = (text: string, lang = 'zh-TW') => {
  if (!speechReady || muted) {
    return;
  }

  preferredSpeechVoice = pickPreferredSpeechVoice(lang);
  window.speechSynthesis.cancel();
  if (pendingSpeechTimeout !== null) {
    window.clearTimeout(pendingSpeechTimeout);
    pendingSpeechTimeout = null;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = preferredSpeechVoice?.lang || lang;
  utterance.voice = preferredSpeechVoice;
  utterance.rate = lang.toLowerCase().startsWith('en') ? 0.82 : preferredSpeechVoice?.name.includes('Meijia') ? 0.68 : 0.72;
  utterance.pitch = lang.toLowerCase().startsWith('en') ? 1.02 : preferredSpeechVoice?.name.includes('Meijia') ? 1 : 1.08;
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
  window.setTimeout(() => {
    actor.element.classList.remove('is-tapped');
  }, 260);

  if (muted) {
    return;
  }

  playTone();
  window.setTimeout(() => {
    if (actor.definition.audioKey) {
      playVoiceName(
        actor.definition.audioKey,
        actor.definition.speechText || actor.definition.nameZh,
        actor.definition.speechLang || 'zh-TW'
      );
      return;
    }

    speakText(actor.definition.speechText || actor.definition.nameZh, actor.definition.speechLang || 'en-US');
  }, 110);
};

const clearActors = () => {
  for (const actor of actors) {
    actor.element.remove();
  }
  actors.length = 0;
};

const showModePanel = () => {
  running = false;
  currentVoiceAudio?.pause();
  if (speechReady) {
    window.speechSynthesis.cancel();
  }
  if (pendingSpeechTimeout !== null) {
    window.clearTimeout(pendingSpeechTimeout);
    pendingSpeechTimeout = null;
  }
  clearActors();
  modePanel?.classList.remove('is-hidden');
  homeButton?.classList.remove('is-visible');
  startButton?.classList.add('is-hidden');
  shell?.classList.remove('is-running');
};

const selectMode = (mode: GameMode) => {
  currentMode = mode;
  running = false;
  clearActors();
  modePanel?.classList.add('is-hidden');
  homeButton?.classList.add('is-visible');
  const labels = MODE_LABELS[mode];
  startButton!.textContent = audioUnlocked ? `玩${labels.title}` : `開始${labels.title}`;
  if (audioUnlocked) {
    startGame();
    return;
  }
  startButton?.classList.remove('is-hidden');
};

const startGame = () => {
  if (running || !currentMode) {
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
homeButton?.addEventListener('click', showModePanel);
for (const button of modeButtons) {
  button.addEventListener('click', () => {
    const mode = button.dataset.mode as GameMode | undefined;
    if (mode) {
      selectMode(mode);
    }
  });
}
soundToggle?.addEventListener('click', () => setMuted(!muted));

prepareAudio();
setMuted(false);
showModePanel();

if (new URLSearchParams(window.location.search).get('autostart') === '1') {
  selectMode('animals');
}
