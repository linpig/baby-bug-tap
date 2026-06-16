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
  displayText?: string;
  speechLang?: string;
  speechText?: string;
  renderScale?: {
    x?: number;
    y?: number;
  };
  spriteKey: string;
  textStyle?: string;
  audioKey: string;
  movementType: MovementType;
  size: number;
  speedRange: [number, number];
}

export const ANIMALS: AnimalDefinition[] = [
  {
    id: 'butterfly',
    nameZh: '蝴蝶',
    speechLang: 'zh-TW',
    speechText: '蝴蝶',
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
    speechLang: 'zh-TW',
    speechText: '瓢蟲',
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
    speechLang: 'zh-TW',
    speechText: '蜜蜂',
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
    speechLang: 'zh-TW',
    speechText: '螞蟻',
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
    speechLang: 'zh-TW',
    speechText: '毛毛蟲',
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
    speechLang: 'zh-TW',
    speechText: '蝸牛',
    spriteKey: 'animal-snail',
    audioKey: 'voice-snail',
    movementType: 'crawl',
    size: 86,
    renderScale: {
      x: 1.2,
      y: 0.88
    },
    speedRange: [8, 16],
    animation: {
      frameOffsetsY: [0, -1, -1, 0],
      frameTilts: [0, 1, 1, 0],
      fps: 4,
      frames: 4,
      path: 'assets/sprites/snail-strip.svg'
    }
  },
  {
    id: 'frog',
    nameZh: '青蛙',
    speechLang: 'zh-TW',
    speechText: '青蛙',
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
    speechLang: 'zh-TW',
    speechText: '小鳥',
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
    speechLang: 'zh-TW',
    speechText: '蜻蜓',
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
    speechLang: 'zh-TW',
    speechText: '甲蟲',
    spriteKey: 'animal-beetle',
    audioKey: 'voice-beetle',
    movementType: 'crawl',
    size: 86,
    speedRange: [16, 28],
    animation: {
      frameOffsetsY: [0, -1, 0, -1],
      frameTilts: [0, 1, 0, -1],
      fps: 6,
      frames: 4,
      path: 'assets/sprites/beetle-strip.svg'
    }
  },
  {
    id: 'grasshopper',
    nameZh: '蚱蜢',
    speechLang: 'zh-TW',
    speechText: '蚱蜢',
    spriteKey: 'animal-grasshopper',
    audioKey: 'voice-grasshopper',
    movementType: 'hop',
    size: 88,
    renderScale: {
      x: 1.14,
      y: 0.9
    },
    speedRange: [24, 38],
    animation: {
      frameOffsetsY: [0, -3, 0, -2],
      frameTilts: [0, -3, 1, -2],
      fps: 6,
      frames: 4,
      path: 'assets/sprites/grasshopper-strip.svg'
    }
  },
  {
    id: 'firefly',
    nameZh: '螢火蟲',
    speechLang: 'zh-TW',
    speechText: '螢火蟲',
    spriteKey: 'animal-firefly',
    audioKey: 'voice-firefly',
    movementType: 'fly',
    size: 82,
    speedRange: [24, 40],
    animation: {
      frameOffsetsY: [-1, 0, -1, 0],
      frameTilts: [0, 1, 0, -1],
      fps: 8,
      frames: 4,
      path: 'assets/sprites/firefly-strip.svg'
    }
  },
  {
    id: 'duck',
    nameZh: '小鴨',
    speechLang: 'zh-TW',
    speechText: '小鴨',
    spriteKey: 'animal-duck',
    audioKey: 'voice-duck',
    movementType: 'hop',
    size: 90,
    renderScale: {
      x: 1.08,
      y: 0.94
    },
    speedRange: [22, 34],
    animation: {
      frameOffsetsY: [0, -2, 1, -1],
      frameTilts: [0, -2, 1, -1],
      fps: 6,
      frames: 4,
      path: 'assets/sprites/duck-strip.svg'
    }
  },
  {
    id: 'rabbit',
    nameZh: '兔子',
    speechLang: 'zh-TW',
    speechText: '兔子',
    spriteKey: 'animal-rabbit',
    audioKey: 'voice-rabbit',
    movementType: 'hop',
    size: 92,
    speedRange: [24, 38],
    animation: {
      frameOffsetsY: [0, -2, 1, -2],
      frameTilts: [0, -1, 1, -1],
      fps: 5,
      frames: 4,
      path: 'assets/sprites/rabbit-strip.svg'
    }
  },
  {
    id: 'cat',
    nameZh: '小貓',
    speechLang: 'zh-TW',
    speechText: '小貓',
    spriteKey: 'animal-cat',
    audioKey: 'voice-cat',
    movementType: 'crawl',
    size: 92,
    renderScale: {
      x: 1.1,
      y: 0.94
    },
    speedRange: [18, 28],
    animation: {
      frameOffsetsY: [0, -1, 0, -1],
      frameTilts: [0, 1, 0, -1],
      fps: 6,
      frames: 4,
      path: 'assets/sprites/cat-strip.svg'
    }
  },
  {
    id: 'dog',
    nameZh: '小狗',
    speechLang: 'zh-TW',
    speechText: '小狗',
    spriteKey: 'animal-dog',
    audioKey: 'voice-dog',
    movementType: 'crawl',
    size: 94,
    renderScale: {
      x: 1.16,
      y: 0.95
    },
    speedRange: [18, 30],
    animation: {
      frameOffsetsY: [0, -1, 0, -1],
      frameTilts: [0, 1, 0, -1],
      fps: 6,
      frames: 4,
      path: 'assets/sprites/dog-strip.svg'
    }
  },
  {
    id: 'turtle',
    nameZh: '烏龜',
    speechLang: 'zh-TW',
    speechText: '烏龜',
    spriteKey: 'animal-turtle',
    audioKey: 'voice-turtle',
    movementType: 'crawl',
    size: 90,
    renderScale: {
      x: 1.14,
      y: 0.9
    },
    speedRange: [10, 18],
    animation: {
      frameOffsetsY: [0, -1, 1, -1],
      frameTilts: [0, 1, 0, -1],
      fps: 4,
      frames: 4,
      path: 'assets/sprites/turtle-strip.svg'
    }
  },
  {
    id: 'chick',
    nameZh: '小雞',
    speechLang: 'zh-TW',
    speechText: '小雞',
    spriteKey: 'animal-chick',
    audioKey: 'voice-chick',
    movementType: 'hop',
    size: 82,
    speedRange: [24, 36],
    animation: {
      frameOffsetsY: [0, -2, 1, -2],
      frameTilts: [0, -1, 1, -1],
      fps: 6,
      frames: 4,
      path: 'assets/sprites/chick-strip.svg'
    }
  },
  {
    id: 'owl',
    nameZh: '貓頭鷹',
    speechLang: 'zh-TW',
    speechText: '貓頭鷹',
    spriteKey: 'animal-owl',
    audioKey: 'voice-owl',
    movementType: 'fly',
    size: 92,
    renderScale: {
      x: 1.08,
      y: 0.96
    },
    speedRange: [22, 36],
    animation: {
      frameOffsetsY: [-1, -2, 0, -2],
      frameTilts: [0, -2, 1, -2],
      fps: 5,
      frames: 4,
      path: 'assets/sprites/owl-strip.svg'
    }
  },
  {
    id: 'squirrel',
    nameZh: '松鼠',
    speechLang: 'zh-TW',
    speechText: '松鼠',
    spriteKey: 'animal-squirrel',
    audioKey: 'voice-squirrel',
    movementType: 'hop',
    size: 90,
    renderScale: {
      x: 1.12,
      y: 0.98
    },
    speedRange: [22, 34],
    animation: {
      frameOffsetsY: [0, -2, 0, -1],
      frameTilts: [0, -1, 1, -1],
      fps: 5,
      frames: 4,
      path: 'assets/sprites/squirrel-strip.svg'
    }
  }
];

export type GameMode = 'animals' | 'letters' | 'numbers';

const LETTER_PALETTES = ['berry', 'sky', 'mint', 'sun', 'peach', 'violet'] as const;
const NUMBER_WORDS_ZH = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'] as const;

export const LETTERS: AnimalDefinition[] = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((letter, index) => {
  return {
    id: `letter-${letter.toLowerCase()}`,
    nameZh: letter,
    displayText: letter,
    speechLang: 'en-US',
    speechText: letter,
    spriteKey: `letter-${letter.toLowerCase()}`,
    audioKey: `voice-letter-${letter.toLowerCase()}`,
    textStyle: LETTER_PALETTES[index % LETTER_PALETTES.length],
    movementType: 'fly',
    size: 92,
    speedRange: [34, 52]
  };
});

export const NUMBERS: AnimalDefinition[] = NUMBER_WORDS_ZH.map((word, index) => {
  const movementType: MovementType = index % 3 === 0 ? 'hop' : index % 2 === 0 ? 'crawl' : 'fly';
  return {
    id: `number-${index}`,
    nameZh: String(index),
    displayText: String(index),
    speechLang: 'zh-TW',
    speechText: NUMBER_WORDS_ZH[index],
    spriteKey: `number-${index}`,
    audioKey: `voice-number-${index}`,
    textStyle: LETTER_PALETTES[index % LETTER_PALETTES.length],
    movementType,
    size: movementType === 'fly' ? 94 : 90,
    speedRange:
      movementType === 'fly' ? [26, 40] : movementType === 'hop' ? [22, 34] : [14, 24]
  };
});

export const MODE_ITEMS: Record<GameMode, AnimalDefinition[]> = {
  animals: ANIMALS,
  letters: LETTERS,
  numbers: NUMBERS
};

export const MODE_LABELS: Record<GameMode, { title: string; subtitle: string }> = {
  animals: {
    title: '昆蟲動物',
    subtitle: '點點看會說出動物或昆蟲名稱'
  },
  letters: {
    title: '英文字母',
    subtitle: '點點看會念出英文 A 到 Z，共 26 個字母'
  },
  numbers: {
    title: '數字',
    subtitle: '點點看會念出中文數字 0 到 9'
  }
};
