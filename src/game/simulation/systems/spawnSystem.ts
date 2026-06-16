import { ANIMALS } from '../../content/animals';
import type { AnimalDefinition } from '../../content/animals';
import type { AnimalEntity, GameState, WorldBounds } from '../state';

const TARGET_MIN = 3;
const TARGET_MAX = 4;

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

const chooseAnimal = (existing: AnimalEntity[]) => {
  const usedIds = new Set(existing.map((entity) => entity.definition.id));
  const candidates = ANIMALS.filter((animal) => !usedIds.has(animal.id));
  const pool = candidates.length > 0 ? candidates : ANIMALS;
  return pool[Math.floor(Math.random() * pool.length)];
};

const chooseY = (definition: AnimalDefinition, bounds: WorldBounds) => {
  if (definition.movementType === 'fly') {
    return randomBetween(bounds.height * 0.2, bounds.height * 0.62);
  }
  if (definition.movementType === 'hop') {
    return randomBetween(bounds.height * 0.56, bounds.groundY);
  }
  return randomBetween(bounds.height * 0.66, bounds.groundY);
};

const hasEnoughSpace = (entity: AnimalEntity, existing: AnimalEntity[]) =>
  existing.every((other) => {
    const distance = Math.hypot(entity.x - other.x, entity.y - other.y);
    return distance > entity.radius + other.radius + 44;
  });

const createEntity = (definition: AnimalDefinition, bounds: WorldBounds): AnimalEntity => {
  const speed = randomBetween(definition.speedRange[0], definition.speedRange[1]);
  const direction = Math.random() > 0.5 ? 1 : -1;
  const radius = definition.size * 0.42;

  return {
    id: `${definition.id}-${crypto.randomUUID()}`,
    definition,
    x: randomBetween(radius + 18, bounds.width - radius - 18),
    y: chooseY(definition, bounds),
    vx: speed * direction,
    vy: definition.movementType === 'fly' ? randomBetween(-10, 10) : 0,
    phase: randomBetween(0, Math.PI * 2),
    nextHopAt: randomBetween(0.4, 1.6),
    radius
  };
};

export const maintainAnimalPopulation = (state: GameState) => {
  const target = TARGET_MIN + Math.floor(Math.random() * (TARGET_MAX - TARGET_MIN + 1));

  while (state.animals.length < target) {
    const definition = chooseAnimal(state.animals);
    let nextEntity = createEntity(definition, state.bounds);

    for (let attempt = 0; attempt < 12 && !hasEnoughSpace(nextEntity, state.animals); attempt += 1) {
      nextEntity = createEntity(definition, state.bounds);
    }

    state.animals.push(nextEntity);
  }

  if (state.animals.length > TARGET_MAX) {
    state.animals.splice(TARGET_MAX);
  }
};
