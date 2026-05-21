import { spawn } from 'node:child_process';
import { mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const assetsDir = path.join(root, 'assets');
const optimizedDir = path.join(assetsDir, 'optimized');
const imageExts = new Set(['.png', '.jpg', '.jpeg']);
const videoExts = new Set(['.mp4', '.mov']);

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: options.stdio || ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', chunk => {
      stdout += chunk.toString();
    });
    child.stderr?.on('data', chunk => {
      stderr += chunk.toString();
    });
    child.on('error', reject);
    child.on('close', code => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        const error = new Error(`${command} exited with ${code}\n${stderr}`);
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      }
    });
  });
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('._')) continue;
    const absolute = path.join(dir, entry.name);
    if (absolute.startsWith(optimizedDir)) continue;
    if (entry.isDirectory()) {
      files.push(...await walk(absolute));
    } else {
      files.push(absolute);
    }
  }
  return files;
}

async function cleanupAppleDoubleFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  await Promise.all(entries.map(async entry => {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await cleanupAppleDoubleFiles(absolute);
      return;
    }
    if (entry.isFile() && entry.name.startsWith('._')) {
      await rm(absolute, { force: true });
    }
  }));
}

function toPosix(relativePath) {
  return relativePath.split(path.sep).join('/');
}

function formatBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${unit ? value.toFixed(value >= 10 ? 1 : 2) : value.toFixed(0)}${units[unit]}`;
}

async function fileSize(file) {
  return (await stat(file)).size;
}

async function imageSize(file) {
  const { stdout } = await run('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file]);
  const width = Number(stdout.match(/pixelWidth:\s*(\d+)/)?.[1] || 0);
  const height = Number(stdout.match(/pixelHeight:\s*(\d+)/)?.[1] || 0);
  return { width, height };
}

async function videoSize(file) {
  const { stdout } = await run('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height',
    '-of', 'json',
    file,
  ]);
  const parsed = JSON.parse(stdout);
  const stream = parsed.streams?.[0] || {};
  return { width: Number(stream.width || 0), height: Number(stream.height || 0) };
}

function imageMaxDimension(relativePath) {
  if (relativePath.includes('/logos/Detalles adicionales/') || relativePath.includes('/icons/')) {
    return 360;
  }
  if (relativePath.includes('/logos/')) {
    return 640;
  }
  if (relativePath.includes('/carrusel-infinito/')) {
    return 720;
  }
  return 960;
}

function imageQuality(relativePath) {
  if (relativePath.includes('/logos/')) return 86;
  if (relativePath.includes('/icons/')) return 86;
  return 76;
}

function videoMaxDimension(relativePath) {
  if (relativePath.includes('mobile')) return 720;
  if (relativePath.includes('hero') || relativePath.includes('Hero') || relativePath.includes('VideoHero')) return 1280;
  if (relativePath.includes('Nuestra-historia')) return 960;
  return 720;
}

function videoCrf(relativePath) {
  if (relativePath.includes('hero') || relativePath.includes('Hero') || relativePath.includes('VideoHero')) return 27;
  if (relativePath.includes('Nuestra-historia')) return 28;
  return 29;
}

function even(value) {
  const rounded = Math.max(2, Math.round(value));
  return rounded % 2 === 0 ? rounded : rounded - 1;
}

function scaledWidth({ width, height }, maxDimension) {
  if (!width || !height) return maxDimension;
  const largest = Math.max(width, height);
  if (largest <= maxDimension) return even(width);
  return even(width * (maxDimension / largest));
}

async function optimizeImage(file) {
  const relative = toPosix(path.relative(root, file));
  const outputRelative = relative
    .replace(/^assets\//, 'assets/optimized/')
    .replace(/\.(png|jpe?g)$/i, '.webp');
  const output = path.join(root, outputRelative);
  await mkdir(path.dirname(output), { recursive: true });

  const originalBytes = await fileSize(file);
  const dimensions = await imageSize(file);
  const maxDimension = imageMaxDimension(relative);
  const shouldResize = Math.max(dimensions.width, dimensions.height) > maxDimension;
  const resizeArgs = shouldResize
    ? dimensions.width >= dimensions.height
      ? ['-resize', String(maxDimension), '0']
      : ['-resize', '0', String(maxDimension)]
    : [];

  await run('cwebp', [
    '-quiet',
    '-m', '6',
    '-q', String(imageQuality(relative)),
    '-metadata', 'none',
    ...resizeArgs,
    file,
    '-o', output,
  ]);

  const optimizedBytes = await fileSize(output);
  return {
    kind: 'image',
    original: relative,
    optimized: outputRelative,
    originalBytes,
    optimizedBytes,
    originalSize: formatBytes(originalBytes),
    optimizedSize: formatBytes(optimizedBytes),
    dimensions,
  };
}

async function optimizeVideo(file) {
  const relative = toPosix(path.relative(root, file));
  const outputRelative = relative
    .replace(/^assets\//, 'assets/optimized/')
    .replace(/\.(mp4|mov)$/i, '.mp4');
  const output = path.join(root, outputRelative);
  await mkdir(path.dirname(output), { recursive: true });

  const originalBytes = await fileSize(file);
  const dimensions = await videoSize(file);
  const maxDimension = videoMaxDimension(relative);
  const targetWidth = scaledWidth(dimensions, maxDimension);
  const crf = videoCrf(relative);

  await run('ffmpeg', [
    '-y',
    '-i', file,
    '-map', '0:v:0',
    '-map', '0:a?',
    '-vf', `scale=${targetWidth}:-2,fps=30`,
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', String(crf),
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '96k',
    '-movflags', '+faststart',
    '-map_metadata', '-1',
    output,
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  const optimizedBytes = await fileSize(output);
  return {
    kind: 'video',
    original: relative,
    optimized: outputRelative,
    originalBytes,
    optimizedBytes,
    originalSize: formatBytes(originalBytes),
    optimizedSize: formatBytes(optimizedBytes),
    dimensions,
    targetWidth,
    crf,
  };
}

async function optimizeInicioHeroMobile() {
  const originalRelative = 'assets/imagenes-inicio/VideoHero.mp4';
  const input = path.join(root, originalRelative);
  const outputRelative = 'assets/optimized/imagenes-inicio/VideoHero-mobile.mp4';
  const output = path.join(root, outputRelative);
  await mkdir(path.dirname(output), { recursive: true });

  const originalBytes = await fileSize(input);
  const dimensions = await videoSize(input);

  await run('ffmpeg', [
    '-y',
    '-i', input,
    '-map', '0:v:0',
    '-vf', "scale='min(720,iw)':-2,fps=24",
    '-an',
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '32',
    '-movflags', '+faststart',
    '-pix_fmt', 'yuv420p',
    '-map_metadata', '-1',
    output,
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  const optimizedBytes = await fileSize(output);
  return {
    kind: 'video',
    derivative: 'mobile',
    original: originalRelative,
    optimized: outputRelative,
    originalBytes,
    optimizedBytes,
    originalSize: formatBytes(originalBytes),
    optimizedSize: formatBytes(optimizedBytes),
    dimensions,
    targetWidth: 720,
    crf: 32,
  };
}

const allFiles = await walk(assetsDir);
const images = allFiles.filter(file => imageExts.has(path.extname(file).toLowerCase()));
const videos = allFiles.filter(file => videoExts.has(path.extname(file).toLowerCase()));

const results = [];
let index = 0;

for (const file of images) {
  index += 1;
  const result = await optimizeImage(file);
  results.push(result);
  console.log(`[image ${index}/${images.length}] ${result.originalSize} -> ${result.optimizedSize} ${result.original}`);
}

index = 0;
for (const file of videos) {
  index += 1;
  const result = await optimizeVideo(file);
  results.push(result);
  console.log(`[video ${index}/${videos.length}] ${result.originalSize} -> ${result.optimizedSize} ${result.original}`);
}

const derivatives = [
  await optimizeInicioHeroMobile(),
];
derivatives.forEach(result => {
  console.log(`[derivative] ${result.originalSize} -> ${result.optimizedSize} ${result.optimized}`);
});

const summary = {
  generatedAt: new Date().toISOString(),
  files: Object.fromEntries(results.map(item => [item.original, item])),
  derivatives: Object.fromEntries(derivatives.map(item => [item.optimized, item])),
  totals: {
    originalBytes: results.reduce((sum, item) => sum + item.originalBytes, 0),
    optimizedBytes: [...results, ...derivatives].reduce((sum, item) => sum + item.optimizedBytes, 0),
  },
};
summary.totals.originalSize = formatBytes(summary.totals.originalBytes);
summary.totals.optimizedSize = formatBytes(summary.totals.optimizedBytes);

await writeFile(path.join(optimizedDir, 'asset-map.json'), `${JSON.stringify(summary, null, 2)}\n`);
await cleanupAppleDoubleFiles(optimizedDir);
console.log(`[done] ${summary.totals.originalSize} -> ${summary.totals.optimizedSize}`);
