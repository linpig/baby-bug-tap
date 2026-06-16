import Phaser from 'phaser';
import { createGameState } from '../../game/simulation/state';
import type { AnimalEntity, GameState } from '../../game/simulation/state';
import { updateMovement } from '../../game/simulation/systems/movementSystem';
import { maintainAnimalPopulation } from '../../game/simulation/systems/spawnSystem';
import { VOICE_ASSETS } from '../../game/assets/manifest';
import { createAnimalTextures } from '../view/animalTextures';
import { playClickFeedback } from '../view/clickFeedback';

interface AnimalView {
  entity: AnimalEntity;
  sprite: Phaser.GameObjects.Image;
}

export class PlayScene extends Phaser.Scene {
  private state!: GameState;
  private background?: Phaser.GameObjects.Graphics;
  private views = new Map<string, AnimalView>();
  private currentVoice?: HTMLAudioElement;

  constructor() {
    super('PlayScene');
  }

  create() {
    const { width, height } = this.scale;
    this.state = createGameState(width, height);
    createAnimalTextures(this);
    this.createBackground(width, height);
    maintainAnimalPopulation(this.state);
    this.syncViews();

    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.resizeWorld(gameSize.width, gameSize.height);
    });
  }

  update(time: number, delta: number) {
    updateMovement(this.state, Math.min(delta, 50), time);
    maintainAnimalPopulation(this.state);
    this.syncViews();
  }

  private createBackground(width: number, height: number) {
    this.background = this.add.graphics();
    this.background.setDepth(0);
    this.drawBackground(width, height);
  }

  private drawBackground(width: number, height: number) {
    if (!this.background) {
      return;
    }

    const g = this.background;
    g.clear();
    g.fillGradientStyle(0x92dcff, 0x92dcff, 0xcdf5cf, 0xa6df82, 1);
    g.fillRect(0, 0, width, height);

    g.fillStyle(0xfff2a0, 1);
    g.fillCircle(width * 0.84, height * 0.17, Math.min(width, height) * 0.075);

    g.fillStyle(0xa7e681, 1);
    g.fillEllipse(width * 0.28, height * 0.83, width * 0.9, height * 0.46);
    g.fillEllipse(width * 0.78, height * 0.76, width * 0.9, height * 0.5);
    g.fillStyle(0x5fbd68, 1);
    g.fillEllipse(width * 0.18, height * 0.96, width * 0.9, height * 0.36);
    g.fillEllipse(width * 0.72, height * 0.93, width * 1.05, height * 0.38);
  }

  private resizeWorld(width: number, height: number) {
    this.state.bounds.width = width;
    this.state.bounds.height = height;
    this.state.bounds.groundY = Math.max(280, height * 0.76);
    this.cameras.main.setSize(width, height);
    this.drawBackground(width, height);
  }

  private syncViews() {
    const activeIds = new Set(this.state.animals.map((entity) => entity.id));

    for (const [id, view] of this.views.entries()) {
      if (!activeIds.has(id)) {
        view.sprite.destroy();
        this.views.delete(id);
      }
    }

    for (const entity of this.state.animals) {
      const existing = this.views.get(entity.id);
      if (existing) {
        this.updateSprite(existing);
        continue;
      }

      const sprite = this.add.image(entity.x, entity.y, entity.definition.spriteKey);
      sprite.setDepth(entity.definition.movementType === 'fly' ? 3 : 2);
      sprite.setDisplaySize(entity.definition.size, entity.definition.size);
      sprite.setInteractive({
        useHandCursor: true,
        pixelPerfect: false
      });
      sprite.on('pointerdown', () => this.handleAnimalTap(sprite, entity));

      this.views.set(entity.id, { entity, sprite });
      this.updateSprite({ entity, sprite });
    }

    const debugState = {
      animalCount: this.state.animals.length,
      animals: this.state.animals.map((entity) => entity.definition.id)
    };

    window.dispatchEvent(new CustomEvent('babyBugGame:state', { detail: debugState }));
    Object.assign(window, { __babyBugGameState: debugState });
  }

  private updateSprite(view: AnimalView) {
    const { entity, sprite } = view;
    sprite.setPosition(entity.x, entity.y);
    sprite.setFlipX(entity.vx < 0);

    if (entity.definition.movementType === 'fly') {
      sprite.rotation = Math.sin(entity.phase) * 0.08;
    } else if (entity.definition.movementType === 'hop') {
      sprite.rotation = Math.sin(entity.phase) * 0.035;
    } else {
      sprite.rotation = Math.sin(entity.phase) * 0.025;
    }
  }

  private handleAnimalTap(sprite: Phaser.GameObjects.Image, entity: AnimalEntity) {
    playClickFeedback(this, sprite);

    if (!this.sound.mute) {
      this.playTone();
      this.currentVoice?.pause();
      const voiceAsset = VOICE_ASSETS.find((asset) => asset.key === entity.definition.audioKey);
      if (voiceAsset) {
        this.currentVoice = new Audio(voiceAsset.path);
        this.currentVoice.volume = 0.95;
        this.currentVoice.play().catch(() => undefined);
      }
    }
  }

  private playTone() {
    const AudioContextClass =
      window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(660, context.currentTime);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.16);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.18);
    oscillator.addEventListener('ended', () => context.close());
  }
}
