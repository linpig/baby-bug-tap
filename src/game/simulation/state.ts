import type { AnimalDefinition } from '../content/animals';

export interface AnimalEntity {
  id: string;
  definition: AnimalDefinition;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  nextHopAt: number;
  radius: number;
}

export interface WorldBounds {
  width: number;
  height: number;
  groundY: number;
}

export interface GameState {
  animals: AnimalEntity[];
  bounds: WorldBounds;
}

export const createGameState = (width: number, height: number): GameState => ({
  animals: [],
  bounds: {
    width,
    height,
    groundY: Math.max(280, height * 0.76)
  }
});
