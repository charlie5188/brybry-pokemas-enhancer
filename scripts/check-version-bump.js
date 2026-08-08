import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseRef = process.argv[2];
if (!baseRef) throw new Error('Usage: node scripts/check-version-bump.js <base-ref>');

const git = (...args) => execFileSync('git', args, { cwd: projectRoot, encoding: 'utf8' }).trim();
const changedSourceFiles = git('diff', '--name-only', `${baseRef}...HEAD`, '--', 'src/')
  .split('\n')
  .filter((file) => file && file !== 'src/metadata.txt');

if (!changedSourceFiles.length) {
  console.log('Version bump check skipped: no product source changes.');
  process.exit(0);
}

const currentPackage = JSON.parse(await readFile(path.join(projectRoot, 'package.json'), 'utf8'));
const basePackage = JSON.parse(git('show', `${baseRef}:package.json`));
const parseVersion = (version) => {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) throw new Error(`Expected a stable semantic version, received ${version}.`);
  return match.slice(1).map(Number);
};
const [baseMajor, baseMinor, basePatch] = parseVersion(basePackage.version);
const [currentMajor, currentMinor, currentPatch] = parseVersion(currentPackage.version);

if (currentMajor !== baseMajor || currentMinor !== baseMinor || currentPatch !== basePatch + 1) {
  throw new Error(
    `Product source changed, so package.json must increment the patch version exactly once: ${basePackage.version} -> ${baseMajor}.${baseMinor}.${basePatch + 1}.`,
  );
}

console.log(`Version bump check passed: ${basePackage.version} -> ${currentPackage.version}.`);
