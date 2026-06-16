export type MovementType = 'crawl' | 'fly' | 'hop';

export interface SpriteAnimation {
  frameOffsetsY?: number[];
  frameTilts?: number[];
  fps: number;
  frames: number;
  path: string;
}

export interface AnimalDefinition {
  animation?: SpriteAnimation;
  id: string;
  nameZh: string;
  renderScale?: {
    x?: number;
    y?: number;
  };
  spriteKey: string;
  audioKey: string;
  movementType: MovementType;
  size: number;
  speedRange: [number, number];
}

export const ANIMALS: AnimalDefinition[] = [
  {
    id: 'butterfly',
    nameZh: '蝴蝶',
    spriteKey: 'animal-butterfly',
    audioKey: 'voice-butterfly',
    movementType: 'fly',
    size: 88,
    speedRange: [28, 44],
    animation: {
      frameOffsetsY: [-2, 1, -1, 1],
      frameTilts: [-3, 2, -2, 3],
      fps: 6,
      frames: 4,
      path: 'assets/sprites/butterfly-strip.svg'
    }
  },
  {
    id: 'ladybug',
    nameZh: '瓢蟲',
    spriteKey: 'animal-ladybug',
    audioKey: 'voice-ladybug',
    movementType: 'crawl',
    size: 82,
    speedRange: [18, 30],
    animation: {
      frameOffsetsY: [0, -1, 0, -1],
      frameTilts: [0, 1, 0, -1],
      fps: 6,
      frames: 4,
      path: 'assets/sprites/ladybug-strip.svg'
    }
  },
  {
    id: 'bee',
    nameZh: '蜜蜂',
    spriteKey: 'animal-bee',
    audioKey: 'voice-bee',
    movementType: 'fly',
    size: 82,
    speedRange: [30, 48],
    animation: {
      frameOffsetsY: [-1, 1, -1, 1],
      frameTilts: [-1, 1, -1, 1],
      fps: 9,
      frames: 4,
      path: 'assets/sprites/bee-strip.svg'
    }
  },
  {
    id: 'ant',
    nameZh: '螞蟻',
    spriteKey: 'animal-ant',
    audioKey: 'voice-ant',
    movementType: 'crawl',
    size: 78,
    speedRange: [18, 34],
    animation: {
      frameOffsetsY: [0, -2, 0, -1],
      frameTilts: [-2, 2, -1, 1],
      fps: 7,
      frames: 4,
      path: 'assets/sprites/ant-strip.svg'
    }
  },
  {
    id: 'caterpillar',
    nameZh: '毛毛蟲',
    spriteKey: 'animal-caterpillar',
    audioKey: 'voice-caterpillar',
    movementType: 'crawl',
    size: 94,
    renderScale: {
      x: 1.18,
      y: 0.86
    },
    speedRange: [14, 24],
    animation: {
      frameOffsetsY: [0, -1, 0, -1],
      frameTilts: [0, 1, 0, -1],
      fps: 5,
      frames: 4,
      path: 'assets/sprites/caterpillar-strip.svg'
    }
  },
  {
    id: 'snail',
    nameZh: '蝸牛',
    spriteKey: 'animal-snail',
    audioKey: 'voice-snail',
    movementType: 'crawl',
    size: 86,
    speedRange: [8, 16]
  },
  {
    id: 'frog',
    nameZh: '青蛙',
    spriteKey: 'animal-frog',
    audioKey: 'voice-frog',
    movementType: 'hop',
    size: 88,
    speedRange: [22, 38],
    animation: {
      frameOffsetsY: [1, -2, -5, -1],
      frameTilts: [0, -2, 1, 0],
      fps: 5,
      frames: 4,
      path: 'assets/sprites/frog-strip.svg'
    }
  },
  {
    id: 'bird',
    nameZh: '小鳥',
    spriteKey: 'animal-bird',
    audioKey: 'voice-bird',
    movementType: 'fly',
    size: 86,
    speedRange: [26, 42],
    animation: {
      frameOffsetsY: [0, -1, 1, -1],
      frameTilts: [0, -3, 2, -2],
      fps: 7,
      frames: 4,
      path: 'assets/sprites/bird-strip.svg'
    }
  },
  {
    id: 'dragonfly',
    nameZh: '蜻蜓',
    spriteKey: 'animal-dragonfly',
    audioKey: 'voice-dragonfly',
    movementType: 'fly',
    size: 90,
    speedRange: [30, 46],
    animation: {
      frameOffsetsY: [-1, 0, -1, 0],
      frameTilts: [-1, 1, -1, 1],
      fps: 10,
      frames: 4,
      path: 'assets/sprites/dragonfly-strip.svg'
    }
  },
  {
    id: 'beetle',
    nameZh: '甲蟲',
    spriteKey: 'animal-beetle',
    audioKey: 'voice-beetle',
    movementType: 'crawl',
    size: 86,
    speedRange: [16, 28]
  },
  {
    id: 'grasshopper',
    nameZh: '蚱蜢',
    spriteKey: 'animal-grasshopper',
    audioKey: 'voice-grasshopper',
    movementType: 'hop',
    size: 88,
    speedRange: [24, 38]
  },
  {
    id: 'firefly',
    nameZh: '螢火蟲',
    spriteKey: 'animal-firefly',
    audioKey: 'voice-firefly',
    movementType: 'fly',
    size: 82,
    speedRange: [24, 40]
  },
  {
    id: 'duck',
    nameZh: '小鴨',
    spriteKey: 'animal-duck',
    audioKey: 'voice-duck',
    movementType: 'hop',
    size: 90,
    speedRange: [22, 34]
  },
  {
    id: 'rabbit',
    nameZh: '兔子',
    spriteKey: 'animal-rabbit',
    audioKey: 'voice-rabbit',
    movementType: 'hop',
    size: 92,
    speedRange: [24, 38]
  },
  {
    id: 'cat',
    nameZh: '小貓',
    spriteKey: 'animal-cat',
    audioKey: 'voice-cat',
    movementType: 'crawl',
    size: 92,
    speedRange: [18, 28]
  },
  {
    id: 'dog',
    nameZh: '小狗',
    spriteKey: 'animal-dog',
    audioKey: 'voice-dog',
    movementType: 'crawl',
    size: 94,
    speedRange: [18, 30]
  },
  {
    id: 'turtle',
    nameZh: '烏龜',
    spriteKey: 'animal-turtle',
    audioKey: 'voice-turtle',
    movementType: 'crawl',
    size: 90,
    speedRange: [10, 18]
  },
  {
    id: 'chick',
    nameZh: '小雞',
    spriteKey: 'animal-chick',
    audioKey: 'voice-chick',
    movementType: 'hop',
    size: 82,
    speedRange: [24, 36]
  },
  {
    id: 'owl',
    nameZh: '貓頭鷹',
    spriteKey: 'animal-owl',
    audioKey: 'voice-owl',
    movementType: 'fly',
    size: 92,
    speedRange: [22, 36]
  },
  {
    id: 'squirrel',
    nameZh: '松鼠',
    spriteKey: 'animal-squirrel',
    audioKey: 'voice-squirrel',
    movementType: 'hop',
    size: 90,
    speedRange: [22, 34]
  }
];
