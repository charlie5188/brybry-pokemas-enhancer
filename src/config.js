const ROOT_ID = 'brybry-enhancer-root';
const ENHANCER_NAME = 'Brybry Pokemas Enhancer';
const ENHANCER_VERSION = '1.11.129';
const TILE_LABEL_CLASS = 'brybry-tile-label';
// Keep result rendering outside the browser's normal double-click window so
// rapid three-state transitions finish before filtering blocks the main thread.
const FILTER_RENDER_DELAY_MS = 500;
const TRAINER_DATA_URL = './data/proto/Trainer.json';
const MOVE_DATA_URL = './data/proto/Move.json';
const SCHEDULE_DATA_URL = './data/proto/Schedule.json';
const MONSTER_DATA_URL = './data/proto/Monster.json';
const MONSTER_BASE_DATA_URL = './data/proto/MonsterBase.json';
const MONSTER_VARIATION_DATA_URL = './data/proto/MonsterVariation.json';
const TRAINER_BASE_DATA_URL = './data/proto/TrainerBase.json';
const TEAM_SKILL_DATA_URL = './data/proto/TeamSkill.json';
const TRAINER_EX_ROLE_DATA_URL = './data/proto/TrainerExRole.json';
const SUPERAWAKENING_DATA_URL = './data/proto/TrainerSpecialAwaking.json';
const ABILITY_PANEL_DATA_URL = './data/proto/AbilityPanel.json';
const ABILITY_DATA_URL = './data/proto/Ability.json';
const PASSIVE_SKILL_CHILD_DATA_URL = './data/proto/PassiveSkillChild.json';
const SKILL_TEMPLATE_PARAMETER_DATA_URL = './data/proto/MoveAndPassiveSkillDigit.json';
const TEAM_SKILL_TAG_URLS = {
  en: './data/lsd/team_skill_tag_en.json',
  fr: './data/lsd/team_skill_tag_fr.json',
  de: './data/lsd/team_skill_tag_de.json',
  es: './data/lsd/team_skill_tag_es.json',
  it: './data/lsd/team_skill_tag_it.json',
  ja: './data/lsd/team_skill_tag_ja.json',
  ko: './data/lsd/team_skill_tag_ko.json',
  zh: './data/lsd/team_skill_tag_zh-TW.json',
};
const MOVE_NAME_URLS = {
  en: './data/lsd/move_name_en.json',
  fr: './data/lsd/move_name_fr.json',
  de: './data/lsd/move_name_de.json',
  es: './data/lsd/move_name_es.json',
  it: './data/lsd/move_name_it.json',
  ja: './data/lsd/move_name_ja.json',
  ko: './data/lsd/move_name_ko.json',
  zh: './data/lsd/move_name_zh-TW.json',
};
const MOVE_DESCRIPTION_URLS = {
  en: {
    descriptions: './data/lsd/move_description_en.json',
    descriptionParts: './data/lsd/move_description_parts_en.json',
  },
  fr: {
    descriptions: './data/lsd/move_description_fr.json',
    descriptionParts: './data/lsd/move_description_parts_fr.json',
  },
  de: {
    descriptions: './data/lsd/move_description_de.json',
    descriptionParts: './data/lsd/move_description_parts_de.json',
  },
  es: {
    descriptions: './data/lsd/move_description_es.json',
    descriptionParts: './data/lsd/move_description_parts_es.json',
  },
  it: {
    descriptions: './data/lsd/move_description_it.json',
    descriptionParts: './data/lsd/move_description_parts_it.json',
  },
  ja: {
    descriptions: './data/lsd/move_description_ja.json',
    descriptionParts: './data/lsd/move_description_parts_ja.json',
  },
  ko: {
    descriptions: './data/lsd/move_description_ko.json',
    descriptionParts: './data/lsd/move_description_parts_ko.json',
  },
  zh: {
    descriptions: './data/lsd/move_description_zh-TW.json',
    descriptionParts: './data/lsd/move_description_parts_zh-TW.json',
  },
};
const SKILL_TEMPLATE_LOCALE_URLS = Object.fromEntries(Object.keys(MOVE_NAME_URLS).map((locale) => {
  const suffix = locale === 'zh' ? 'zh-TW' : locale;
  return [locale, {
    numbers: `./data/lsd/passive_skill_and_move_number_${suffix}.json`,
    referencedMessages: `./data/lsd/tag_name_with_prepositions_${suffix}.json`,
  }];
}));
const PASSIVE_SKILL_SEARCH_URLS = {
  en: {
    names: './data/lsd/passive_skill_name_en.json',
    nameParts: './data/lsd/passive_skill_name_parts_en.json',
    descriptions: './data/lsd/passive_skill_description_en.json',
    descriptionParts: './data/lsd/passive_skill_description_parts_en.json',
  },
  fr: {
    names: './data/lsd/passive_skill_name_fr.json',
    nameParts: './data/lsd/passive_skill_name_parts_fr.json',
    descriptions: './data/lsd/passive_skill_description_fr.json',
    descriptionParts: './data/lsd/passive_skill_description_parts_fr.json',
  },
  de: {
    names: './data/lsd/passive_skill_name_de.json',
    nameParts: './data/lsd/passive_skill_name_parts_de.json',
    descriptions: './data/lsd/passive_skill_description_de.json',
    descriptionParts: './data/lsd/passive_skill_description_parts_de.json',
  },
  es: {
    names: './data/lsd/passive_skill_name_es.json',
    nameParts: './data/lsd/passive_skill_name_parts_es.json',
    descriptions: './data/lsd/passive_skill_description_es.json',
    descriptionParts: './data/lsd/passive_skill_description_parts_es.json',
  },
  it: {
    names: './data/lsd/passive_skill_name_it.json',
    nameParts: './data/lsd/passive_skill_name_parts_it.json',
    descriptions: './data/lsd/passive_skill_description_it.json',
    descriptionParts: './data/lsd/passive_skill_description_parts_it.json',
  },
  ja: {
    names: './data/lsd/passive_skill_name_ja.json',
    nameParts: './data/lsd/passive_skill_name_parts_ja.json',
    descriptions: './data/lsd/passive_skill_description_ja.json',
    descriptionParts: './data/lsd/passive_skill_description_parts_ja.json',
  },
  ko: {
    names: './data/lsd/passive_skill_name_ko.json',
    nameParts: './data/lsd/passive_skill_name_parts_ko.json',
    descriptions: './data/lsd/passive_skill_description_ko.json',
    descriptionParts: './data/lsd/passive_skill_description_parts_ko.json',
  },
  zh: {
    names: './data/lsd/passive_skill_name_zh-TW.json',
    nameParts: './data/lsd/passive_skill_name_parts_zh-TW.json',
    descriptions: './data/lsd/passive_skill_description_zh-TW.json',
    descriptionParts: './data/lsd/passive_skill_description_parts_zh-TW.json',
  },
};
// PomaTools' authored abbreviations are stored per locale under src/data so
// everyday feature work does not need to load the large source dictionaries.

const FILTER_ICON_BASE = 'https://pomasters.github.io/SyncPairsTracker/images/';
const MOVE_LEVEL_ICON_BASE = 'https://pomasters.github.io/SyncPairsTracker/images/';
const PROJECT_GITHUB_URL = 'https://github.com/charlie5188/brybry-pokemas-enhancer';
const MASTER_PASSIVE_ICON_URLS = {
  physical: 'https://pomatools.github.io/assets/img/battle/STAT_002R.png',
  special: 'https://pomatools.github.io/assets/img/battle/STAT_008R.png',
};
const FILTER_SECTION_ICON_URLS = {
  region: 'https://www.pomatools.site/assets/images/icon_theme_region.png',
  trainerGroup: 'https://www.pomatools.site/assets/images/icon_theme_trainergroup.png',
  fashion: 'https://www.pomatools.site/assets/images/icon_theme_fashion.png',
  other: 'https://www.pomatools.site/assets/images/icon_theme_other.png',
};
const PICKER_PREFERENCES_KEY = 'brybry-enhancer-picker-preferences';
const GRID_PREFERENCES_KEY = 'brybry-enhancer-sync-grid-builds';
const PREFERENCE_VERSION = 4;
const SPOILER_REDIRECT_KEY = 'brybry-enhancer-spoiler-redirect';
const SETTINGS_ICON = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>';
const SORT_DIRECTION_ICON = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14m7-7-7 7-7-7"/></svg>';
const VIEW_ICONS = {
  list: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 5h.01M3 12h.01M3 19h.01M8 5h13M8 12h13M8 19h13"/></svg>',
  icons: '<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
};
const STATUS_INFLICT_PATTERNS = {
  poison: [['leaves', 'target', 'poisoned'], ['leaving', 'target', 'poisoned'], ['leaves', 'opposing', 'poisoned'], ['leaves', 'opponent', 'poisoned']],
  burn: [['leaves', 'target', 'burned'], ['leaving', 'target', 'burned'], ['leaves', 'opposing', 'burned'], ['leaves', 'opponent', 'burned']],
  paralysis: [['leaves', 'target', 'paralyzed'], ['leaving', 'target', 'paralyzed'], ['leaves', 'opposing', 'paralyzed']],
  sleep: [['puts', 'target', 'sleep'], ['putting', 'target', 'sleep'], ['puts', 'opposing', 'sleep']],
  freeze: [['leaves', 'target', 'frozen'], ['leaving', 'target', 'frozen'], ['leaves', 'opposing', 'frozen']],
};
const INTERFERENCE_INFLICT_PATTERNS = {
  flinch: [['makes', 'target', 'flinch'], ['making', 'target', 'flinch'], ['leaves', 'target', 'flinch'], ['leaves', 'opposing', 'flinch']],
  confusion: [['leaves', 'target', 'confused'], ['leaving', 'target', 'confused'], ['leaves', 'opposing', 'confused']],
  trap: [['leaves', 'target', 'trapped'], ['leaving', 'target', 'trapped'], ['leaves', 'opposing', 'trapped']],
};
const OPPONENT_STAT_INCREASE_REMOVAL_PATTERNS = [
  ['returns', 'target', 'raised stats', 'to normal'],
  ['returns', 'raised stats', 'opposing sync pairs', 'to normal'],
];
const IMMUNITY_FILTER_PATTERNS = {
  statusImmunity: [
    ['prevents', 'getting', 'status condition'],
    ['prevents', 'status conditions', 'being inflicted'],
    ['status conditions cannot be inflicted'],
  ],
  statReductionImmunity: [
    ['prevents', 'stats', 'being lowered'],
    ['stats cannot be lowered'],
    ['stats would be lowered', 'same amount instead'],
  ],
  interferenceImmunity: [
    ['prevents', 'flinching', 'confused', 'trapped'],
    ['prevents', 'flinching', 'becoming confused', 'trapped'],
  ],
  criticalHitImmunity: [
    ['prevents', 'critical hits'],
    ['protects', 'against critical hits'],
    ['protected against critical hits'],
  ],
};
const STATUS_IMMUNITY_DETAIL_PATTERNS = {
  allStatusImmunity: IMMUNITY_FILTER_PATTERNS.statusImmunity,
  poisonImmunity: [['prevents', 'getting poisoned'], ...IMMUNITY_FILTER_PATTERNS.statusImmunity],
  burnImmunity: [['prevents', 'getting burned'], ...IMMUNITY_FILTER_PATTERNS.statusImmunity],
  paralysisImmunity: [['prevents', 'getting paralyzed'], ...IMMUNITY_FILTER_PATTERNS.statusImmunity],
  sleepImmunity: [['prevents', 'falling asleep'], ...IMMUNITY_FILTER_PATTERNS.statusImmunity],
  freezeImmunity: [['prevents', 'getting frozen'], ...IMMUNITY_FILTER_PATTERNS.statusImmunity],
};
const INTERFERENCE_IMMUNITY_DETAIL_PATTERNS = {
  allInterferenceImmunity: IMMUNITY_FILTER_PATTERNS.interferenceImmunity,
  flinchImmunity: [['prevents', 'flinching'], ...IMMUNITY_FILTER_PATTERNS.interferenceImmunity],
  confusionImmunity: [['prevents', 'becoming confused'], ...IMMUNITY_FILTER_PATTERNS.interferenceImmunity],
  trapImmunity: [['prevents', 'becoming trapped'], ...IMMUNITY_FILTER_PATTERNS.interferenceImmunity],
};
const STAT_REDUCTION_IMMUNITY_DETAIL_PATTERNS = {
  allStatReductionImmunity: IMMUNITY_FILTER_PATTERNS.statReductionImmunity,
  attackReductionImmunity: [['prevents', 'attack', 'being lowered'], ['attack', 'protected', 'stat rank reduction'], ...IMMUNITY_FILTER_PATTERNS.statReductionImmunity],
  spAttackReductionImmunity: [['prevents', 'sp. atk', 'being lowered'], ['sp. atk', 'protected', 'stat rank reduction'], ...IMMUNITY_FILTER_PATTERNS.statReductionImmunity],
  defenseReductionImmunity: [['prevents', 'defense', 'being lowered'], ['defense', 'protected', 'stat rank reduction'], ...IMMUNITY_FILTER_PATTERNS.statReductionImmunity],
  spDefenseReductionImmunity: [['prevents', 'sp. def', 'being lowered'], ['sp. def', 'protected', 'stat rank reduction'], ...IMMUNITY_FILTER_PATTERNS.statReductionImmunity],
  speedReductionImmunity: [['prevents', 'speed', 'being lowered'], ['speed', 'protected', 'stat rank reduction'], ...IMMUNITY_FILTER_PATTERNS.statReductionImmunity],
  accuracyReductionImmunity: [['prevents', 'accuracy', 'being lowered'], ['accuracy', 'protected', 'stat rank reduction'], ...IMMUNITY_FILTER_PATTERNS.statReductionImmunity],
  evasionReductionImmunity: [['prevents', 'evasiveness', 'being lowered'], ['evasiveness', 'protected', 'stat rank reduction'], ...IMMUNITY_FILTER_PATTERNS.statReductionImmunity],
};
const STAT_DECREASE_ICON_URLS = {
  attack: 'https://pomatools.github.io/assets/img/battle/STAT_002L.png',
  defense: 'https://pomatools.github.io/assets/img/battle/STAT_004L.png',
  spAttack: 'https://pomatools.github.io/assets/img/battle/STAT_008L.png',
  spDefense: 'https://pomatools.github.io/assets/img/battle/STAT_016L.png',
  speed: 'https://pomatools.github.io/assets/img/battle/STAT_032L.png',
  accuracy: 'https://pomatools.github.io/assets/img/battle/STAT_064L.png',
  evasion: 'https://pomatools.github.io/assets/img/battle/STAT_128L.png',
  critical: 'https://pomatools.github.io/assets/img/battle/STAT_256L.png',
};
const STAT_INCREASE_ICON_URLS = {
  attack: 'https://pomatools.github.io/assets/img/battle/STAT_002R.png',
  defense: 'https://pomatools.github.io/assets/img/battle/STAT_004R.png',
  spAttack: 'https://pomatools.github.io/assets/img/battle/STAT_008R.png',
  spDefense: 'https://pomatools.github.io/assets/img/battle/STAT_016R.png',
  speed: 'https://pomatools.github.io/assets/img/battle/STAT_032R.png',
  accuracy: 'https://pomatools.github.io/assets/img/battle/STAT_064R.png',
  evasion: 'https://pomatools.github.io/assets/img/battle/STAT_128R.png',
  critical: 'https://pomatools.github.io/assets/img/battle/STAT_256R.png',
};
const CONDITION_FILTER_ICON_URLS = {
  poison: 'https://pomatools.github.io/assets/img/battle/SCPM_001.png',
  burn: 'https://pomatools.github.io/assets/img/battle/SCPM_004.png',
  paralysis: 'https://pomatools.github.io/assets/img/battle/SCPM_008.png',
  freeze: 'https://pomatools.github.io/assets/img/battle/SCPM_016.png',
  sleep: 'https://pomatools.github.io/assets/img/battle/SCPM_032.png',
  confusion: 'https://pomatools.github.io/assets/img/battle/SCTP_001.png',
  flinch: 'https://pomatools.github.io/assets/img/battle/SCTP_002.png',
  trap: 'https://pomatools.github.io/assets/img/battle/SCTP_004.png',
};
const IMMUNITY_DETAIL_ICON_KEYS = {
  poisonImmunity: 'poison', burnImmunity: 'burn', paralysisImmunity: 'paralysis', sleepImmunity: 'sleep', freezeImmunity: 'freeze',
  flinchImmunity: 'flinch', confusionImmunity: 'confusion', trapImmunity: 'trap',
  attackReductionImmunity: 'attack', spAttackReductionImmunity: 'spAttack', defenseReductionImmunity: 'defense',
  spDefenseReductionImmunity: 'spDefense', speedReductionImmunity: 'speed', accuracyReductionImmunity: 'accuracy',
  evasionReductionImmunity: 'evasion',
};
const REBUFF_DETAIL_CONFIG = Object.fromEntries([
  ['normalRebuffDown', 'normal', 'normalZone'], ['fireRebuffDown', 'fire', 'fireType'],
  ['waterRebuffDown', 'water', 'waterType'], ['electricRebuffDown', 'electric', 'electricType'],
  ['grassRebuffDown', 'grass', 'grassType'], ['iceRebuffDown', 'ice', 'iceZone'],
  ['fightingRebuffDown', 'fighting', 'fightingZone'], ['poisonRebuffDown', 'poison', 'poisonZone'],
  ['groundRebuffDown', 'ground', 'groundZone'], ['flyingRebuffDown', 'flying', 'flyingZone'],
  ['psychicRebuffDown', 'psychic', 'psychicType'], ['bugRebuffDown', 'bug', 'bugZone'],
  ['rockRebuffDown', 'rock', 'rockZone'], ['ghostRebuffDown', 'ghost', 'ghostZone'],
  ['dragonRebuffDown', 'dragon', 'dragonZone'], ['darkRebuffDown', 'dark', 'darkZone'],
  ['steelRebuffDown', 'steel', 'steelZone'], ['fairyRebuffDown', 'fairy', 'fairyZone'],
  ['stellarRebuffDown', 'stellar', 'stellarType', 'StellarIC_Masters.png'],
].map(([value, type, labelKey, iconFile]) => [value, {
  type,
  labelKey,
  iconSrc: `https://archives.bulbagarden.net/wiki/Special:Redirect/file/${iconFile || `${type[0].toUpperCase()}${type.slice(1)}_Rebuff_down_icon_Masters.png`}`,
  rebuffDirection: iconFile ? '↓' : '',
}]));
const REBUFF_UP_DETAIL_CONFIG = Object.fromEntries(Object.entries(REBUFF_DETAIL_CONFIG).map(([value, detail]) => [
  value.replace(/Down$/, 'Up'),
  {
    ...detail,
    iconSrc: `https://archives.bulbagarden.net/wiki/Special:Redirect/file/${detail.type[0].toUpperCase()}${detail.type.slice(1)}IC_Masters.png`,
  },
]));
function rebuffDetailPatterns(direction, detail) {
  return [
    [[direction, `${detail.type} type rebuff`]],
    [[direction, 'following type rebuffs', detail.type]],
  ].flat();
}
const FIELD_DETAIL_ICON_CONFIG = {
  sunnyWeather: { iconSrc: 'https://pomatools.github.io/assets/img/battle/WTHR_002.png' },
  rainyWeather: { iconSrc: 'https://pomatools.github.io/assets/img/battle/WTHR_001.png' },
  sandstormWeather: { iconSrc: 'https://pomatools.github.io/assets/img/battle/WTHR_004.png' },
  hailWeather: { iconSrc: 'https://pomatools.github.io/assets/img/battle/WTHR_008.png' },
  electricTerrain: { iconName: 'type_electric' },
  grassyTerrain: { iconName: 'type_grass' },
  psychicTerrain: { iconName: 'type_psychic' },
  normalZone: { iconName: 'type_normal' },
  iceZone: { iconName: 'type_ice' },
  fightingZone: { iconName: 'type_fighting' },
  poisonZone: { iconName: 'type_poison' },
  groundZone: { iconName: 'type_ground' },
  flyingZone: { iconName: 'type_flying' },
  bugZone: { iconName: 'type_bug' },
  rockZone: { iconName: 'type_rock' },
  ghostZone: { iconName: 'type_ghost' },
  dragonZone: { iconName: 'type_dragon' },
  darkZone: { iconName: 'type_dark' },
  steelZone: { iconName: 'type_steel' },
  fairyZone: { iconName: 'type_fairy' },
  circlePhysical: { iconSrc: 'https://www.pomatools.site/assets/images/icon_stat_atk.png', iconOnly: false },
  circleSpecial: { iconSrc: 'https://www.pomatools.site/assets/images/icon_stat_spa.png', iconOnly: false },
  circleDefensive: { iconSrc: 'https://www.pomatools.site/assets/images/icon_stat_hp.png', iconOnly: false },
  moveGaugeAcceleration: { iconSrc: 'https://pomatools.github.io/assets/img/battle/FILD_001.png' },
  physicalDamageReduction: { iconSrc: 'https://pomatools.github.io/assets/img/battle/FILD_002.png' },
  specialDamageReduction: { iconSrc: 'https://pomatools.github.io/assets/img/battle/FILD_004.png' },
  criticalHitDefense: { iconSrc: 'https://pomatools.github.io/assets/img/battle/FILD_008.png' },
  statusConditionDefense: { iconSrc: STATUS_CONDITION_DEFENSE_ICON_SRC },
  statusMoveDefense: { iconSrc: 'https://pomatools.github.io/assets/img/battle/FILD_032.png' },
  statReductionDefense: { iconSrc: 'https://pomatools.github.io/assets/img/battle/FILD_016.png' },
  noStatIncreases: { iconSrc: NO_STAT_INCREASES_ICON_SRC },
  fireDamageField: { iconSrc: 'https://archives.bulbagarden.net/media/upload/f/fb/Fire_Damage_Field_icon_Masters.png' },
  poisonDamageField: { iconSrc: 'https://archives.bulbagarden.net/media/upload/f/fc/Poison_Damage_Field_icon_Masters.png' },
  rockDamageField: { iconSrc: 'https://archives.bulbagarden.net/media/upload/b/b7/Rock_Damage_Field_icon_Masters.png' },
  darkDamageField: { iconSrc: 'https://archives.bulbagarden.net/media/upload/c/c6/Dark_Damage_Field_icon_Masters.png' },
  steelDamageField: { iconSrc: 'https://archives.bulbagarden.net/media/upload/a/a7/Steel_Damage_Field_icon_Masters.png' },
};

// Compact translation table for detail filters. Weather/terrain/zone EX labels
// and stat-direction labels are derived below so every supported UI locale has
// a native label without duplicating near-identical entries.
const SKILL_FILTER_TRANSLATIONS = {
  weather: { en: 'Weather', fr: 'Météo', de: 'Wetter', es: 'Clima', it: 'Meteo', ja: '天気', ko: '날씨', zh: '天氣' },
  terrain: { en: 'Terrain', fr: 'Champ', de: 'Feld', es: 'Campo', it: 'Campo', ja: 'フィールド', ko: '필드', zh: '場地' },
  zone: { en: 'Zone', fr: 'Zone', de: 'Zone', es: 'Zona', it: 'Zona', ja: 'ゾーン', ko: '존', zh: '領域' },
  weatherEx: { en: 'EX Weather', fr: 'Météo EX', de: 'EX-Wetter', es: 'Clima EX', it: 'Meteo EX', ja: 'EX天気', ko: 'EX 날씨', zh: 'EX天氣' },
  terrainEx: { en: 'EX Terrain', fr: 'Champ EX', de: 'EX-Feld', es: 'Campo EX', it: 'Campo EX', ja: 'EXフィールド', ko: 'EX 필드', zh: 'EX場地' },
  zoneEx: { en: 'EX Zone', fr: 'Zone EX', de: 'EX-Zone', es: 'Zona EX', it: 'Zona EX', ja: 'EXゾーン', ko: 'EX 존', zh: 'EX領域' },
  circle: { en: 'Circle', fr: 'Cercle', de: 'Kreis', es: 'Círculo', it: 'Cerchio', ja: 'サークル', ko: '서클', zh: '圓環' },
  alliedField: { en: 'Allied Field', fr: 'Terrain allié', de: 'Mitstreiter-Feld', es: 'Campo aliado', it: 'Campo alleato', ja: '味方の場', ko: '아군 필드', zh: '我方場地' },
  opponentField: { en: 'Opponent Field', fr: 'Terrain adverse', de: 'Gegner-Feld', es: 'Campo rival', it: 'Campo avversario', ja: '相手の場', ko: '상대 필드', zh: '對手場地' },
  statUp: { en: 'Stat ↑', fr: 'Stats ↑', de: 'Werte ↑', es: 'Características ↑', it: 'Statistiche ↑', ja: '能力↑', ko: '능력↑', zh: '能力↑' },
  statDown: { en: 'Opponent Stat ↓', fr: 'Stats adverses ↓', de: 'Gegner-Werte ↓', es: 'Características del rival ↓', it: 'Statistiche avversarie ↓', ja: '相手能力↓', ko: '상대 능력↓', zh: '對手能力↓' },
  opponentStatIncreaseRemoval: { en: 'Opponent Stat ↑ Removal', fr: 'Bonus de stats adverses annulés', de: 'Gegner-Werte ↑ entfernen', es: 'Eliminar mejoras del rival', it: 'Rimozione aumenti avversari', ja: '能力↑解除', ko: '능력↑ 해제', zh: '能力↑解除' },
  status: { en: 'Inflict Status', fr: 'Infliger une altération', de: 'Statusproblem zufügen', es: 'Causar problema de estado', it: 'Infliggi stato alterato', ja: '異常付与', ko: '상태 이상 부여', zh: '賦予異常狀態' },
  interference: { en: 'Inflict Interference', fr: 'Infliger une entrave', de: 'Störung zufügen', es: 'Causar interferencia', it: 'Infliggi interferenza', ja: '妨害付与', ko: '방해 상태 부여', zh: '賦予妨害狀態' },
  immunity: { en: 'Immunity', fr: 'Immunité', de: 'Immunität', es: 'Inmunidad', it: 'Immunità', ja: '無効', ko: '무효', zh: '免疫' },
  immunitySymbol: { en: '🚫', fr: '🚫', de: '🚫', es: '🚫', it: '🚫', ja: '🚫', ko: '🚫', zh: '🚫' },
  rebuff: { en: 'Rebuff', fr: 'Résilience au type ↓', de: 'Typ-Widerstand ↓', es: 'Resistencia de tipo ↓', it: 'Resistenza al tipo ↓', ja: 'タイプ抵抗↓', ko: '타입 저항↓', zh: '屬性抵抗↓' },
  rebuffUp: { en: 'Type Rebuff ↑', fr: 'Résilience au type ↑', de: 'Typ-Widerstand ↑', es: 'Resistencia de tipo ↑', it: 'Resistenza al tipo ↑', ja: 'タイプ抵抗↑', ko: '타입 저항↑', zh: '屬性抵抗↑' },
  masterPassive: { en: 'Master Passive', fr: 'Talent Maître', de: 'Meister-Passivfähigkeit', es: 'Habilidad maestra', it: 'Abilità Master', ja: 'マスターパッシブ', ko: '마스터 패시브', zh: '大師被動' },
  sunnyWeather: { en: 'Sunny', fr: 'Soleil', de: 'Sonne', es: 'Sol', it: 'Sole', ja: '晴れ', ko: '쾌청', zh: '晴天' },
  rainyWeather: { en: 'Rain', fr: 'Pluie', de: 'Regen', es: 'Lluvia', it: 'Pioggia', ja: '雨', ko: '비', zh: '下雨' },
  sandstormWeather: { en: 'Sandstorm', fr: 'Tempête de sable', de: 'Sandsturm', es: 'Tormenta de arena', it: 'Tempesta di sabbia', ja: 'すなあらし', ko: '모래바람', zh: '沙暴' },
  hailWeather: { en: 'Hailstorm', fr: 'Grêle', de: 'Hagel', es: 'Granizo', it: 'Grandine', ja: 'あられ', ko: '싸라기눈', zh: '冰雹' },
  electricTerrain: { en: 'Electric', fr: 'Électrik', de: 'Elektro', es: 'Eléctrico', it: 'Elettro', ja: 'エレキ', ko: '일렉트릭', zh: '電氣' },
  grassyTerrain: { en: 'Grassy', fr: 'Herbu', de: 'Gras', es: 'Hierba', it: 'Erba', ja: 'グラス', ko: '그래스', zh: '青草' },
  psychicTerrain: { en: 'Psychic', fr: 'Psychique', de: 'Psycho', es: 'Psíquico', it: 'Psico', ja: 'サイコ', ko: '사이코', zh: '精神' },
  fireType: { en: 'Fire', fr: 'Feu', de: 'Feuer', es: 'Fuego', it: 'Fuoco', ja: 'ほのお', ko: '불꽃', zh: '火' },
  waterType: { en: 'Water', fr: 'Eau', de: 'Wasser', es: 'Agua', it: 'Acqua', ja: 'みず', ko: '물', zh: '水' },
  electricType: { en: 'Electric', fr: 'Électrik', de: 'Elektro', es: 'Eléctrico', it: 'Elettro', ja: 'でんき', ko: '전기', zh: '電' },
  grassType: { en: 'Grass', fr: 'Plante', de: 'Pflanze', es: 'Planta', it: 'Erba', ja: 'くさ', ko: '풀', zh: '草' },
  psychicType: { en: 'Psychic', fr: 'Psy', de: 'Psycho', es: 'Psíquico', it: 'Psico', ja: 'エスパー', ko: '에스퍼', zh: '超能力' },
  stellarType: { en: 'Stellar', fr: 'Stellaire', de: 'Stellar', es: 'Astral', it: 'Astrale', ja: 'ステラ', ko: '스텔라', zh: '太晶' },
  normalZone: { en: 'Normal', fr: 'Normal', de: 'Normal', es: 'Normal', it: 'Normale', ja: 'ノーマル', ko: '노말', zh: '一般' },
  iceZone: { en: 'Ice', fr: 'Glace', de: 'Eis', es: 'Hielo', it: 'Ghiaccio', ja: 'こおり', ko: '얼음', zh: '冰' },
  fightingZone: { en: 'Fighting', fr: 'Combat', de: 'Kampf', es: 'Lucha', it: 'Lotta', ja: 'かくとう', ko: '격투', zh: '格鬥' },
  poisonZone: { en: 'Poison', fr: 'Poison', de: 'Gift', es: 'Veneno', it: 'Veleno', ja: 'どく', ko: '독', zh: '毒' },
  groundZone: { en: 'Ground', fr: 'Sol', de: 'Boden', es: 'Tierra', it: 'Terra', ja: 'じめん', ko: '땅', zh: '地面' },
  flyingZone: { en: 'Flying', fr: 'Vol', de: 'Flug', es: 'Volador', it: 'Volante', ja: 'ひこう', ko: '비행', zh: '飛行' },
  bugZone: { en: 'Bug', fr: 'Insecte', de: 'Käfer', es: 'Bicho', it: 'Coleottero', ja: 'むし', ko: '벌레', zh: '蟲' },
  rockZone: { en: 'Rock', fr: 'Roche', de: 'Gestein', es: 'Roca', it: 'Roccia', ja: 'いわ', ko: '바위', zh: '岩石' },
  ghostZone: { en: 'Ghost', fr: 'Spectre', de: 'Geist', es: 'Fantasma', it: 'Spettro', ja: 'ゴースト', ko: '고스트', zh: '幽靈' },
  dragonZone: { en: 'Dragon', fr: 'Dragon', de: 'Drache', es: 'Dragón', it: 'Drago', ja: 'ドラゴン', ko: '드래곤', zh: '龍' },
  darkZone: { en: 'Dark', fr: 'Ténèbres', de: 'Unlicht', es: 'Siniestro', it: 'Buio', ja: 'あく', ko: '악', zh: '惡' },
  steelZone: { en: 'Steel', fr: 'Acier', de: 'Stahl', es: 'Acero', it: 'Acciaio', ja: 'はがね', ko: '강철', zh: '鋼' },
  fairyZone: { en: 'Fairy', fr: 'Fée', de: 'Fee', es: 'Hada', it: 'Folletto', ja: 'フェアリー', ko: '페어리', zh: '妖精' },
  attack: { en: 'Attack', fr: 'Attaque', de: 'Angriff', es: 'Ataque', it: 'Attacco', ja: '攻撃', ko: '공격', zh: '攻擊' },
  spAttack: { en: 'Sp. Atk', fr: 'Atq. Spé.', de: 'Spezial-Angriff', es: 'At. Esp.', it: 'Att. Sp.', ja: '特攻', ko: '특수공격', zh: '特攻' },
  defense: { en: 'Defense', fr: 'Défense', de: 'Verteidigung', es: 'Defensa', it: 'Difesa', ja: '防御', ko: '방어', zh: '防御' },
  spDefense: { en: 'Sp. Def', fr: 'Déf. Spé.', de: 'Spezial-Verteidigung', es: 'Def. Esp.', it: 'Dif. Sp.', ja: '特防', ko: '특수방어', zh: '特防' },
  speed: { en: 'Speed', fr: 'Vitesse', de: 'Initiative', es: 'Velocidad', it: 'Velocità', ja: '素早さ', ko: '스피드', zh: '速度' },
  accuracy: { en: 'Accuracy', fr: 'Précision', de: 'Genauigkeit', es: 'Precisión', it: 'Precisione', ja: '命中率', ko: '명중률', zh: '命中率' },
  sureHitNext: { en: 'Guaranteed Hit', fr: 'Capacité immanquable', de: 'Garantierter Treffer', es: 'Golpe certero', it: 'Colpo sicuro', ja: '必中', ko: '필중', zh: '必中' },
  evasion: { en: 'Evasiveness', fr: 'Esquive', de: 'Fluchtwert', es: 'Evasión', it: 'Elusione', ja: '回避率', ko: '회피율', zh: '閃避率' },
  critical: { en: 'Critical rate', fr: 'Taux de critique', de: 'Volltrefferquote', es: 'Índice crítico', it: 'Probabilità di brutto colpo', ja: '急所率', ko: '급소율', zh: '要害率' },
  circlePhysical: { en: 'Physical', fr: 'Physique', de: 'Physisch', es: 'Físico', it: 'Fisico', ja: '物理', ko: '물리', zh: '物理' },
  circleSpecial: { en: 'Special', fr: 'Spécial', de: 'Spezial', es: 'Especial', it: 'Speciale', ja: '特殊', ko: '특수', zh: '特殊' },
  circleDefensive: { en: 'Defensive', fr: 'Défensif', de: 'Defensiv', es: 'Defensivo', it: 'Difensivo', ja: '防御', ko: '방어', zh: '防御' },
  physicalDamageReduction: { en: 'Physical Damage ↓', fr: 'Dégâts physiques ↓', de: 'Physischer Schaden ↓', es: 'Daño físico ↓', it: 'Danni fisici ↓', ja: '物理ダメージ軽減', ko: '물리 데미지 감소', zh: '物理傷害減輕' },
  specialDamageReduction: { en: 'Special Damage ↓', fr: 'Dégâts spéciaux ↓', de: 'Spezial-Schaden ↓', es: 'Daño especial ↓', it: 'Danni speciali ↓', ja: '特殊ダメージ軽減', ko: '특수 데미지 감소', zh: '特殊傷害減輕' },
  criticalHitDefense: { en: 'Critical-Hit Defense', fr: 'Défense anti-critique', de: 'Volltrefferschutz', es: 'Defensa contra críticos', it: 'Difesa dai brutti colpi', ja: '急所防御', ko: '급소 방어', zh: '要害防禦' },
  statusConditionDefense: { en: 'Status Defense', fr: 'Défense contre les altérations', de: 'Statusschutz', es: 'Defensa contra problemas de estado', it: 'Difesa dagli stati alterati', ja: '状態異常防御', ko: '상태 이상 방어', zh: '異常狀態防禦' },
  statusMoveDefense: { en: 'Status Move Defense', fr: 'Défense contre les capacités de statut', de: 'Status-Attacken-Schutz', es: 'Defensa contra movimientos de estado', it: 'Difesa dalle mosse di stato', ja: '変化技防御', ko: '변화기술 방어', zh: '變化招式防禦' },
  statReductionDefense: { en: 'Stat Reduction Defense', fr: 'Défense contre les baisses de stats', de: 'Wertesenkungsschutz', es: 'Defensa contra reducción de características', it: 'Difesa dalla riduzione delle statistiche', ja: '能力下降防御', ko: '능력치 하락 방어', zh: '能力下降防禦' },
  moveGaugeAcceleration: { en: 'Move Gauge Acceleration', fr: 'Accélération de la Jauge Capacité', de: 'Attackenleiste beschleunigt', es: 'Aceleración de la barra de movimientos', it: 'Accelerazione barra mosse', ja: 'わざゲージ加速', ko: '기술게이지 가속', zh: '招式計量槽加速' },
  fireDamageField: { en: 'Fire Damage Field', fr: 'Zone de dégâts Feu', de: 'Feuer-Schadensfeld', es: 'Campo de daño Fuego', it: 'Campo danni Fuoco', ja: 'ほのおダメージの場', ko: '불꽃 데미지 필드', zh: '火屬性傷害場地' },
  poisonDamageField: { en: 'Poison Damage Field', fr: 'Zone de dégâts Poison', de: 'Gift-Schadensfeld', es: 'Campo de daño Veneno', it: 'Campo danni Veleno', ja: 'どくダメージの場', ko: '독 데미지 필드', zh: '毒屬性傷害場地' },
  rockDamageField: { en: 'Rock Damage Field', fr: 'Zone de dégâts Roche', de: 'Gestein-Schadensfeld', es: 'Campo de daño Roca', it: 'Campo danni Roccia', ja: 'いわダメージの場', ko: '바위 데미지 필드', zh: '岩石屬性傷害場地' },
  darkDamageField: { en: 'Dark Damage Field', fr: 'Zone de dégâts Ténèbres', de: 'Unlicht-Schadensfeld', es: 'Campo de daño Siniestro', it: 'Campo danni Buio', ja: 'あくダメージの場', ko: '악 데미지 필드', zh: '惡屬性傷害場地' },
  steelDamageField: { en: 'Steel Damage Field', fr: 'Zone de dégâts Acier', de: 'Stahl-Schadensfeld', es: 'Campo de daño Acero', it: 'Campo danni Acciaio', ja: 'はがねダメージの場', ko: '강철 데미지 필드', zh: '鋼屬性傷害場地' },
  noStatIncreases: { en: 'No Stat Increases', fr: 'Hausse de stats impossible', de: 'Keine Werterhöhungen', es: 'Sin aumento de características', it: 'Aumento statistiche impossibile', ja: '能力上昇不可', ko: '능력치 상승 불가', zh: '能力無法提升' },
  poison: { en: 'Poison', fr: 'Poison', de: 'Vergiftung', es: 'Envenenamiento', it: 'Avvelenamento', ja: 'どく', ko: '독', zh: '中毒' },
  burn: { en: 'Burn', fr: 'Brûlure', de: 'Verbrennung', es: 'Quemadura', it: 'Scottatura', ja: 'やけど', ko: '화상', zh: '灼傷' },
  paralysis: { en: 'Paralysis', fr: 'Paralysie', de: 'Paralyse', es: 'Parálisis', it: 'Paralisi', ja: 'まひ', ko: '마비', zh: '麻痺' },
  sleep: { en: 'Sleep', fr: 'Sommeil', de: 'Schlaf', es: 'Sueño', it: 'Sonno', ja: 'ねむり', ko: '잠듦', zh: '睡眠' },
  freeze: { en: 'Freeze', fr: 'Gel', de: 'Einfrieren', es: 'Congelación', it: 'Congelamento', ja: 'こおり', ko: '얼음', zh: '冰凍' },
  flinch: { en: 'Flinch', fr: 'Apeurement', de: 'Zurückschrecken', es: 'Retroceso', it: 'Tentennamento', ja: 'ひるみ', ko: '풀죽음', zh: '畏縮' },
  confusion: { en: 'Confusion', fr: 'Confusion', de: 'Verwirrung', es: 'Confusión', it: 'Confusione', ja: 'こんらん', ko: '혼란', zh: '混乱' },
  trap: { en: 'Trap', fr: 'Ligotage', de: 'Fesselung', es: 'Atadura', it: 'Imprigionamento', ja: 'バインド', ko: '바인드', zh: '束縛' },
  statusImmunity: { en: 'Status Immunity', fr: 'Immunité aux altérations', de: 'Statusimmunität', es: 'Inmunidad a problemas de estado', it: 'Immunità agli stati alterati', ja: '異常無効', ko: '상태 이상 무효', zh: '異常狀態免疫' },
  statReductionImmunity: { en: 'Stat ↓ Immunity', fr: 'Immunité Stats ↓', de: 'Werte ↓ Immunität', es: 'Inmunidad Características ↓', it: 'Immunità Statistiche ↓', ja: '能力↓無効', ko: '능력↓ 무효', zh: '能力↓免疫' },
  interferenceImmunity: { en: 'Interference Immunity', fr: 'Immunité aux entraves', de: 'Störungsimmunität', es: 'Inmunidad a interferencias', it: 'Immunità alle interferenze', ja: '妨害無効', ko: '방해 무효', zh: '妨害免疫' },
  criticalHitImmunity: { en: 'Critical-Hit Immunity', fr: 'Immunité aux critiques', de: 'Volltrefferimmunität', es: 'Inmunidad a golpes críticos', it: 'Immunità ai brutti colpi', ja: '急所無効', ko: '급소 무효', zh: '要害免疫' },
  allStatusImmunity: { en: 'All Status Immunity', fr: 'Immunité à toutes les altérations', de: 'Immunität gegen alle Statusprobleme', es: 'Inmunidad a todos los problemas de estado', it: 'Immunità a tutti gli stati alterati', ja: '全状態異常無効', ko: '모든 상태 이상 무효', zh: '全異常狀態免疫' },
  allInterferenceImmunity: { en: 'All Interference Immunity', fr: 'Immunité à toutes les entraves', de: 'Immunität gegen alle Störungen', es: 'Inmunidad a todas las interferencias', it: 'Immunità a tutte le interferenze', ja: '全妨害無効', ko: '모든 방해 무효', zh: '全妨害免疫' },
  allStatReductionImmunity: { en: 'All Stats ↓ Immunity', fr: 'Immunité Toutes stats ↓', de: 'Alle Werte ↓ Immunität', es: 'Inmunidad Todas las características ↓', it: 'Immunità Tutte le statistiche ↓', ja: '全↓無効', ko: '모든 능력↓ 무효', zh: '全能力↓免疫' },
  poisonImmunity: { en: 'Poison Immunity', fr: 'Immunité au poison', de: 'Giftimmunität', es: 'Inmunidad al veneno', it: 'Immunità al veleno', ja: 'どく無効', ko: '독 무효', zh: '中毒免疫' },
  burnImmunity: { en: 'Burn Immunity', fr: 'Immunité aux brûlures', de: 'Verbrennungsimmunität', es: 'Inmunidad a quemaduras', it: 'Immunità alle scottature', ja: 'やけど無効', ko: '화상 무효', zh: '灼傷免疫' },
  paralysisImmunity: { en: 'Paralysis Immunity', fr: 'Immunité à la paralysie', de: 'Paralyseimmunität', es: 'Inmunidad a parálisis', it: 'Immunità alla paralisi', ja: 'まひ無効', ko: '마비 무효', zh: '麻痺免疫' },
  sleepImmunity: { en: 'Sleep Immunity', fr: 'Immunité au sommeil', de: 'Schlafimmunität', es: 'Inmunidad al sueño', it: 'Immunità al sonno', ja: 'ねむり無効', ko: '잠듦 무효', zh: '睡眠免疫' },
  freezeImmunity: { en: 'Freeze Immunity', fr: 'Immunité au gel', de: 'Einfrierimmunität', es: 'Inmunidad a congelación', it: 'Immunità al congelamento', ja: 'こおり無効', ko: '얼음 무효', zh: '冰凍免疫' },
  flinchImmunity: { en: 'Flinch Immunity', fr: 'Immunité à l’apeurement', de: 'Zurückschreckimmunität', es: 'Inmunidad al retroceso', it: 'Immunità al tentennamento', ja: 'ひるみ無効', ko: '풀죽음 무효', zh: '畏縮免疫' },
  confusionImmunity: { en: 'Confusion Immunity', fr: 'Immunité à la confusion', de: 'Verwirrungsimmunität', es: 'Inmunidad a confusión', it: 'Immunità alla confusione', ja: 'こんらん無効', ko: '혼란 무효', zh: '混亂免疫' },
  trapImmunity: { en: 'Trap Immunity', fr: 'Immunité au ligotage', de: 'Fesselungsimmunität', es: 'Inmunidad a ataduras', it: 'Immunità all’imprigionamento', ja: 'バインド無効', ko: '바인드 무효', zh: '束縛免疫' },
  attackReductionImmunity: { en: 'Attack ↓ Immunity', fr: 'Immunité Attaque ↓', de: 'Angriff ↓ Immunität', es: 'Inmunidad Ataque ↓', it: 'Immunità Attacco ↓', ja: '攻撃↓無効', ko: '공격↓ 무효', zh: '攻擊↓免疫' },
  spAttackReductionImmunity: { en: 'Sp. Atk ↓ Immunity', fr: 'Immunité Atq. Spé. ↓', de: 'Spezial-Angriff ↓ Immunität', es: 'Inmunidad At. Esp. ↓', it: 'Immunità Att. Sp. ↓', ja: '特攻↓無効', ko: '특수공격↓ 무효', zh: '特攻↓免疫' },
  defenseReductionImmunity: { en: 'Defense ↓ Immunity', fr: 'Immunité Défense ↓', de: 'Verteidigung ↓ Immunität', es: 'Inmunidad Defensa ↓', it: 'Immunità Difesa ↓', ja: '防御↓無効', ko: '방어↓ 무효', zh: '防禦↓免疫' },
  spDefenseReductionImmunity: { en: 'Sp. Def ↓ Immunity', fr: 'Immunité Déf. Spé. ↓', de: 'Spezial-Verteidigung ↓ Immunität', es: 'Inmunidad Def. Esp. ↓', it: 'Immunità Dif. Sp. ↓', ja: '特防↓無効', ko: '특수방어↓ 무효', zh: '特防↓免疫' },
  speedReductionImmunity: { en: 'Speed ↓ Immunity', fr: 'Immunité Vitesse ↓', de: 'Initiative ↓ Immunität', es: 'Inmunidad Velocidad ↓', it: 'Immunità Velocità ↓', ja: '素早さ↓無効', ko: '스피드↓ 무효', zh: '速度↓免疫' },
  accuracyReductionImmunity: { en: 'Accuracy ↓ Immunity', fr: 'Immunité Précision ↓', de: 'Genauigkeit ↓ Immunität', es: 'Inmunidad Precisión ↓', it: 'Immunità Precisione ↓', ja: '命中率↓無効', ko: '명중률↓ 무효', zh: '命中率↓免疫' },
  evasionReductionImmunity: { en: 'Evasiveness ↓ Immunity', fr: 'Immunité Esquive ↓', de: 'Fluchtwert ↓ Immunität', es: 'Inmunidad Evasión ↓', it: 'Immunità Elusione ↓', ja: '回避率↓無効', ko: '회피율↓ 무효', zh: '閃避率↓免疫' },
  masterPhysical: { en: 'Physical', fr: 'Physique', de: 'Physisch', es: 'Físico', it: 'Fisico', ja: '物理マスター', ko: '물리', zh: '物理' },
  masterSpecial: { en: 'Special', fr: 'Spécial', de: 'Spezial', es: 'Especial', it: 'Speciale', ja: '特殊マスター', ko: '특수', zh: '特殊' },
  masterGeneral: { en: 'General', fr: 'Général', de: 'Allgemein', es: 'General', it: 'Generale', ja: '汎用マスター', ko: '범용', zh: '泛用' },
};

const STAT_REDUCTION_IMMUNITY_TOOLTIP_NOTES = {
  en: 'Also includes effects that turn stat reductions into equal stat increases.',
  fr: 'Inclut aussi les effets qui transforment les baisses de stats en hausses équivalentes.',
  de: 'Enthält auch Effekte, die Wertesenkungen in gleich hohe Erhöhungen umkehren.',
  es: 'También incluye efectos que convierten las reducciones de características en aumentos equivalentes.',
  it: 'Include anche gli effetti che trasformano le riduzioni delle statistiche in aumenti equivalenti.',
  ja: '能力がさがる代わりに同じ分だけあがる効果も含みます。',
  ko: '능력치 하락을 같은 수치의 상승으로 바꾸는 효과도 포함합니다.',
  zh: '也包含将能力下降转为等量提升的效果。',
};

const STAT_REDUCTION_REVERSAL_TOOLTIP_NOTES = {
  en: 'Also includes all-stat effects that turn stat reductions into equal stat increases.',
  fr: 'Inclut aussi les effets pour toutes les stats qui transforment les baisses en hausses équivalentes.',
  de: 'Enthält auch Effekte für alle Werte, die Senkungen in gleich hohe Erhöhungen umkehren.',
  es: 'También incluye efectos para todas las características que convierten reducciones en aumentos equivalentes.',
  it: 'Include anche gli effetti per tutte le statistiche che trasformano le riduzioni in aumenti equivalenti.',
  ja: '能力がさがる代わりに同じ分だけあがる、全能力対象の効果も含みます。',
  ko: '모든 능력치 하락을 같은 수치의 상승으로 바꾸는 효과도 포함합니다.',
  zh: '也包含将任意能力下降转为等量提升的全能力效果。',
};

const SURE_HIT_TOOLTIP_NOTES = {
  en: 'Includes Sure Hit Next, moves that never miss, and unconditional or conditional effects that make moves never miss.',
  fr: 'Inclut Prochaine capacité immanquable, les capacités qui n’échouent jamais et les effets conditionnels ou non qui les rendent immanquables.',
  de: 'Enthält Garantierter Treffer (Nächste), Attacken, die nie verfehlen, sowie bedingte oder unbedingte Effekte, durch die Attacken nie verfehlen.',
  es: 'Incluye Golpe certero siguiente, movimientos que nunca fallan y efectos condicionales o incondicionales que hacen que los movimientos nunca fallen.',
  it: 'Include Colpo sicuro prossimo, mosse che non falliscono mai ed effetti condizionati o incondizionati che rendono le mosse infallibili.',
  ja: '必中状態の付与・必ず命中する技・無条件または特定条件で技が必ず命中する効果を含みます。',
  ko: '필중 차례 효과, 반드시 명중하는 기술, 조건부 또는 무조건으로 기술이 반드시 명중하는 효과를 포함합니다.',
  zh: '包含赋予必中状态、招式自身必定命中，以及无条件或特定条件下招式必定命中的效果。',
};

const CIRCLE_DETAIL_TOOLTIP_LABELS = {
  circlePhysical: { en: 'Physical Circle', fr: 'Cercle physique', de: 'Physischer Kreis', es: 'Círculo físico', it: 'Cerchio fisico', ja: '物理サークル', ko: '물리 서클', zh: '物理圓環' },
  circleSpecial: { en: 'Special Circle', fr: 'Cercle spécial', de: 'Spezial-Kreis', es: 'Círculo especial', it: 'Cerchio speciale', ja: '特殊サークル', ko: '특수 서클', zh: '特殊圓環' },
  circleDefensive: { en: 'Defensive Circle', fr: 'Cercle défensif', de: 'Defensiver Kreis', es: 'Círculo defensivo', it: 'Cerchio difensivo', ja: '防御サークル', ko: '방어 서클', zh: '防禦圓環' },
};

const CIRCLE_REGION_ANCHOR_TRANSLATIONS = {
  en: { label: '→ Region', tooltip: 'Filter Circles further by region' },
  fr: { label: '→ Région', tooltip: 'Affiner les Cercles par région' },
  de: { label: '→ Region', tooltip: 'Kreise weiter nach Region filtern' },
  es: { label: '→ Región', tooltip: 'Filtrar más los Círculos por región' },
  it: { label: '→ Regione', tooltip: 'Filtra ulteriormente i Cerchi per regione' },
  ja: { label: '→ 地方', tooltip: '地方でサークルを絞り込む' },
  ko: { label: '→ 지방', tooltip: '지방으로 서클을 더 필터링' },
  zh: { label: '→ 地區', tooltip: '按地區進一步篩選圓環' },
};

const OPPONENT_STAT_INCREASE_REMOVAL_TOOLTIP_NOTES = {
  en: 'Includes effects that reset, reverse, or steal the opponent’s raised stats.',
  fr: 'Inclut les effets qui annulent, inversent ou volent les hausses de stats adverses.',
  de: 'Enthält Effekte, die erhöhte gegnerische Werte zurücksetzen, umkehren oder stehlen.',
  es: 'Incluye efectos que restablecen, invierten o roban las mejoras de características del rival.',
  it: 'Include effetti che azzerano, invertono o sottraggono gli aumenti delle statistiche avversarie.',
  ja: '相手のあがった能力をもとに戻す・反転する・奪う効果を含みます。',
  ko: '상대의 상승한 능력치를 되돌리거나 반전하거나 빼앗는 효과를 포함합니다.',
  zh: '包含重置、反转或夺取对手能力提升的效果。',
};

function skillFilterLabels(value) {
  const directLabels = SKILL_FILTER_TRANSLATIONS[value];
  if (directLabels) return directLabels;
  const rebuff = REBUFF_DETAIL_CONFIG[value] || REBUFF_UP_DETAIL_CONFIG[value];
  if (rebuff) {
    const typeLabels = SKILL_FILTER_TRANSLATIONS[rebuff.labelKey];
    const rebuffLabels = SKILL_FILTER_TRANSLATIONS[REBUFF_UP_DETAIL_CONFIG[value] ? 'rebuffUp' : 'rebuff'];
    return Object.fromEntries(Object.keys(typeLabels).map((locale) => [
      locale,
      `${typeLabels[locale]}${locale === 'ja' || locale === 'zh' ? '' : ' '}${rebuffLabels[locale]}`,
    ]));
  }
  let translationKey = value;
  let prefix = '';
  let suffix = '';
  if (value.startsWith('ex')) {
    translationKey = `${value[2].toLowerCase()}${value.slice(3)}`;
    prefix = 'EX ';
  } else if (value.endsWith('Up') || value.endsWith('Down')) {
    suffix = value.endsWith('Up') ? ' ↑' : ' ↓';
    translationKey = value.replace(/(?:Up|Down)$/, '');
  }
  const labels = SKILL_FILTER_TRANSLATIONS[translationKey];
  return Object.fromEntries(Object.entries(labels).map(([locale, label]) => [locale, `${prefix}${label}${suffix}`]));
}

const SKILL_FILTER_CATEGORIES = [
  {
    value: 'weather', group: 'field',
    labels: skillFilterLabels('weather'),
    patterns: {
      en: [['makes', 'weather'], ['causes', 'sandstorm'], ['causes', 'hailstorm'], ['causes', 'snow']],
      ja: [['天気を', 'にする']],
      zh: [['天氣', '變成'], ['天气', '变成'], ['使天氣'], ['使天气']],
    },
  },
  {
    value: 'terrain', group: 'field',
    labels: skillFilterLabels('terrain'),
    patterns: {
      en: [['turns', 'terrain', 'into']],
      ja: [['フィールドを', 'にする']],
      zh: [['場地', '變成'], ['场地', '变成']],
    },
  },
  {
    value: 'zone', group: 'field',
    labels: skillFilterLabels('zone'),
    patterns: {
      en: [['turns', 'zone', 'into']],
      ja: [['ゾーンを', 'にする']],
      zh: [['領域', '變成'], ['领域', '变成']],
    },
  },
  {
    value: 'weatherEx', group: 'field',
    labels: skillFilterLabels('weatherEx'),
    patterns: { en: [['ex sunny'], ['ex rainy'], ['ex sandstorm'], ['ex hailstorm'], ['ex snow']] },
  },
  {
    value: 'terrainEx', group: 'field',
    labels: skillFilterLabels('terrainEx'),
    patterns: { en: [['ex electric terrain'], ['ex grassy terrain'], ['ex psychic terrain']] },
  },
  {
    value: 'zoneEx', group: 'field',
    labels: skillFilterLabels('zoneEx'),
    patterns: { en: [
      ['ex normal zone'], ['ex ice zone'], ['ex fighting zone'], ['ex poison zone'],
      ['ex ground zone'], ['ex flying zone'], ['ex bug zone'], ['ex rock zone'],
      ['ex ghost zone'], ['ex dragon zone'], ['ex dark zone'], ['ex steel zone'], ['ex fairy zone'],
    ] },
  },
  {
    value: 'circle', group: 'field',
    labels: skillFilterLabels('circle'),
    patterns: {
      en: [['applies', 'circle', 'allied field']],
      ja: [['味方全体の場を', 'サークル', 'にする']],
      zh: [['我方全體的場地', '圓環'], ['我方全体的场地', '圆环']],
    },
  },
  {
    value: 'alliedField', group: 'field',
    labels: skillFilterLabels('alliedField'),
    patterns: { en: [
      ['physical damage reduction effect'], ['special damage reduction effect'],
      ['critical-hit defense effect'], ['status condition defense effect'],
      ['status move defense effect'], ['stat reduction defense effect'],
      ['move gauge acceleration effect'],
    ] },
  },
  {
    value: 'opponentField', group: 'field',
    labels: skillFilterLabels('opponentField'),
    patterns: { en: [
      ['fire damage field'], ['poison damage field'], ['rock damage field'],
      ['dark damage field'], ['steel damage field'], ['no stat increases effect'],
    ] },
  },
  {
    value: 'statUp', group: 'utility',
    labels: skillFilterLabels('statUp'),
    patterns: { en: [['raises', 'stat rank']], ja: [['段階あげる'], ['段階上げる']], zh: [['提高', '階'], ['提高', '级']] },
  },
  {
    value: 'statDown', group: 'utility',
    labels: skillFilterLabels('statDown'),
    patterns: { en: [['lowers', 'stat rank'], ...OPPONENT_STAT_INCREASE_REMOVAL_PATTERNS], ja: [['段階さげる'], ['段階下げる']], zh: [['降低', '階'], ['降低', '级']] },
  },
  {
    value: 'status', group: 'utility',
    labels: skillFilterLabels('status'),
    patterns: { en: Object.values(STATUS_INFLICT_PATTERNS).flat() },
  },
  {
    value: 'interference', group: 'utility',
    labels: skillFilterLabels('interference'),
    patterns: { en: Object.values(INTERFERENCE_INFLICT_PATTERNS).flat() },
  },
  {
    value: 'sureHitNext', group: 'utility',
    labels: skillFilterLabels('sureHitNext'),
    tooltipNotes: SURE_HIT_TOOLTIP_NOTES,
    patterns: { en: [['sure hit next effect'], ['never miss']] },
  },
  { value: 'statusImmunity', group: 'utility', labels: skillFilterLabels('statusImmunity'), patterns: { en: Object.values(STATUS_IMMUNITY_DETAIL_PATTERNS).flat() } },
  { value: 'interferenceImmunity', group: 'utility', labels: skillFilterLabels('interferenceImmunity'), patterns: { en: Object.values(INTERFERENCE_IMMUNITY_DETAIL_PATTERNS).flat() } },
  { value: 'statReductionImmunity', group: 'utility', labels: skillFilterLabels('statReductionImmunity'), tooltipNotes: STAT_REDUCTION_IMMUNITY_TOOLTIP_NOTES, patterns: { en: Object.values(STAT_REDUCTION_IMMUNITY_DETAIL_PATTERNS).flat() } },
  { value: 'criticalHitImmunity', group: 'utility', labels: skillFilterLabels('criticalHitImmunity'), patterns: { en: IMMUNITY_FILTER_PATTERNS.criticalHitImmunity } },
  {
    value: 'rebuff', group: 'utility',
    labels: skillFilterLabels('rebuff'),
    patterns: { en: Object.values(REBUFF_DETAIL_CONFIG).flatMap((detail) => rebuffDetailPatterns('lowers', detail)) },
  },
  {
    value: 'rebuffUp', group: 'utility',
    labels: skillFilterLabels('rebuffUp'),
    patterns: { en: Object.values(REBUFF_UP_DETAIL_CONFIG).flatMap((detail) => rebuffDetailPatterns('raises', detail)) },
  },
  {
    value: 'masterPassive', group: 'utility', iconName: 'icon_master',
    masterPassiveType: 'all',
    labels: skillFilterLabels('masterPassive'),
  },
];

const SKILL_FILTER_DETAILS = [
  ['sunnyWeather', 'weather', [['makes the weather sunny']]],
  ['rainyWeather', 'weather', [['makes the weather rainy']]],
  ['sandstormWeather', 'weather', [['causes a sandstorm']]],
  ['hailWeather', 'weather', [['causes a hailstorm']]],
  ['electricTerrain', 'terrain', [['terrain into electric terrain']]],
  ['grassyTerrain', 'terrain', [['terrain into grassy terrain']]],
  ['psychicTerrain', 'terrain', [['terrain into psychic terrain']]],
  ['normalZone', 'zone', [['zone into a normal zone'], ['zone into an normal zone']]],
  ['iceZone', 'zone', [['zone into an ice zone'], ['zone into a ice zone']]],
  ['fightingZone', 'zone', [['zone into a fighting zone']]],
  ['poisonZone', 'zone', [['zone into a poison zone']]],
  ['groundZone', 'zone', [['zone into a ground zone']]],
  ['flyingZone', 'zone', [['zone into a flying zone']]],
  ['bugZone', 'zone', [['zone into a bug zone']]],
  ['rockZone', 'zone', [['zone into a rock zone']]],
  ['ghostZone', 'zone', [['zone into a ghost zone']]],
  ['dragonZone', 'zone', [['zone into a dragon zone']]],
  ['darkZone', 'zone', [['zone into a dark zone']]],
  ['steelZone', 'zone', [['zone into a steel zone']]],
  ['fairyZone', 'zone', [['zone into a fairy zone']]],
  ['exSunnyWeather', 'weatherEx', [['ex sunny']]],
  ['exRainyWeather', 'weatherEx', [['ex rainy']]],
  ['exSandstormWeather', 'weatherEx', [['ex sandstorm']]],
  ['exHailWeather', 'weatherEx', [['ex hailstorm']]],
  ['exElectricTerrain', 'terrainEx', [['ex electric terrain']]],
  ['exGrassyTerrain', 'terrainEx', [['ex grassy terrain']]],
  ['exPsychicTerrain', 'terrainEx', [['ex psychic terrain']]],
  ['exNormalZone', 'zoneEx', [['ex normal zone']]],
  ['exIceZone', 'zoneEx', [['ex ice zone']]],
  ['exFightingZone', 'zoneEx', [['ex fighting zone']]],
  ['exPoisonZone', 'zoneEx', [['ex poison zone']]],
  ['exGroundZone', 'zoneEx', [['ex ground zone']]],
  ['exFlyingZone', 'zoneEx', [['ex flying zone']]],
  ['exBugZone', 'zoneEx', [['ex bug zone']]],
  ['exRockZone', 'zoneEx', [['ex rock zone']]],
  ['exGhostZone', 'zoneEx', [['ex ghost zone']]],
  ['exDragonZone', 'zoneEx', [['ex dragon zone']]],
  ['exDarkZone', 'zoneEx', [['ex dark zone']]],
  ['exSteelZone', 'zoneEx', [['ex steel zone']]],
  ['exFairyZone', 'zoneEx', [['ex fairy zone']]],
  ['circlePhysical', 'circle', [['circle (physical)']]],
  ['circleSpecial', 'circle', [['circle (special)']]],
  ['circleDefensive', 'circle', [['circle (defensive)']]],
  ['physicalDamageReduction', 'alliedField', [['physical damage reduction effect']]],
  ['specialDamageReduction', 'alliedField', [['special damage reduction effect']]],
  ['criticalHitDefense', 'alliedField', [['critical-hit defense effect']]],
  ['statusConditionDefense', 'alliedField', [['status condition defense effect']]],
  ['statusMoveDefense', 'alliedField', [['status move defense effect']]],
  ['statReductionDefense', 'alliedField', [['stat reduction defense effect']]],
  ['moveGaugeAcceleration', 'alliedField', [['move gauge acceleration effect']]],
  ['fireDamageField', 'opponentField', [['fire damage field']]],
  ['poisonDamageField', 'opponentField', [['poison damage field']]],
  ['rockDamageField', 'opponentField', [['rock damage field']]],
  ['darkDamageField', 'opponentField', [['dark damage field']]],
  ['steelDamageField', 'opponentField', [['steel damage field']]],
  ['noStatIncreases', 'opponentField', [['no stat increases effect']]],
  ['attackUp', 'statUp', [['raises', 'attack', 'stat rank']]],
  ['spAttackUp', 'statUp', [['raises', 'sp. atk', 'stat rank']]],
  ['defenseUp', 'statUp', [['raises', 'defense', 'stat rank']]],
  ['spDefenseUp', 'statUp', [['raises', 'sp. def', 'stat rank']]],
  ['speedUp', 'statUp', [['raises', 'speed', 'stat rank']]],
  ['accuracyUp', 'statUp', [['raises', 'accuracy', 'stat rank']]],
  ['evasionUp', 'statUp', [['raises', 'evasiveness', 'stat rank']]],
  ['criticalUp', 'statUp', [['raises', 'critical-hit rate']]],
  ['attackDown', 'statDown', [['lowers', 'attack', 'stat rank']]],
  ['spAttackDown', 'statDown', [['lowers', 'sp. atk', 'stat rank']]],
  ['defenseDown', 'statDown', [['lowers', 'defense', 'stat rank']]],
  ['spDefenseDown', 'statDown', [['lowers', 'sp. def', 'stat rank']]],
  ['speedDown', 'statDown', [['lowers', 'speed', 'stat rank']]],
  ['accuracyDown', 'statDown', [['lowers', 'accuracy', 'stat rank']]],
  ['evasionDown', 'statDown', [['lowers', 'evasiveness', 'stat rank']]],
  ['opponentStatIncreaseRemoval', 'statDown', OPPONENT_STAT_INCREASE_REMOVAL_PATTERNS],
  ['poison', 'status', STATUS_INFLICT_PATTERNS.poison],
  ['burn', 'status', STATUS_INFLICT_PATTERNS.burn],
  ['paralysis', 'status', STATUS_INFLICT_PATTERNS.paralysis],
  ['sleep', 'status', STATUS_INFLICT_PATTERNS.sleep],
  ['freeze', 'status', STATUS_INFLICT_PATTERNS.freeze],
  ['flinch', 'interference', INTERFERENCE_INFLICT_PATTERNS.flinch],
  ['confusion', 'interference', INTERFERENCE_INFLICT_PATTERNS.confusion],
  ['trap', 'interference', INTERFERENCE_INFLICT_PATTERNS.trap],
  ...Object.entries(STATUS_IMMUNITY_DETAIL_PATTERNS).map(([value, patterns]) => [value, 'statusImmunity', patterns]),
  ...Object.entries(INTERFERENCE_IMMUNITY_DETAIL_PATTERNS).map(([value, patterns]) => [value, 'interferenceImmunity', patterns]),
  ...Object.entries(STAT_REDUCTION_IMMUNITY_DETAIL_PATTERNS).map(([value, patterns]) => [value, 'statReductionImmunity', patterns]),
  ...Object.entries(REBUFF_DETAIL_CONFIG).map(([value, detail]) => [value, 'rebuff', rebuffDetailPatterns('lowers', detail)]),
  ...Object.entries(REBUFF_UP_DETAIL_CONFIG).map(([value, detail]) => [value, 'rebuffUp', rebuffDetailPatterns('raises', detail)]),
  ['masterPhysical', 'masterPassive', [], 'physical'],
  ['masterSpecial', 'masterPassive', [], 'special'],
  ['masterGeneral', 'masterPassive', [], 'general'],
].map(([value, detailOf, patterns, masterPassiveType]) => ({
  value,
  detailOf,
  group: SKILL_FILTER_CATEGORIES.find((category) => category.value === detailOf)?.group || 'utility',
  labels: skillFilterLabels(value),
  ...(CIRCLE_DETAIL_TOOLTIP_LABELS[value] ? { tooltipLabels: CIRCLE_DETAIL_TOOLTIP_LABELS[value] } : {}),
  patterns: { en: patterns },
  ...(value === 'allStatReductionImmunity' ? { tooltipNotes: STAT_REDUCTION_IMMUNITY_TOOLTIP_NOTES } : {}),
  ...(['attackReductionImmunity', 'spAttackReductionImmunity', 'defenseReductionImmunity', 'spDefenseReductionImmunity', 'speedReductionImmunity', 'accuracyReductionImmunity', 'evasionReductionImmunity'].includes(value)
    ? { tooltipNotes: STAT_REDUCTION_REVERSAL_TOOLTIP_NOTES }
    : {}),
  ...(value === 'opponentStatIncreaseRemoval' ? {
    tooltipNotes: OPPONENT_STAT_INCREASE_REMOVAL_TOOLTIP_NOTES,
    suppressStatDirection: true,
  } : {}),
  ...(() => {
    const baseValue = value.startsWith('ex') ? `${value[2].toLowerCase()}${value.slice(3)}` : value;
    const icon = FIELD_DETAIL_ICON_CONFIG[baseValue];
    return icon ? { ...icon, iconOnly: icon.iconOnly !== false, exVariant: value.startsWith('ex') } : {};
  })(),
  ...(REBUFF_DETAIL_CONFIG[value] ? {
    iconSrc: REBUFF_DETAIL_CONFIG[value].iconSrc,
    iconOnly: true,
    rebuffDirection: REBUFF_DETAIL_CONFIG[value].rebuffDirection,
  } : {}),
  ...(REBUFF_UP_DETAIL_CONFIG[value] ? { iconSrc: REBUFF_UP_DETAIL_CONFIG[value].iconSrc, iconOnly: true, rebuffDirection: '↑' } : {}),
  ...((STAT_DECREASE_ICON_URLS[value.replace(/(?:Up|Down)$/, '')] || CONDITION_FILTER_ICON_URLS[value]) ? {
    iconSrc: (value.endsWith('Up') ? STAT_INCREASE_ICON_URLS : STAT_DECREASE_ICON_URLS)[value.replace(/(?:Up|Down)$/, '')]
      || CONDITION_FILTER_ICON_URLS[value],
    iconOnly: true,
  } : {}),
  ...(() => {
    const iconKey = IMMUNITY_DETAIL_ICON_KEYS[value];
    const iconSrc = STAT_DECREASE_ICON_URLS[iconKey] || CONDITION_FILTER_ICON_URLS[iconKey];
    return iconSrc ? {
      iconSrc,
      compactLabels: skillFilterLabels('immunitySymbol'),
      attributeDirection: STAT_DECREASE_ICON_URLS[iconKey] ? '↓' : '',
    } : {};
  })(),
  ...(masterPassiveType ? { masterPassiveType, compactLabels: { ja: 'マスター' } } : {}),
  ...(value === 'masterPhysical' ? {
    iconSrcs: [MASTER_PASSIVE_ICON_URLS.physical],
  } : value === 'masterSpecial' ? {
    iconSrcs: [MASTER_PASSIVE_ICON_URLS.special],
  } : value === 'masterGeneral' ? {
    iconSrcs: [MASTER_PASSIVE_ICON_URLS.physical, MASTER_PASSIVE_ICON_URLS.special],
  } : {}),
}));

SKILL_FILTER_CATEGORIES.push(...SKILL_FILTER_DETAILS);
