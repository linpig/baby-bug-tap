import Phaser from 'phaser';

export const playClickFeedback = (scene: Phaser.Scene, sprite: Phaser.GameObjects.Image) => {
  const glow = scene.add.circle(sprite.x, sprite.y, Math.max(sprite.displayWidth, sprite.displayHeight) * 0.44, 0xfff4a3, 0.48);
  glow.setDepth(sprite.depth - 1);

  scene.tweens.add({
    targets: glow,
    alpha: 0,
    scale: 1.45,
    duration: 320,
    ease: 'Sine.easeOut',
    onComplete: () => glow.destroy()
  });

  scene.tweens.killTweensOf(sprite);
  scene.tweens.add({
    targets: sprite,
    scale: sprite.scale * 1.18,
    duration: 110,
    yoyo: true,
    ease: 'Back.easeOut'
  });
};
