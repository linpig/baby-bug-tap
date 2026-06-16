import { ANIMALS } from '../content/animals';

export const VOICE_ASSETS = ANIMALS.map((animal) => ({
  key: animal.audioKey,
  path: `assets/audio/voice/${animal.id}.mp3`
}));

export const FX_ASSETS = [
  {
    key: 'fx-pop',
    path: 'assets/audio/fx/pop.m4a'
  }
];
