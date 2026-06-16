import Phaser from 'phaser';

const SIZE = 180;

type AnimalPainter = (graphics: Phaser.GameObjects.Graphics) => void;

const outline = 0x31524a;
const dark = 0x253b35;

const withStroke = (graphics: Phaser.GameObjects.Graphics, width = 7, color = outline) => {
  graphics.lineStyle(width, color, 1);
};

const eye = (graphics: Phaser.GameObjects.Graphics, x: number, y: number) => {
  graphics.fillStyle(0xffffff, 1);
  graphics.fillCircle(x, y, 7);
  graphics.fillStyle(dark, 1);
  graphics.fillCircle(x + 1, y + 1, 3);
};

const smile = (graphics: Phaser.GameObjects.Graphics, x: number, y: number, width: number) => {
  withStroke(graphics, 5, dark);
  graphics.beginPath();
  graphics.arc(x, y, width, 0.15 * Math.PI, 0.85 * Math.PI);
  graphics.strokePath();
};

const painters: Record<string, AnimalPainter> = {
  butterfly: (g) => {
    withStroke(g);
    g.fillStyle(0xff8fc8, 1);
    g.fillEllipse(58, 70, 70, 62);
    g.strokeEllipse(58, 70, 70, 62);
    g.fillStyle(0x82c7ff, 1);
    g.fillEllipse(122, 70, 70, 62);
    g.strokeEllipse(122, 70, 70, 62);
    g.fillStyle(0xffd65f, 1);
    g.fillEllipse(60, 116, 58, 48);
    g.strokeEllipse(60, 116, 58, 48);
    g.fillStyle(0x9eea83, 1);
    g.fillEllipse(120, 116, 58, 48);
    g.strokeEllipse(120, 116, 58, 48);
    g.fillStyle(0x69508f, 1);
    g.fillEllipse(90, 92, 25, 94);
    g.fillCircle(90, 37, 19);
    eye(g, 82, 34);
    eye(g, 98, 34);
  },
  ladybug: (g) => {
    withStroke(g, 8, 0x422833);
    g.fillStyle(0xf95b5b, 1);
    g.fillEllipse(90, 96, 108, 92);
    g.strokeEllipse(90, 96, 108, 92);
    g.lineStyle(7, 0x422833, 1);
    g.lineBetween(90, 50, 90, 139);
    g.fillStyle(0x342833, 1);
    g.fillCircle(90, 46, 25);
    [67, 113, 73, 107].forEach((x, index) => g.fillCircle(x, index < 2 ? 82 : 112, 8));
    eye(g, 81, 39);
    eye(g, 99, 39);
  },
  bee: (g) => {
    withStroke(g, 5, 0x5693a8);
    g.fillStyle(0xd9f6ff, 0.9);
    g.fillEllipse(75, 58, 48, 40);
    g.strokeEllipse(75, 58, 48, 40);
    g.fillEllipse(112, 58, 48, 40);
    g.strokeEllipse(112, 58, 48, 40);
    withStroke(g, 8, 0x4d3b26);
    g.fillStyle(0xffd84d, 1);
    g.fillEllipse(96, 98, 105, 70);
    g.strokeEllipse(96, 98, 105, 70);
    g.lineStyle(10, 0x4d3b26, 1);
    g.lineBetween(72, 68, 69, 126);
    g.lineBetween(100, 64, 101, 132);
    g.lineBetween(126, 72, 123, 122);
    g.fillStyle(0x5a3d2b, 1);
    g.fillCircle(45, 95, 24);
    eye(g, 36, 88);
    eye(g, 51, 88);
  },
  ant: (g) => {
    withStroke(g, 7, 0x4b2a20);
    g.fillStyle(0x8a4a35, 1);
    g.fillCircle(55, 96, 23);
    g.strokeCircle(55, 96, 23);
    g.fillStyle(0x9d5b3d, 1);
    g.fillCircle(91, 93, 27);
    g.strokeCircle(91, 93, 27);
    g.fillStyle(0xb46b45, 1);
    g.fillEllipse(129, 96, 58, 48);
    g.strokeEllipse(129, 96, 58, 48);
    g.lineStyle(7, 0x4b2a20, 1);
    [[68, 118, 49, 145], [92, 121, 88, 149], [112, 118, 130, 145], [68, 72, 49, 45], [92, 66, 88, 35], [112, 72, 130, 45]].forEach(([x1, y1, x2, y2]) => g.lineBetween(x1, y1, x2, y2));
    eye(g, 49, 88);
    eye(g, 61, 88);
  },
  caterpillar: (g) => {
    withStroke(g, 7, 0x326b34);
    [48, 78, 108, 137].forEach((x, index) => {
      g.fillStyle(index % 2 === 0 ? 0x78d957 : 0x8ee86b, 1);
      g.fillCircle(x, 96 + (index === 3 ? 5 : 0), index === 1 ? 31 : 28);
      g.strokeCircle(x, 96 + (index === 3 ? 5 : 0), index === 1 ? 31 : 28);
    });
    eye(g, 39, 88);
    eye(g, 55, 88);
    smile(g, 48, 103, 15);
  },
  snail: (g) => {
    withStroke(g, 7, 0x416b38);
    g.fillStyle(0x9bd77d, 1);
    g.fillRoundedRect(30, 99, 122, 34, 18);
    g.strokeRoundedRect(30, 99, 122, 34, 18);
    withStroke(g, 7, 0x7a4c28);
    g.fillStyle(0xe8a35f, 1);
    g.fillCircle(86, 80, 39);
    g.strokeCircle(86, 80, 39);
    g.lineStyle(6, 0x7a4c28, 1);
    g.strokeCircle(86, 80, 21);
    g.lineStyle(5, 0x416b38, 1);
    g.lineBetween(126, 100, 151, 49);
    g.lineBetween(112, 100, 129, 52);
    eye(g, 151, 49);
    eye(g, 129, 52);
  },
  frog: (g) => {
    withStroke(g, 8, 0x2f7437);
    g.fillStyle(0x62cc69, 1);
    g.fillEllipse(90, 99, 100, 80);
    g.strokeEllipse(90, 99, 100, 80);
    g.fillCircle(64, 64, 22);
    g.strokeCircle(64, 64, 22);
    g.fillCircle(114, 64, 22);
    g.strokeCircle(114, 64, 22);
    eye(g, 64, 63);
    eye(g, 114, 63);
    smile(g, 90, 102, 28);
    g.fillStyle(0xf79abb, 0.72);
    g.fillCircle(52, 96, 8);
    g.fillCircle(128, 96, 8);
  },
  bird: (g) => {
    withStroke(g, 8, 0x2e5f98);
    g.fillStyle(0x68b7ff, 1);
    g.fillEllipse(94, 96, 95, 78);
    g.strokeEllipse(94, 96, 95, 78);
    g.fillCircle(64, 66, 27);
    g.strokeCircle(64, 66, 27);
    g.fillStyle(0xffb347, 1);
    g.lineStyle(6, 0x8a5a1e, 1);
    g.fillTriangle(41, 67, 15, 55, 20, 80);
    g.strokeTriangle(41, 67, 15, 55, 20, 80);
    eye(g, 61, 59);
    g.fillStyle(0xa9d7ff, 1);
    g.lineStyle(7, 0x2e5f98, 1);
    g.fillEllipse(113, 97, 58, 35);
    g.strokeEllipse(113, 97, 58, 35);
  }
};

export const createAnimalTextures = (scene: Phaser.Scene) => {
  for (const [id, paint] of Object.entries(painters)) {
    const key = `animal-${id}`;
    if (scene.textures.exists(key)) {
      continue;
    }
    const graphics = scene.add.graphics();
    paint(graphics);
    graphics.generateTexture(key, SIZE, SIZE);
    graphics.destroy();
  }
};
