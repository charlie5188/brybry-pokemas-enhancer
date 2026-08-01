import { readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { buildUserscript } from './build.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(projectRoot, 'brybry-enhancer.user.js');
const committedOutput = await readFile(outputPath, 'utf8');
const rebuiltOutput = await buildUserscript({ write: false });

if (!committedOutput.startsWith('// ==UserScript==\n')) {
  throw new Error('Generated userscript metadata header is missing or is not at byte zero.');
}
if (!committedOutput.includes('// ==/UserScript==')) {
  throw new Error('Generated userscript metadata footer is missing.');
}
new vm.Script(committedOutput, { filename: 'brybry-enhancer.user.js' });
if (committedOutput !== rebuiltOutput) {
  throw new Error('brybry-enhancer.user.js is stale. Run npm run build and commit the generated file.');
}

const compatibilityContract = [
  'brybry-enhancer-picker-preferences',
  'brybry-enhancer-sync-grid-builds',
  'brybry-enhancer-spoiler-redirect',
  './data/proto/Trainer.json',
  './data/proto/Move.json',
  './data/proto/AbilityPanel.json',
  './data/proto/PassiveSkillChild.json',
  '#pairSearchModal',
  'syncPairSelect',
  'syncGridDiv',
  'lastReleasedPairs',
];
for (const requiredValue of compatibilityContract) {
  if (!committedOutput.includes(requiredValue)) {
    throw new Error(`Compatibility contract value is missing: ${requiredValue}`);
  }
}
for (const metadataValue of [
  '// @homepageURL  https://github.com/charlie5188/brybry-pokemas-enhancer',
  '// @downloadURL  https://raw.githubusercontent.com/charlie5188/brybry-pokemas-enhancer/main/brybry-enhancer.user.js',
  '// @updateURL    https://raw.githubusercontent.com/charlie5188/brybry-pokemas-enhancer/main/brybry-enhancer.user.js',
]) {
  if (!committedOutput.includes(metadataValue)) throw new Error(`Release metadata is missing: ${metadataValue}`);
}

const stateSource = await readFile(path.join(projectRoot, 'src/state.js'), 'utf8');
for (const defaultValue of [
  "let sortCriterion = 'updated';",
  "let sortDirection = 'desc';",
  "let viewMode = 'icons';",
  'let spoilerProtectionEnabled = false;',
]) {
  if (!stateSource.includes(defaultValue)) throw new Error(`Default behavior changed: ${defaultValue}`);
}

const supportedLocales = ['en', 'fr', 'de', 'es', 'it', 'ja', 'ko', 'zh'];
const localeSource = await readFile(path.join(projectRoot, 'src/i18n.js'), 'utf8');
for (const locale of supportedLocales) {
  if (!localeSource.includes(`  ${locale}: {`)) throw new Error(`UI locale is missing: ${locale}`);
  for (const kind of ['skills', 'moves']) {
    const abbreviationPath = path.join(projectRoot, `src/data/pomatools-abbreviations/${locale}-${kind}.json`);
    const abbreviations = JSON.parse(await readFile(abbreviationPath, 'utf8'));
    if (!Object.keys(abbreviations).length) throw new Error(`PomaTools abbreviation data is empty: ${locale}-${kind}`);
  }
}

const parserSource = await readFile(path.join(projectRoot, 'src/data/template-parser.js'), 'utf8');
const parserContext = {};
vm.createContext(parserContext);
vm.runInContext(`${parserSource}\nthis.createBrybryTemplateResolverForCheck = createBrybryTemplateResolver; this.matchDocumentsForCheck = brybryDocumentsMatchPatterns; this.masterPassiveKindForCheck = brybryMasterPassiveKind;`, parserContext);
const parameterEntry = (id, values) => Object.fromEntries([
  ['id', id],
  ...values.flatMap((value, index) => [[`param${index * 2 + 1}`, value === null ? '-1' : '1'], [`param${index * 2 + 2}`, value ?? '']]),
]);
const circleParts = {
  999281: 'Increases the [Name:ReferencedMessageTag Idx="7" ] by [Digit:1digit Idx="8" ] [EN:Qty Ref="8" S="rank" P="ranks" ].',
  999287: 'Applies [Name:ReferencedMessageTag Idx="9" ] to the allied field of play.',
};
const circleDescriptions = {
  8206: '[Name:MoveDescriptionPartsIdTag Idx="999281" ] [Name:MoveDescriptionPartsIdTag Idx="999287" ]',
  8201: '[Name:MoveDescriptionPartsIdTag Idx="999281" ] [Name:MoveDescriptionPartsIdTag Idx="999287" ]',
  8202: '[Name:MoveDescriptionPartsIdTag Idx="999287" ]',
  2: 'No additional effect.',
};
const circleParameters = new Map([
  ['8206', parameterEntry('8206', ['10', 'per_5', '20020003', '10', 'per_3', '40', '14', '40000228', '1', '40000369'])],
  ['8201', parameterEntry('8201', ['10', 'per_5', '20020001', '10', 'per_3', '40', '14', '40000229', '1', '40000364'])],
  ['8202', parameterEntry('8202', ['per_5', '10', '20020001', 'per_5', 'per_5', '20', '25', '1', '40000229', '40000365'])],
]);
const circleResolver = parserContext.createBrybryTemplateResolverForCheck({
  parametersById: circleParameters,
  numbers: { 1: 'one', 10: '10', per_5: '5', per_3: '3', 40: '40', 14: '14' },
  referencedMessages: {
    40000228: 'Physical Moves ↑ Next effect',
    40000229: 'Special Moves ↑ Next effect',
    40000369: 'Hoenn Circle (Physical)',
    40000364: 'Kanto Circle (Special)',
    40000365: 'Kanto Circle (Defensive)',
  },
  moveNames: {}, passiveNames: {}, passiveNameParts: {}, moveDescriptions: circleDescriptions,
  moveDescriptionParts: circleParts, passiveDescriptions: {}, passiveDescriptionParts: {},
});
const knownPairs = [
  { trainerId: '10019900000', moveId: '8206', circle: 'physical' },
  { trainerId: '10110900000', moveId: '8201', circle: 'special' },
  { trainerId: '10015000001', moveId: '8202', circle: 'defensive' },
  { trainerId: '10000000000', moveId: '2', circle: null },
];
for (const pair of knownPairs) {
  const resolved = circleResolver.resolveMoveDescription(pair.moveId).toLowerCase();
  assert.equal(resolved.includes('circle'), Boolean(pair.circle), `${pair.trainerId}: broad Circle match`);
  for (const type of ['physical', 'special', 'defensive']) {
    assert.equal(resolved.includes(`circle (${type})`), pair.circle === type, `${pair.trainerId}: ${type} Circle match`);
  }
}
assert.match(
  circleResolver.resolvePlaceholders('missing', 'Keeps [Name:ReferencedMessageTag Idx="0" ] safely.'),
  /\[Name:ReferencedMessageTag/,
  'Unresolved placeholders must be preserved for safe fallback.',
);
const sleepInflictionPatterns = [['puts', 'target', 'sleep'], ['putting', 'target', 'sleep'], ['puts', 'opposing', 'sleep']];
assert.equal(parserContext.matchDocumentsForCheck(['Puts the target to sleep.'], sleepInflictionPatterns), true);
assert.equal(parserContext.matchDocumentsForCheck(['Prevents all allied sync pairs from falling asleep.'], sleepInflictionPatterns), false);
const trapInflictionPatterns = [['leaves', 'target', 'trapped'], ['leaving', 'target', 'trapped'], ['leaves', 'opposing', 'trapped']];
assert.equal(parserContext.matchDocumentsForCheck(['Leaves the target trapped.'], trapInflictionPatterns), true);
assert.equal(parserContext.matchDocumentsForCheck([
  'Raises the chance of inflicting the flinching, confused, or trapped condition with the additional effects of moves.',
  'Removes the trapped condition from the user.',
], trapInflictionPatterns), false, 'Trap modifiers and self-cleansing must not count as trap infliction.');
const mortalSpinDocument = 'Mortal Spin Leaves the target poisoned. Removes a damage field from the allied field of play. Removes the trapped condition from the user.';
assert.equal(
  parserContext.matchDocumentsForCheck([mortalSpinDocument], trapInflictionPatterns),
  false,
  'Terms from separate effects of Mortal Spin must not combine into trap infliction.',
);
assert.equal(
  parserContext.matchDocumentsForCheck([mortalSpinDocument], [['leaves', 'target', 'poisoned']]),
  true,
  'Sentence-level matching must preserve Mortal Spin’s real poison capability.',
);
const capabilityPatternChecks = [
  ['poison', [['leaves', 'target', 'poisoned']], 'Leaves the target poisoned.'],
  ['burn', [['leaves', 'target', 'burned']], 'Leaves the target burned.'],
  ['paralysis', [['leaves', 'target', 'paralyzed']], 'Leaves the target paralyzed.'],
  ['sleep', [['puts', 'target', 'sleep']], 'Puts the target to sleep.'],
  ['freeze', [['leaves', 'target', 'frozen']], 'Leaves the target frozen.'],
  ['flinch', [['makes', 'target', 'flinch']], 'Makes the target flinch.'],
  ['confusion', [['leaves', 'target', 'confused']], 'Leaves the target confused.'],
  ['trap', trapInflictionPatterns, 'Leaves the target trapped.'],
];
const nonInflictingDocuments = [
  'Raises the chance of inflicting status conditions with the additional effects of the user’s moves.',
  'Raises the chance of inflicting the flinching, confused, or trapped condition with the additional effects of the user’s moves.',
  'Removes all status conditions from the user.',
  'Removes the flinching, confused, and trapped conditions from the user.',
  'Prevents the user from getting poisoned, burned, paralyzed, frozen, or falling asleep.',
  'Prevents the user from flinching, becoming confused, or becoming trapped.',
];
for (const [name, patterns, positiveDocument] of capabilityPatternChecks) {
  assert.equal(parserContext.matchDocumentsForCheck([positiveDocument], patterns), true, `${name}: explicit infliction must match.`);
  assert.equal(
    parserContext.matchDocumentsForCheck(nonInflictingDocuments, patterns),
    false,
    `${name}: modifiers, cleansing, and prevention must not count as infliction.`,
  );
}
const dataIndexSource = await readFile(path.join(projectRoot, 'src/data/index.js'), 'utf8');
assert.match(
  dataIndexSource,
  /pairSkillSearchDocuments\(pair, categoryLocale, false\)/,
  'Capability filters must only evaluate directly owned passives, not implementation child effects.',
);
const pickerSource = await readFile(path.join(projectRoot, 'src/picker/index.js'), 'utf8');
assert.match(
  pickerSource,
  /panel\.append\(\s*typeSection,\s*weaknessSection,\s*moveTypeSection,/,
  'Damaging move type must appear immediately after weakness filters.',
);
assert.match(
  pickerSource,
  /accordionSection\('region', text\(\)\.region, regionRow, \{ defaultOpen: true \}\)/,
  'Region filters must be expanded by default.',
);
assert.match(pickerSource, /accordionSection\('weakness'/, 'Weakness filters must be collapsible.');
assert.match(pickerSource, /accordionSection\('superawakening'/, 'Superawakening filters must be collapsible.');
assert.match(
  pickerSource,
  /queuePairRender\(FILTER_RENDER_DELAY_MS\)/,
  'Three-state filters must debounce expensive result rendering.',
);
assert.match(
  pickerSource,
  /parentValues\[0\] === 'status'/,
  'Status effects must render one parent category per row.',
);
assert.match(pickerSource, /parentValues\[0\] === 'weather'/, 'Field effects must render one parent category per row.');
assert.match(pickerSource, /parentValues\[0\] === 'statUp'/, 'Stat changes must render one parent category per row.');
const configSource = await readFile(path.join(projectRoot, 'src/config.js'), 'utf8');
assert.match(configSource, /FILTER_RENDER_DELAY_MS = 500/, 'Filter rendering must wait through a normal double-click window.');
assert.match(configSource, /\['exFairyZone', 'zoneEx'/, 'EX Zone child filters must be declared.');
assert.match(configSource, /iconOnly: true, exVariant:/, 'Concrete field-effect children must use icon buttons.');
assert.match(
  pickerSource,
  /category\.value !== 'masterPassive'/,
  'Master Passive must not render a redundant All filter button.',
);
assert.doesNotMatch(pickerSource, /battleTitle/, 'The redundant Battle Features heading must not render.');
assert.doesNotMatch(pickerSource, /clickTo(?:Include|Exclude|Clear)/, 'Filter tooltips must not contain click instructions.');
assert.match(pickerSource, /document\.createElement\('form'\)/, 'The filter controls must use a semantic form container.');
assert.match(pickerSource, /be-accordion-content/, 'Every accordion item must wrap its content consistently.');
for (const group of ['type', 'role', 'exRole', 'rarity']) {
  assert.match(pickerSource, new RegExp(`accordionSection\\('${group}'`), `${group} must use the shared accordion component.`);
}
for (const group of ['weather', 'statUp', 'status', 'masterPassive']) {
  assert.match(pickerSource, new RegExp(`skill-\\$\\{parentValues\\[0\\]\\}`), `${group} categories must use the shared accordion component.`);
}
const storageSource = await readFile(path.join(projectRoot, 'src/storage.js'), 'utf8');
assert.match(storageSource, /openFilterAccordions: \[\.\.\.openFilterAccordions\]/, 'Open accordion preferences must persist.');
assert.match(storageSource, /closedFilterAccordions: \[\.\.\.closedFilterAccordions\]/, 'Closed accordion preferences must persist.');
const stylesSource = await readFile(path.join(projectRoot, 'src/styles.css'), 'utf8');
assert.doesNotMatch(
  stylesSource,
  /\.be-skill-battle-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2/s,
  'Battle feature groups must remain a single-column layout.',
);
assert.doesNotMatch(stylesSource, /border-style:\s*dashed/, 'Interactive filter buttons must use consistent solid borders.');
assert.match(stylesSource, /summary\.be-accordion-trigger:focus-visible/, 'Accordion triggers must expose a keyboard focus state.');
assert.match(stylesSource, /\.be-accordion-chevron/, 'Accordion triggers must use a consistent chevron affordance.');
assert.match(
  stylesSource,
  /\.be-filter-sidebar > \.be-picker-tools\s*\{[^}]*position:\s*sticky/s,
  'The filter reset and result count toolbar must remain sticky on desktop.',
);
const attackUpPatterns = [['raises', 'attack', 'stat rank']];
assert.equal(parserContext.matchDocumentsForCheck(['Raises the user’s Attack by six stat ranks.'], attackUpPatterns), true);
assert.equal(parserContext.matchDocumentsForCheck([
  'Raises the chance of additional effects.',
  'The user’s Attack is protected from stat rank reduction.',
], attackUpPatterns), false, 'Category terms from separate skills must not be combined.');
assert.equal(
  parserContext.matchDocumentsForCheck(['Raises the user’s Sp. Atk by six stat ranks.'], [['raises', 'sp. atk', 'stat rank']]),
  true,
  'Sentence segmentation must preserve abbreviated stat names.',
);
const fieldDetailPatternChecks = [
  ['sunny weather', [['makes the weather sunny']], 'Makes the weather sunny.'],
  ['rainy weather', [['makes the weather rainy']], 'Makes the weather rainy.'],
  ['sandstorm', [['causes a sandstorm']], 'Causes a sandstorm.'],
  ['hailstorm', [['causes a hailstorm']], 'Causes a hailstorm.'],
  ['Electric Terrain', [['terrain into electric terrain']], 'Turns the field of play’s terrain into Electric Terrain.'],
  ['Fairy Zone', [['zone into a fairy zone']], 'Turns the field of play’s zone into a Fairy Zone.'],
];
for (const [name, patterns, document] of fieldDetailPatternChecks) {
  assert.equal(parserContext.matchDocumentsForCheck([document], patterns), true, `${name}: concrete field effect must match.`);
}
assert.equal(
  parserContext.matchDocumentsForCheck(['Makes the weather EX sunny.'], [['makes the weather sunny']]),
  false,
  'Ordinary sunny weather must not match EX sunny weather.',
);
assert.equal(
  parserContext.matchDocumentsForCheck(['Makes the weather EX sunny.'], [['ex sunny']]),
  true,
  'EX sunny weather must match its concrete EX child filter.',
);
assert.equal(
  parserContext.matchDocumentsForCheck(['Makes the weather sunny.'], [['ex sunny']]),
  false,
  'Ordinary sunny weather must not match the EX sunny child filter.',
);
const exZonePatterns = [
  ['ex normal zone'], ['ex ice zone'], ['ex fighting zone'], ['ex poison zone'],
  ['ex ground zone'], ['ex flying zone'], ['ex bug zone'], ['ex rock zone'],
  ['ex ghost zone'], ['ex dragon zone'], ['ex dark zone'], ['ex steel zone'], ['ex fairy zone'],
];
assert.equal(
  parserContext.matchDocumentsForCheck(['Turns the field of play’s zone into an EX Ice Zone.'], exZonePatterns),
  true,
  'A concrete EX Zone must match the EX Zone category.',
);
assert.equal(
  parserContext.matchDocumentsForCheck([
    'Turns the field of play’s zone into an Ice Zone. The user has an EX Role.',
  ], exZonePatterns),
  false,
  'An ordinary Zone must not match EX Zone because of unrelated EX text.',
);
assert.equal(parserContext.masterPassiveKindForCheck('28012501', 'Pasio Flagbearer'), 'general', 'Sygna Suit Lear must match Master Passive.');
assert.equal(parserContext.masterPassiveKindForCheck('28010201', 'Hoenn Pride'), 'physical');
assert.equal(parserContext.masterPassiveKindForCheck('28010301', 'Hoenn Spirit'), 'special');
assert.equal(parserContext.masterPassiveKindForCheck('28040101', 'Galar’s Shining Ace'), 'general', 'New named Master Passives remain supported.');
assert.equal(parserContext.masterPassiveKindForCheck('18021001', 'Sand Fortress'), '', 'Acerola must not match Master Passive.');
assert.equal(parserContext.masterPassiveKindForCheck('99023201', 'The Competitive Heir'), '', 'Ortega must not match Master Passive.');

const gridSource = await readFile(path.join(projectRoot, 'src/grid/index.js'), 'utf8');
const gridContext = {
  SYNC_POWER_TILE_LABELS: {
    en: 'Sync: Power +{value}',
    ja: 'B技: 威力+{value}',
  },
  moveInfoByCellId: new Map(),
  tileAbbreviationByCellId: new Map(),
  language: () => 'ja',
  requestAnimationFrame: () => {},
};
vm.createContext(gridContext);
vm.runInContext(`${gridSource}\nthis.syncPowerTileLabelForCheck = syncPowerTileLabel; this.displayTileNameForCheck = displayTileName;`, gridContext);
assert.equal(gridContext.syncPowerTileLabelForCheck({ isSyncPowerBoost: true, abilityValue: 25 }, 'ja'), 'B技: 威力+25');
assert.equal(gridContext.syncPowerTileLabelForCheck({ isSyncPowerBoost: true, abilityValue: 40 }, 'en'), 'Sync: Power +40');
assert.equal(gridContext.syncPowerTileLabelForCheck({ isSyncPowerBoost: false, abilityValue: 25 }, 'ja'), '');
const syncTile = { dataset: { cellId: 'sync-power', tileName: 'Full Sync Move Name: Power +25' } };
gridContext.moveInfoByCellId.set('sync-power', { isSyncPowerBoost: true, abilityValue: 25 });
assert.equal(gridContext.displayTileNameForCheck(syncTile, syncTile.dataset.tileName), 'B技: 威力+25');
assert.equal(syncTile.dataset.tileName, 'Full Sync Move Name: Power +25', 'Full Sync Move name must remain available to the tooltip.');
const regularTile = { dataset: { cellId: 'regular-power', tileName: 'Thunderbolt: Power +3' } };
gridContext.moveInfoByCellId.set('regular-power', { isSyncPowerBoost: false, abilityValue: 3 });
assert.equal(gridContext.displayTileNameForCheck(regularTile, regularTile.dataset.tileName), 'Thunderbolt: Power +3');

console.log('Check passed: build, metadata, syntax and committed artifact are valid.');
