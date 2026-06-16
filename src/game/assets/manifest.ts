import { MODE_ITEMS } from '../content/animals';

const allItems = Object.values(MODE_ITEMS).flat();
const voicedItems = allItems.filter((item) => item.audioKey);
const seenVoiceKeys = new Set<string>();

export const VOICE_ASSETS = voicedItems
  .filter((item) => {
    if (seenVoiceKeys.has(item.audioKey)) {
      return false;
    }
    seenVoiceKeys.add(item.audioKey);
    return true;
  })
  .map((item) => ({
    key: item.audioKey,
    path: `assets/audio/voice/${item.id}.mp3`
  }));

export const FX_ASSETS = [
  {
    key: 'fx-pop',
    path: 'assets/audio/fx/pop.m4a'
  }
];
