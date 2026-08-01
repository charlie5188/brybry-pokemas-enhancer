import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(projectRoot, 'src');
const outputPath = path.join(projectRoot, 'brybry-enhancer.user.js');
const supportedLocales = ['en', 'fr', 'de', 'es', 'it', 'ja', 'ko', 'zh'];

const sourceFiles = [
  'config.js',
  'i18n.js',
  'state.js',
  'storage.js',
  'spoiler-protection.js',
  'styles.js',
  'grid/index.js',
  'data/template-parser.js',
  'data/index.js',
  'picker/index.js',
  'index.js',
];

async function readSource(relativePath) {
  return readFile(path.join(sourceRoot, relativePath), 'utf8');
}

export async function buildUserscript({ write = true } = {}) {
  const abbreviationFiles = supportedLocales.flatMap((locale) => [
    `data/pomatools-abbreviations/${locale}-skills.json`,
    `data/pomatools-abbreviations/${locale}-moves.json`,
  ]);
  const [metadata, css, ...sources] = await Promise.all([
    readSource('metadata.txt'),
    readSource('styles.css'),
    ...abbreviationFiles.map(readSource),
    ...sourceFiles.map(readSource),
  ]);
  const abbreviationSources = sources.slice(0, abbreviationFiles.length).map((value) => JSON.parse(value));
  const modules = sources.slice(abbreviationFiles.length);
  const skillAbbreviations = Object.fromEntries(supportedLocales.map((locale, index) => [locale, abbreviationSources[index * 2]]));
  const moveAbbreviations = Object.fromEntries(supportedLocales.map((locale, index) => [locale, abbreviationSources[index * 2 + 1]]));

  const generatedData = [
    `const BRYBRY_ENHANCER_CSS = ${JSON.stringify(css)};`,
    `const POMATOOLS_SKILL_ABBR = Object.freeze(${JSON.stringify(skillAbbreviations)});`,
    `const POMATOOLS_MOVE_ABBR = Object.freeze(${JSON.stringify(moveAbbreviations)});`,
  ].join('\n');
  const input = `(() => {\n'use strict';\n${generatedData}\n${modules.join('\n')}\n})();\n`;
  const result = await build({
    bundle: true,
    charset: 'utf8',
    format: 'esm',
    legalComments: 'none',
    minify: false,
    sourcemap: false,
    stdin: {
      contents: input,
      loader: 'js',
      sourcefile: 'src/index.js',
    },
    target: ['safari15'],
    write: false,
  });
  const output = `${metadata.trimEnd()}\n\n${result.outputFiles[0].text}`;
  if (write) await writeFile(outputPath, output);
  return output;
}

async function runBuild() {
  await buildUserscript();
  console.log('Built brybry-enhancer.user.js');
}

async function sourceFingerprint(directory = sourceRoot) {
  const entries = await readdir(directory, { withFileTypes: true });
  const values = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFingerprint(entryPath);
    const details = await stat(entryPath);
    return `${entryPath}:${details.mtimeMs}:${details.size}`;
  }));
  return values.flat().sort().join('|');
}

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await runBuild();
  if (process.argv.includes('--watch')) {
    console.log('Watching src/ for changes…');
    let previousFingerprint = await sourceFingerprint();
    while (true) {
      await delay(300);
      const nextFingerprint = await sourceFingerprint();
      if (nextFingerprint === previousFingerprint) continue;
      previousFingerprint = nextFingerprint;
      await runBuild().catch((error) => console.error(error));
    }
  }
}
