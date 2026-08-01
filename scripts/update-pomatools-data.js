import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const sourceRoot = process.argv[2];
if (!sourceRoot) {
  throw new Error('Usage: node scripts/update-pomatools-data.js /path/to/pomatools.github.io');
}

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.join(projectRoot, 'src/data/pomatools-abbreviations');
const localeFiles = { en: 'en', fr: 'fr', de: 'de', es: 'es', it: 'it', ja: 'ja', ko: 'ko', zh: 'zh' };

await mkdir(outputRoot, { recursive: true });

for (const [locale, sourceLocale] of Object.entries(localeFiles)) {
  const sourcePath = path.join(sourceRoot, 'assets/i18n', `${sourceLocale}.json`);
  const source = JSON.parse(await readFile(sourcePath, 'utf8'));
  for (const [kind, section] of [['skills', 'SKILLS'], ['moves', 'MOVES']]) {
    const abbreviations = Object.fromEntries(Object.entries(source.DATA[section] || {})
      .filter(([, entry]) => entry.ABBR && entry.ABBR !== entry.NAME)
      .map(([id, entry]) => [id, entry.ABBR]));
    const outputPath = path.join(outputRoot, `${locale}-${kind}.json`);
    await writeFile(outputPath, `${JSON.stringify(abbreviations, null, 2)}\n`);
  }
}

console.log(`Updated PomaTools abbreviations in ${outputRoot}`);
