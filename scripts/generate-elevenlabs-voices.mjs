import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const cwd = process.cwd();
const envPath = path.join(cwd, '.env.local');
const outputDir = path.join(cwd, 'public', 'assets', 'audio', 'voice');

const voiceLines = [
  { id: 'butterfly', text: '蝴蝶' },
  { id: 'ladybug', text: '瓢蟲' },
  { id: 'bee', text: '蜜蜂' },
  { id: 'ant', text: '螞蟻' },
  { id: 'caterpillar', text: '毛毛蟲' },
  { id: 'snail', text: '蝸牛' },
  { id: 'frog', text: '青蛙' },
  { id: 'bird', text: '小鳥' },
  { id: 'dragonfly', text: '蜻蜓' },
  { id: 'beetle', text: '甲蟲' },
  { id: 'grasshopper', text: '蚱蜢' },
  { id: 'firefly', text: '螢火蟲' },
  { id: 'duck', text: '小鴨' },
  { id: 'rabbit', text: '兔子' },
  { id: 'cat', text: '小貓' },
  { id: 'dog', text: '小狗' },
  { id: 'turtle', text: '烏龜' },
  { id: 'chick', text: '小雞' },
  { id: 'owl', text: '貓頭鷹' },
  { id: 'squirrel', text: '松鼠' }
];

const parseEnvFile = async () => {
  try {
    const raw = await readFile(envPath, 'utf8');
    const entries = raw
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const separator = line.indexOf('=');
        if (separator === -1) {
          return null;
        }
        const key = line.slice(0, separator).trim();
        const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
        return [key, value];
      })
      .filter(Boolean);

    return Object.fromEntries(entries);
  } catch {
    return {};
  }
};

const envFromFile = await parseEnvFile();
const apiKey = process.env.ELEVENLABS_API_KEY || envFromFile.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_VOICE_ID || envFromFile.ELEVENLABS_VOICE_ID || 'hkfHEbBvdQFNX4uWHqRF';
const modelId = process.env.ELEVENLABS_MODEL_ID || envFromFile.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';

if (!apiKey) {
  console.error('Missing ELEVENLABS_API_KEY. Put it in .env.local or export it in the shell.');
  process.exit(1);
}

await mkdir(outputDir, { recursive: true });

for (const line of voiceLines) {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey
    },
    body: JSON.stringify({
      text: line.text,
      model_id: modelId,
      language_code: 'zh'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to generate ${line.id}: ${response.status} ${response.statusText}`);
    console.error(errorText);
    process.exit(1);
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  await writeFile(path.join(outputDir, `${line.id}.mp3`), audioBuffer);
  console.log(`Generated public/assets/audio/voice/${line.id}.mp3`);
}
