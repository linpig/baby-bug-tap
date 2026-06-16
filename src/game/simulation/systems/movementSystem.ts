import type { AnimalEntity, GameState } from '../state';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const turnAround = (entity: AnimalEntity) => {
  entity.vx *= -1;
};

const updateFlyer = (entity: AnimalEntity, deltaSeconds: number, width: number, height: number) => {
  entity.phase += deltaSeconds * 1.5;
  entity.x += entity.vx * deltaSeconds;
  entity.y += (entity.vy + Math.sin(entity.phase) * 18) * deltaSeconds;

  const minY = height * 0.18;
  const maxY = height * 0.66;
  if (entity.y < minY || entity.y > maxY) {
    entity.vy *= -1;
    entity.y = clamp(entity.y, minY, maxY);
  }
};

const updateCrawler = (entity: AnimalEntity, deltaSeconds: number, groundY: number) => {
  entity.phase += deltaSeconds * 2;
  entity.x += entity.vx * deltaSeconds;
  entity.y += Math.sin(entity.phase) * 2.4 * deltaSeconds;
  entity.y = clamp(entity.y, groundY - 120, groundY + 8);
};

const updateHopper = (entity: AnimalEntity, deltaSeconds: number, elapsedSeconds: number, groundY: number) => {
  if (elapsedSeconds >= entity.nextHopAt) {
    entity.vx *= Math.random() > 0.22 ? 1 : -1;
    entity.vy = -randomHopVelocity();
    entity.nextHopAt = elapsedSeconds + 1.25 + Math.random() * 1.2;
  }

  entity.x += entity.vx * deltaSeconds;
  entity.y += entity.vy * deltaSeconds;
  entity.vy += 170 * deltaSeconds;

  if (entity.y > groundY - 18) {
    entity.y = groundY - 18;
    entity.vy = 0;
  }
};

const randomHopVelocity = () => 92 + Math.random() * 36;

export const updateMovement = (state: GameState, deltaMs: number, elapsedMs: number) => {
  const deltaSeconds = deltaMs / 1000;
  const elapsedSeconds = elapsedMs / 1000;
  const { width, height, groundY } = state.bounds;

  for (const entity of state.animals) {
    if (entity.definition.movementType === 'fly') {
      updateFlyer(entity, deltaSeconds, width, height);
    } else if (entity.definition.movementType === 'hop') {
      updateHopper(entity, deltaSeconds, elapsedSeconds, groundY);
    } else {
      updateCrawler(entity, deltaSeconds, groundY);
    }

    const edgePadding = entity.radius + 16;
    if (entity.x < edgePadding || entity.x > width - edgePadding) {
      entity.x = clamp(entity.x, edgePadding, width - edgePadding);
      turnAround(entity);
    }
  }
};
