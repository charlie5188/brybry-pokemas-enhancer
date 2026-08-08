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
const packageManifest = JSON.parse(await readFile(path.join(projectRoot, 'package.json'), 'utf8'));
const packageLock = JSON.parse(await readFile(path.join(projectRoot, 'package-lock.json'), 'utf8'));
const metadataSource = await readFile(path.join(projectRoot, 'src/metadata.txt'), 'utf8');
const metadataVersion = metadataSource.match(/^\/\/ @version\s+(\S+)$/m)?.[1];

if (!metadataVersion) throw new Error('src/metadata.txt is missing a valid @version value.');
for (const [location, version] of [
  ['package.json', packageManifest.version],
  ['package-lock.json', packageLock.version],
  ['package-lock.json root package', packageLock.packages?.['']?.version],
]) {
  if (version !== metadataVersion) {
    throw new Error(`Version mismatch: src/metadata.txt is ${metadataVersion}, but ${location} is ${version}.`);
  }
}

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
  /accordionSection\('region', text\(\)\.region, regionRow, \{[\s\S]{0,80}defaultOpen: true/,
  'Region filters must be expanded by default.',
);
assert.match(pickerSource, /accordionSection\('weakness'/, 'Weakness filters must be collapsible.');
assert.match(pickerSource, /accordionSection\('superawakening'/, 'Superawakening filters must be collapsible.');
assert.match(
  pickerSource,
  /acquisitionGroups\.append\(scoutCluster, otherAcquisitionCluster\)/,
  'Acquisition must render Scout and its child types as a grouped parent-child cluster.',
);
assert.match(pickerSource, /EXCLUSIVITY_OPTIONS\.forEach\(\(option\) => scoutCluster\.append/, 'Scout types must render beside their Scout parent.');
assert.match(
  pickerSource,
  /group: 'exclusivity',[\s\S]{0,80}detail: true/,
  'Scout type children must use the detail-button treatment.',
);
assert.doesNotMatch(
  pickerSource,
  /const exclusivitySection = accordionSection/,
  'Scout type must not render as a separate accordion.',
);
assert.match(
  pickerSource,
  /active: acquisitionActive/,
  'Stored Scout-type selections must open the merged Acquisition accordion.',
);
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
const i18nSource = await readFile(path.join(projectRoot, 'src/i18n.js'), 'utf8');
const configRuntime = {};
new vm.Script(`
  const STATUS_CONDITION_DEFENSE_ICON_SRC = '';
  const NO_STAT_INCREASES_ICON_SRC = '';
  ${configSource}
  globalThis.skillFilterCategoriesForCheck = SKILL_FILTER_CATEGORIES;
`).runInNewContext(configRuntime);
assert.ok(configRuntime.skillFilterCategoriesForCheck.length > 0, 'Skill filter configuration must initialize without throwing.');
assert.equal(
  configRuntime.skillFilterCategoriesForCheck.find((category) => category.value === 'statUp')?.labels?.ja,
  '能力↑',
  'Direct parent labels such as statUp must not be treated as derived detail labels.',
);
assert.match(configSource, /FILTER_RENDER_DELAY_MS = 500/, 'Filter rendering must wait through a normal double-click window.');
assert.match(configSource, /\['exFairyZone', 'zoneEx'/, 'EX Zone child filters must be declared.');
assert.match(configSource, /value: 'circle', group: 'field',\s*\n\s*labels:/, 'Circle parent filter must remain text-only.');
for (const circleIcon of ['icon_stat_atk', 'icon_stat_spa', 'icon_stat_hp']) {
  assert.match(configSource, new RegExp(`${circleIcon}\\.png`), `${circleIcon} must be used by a Circle child filter.`);
}
for (const circleFilter of ['circlePhysical', 'circleSpecial', 'circleDefensive']) {
  assert.match(
    configSource,
    new RegExp(`${circleFilter}: \\{[^}]*iconOnly: false`),
    `${circleFilter} must show its text label beside the icon.`,
  );
}
for (const damageFieldIcon of ['Fire', 'Poison', 'Rock', 'Dark', 'Steel']) {
  assert.match(
    configSource,
    new RegExp(`${damageFieldIcon}_Damage_Field_icon_Masters\\.png`),
    `${damageFieldIcon} Damage Field must use its dedicated game icon.`,
  );
}
for (const fieldEffect of [
  'physicalDamageReduction', 'specialDamageReduction', 'criticalHitDefense',
  'statusConditionDefense', 'statusMoveDefense', 'statReductionDefense',
  'moveGaugeAcceleration', 'fireDamageField',
  'poisonDamageField', 'rockDamageField', 'darkDamageField', 'steelDamageField',
  'noStatIncreases',
]) {
  assert.match(configSource, new RegExp(`\\['${fieldEffect}',`), `${fieldEffect} field-effect filter must be declared.`);
}
assert.match(configSource, /iconOnly: icon\.iconOnly !== false, exVariant:/, 'Concrete field-effect children must use icons while allowing labeled exceptions.');
for (const iconCode of ['FILD_001', 'FILD_002', 'FILD_004', 'FILD_008', 'FILD_016', 'FILD_032']) {
  assert.match(configSource, new RegExp(`${iconCode}\\.png`), `${iconCode} game field-effect icon must be used.`);
}
assert.match(configSource, /statusConditionDefense: \{ iconSrc: STATUS_CONDITION_DEFENSE_ICON_SRC \}/, 'Status Condition Defense must use the embedded user-provided icon.');
assert.match(configSource, /statusMoveDefense: \{ iconSrc: '[^']*\/FILD_032\.png' \}/, 'Status Move Defense must use FILD_032.');
assert.match(configSource, /statReductionDefense: \{ iconSrc: '[^']*\/FILD_016\.png' \}/, 'Stat Reduction Defense must use FILD_016.');
assert.match(configSource, /noStatIncreases: \{ iconSrc: NO_STAT_INCREASES_ICON_SRC \}/, 'No Stat Increases must use the embedded project icon.');
assert.match(committedOutput, /NO_STAT_INCREASES_ICON_SRC = "data:image\/png;base64,iVBORw0KGgo/, 'The user-provided No Stat Increases PNG must be embedded during the build.');
assert.match(committedOutput, /data:image\/png;base64,iVBORw0KGgo/, 'The Status Condition Defense PNG must be embedded during the build.');
assert.match(
  pickerSource,
  /category\.value !== 'masterPassive'/,
  'Master Passive must not render a redundant All filter button.',
);
assert.match(configSource, /masterPhysical'[\s\S]{0,100}iconSrcs: \[MASTER_PASSIVE_ICON_URLS\.physical\]/, 'Physical Master Passive must use its category icon.');
assert.match(configSource, /masterSpecial'[\s\S]{0,100}iconSrcs: \[MASTER_PASSIVE_ICON_URLS\.special\]/, 'Special Master Passive must use its category icon.');
assert.match(configSource, /masterGeneral'[\s\S]{0,140}iconSrcs: \[MASTER_PASSIVE_ICON_URLS\.physical, MASTER_PASSIVE_ICON_URLS\.special\]/, 'General Master Passive must use both category icons.');
assert.match(configSource, /MASTER_PASSIVE_ICON_URLS = \{[\s\S]{0,180}physical: '[^']*\/STAT_002R\.png',[\s\S]{0,100}special: '[^']*\/STAT_008R\.png'/, 'Master Passive filters must reuse the yellow stat-increase icons.');
assert.doesNotMatch(
  configSource,
  /value === 'master(?:Physical|Special|General)'[\s\S]{0,180}iconOnly/,
  'Master Passive child filters must keep their text labels visible.',
);
assert.match(pickerSource, /category\.iconSrcs\.forEach/, 'Skill category buttons must render multiple icons when configured.');
assert.match(
  pickerSource,
  /icon\.referrerPolicy = 'no-referrer';\s*\n\s*icon\.src = category\.iconSrc/,
  'Remote skill-category icons must suppress the Brybry referrer before loading.',
);
assert.doesNotMatch(pickerSource, /battleTitle/, 'The redundant Battle Features heading must not render.');
assert.doesNotMatch(pickerSource, /clickTo(?:Include|Exclude|Clear)/, 'Filter tooltips must not contain click instructions.');
assert.match(pickerSource, /function renderActiveFilterTags\(\)/, 'Active filters must render as removable header tags.');
assert.match(pickerSource, /tag\.addEventListener\('click', \(\) => removeActiveFilter\(entry\)\)/, 'Header tags must clear one filter.');
assert.match(pickerSource, /button\.removeAttribute\('title'\)/, 'Filter buttons must suppress the duplicate native browser tooltip.');
assert.doesNotMatch(pickerSource, /button\.title = tooltip/, 'Filter buttons must rely on the custom tooltip only.');
assert.match(
  pickerSource,
  /button\.matches\('\.be-chip--icon-only, \.be-skill-category-chip--icon-only, \.be-skill-category-chip--compact-label'\)/,
  'Icon-only and compact-label filter buttons should receive custom tooltips.',
);
assert.match(pickerSource, /else delete button\.dataset\.beTooltip/, 'Fully labeled filter buttons must not retain redundant tooltips.');
for (const immunityParent of ['statusImmunity', 'statReductionImmunity', 'interferenceImmunity', 'criticalHitImmunity']) {
  assert.match(configSource, new RegExp(`value: '${immunityParent}', group: 'utility'`), `${immunityParent} must remain a top-level capability filter.`);
}
for (const [detailMap, parent] of [
  ['STATUS_IMMUNITY_DETAIL_PATTERNS', 'statusImmunity'],
  ['INTERFERENCE_IMMUNITY_DETAIL_PATTERNS', 'interferenceImmunity'],
  ['STAT_REDUCTION_IMMUNITY_DETAIL_PATTERNS', 'statReductionImmunity'],
]) {
  assert.match(configSource, new RegExp(`Object\\.entries\\(${detailMap}\\)[\\s\\S]{0,100}\\[value, '${parent}', patterns\\]`), `${parent} must render its individual immunity children.`);
  assert.match(configSource, new RegExp(`value: '${parent}'[\\s\\S]{0,180}Object\\.values\\(${detailMap}\\)\\.flat\\(\\)`), `${parent} must match every individual immunity child.`);
}
assert.match(
  configSource,
  /allStatReductionImmunity: IMMUNITY_FILTER_PATTERNS\.statReductionImmunity/,
  'All Stat Reduction Immunity must remain an exact child of Stat Reduction Immunity.',
);
assert.match(configSource, /allStatusImmunity: IMMUNITY_FILTER_PATTERNS\.statusImmunity/, 'All Status Immunity must remain an exact child of Status Immunity.');
assert.match(configSource, /allInterferenceImmunity: IMMUNITY_FILTER_PATTERNS\.interferenceImmunity/, 'All Interference Immunity must remain an exact child of Interference Immunity.');
assert.match(configSource, /ja: '全↓無効'/, 'All Stat Reduction Immunity must use an arrow in its Japanese label.');
assert.match(configSource, /ja: '全状態異常無効'/, 'All Status Immunity must have a distinct Japanese child label.');
assert.match(configSource, /ja: '全妨害無効'/, 'All Interference Immunity must have a distinct Japanese child label.');
assert.match(configSource, /const IMMUNITY_DETAIL_ICON_KEYS = \{/, 'Individual immunity filters must map their attribute to an icon.');
assert.match(configSource, /immunitySymbol: \{ en: '🚫',[^}]*zh: '🚫' \}/, 'The immunity symbol must remain consistent in every locale.');
assert.match(configSource, /ja: '異常付与'/, 'The Japanese status-infliction parent label must remain compact.');
assert.match(configSource, /ja: '妨害付与'/, 'The Japanese interference-infliction parent label must remain compact.');
assert.match(configSource, /ja: '異常無効'/, 'The Japanese status-immunity parent label must remain compact.');
assert.match(configSource, /compactLabels: skillFilterLabels\('immunitySymbol'\)/, 'Individual immunity filters must use the compact immunity symbol.');
assert.match(pickerSource, /button\.setAttribute\('aria-label', categoryLabel\)/, 'Compact filter buttons must retain their full accessible label.');
assert.match(configSource, /const REBUFF_DETAIL_CONFIG = Object\.fromEntries/, 'Type Rebuff filters must declare their individual icon configuration.');
assert.match(configSource, /Special:Redirect\/file\/\$\{iconFile \|\| `\$\{type\[0\]\.toUpperCase\(\)\}.*_Rebuff_down_icon_Masters\.png`\}/, 'Type Rebuff filters must use the Bulbagarden battle icons.');
assert.match(configSource, /Object\.entries\(REBUFF_DETAIL_CONFIG\).*\[value, 'rebuff'/, 'Every Type Rebuff icon must render as a child filter.');
assert.match(configSource, /rebuffDetailPatterns\('lowers', detail\)/, 'Type Rebuff child filters must require an explicit decrease.');
assert.match(configSource, /\['stellarRebuffDown', 'stellar', 'stellarType', 'StellarIC_Masters\.png'\]/, 'Stellar Type Rebuff must use the available Stellar battle icon.');
assert.match(configSource, /rebuffDirection: iconFile \? '↓' : ''/, 'A fallback Type Rebuff Down icon must receive an explicit down arrow.');
assert.match(configSource, /const REBUFF_UP_DETAIL_CONFIG = Object\.fromEntries/, 'Type Rebuff Up filters must derive all supported type children.');
assert.match(configSource, /value\.replace\(\/Down\$\/, 'Up'\)/, 'Every Type Rebuff Down child must have a corresponding Type Rebuff Up child.');
assert.match(configSource, /rebuffDetailPatterns\('raises', detail\)/, 'Type Rebuff Up child filters must require an explicit increase.');
assert.match(configSource, /\[direction, 'following type rebuffs', detail\.type\]/, 'Type Rebuff filters must support multi-type list descriptions.');
assert.match(pickerSource, /direction\.textContent = category\.rebuffDirection/, 'Type Rebuff Up icons must render their direction marker.');
assert.match(pickerSource, /expandedDirectionLabel\(categoryLabel, locale\)/, 'Directional filter tooltips must spell out their direction instead of using arrows.');
assert.match(pickerSource, /category\.rebuffDirection\) button\.classList\.add\('be-skill-category-chip--directional-icon'\)/, 'Type Rebuff Up buttons must use content-aware directional sizing.');
for (const increaseIcon of ['002', '004', '008', '016', '032', '064', '128', '256']) {
  assert.match(configSource, new RegExp(`STAT_${increaseIcon}R\\.png`), `Stat increase icon STAT_${increaseIcon}R must remain configured.`);
}
assert.match(configSource, /value\.endsWith\('Up'\) \? STAT_INCREASE_ICON_URLS : STAT_DECREASE_ICON_URLS/, 'Stat increases must use yellow increase icons while decreases use blue icons.');
assert.match(configSource, /attributeDirection: STAT_DECREASE_ICON_URLS\[iconKey\] \? '↓' : ''/, 'Stat reduction immunity icons must display a down arrow.');
assert.match(configSource, /labels: skillFilterLabels\(value\)/, 'Every skill detail filter must read labels from the unified translation table.');
assert.match(
  configSource,
  /const directLabels = SKILL_FILTER_TRANSLATIONS\[value\];\s*\n\s*if \(directLabels\) return directLabels;/,
  'Direct parent-filter translations must resolve before derived Up, Down, or EX detail labels.',
);
assert.match(
  configSource,
  /\.map\(\(\[value, detailOf, patterns, masterPassiveType\]\)/,
  'Skill detail definitions must only contain behavior data, not embedded translations.',
);
const detailTranslationBlock = configSource.match(/const SKILL_FILTER_TRANSLATIONS = \{([\s\S]*?)\n\};/)?.[1] || '';
const detailTranslationEntries = [...detailTranslationBlock.matchAll(/^\s{2}\w+: \{ ([^}]+) \},$/gm)];
assert.ok(detailTranslationEntries.length > 0, 'The unified skill-detail translation table must not be empty.');
for (const [, labels] of detailTranslationEntries) {
  for (const locale of ['en', 'fr', 'de', 'es', 'it', 'ja', 'ko', 'zh']) {
    assert.match(labels, new RegExp(`(?:^|, )${locale}:`), `Every skill-detail translation must include ${locale}.`);
  }
}
for (const parentFilter of ['weather', 'terrain', 'zone', 'circle', 'alliedField', 'opponentField', 'statUp', 'statDown', 'status', 'interference', 'sureHitNext', 'statusImmunity', 'statReductionImmunity', 'interferenceImmunity', 'criticalHitImmunity', 'rebuffUp', 'rebuff', 'masterPassive']) {
  assert.match(configSource, new RegExp(`labels: skillFilterLabels\\('${parentFilter}'\\)`), `${parentFilter} must use the unified filter translation table.`);
}
for (const localizedOptions of ['ROLE_FAMILIES', 'REGION_OPTIONS', 'ACQUISITION_OPTIONS', 'EXCLUSIVITY_OPTIONS']) {
  assert.match(i18nSource, new RegExp(`const ${localizedOptions} = \\[[\\s\\S]*?labels: \\{ en:`), `${localizedOptions} must keep translations under labels.`);
}
assert.match(pickerSource, /family\.labels\[locale\]/, 'Role-family filters must read the unified labels shape.');
assert.match(pickerSource, /region\.labels\[locale\]/, 'Region filters must read the unified labels shape.');
assert.match(pickerSource, /option\.labels\[locale\]/, 'Acquisition filters must read the unified labels shape.');
assert.match(
  pickerSource,
  /\[copy\.skillConditions, \['status', 'interference', 'sureHitNext', 'statusImmunity', 'interferenceImmunity', 'criticalHitImmunity'\]\]/,
  'Status and interference immunity filters must remain grouped under Status effects.',
);
assert.match(
  pickerSource,
  /\[copy\.skillStatChanges, \['statUp', 'statDown', 'statReductionImmunity', 'rebuffUp', 'rebuff'\]\]/,
  'Stat Reduction Immunity must remain grouped under Stat changes.',
);
assert.match(pickerSource, /directionButton\.dataset\.beTooltip = label/, 'Sort direction control must use the custom tooltip.');
assert.match(pickerSource, /button\.dataset\.beTooltip = label;\s*\n\s*button\.removeAttribute\('title'\)/, 'View controls must use custom tooltips without native title hints.');
assert.match(pickerSource, /bindFilterTooltips\(toolbar\)/, 'The left results toolbar must bind custom tooltip interactions.');
assert.match(pickerSource, /document\.createElement\('form'\)/, 'The filter controls must use a semantic form container.');
assert.match(pickerSource, /be-accordion-content/, 'Every accordion item must wrap its content consistently.');
for (const group of ['region', 'trainerGroup', 'fashion', 'other']) {
  assert.match(
    pickerSource,
    new RegExp(`iconSrc: FILTER_SECTION_ICON_URLS\\.${group}`),
    `${group} accordion must use its configured heading icon.`,
  );
}
assert.match(pickerSource, /be-accordion-heading-icon/, 'Accordion headings must render configured icons.');
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
const spoilerProtectionSource = await readFile(path.join(projectRoot, 'src/spoiler-protection.js'), 'utf8');
assert.match(configSource, /PROJECT_GITHUB_URL = 'https:\/\/github\.com\/charlie5188\/brybry-pokemas-enhancer'/, 'Project GitHub URL must remain configured centrally.');
assert.match(spoilerProtectionSource, /contributeLink\.href = PROJECT_GITHUB_URL/, 'Settings popover must link to the project GitHub repository.');
assert.match(spoilerProtectionSource, /contributeLink\.rel = 'noopener noreferrer'/, 'External GitHub link must isolate the opener.');
assert.match(stylesSource, /\.be-settings-contribute\s*\{/, 'Settings GitHub contribution link must have dedicated styling.');
assert.match(stylesSource, /\.be-chip--detail\s*\{/, 'Generic child filter buttons must have a distinct detail style.');
assert.doesNotMatch(
  stylesSource,
  /\.be-skill-battle-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2/s,
  'Battle feature groups must remain a single-column layout.',
);
assert.doesNotMatch(stylesSource, /border-style:\s*dashed/, 'Interactive filter buttons must use consistent solid borders.');
assert.match(stylesSource, /summary\.be-accordion-trigger:focus-visible/, 'Accordion triggers must expose a keyboard focus state.');
assert.match(stylesSource, /\.be-accordion-chevron/, 'Accordion triggers must use a consistent chevron affordance.');
assert.match(stylesSource, /\.be-accordion-heading-icon/, 'Accordion heading icons must have dedicated sizing.');
assert.match(stylesSource, /\.be-active-filter-tag/, 'Active filter tags must have dedicated styling.');
assert.match(
  stylesSource,
  /\.be-skill-category-chip--directional-icon\s*\{[^}]*min-width:\s*44px;[^}]*padding:\s*4px 6px;[^}]*width:\s*auto;/s,
  'Directional icon buttons must hug their icon and arrow with sufficient padding.',
);
assert.match(stylesSource, /\.be-stat-direction\s*\{[^}]*font:\s*700 15px\/1/s, 'Direction arrows must use one consistent visual weight.');
assert.match(stylesSource, /\.be-skill-category-chip--compact-label \.be-skill-category-label\s*\{[^}]*font-size:\s*16px/s, 'Compact immunity emoji must remain legible.');
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
const sureHitNextPatterns = [['sure hit next effect'], ['never miss']];
assert.equal(
  parserContext.matchDocumentsForCheck(['Applies the Sure Hit Next effect to all allied sync pairs.'], sureHitNextPatterns),
  true,
  'Sure Hit Next providers must match the sure-hit filter.',
);
assert.equal(
  parserContext.matchDocumentsForCheck(['Moves never miss.'], sureHitNextPatterns),
  true,
  'Innately accurate moves must match the sure-hit filter.',
);
assert.equal(
  parserContext.matchDocumentsForCheck(['Never misses during a hailstorm.'], sureHitNextPatterns),
  true,
  'Conditional never-miss effects must match the sure-hit filter.',
);
const fieldDetailPatternChecks = [
  ['sunny weather', [['makes the weather sunny']], 'Makes the weather sunny.'],
  ['rainy weather', [['makes the weather rainy']], 'Makes the weather rainy.'],
  ['sandstorm', [['causes a sandstorm']], 'Causes a sandstorm.'],
  ['hailstorm', [['causes a hailstorm']], 'Causes a hailstorm.'],
  ['Electric Terrain', [['terrain into electric terrain']], 'Turns the field of play’s terrain into Electric Terrain.'],
  ['Fairy Zone', [['zone into a fairy zone']], 'Turns the field of play’s zone into a Fairy Zone.'],
  ['Physical Damage Reduction', [['physical damage reduction effect']], 'Applies the Physical Damage Reduction effect to the allied field of play.'],
  ['Special Damage Reduction', [['special damage reduction effect']], 'Applies the Special Damage Reduction effect to the allied field of play.'],
  ['Critical-Hit Defense', [['critical-hit defense effect']], 'Applies the Critical-Hit Defense effect to the allied field of play.'],
  ['Status Condition Defense', [['status condition defense effect']], 'Applies the Status Condition Defense effect to the allied field of play.'],
  ['Status Move Defense', [['status move defense effect']], 'Applies the Status Move Defense effect to the allied field of play.'],
  ['Stat Reduction Defense', [['stat reduction defense effect']], 'Applies the Stat Reduction Defense effect to the allied field of play.'],
  ['Move Gauge Acceleration', [['move gauge acceleration effect']], 'Applies the Move Gauge Acceleration effect to the allied field of play.'],
  ['Fire Damage Field', [['fire damage field']], 'Applies the Fire Damage Field to the opponents’ field of play.'],
  ['No Stat Increases', [['no stat increases effect']], 'Applies the No Stat Increases effect to the opponents’ field of play.'],
];
for (const [name, patterns, document] of fieldDetailPatternChecks) {
  assert.equal(parserContext.matchDocumentsForCheck([document], patterns), true, `${name}: concrete field effect must match.`);
}
const immunityPatternChecks = [
  ['Status Immunity', [['prevents', 'getting', 'status condition']], 'Prevents the user from getting a status condition.'],
  ['Stat Reduction Immunity', [['prevents', 'stats', 'being lowered']], 'Prevents the user’s stats from being lowered.'],
  ['Interference Immunity', [['prevents', 'flinching', 'becoming confused', 'trapped']], 'Prevents the user from flinching, becoming confused, or becoming trapped.'],
  ['Critical-Hit Immunity', [['protects', 'against critical hits']], 'Protects the user against critical hits.'],
];
for (const [name, patterns, document] of immunityPatternChecks) {
  assert.equal(parserContext.matchDocumentsForCheck([document], patterns), true, `${name}: explicit immunity must match.`);
}
const fireRebuffDownPatterns = [['lowers', 'fire type rebuff']];
assert.equal(
  parserContext.matchDocumentsForCheck(['Lowers the target’s Fire Type Rebuff by one rank.'], fireRebuffDownPatterns),
  true,
  'A Fire Type Rebuff decrease must match the Fire Rebuff Down filter.',
);
assert.equal(
  parserContext.matchDocumentsForCheck(['Raises the Fire Type Rebuff of all allied sync pairs by one rank.'], fireRebuffDownPatterns),
  false,
  'An allied Fire Type Rebuff increase must not match the Fire Rebuff Down filter.',
);
assert.equal(
  parserContext.matchDocumentsForCheck(['Lowers the target’s Stellar Type Rebuff by three ranks.'], [['lowers', 'stellar type rebuff']]),
  true,
  'A Stellar Type Rebuff decrease must match the Stellar Rebuff Down filter.',
);
const fireRebuffUpPatterns = [['raises', 'fire type rebuff']];
assert.equal(
  parserContext.matchDocumentsForCheck(['Raises the Fire Type Rebuff of all allied sync pairs by one rank.'], fireRebuffUpPatterns),
  true,
  'An allied Fire Type Rebuff increase must match the Fire Rebuff Up filter.',
);
const chaseMultiRebuffDocument = 'Lowers all of the following Type Rebuffs of all opposing sync pairs by one rank: Normal, Fire, Water, Electric, Grass, Ice, Psychic, Dark, Fairy.';
assert.equal(
  parserContext.matchDocumentsForCheck([chaseMultiRebuffDocument], [['lowers', 'following type rebuffs', 'fire']]),
  true,
  'A listed type in a multi-Type Rebuff decrease must match its child filter.',
);
assert.equal(
  parserContext.matchDocumentsForCheck([chaseMultiRebuffDocument], [['lowers', 'following type rebuffs', 'fighting']]),
  false,
  'An unlisted type in a multi-Type Rebuff decrease must not match its child filter.',
);
assert.equal(
  parserContext.matchDocumentsForCheck(['Lowers the target’s Fire Type Rebuff by one rank.'], fireRebuffUpPatterns),
  false,
  'A Fire Type Rebuff decrease must not match the Fire Rebuff Up filter.',
);
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
const multiplierSource = await readFile(path.join(projectRoot, 'src/data/power-multipliers.js'), 'utf8');
const multiplierContext = {};
vm.createContext(multiplierContext);
vm.runInContext(`${multiplierSource}\nthis.powerMultiplierForCheck = powerMultiplierForPassiveId;`, multiplierContext);
assert.deepEqual(
  { ...multiplierContext.powerMultiplierForCheck(16010601) },
  { kind: 'cap', value: 100 },
  'Attack-raised Sync Move power must expose its verified +100% cap.',
);
assert.deepEqual(
  { ...multiplierContext.powerMultiplierForCheck(16012401) },
  { kind: 'cap', value: 120 },
  'Multi-stat Sync Move power must expose its verified +120% cap.',
);
assert.deepEqual(
  { ...multiplierContext.powerMultiplierForCheck(13010603) },
  { kind: 'fixed', value: 30 },
  'Numbered conditional power boosts must derive a dynamic 10% per level.',
);
assert.deepEqual(
  { ...multiplierContext.powerMultiplierForCheck(16014603) },
  { kind: 'fixed', value: 30 },
  'Super-effective Max Move power boosts must use their numbered multiplier.',
);
assert.deepEqual(
  { ...multiplierContext.powerMultiplierForCheck(13011805) },
  { kind: 'fixed', value: 50 },
  'Grid conditional power-up families must expose their numbered multiplier.',
);
assert.deepEqual(
  { ...multiplierContext.powerMultiplierForCheck(13011005) },
  { kind: 'cap', value: 50 },
  'Full-HP power boosts must expose their verified maximum.',
);
assert.deepEqual(
  { ...multiplierContext.powerMultiplierForCheck(13013604) },
  { kind: 'cap', value: 20 },
  'Low-HP power boosts must expose their verified maximum.',
);
assert.deepEqual(
  { ...multiplierContext.powerMultiplierForCheck(13010503) },
  { kind: 'cap', value: 18 },
  'Move-gauge power boosts must use six gauge slots for their maximum.',
);
assert.deepEqual(
  { ...multiplierContext.powerMultiplierForCheck(16013701) },
  { kind: 'cap', value: 100 },
  'Move-gauge Sync Move power must expose its verified +100% maximum.',
);
assert.deepEqual(
  { ...multiplierContext.powerMultiplierForCheck(13085301) },
  { kind: 'fixed', value: 100 },
  'Explicit two-times power effects must not derive +10% from the ID suffix.',
);
assert.equal(multiplierContext.powerMultiplierForCheck(99999999), null, 'Unknown effects must not guess a multiplier.');
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
gridContext.MOVE_LEVEL_ICON_BASE = 'https://pomasters.github.io/SyncPairsTracker/images/';
vm.runInContext(`${gridSource}\nthis.syncPowerTileLabelForCheck = syncPowerTileLabel; this.displayTileNameForCheck = displayTileName; this.requiredMoveLevelForCheck = requiredMoveLevel; this.moveLevelIconUrlForCheck = moveLevelIconUrl; this.fieldDurationInfoForCheck = fieldDurationInfo;`, gridContext);
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
assert.equal(gridContext.requiredMoveLevelForCheck({ dataset: { level: '4' } }), 4);
assert.equal(gridContext.requiredMoveLevelForCheck({ dataset: {} }), 1, 'Tiles without data-level must default to move level 1.');
assert.equal(gridContext.moveLevelIconUrlForCheck(5), 'https://pomasters.github.io/SyncPairsTracker/images/5.png');
assert.match(gridSource, /icon\.alt = accessibleLabel/, 'Move-level icons must retain localized fallback text.');
assert.match(stylesSource, /\.be-required-move-level-icon/, 'Move-level icons must have dedicated tooltip sizing.');
assert.match(
  gridSource,
  /title\.insertBefore\(line, titleText\)/,
  'Move-level icons must appear immediately before the tooltip title text.',
);
assert.doesNotMatch(
  stylesSource,
  /\.tooltip \.be-required-move-level\s*\{[^}]*background:/s,
  'Move-level requirements must not render as a separate tooltip block.',
);
assert.deepEqual(
  { ...gridContext.fieldDurationInfoForCheck(19020803, 'Extends the duration of sunny weather when the weather turns sunny while the user is on the field.') },
  { baseSeconds: 45, extensionSeconds: 30 },
  'Field Extension 3 must explain its approximately 30-second extension.',
);
assert.deepEqual(
  { ...gridContext.fieldDurationInfoForCheck(19061805, 'Makes the weather sunny the first time the user attacks. Extends the duration of sunny weather when the weather turns sunny while the user is on the field.') },
  { baseSeconds: 45, extensionSeconds: 50 },
  'Field-setting Extension 5 skills must explain both base duration and extension.',
);
assert.deepEqual(
  { ...gridContext.fieldDurationInfoForCheck(19020301, 'Turns the field of play’s terrain into Grassy Terrain after using the user’s sync move.') },
  { baseSeconds: 45, extensionSeconds: null },
  'Field-setting skills must explain the base field duration.',
);
assert.equal(
  gridContext.fieldDurationInfoForCheck(13010603, 'Powers up the user’s moves when the terrain is Grassy Terrain.'),
  null,
  'Skills that only benefit from an active field must not receive a duration explanation.',
);
assert.match(gridSource, /appendFieldDuration\(tooltip, moveInfo\)/, 'Grid tooltips must append verified field-duration details.');
assert.match(stylesSource, /\.be-field-duration/, 'Field-duration tooltip details must have dedicated styling.');

console.log('Check passed: build, metadata, syntax and committed artifact are valid.');
