const ROOT_ID = 'brybry-enhancer-root';
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
const PICKER_PREFERENCES_KEY = 'brybry-enhancer-picker-preferences';
const GRID_PREFERENCES_KEY = 'brybry-enhancer-sync-grid-builds';
const PREFERENCE_VERSION = 3;
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
const STAT_FILTER_ICON_URLS = {
  attack: 'https://pomatools.github.io/assets/img/battle/STAT_002L.png',
  defense: 'https://pomatools.github.io/assets/img/battle/STAT_004L.png',
  spAttack: 'https://pomatools.github.io/assets/img/battle/STAT_008L.png',
  spDefense: 'https://pomatools.github.io/assets/img/battle/STAT_016L.png',
  speed: 'https://pomatools.github.io/assets/img/battle/STAT_032L.png',
  accuracy: 'https://pomatools.github.io/assets/img/battle/STAT_064L.png',
  evasion: 'https://pomatools.github.io/assets/img/battle/STAT_128L.png',
  critical: 'https://pomatools.github.io/assets/img/battle/STAT_256L.png',
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
};
const SKILL_FILTER_CATEGORIES = [
  {
    value: 'weather', group: 'field',
    labels: { en: 'Weather', fr: 'Météo', de: 'Wetter', es: 'Clima', it: 'Meteo', ja: '天気', ko: '날씨', zh: '天气' },
    patterns: {
      en: [['makes', 'weather'], ['causes', 'sandstorm'], ['causes', 'hailstorm'], ['causes', 'snow']],
      ja: [['天気を', 'にする']],
      zh: [['天氣', '變成'], ['天气', '变成'], ['使天氣'], ['使天气']],
    },
  },
  {
    value: 'terrain', group: 'field',
    labels: { en: 'Terrain', fr: 'Champ', de: 'Feld', es: 'Campo', it: 'Campo', ja: 'フィールド', ko: '필드', zh: '场地' },
    patterns: {
      en: [['turns', 'terrain', 'into']],
      ja: [['フィールドを', 'にする']],
      zh: [['場地', '變成'], ['场地', '变成']],
    },
  },
  {
    value: 'zone', group: 'field',
    labels: { en: 'Zone', fr: 'Zone', de: 'Zone', es: 'Zona', it: 'Zona', ja: 'ゾーン', ko: '존', zh: '领域' },
    patterns: {
      en: [['turns', 'zone', 'into']],
      ja: [['ゾーンを', 'にする']],
      zh: [['領域', '變成'], ['领域', '变成']],
    },
  },
  {
    value: 'weatherEx', group: 'field',
    labels: { en: 'EX Weather', fr: 'Météo EX', de: 'EX-Wetter', es: 'Clima EX', it: 'Meteo EX', ja: 'EX天気', ko: 'EX 날씨', zh: 'EX天气' },
    patterns: { en: [['ex sunny'], ['ex rainy'], ['ex sandstorm'], ['ex hailstorm'], ['ex snow']] },
  },
  {
    value: 'terrainEx', group: 'field',
    labels: { en: 'EX Terrain', fr: 'Champ EX', de: 'EX-Feld', es: 'Campo EX', it: 'Campo EX', ja: 'EXフィールド', ko: 'EX 필드', zh: 'EX场地' },
    patterns: { en: [['ex electric terrain'], ['ex grassy terrain'], ['ex psychic terrain']] },
  },
  {
    value: 'zoneEx', group: 'field',
    labels: { en: 'EX Zone', fr: 'Zone EX', de: 'EX-Zone', es: 'Zona EX', it: 'Zona EX', ja: 'EXゾーン', ko: 'EX 존', zh: 'EX领域' },
    patterns: { en: [
      ['ex normal zone'], ['ex ice zone'], ['ex fighting zone'], ['ex poison zone'],
      ['ex ground zone'], ['ex flying zone'], ['ex bug zone'], ['ex rock zone'],
      ['ex ghost zone'], ['ex dragon zone'], ['ex dark zone'], ['ex steel zone'], ['ex fairy zone'],
    ] },
  },
  {
    value: 'circle', group: 'field', iconName: 'icon_circle',
    labels: { en: 'Circle', fr: 'Cercle', de: 'Kreis', es: 'Círculo', it: 'Cerchio', ja: 'サークル', ko: '서클', zh: '圆环' },
    patterns: {
      en: [['applies', 'circle', 'allied field']],
      ja: [['味方全体の場を', 'サークル', 'にする']],
      zh: [['我方全體的場地', '圓環'], ['我方全体的场地', '圆环']],
    },
  },
  {
    value: 'statUp', group: 'utility',
    labels: { en: 'Stat ↑', fr: 'Stats ↑', de: 'Werte ↑', es: 'Características ↑', it: 'Statistiche ↑', ja: '能力↑', ko: '능력↑', zh: '能力↑' },
    patterns: { en: [['raises', 'stat rank']], ja: [['段階あげる'], ['段階上げる']], zh: [['提高', '階'], ['提高', '级']] },
  },
  {
    value: 'statDown', group: 'utility',
    labels: { en: 'Stat ↓', fr: 'Stats ↓', de: 'Werte ↓', es: 'Características ↓', it: 'Statistiche ↓', ja: '能力↓', ko: '능력↓', zh: '能力↓' },
    patterns: { en: [['lowers', 'stat rank']], ja: [['段階さげる'], ['段階下げる']], zh: [['降低', '階'], ['降低', '级']] },
  },
  {
    value: 'status', group: 'utility',
    labels: { en: 'Status', fr: 'Altérations', de: 'Statusprobleme', es: 'Problemas de estado', it: 'Problemi di stato', ja: '状態異常', ko: '상태 이상', zh: '异常状态' },
    patterns: { en: Object.values(STATUS_INFLICT_PATTERNS).flat() },
  },
  {
    value: 'interference', group: 'utility',
    labels: { en: 'Interference', fr: 'Entraves', de: 'Störungen', es: 'Interferencias', it: 'Interferenze', ja: '妨害状態', ko: '방해 상태', zh: '妨害状态' },
    patterns: { en: Object.values(INTERFERENCE_INFLICT_PATTERNS).flat() },
  },
  {
    value: 'rebuff', group: 'utility',
    labels: { en: 'Rebuff', fr: 'Résilience au type ↓', de: 'Typ-Widerstand ↓', es: 'Resistencia de tipo ↓', it: 'Resistenza al tipo ↓', ja: 'タイプ抵抗↓', ko: '타입 저항↓', zh: '属性抵抗↓' },
    patterns: { en: [['type rebuff'], ['rebuff']], ja: [['タイプ抵抗']], zh: [['屬性抵抗'], ['属性抵抗']] },
  },
  {
    value: 'masterPassive', group: 'utility', iconName: 'icon_master',
    masterPassiveType: 'all',
    labels: { en: 'Master Passive', fr: 'Talent Maître', de: 'Meister-Passivfähigkeit', es: 'Habilidad maestra', it: 'Abilità Master', ja: 'マスターパッシブ', ko: '마스터 패시브', zh: '大师被动' },
  },
];

const SKILL_FILTER_DETAILS = [
  ['sunnyWeather', 'weather', 'Sunny', '晴れ', '晴天', [['makes the weather sunny']]],
  ['rainyWeather', 'weather', 'Rain', '雨', '下雨', [['makes the weather rainy']]],
  ['sandstormWeather', 'weather', 'Sandstorm', 'すなあらし', '沙暴', [['causes a sandstorm']]],
  ['hailWeather', 'weather', 'Hailstorm', 'あられ', '冰雹', [['causes a hailstorm']]],
  ['electricTerrain', 'terrain', 'Electric', 'エレキ', '电气', [['terrain into electric terrain']]],
  ['grassyTerrain', 'terrain', 'Grassy', 'グラス', '青草', [['terrain into grassy terrain']]],
  ['psychicTerrain', 'terrain', 'Psychic', 'サイコ', '精神', [['terrain into psychic terrain']]],
  ['normalZone', 'zone', 'Normal', 'ノーマル', '一般', [['zone into a normal zone'], ['zone into an normal zone']]],
  ['iceZone', 'zone', 'Ice', 'こおり', '冰', [['zone into an ice zone'], ['zone into a ice zone']]],
  ['fightingZone', 'zone', 'Fighting', 'かくとう', '格斗', [['zone into a fighting zone']]],
  ['poisonZone', 'zone', 'Poison', 'どく', '毒', [['zone into a poison zone']]],
  ['groundZone', 'zone', 'Ground', 'じめん', '地面', [['zone into a ground zone']]],
  ['flyingZone', 'zone', 'Flying', 'ひこう', '飞行', [['zone into a flying zone']]],
  ['bugZone', 'zone', 'Bug', 'むし', '虫', [['zone into a bug zone']]],
  ['rockZone', 'zone', 'Rock', 'いわ', '岩石', [['zone into a rock zone']]],
  ['ghostZone', 'zone', 'Ghost', 'ゴースト', '幽灵', [['zone into a ghost zone']]],
  ['dragonZone', 'zone', 'Dragon', 'ドラゴン', '龙', [['zone into a dragon zone']]],
  ['darkZone', 'zone', 'Dark', 'あく', '恶', [['zone into a dark zone']]],
  ['steelZone', 'zone', 'Steel', 'はがね', '钢', [['zone into a steel zone']]],
  ['fairyZone', 'zone', 'Fairy', 'フェアリー', '妖精', [['zone into a fairy zone']]],
  ['exSunnyWeather', 'weatherEx', 'EX Sunny', 'EX晴れ', 'EX晴天', [['ex sunny']]],
  ['exRainyWeather', 'weatherEx', 'EX Rain', 'EX雨', 'EX下雨', [['ex rainy']]],
  ['exSandstormWeather', 'weatherEx', 'EX Sandstorm', 'EXすなあらし', 'EX沙暴', [['ex sandstorm']]],
  ['exHailWeather', 'weatherEx', 'EX Hailstorm', 'EXあられ', 'EX冰雹', [['ex hailstorm']]],
  ['exElectricTerrain', 'terrainEx', 'EX Electric', 'EXエレキ', 'EX电气', [['ex electric terrain']]],
  ['exGrassyTerrain', 'terrainEx', 'EX Grassy', 'EXグラス', 'EX青草', [['ex grassy terrain']]],
  ['exPsychicTerrain', 'terrainEx', 'EX Psychic', 'EXサイコ', 'EX精神', [['ex psychic terrain']]],
  ['exNormalZone', 'zoneEx', 'EX Normal', 'EXノーマル', 'EX一般', [['ex normal zone']]],
  ['exIceZone', 'zoneEx', 'EX Ice', 'EXこおり', 'EX冰', [['ex ice zone']]],
  ['exFightingZone', 'zoneEx', 'EX Fighting', 'EXかくとう', 'EX格斗', [['ex fighting zone']]],
  ['exPoisonZone', 'zoneEx', 'EX Poison', 'EXどく', 'EX毒', [['ex poison zone']]],
  ['exGroundZone', 'zoneEx', 'EX Ground', 'EXじめん', 'EX地面', [['ex ground zone']]],
  ['exFlyingZone', 'zoneEx', 'EX Flying', 'EXひこう', 'EX飞行', [['ex flying zone']]],
  ['exBugZone', 'zoneEx', 'EX Bug', 'EXむし', 'EX虫', [['ex bug zone']]],
  ['exRockZone', 'zoneEx', 'EX Rock', 'EXいわ', 'EX岩石', [['ex rock zone']]],
  ['exGhostZone', 'zoneEx', 'EX Ghost', 'EXゴースト', 'EX幽灵', [['ex ghost zone']]],
  ['exDragonZone', 'zoneEx', 'EX Dragon', 'EXドラゴン', 'EX龙', [['ex dragon zone']]],
  ['exDarkZone', 'zoneEx', 'EX Dark', 'EXあく', 'EX恶', [['ex dark zone']]],
  ['exSteelZone', 'zoneEx', 'EX Steel', 'EXはがね', 'EX钢', [['ex steel zone']]],
  ['exFairyZone', 'zoneEx', 'EX Fairy', 'EXフェアリー', 'EX妖精', [['ex fairy zone']]],
  ['circlePhysical', 'circle', 'Physical', '物理', '物理', [['circle (physical)']]],
  ['circleSpecial', 'circle', 'Special', '特殊', '特殊', [['circle (special)']]],
  ['circleDefensive', 'circle', 'Defensive', '防御', '防御', [['circle (defensive)']]],
  ['attackUp', 'statUp', 'Attack ↑', '攻撃↑', '攻击↑', [['raises', 'attack', 'stat rank']]],
  ['spAttackUp', 'statUp', 'Sp. Atk ↑', '特攻↑', '特攻↑', [['raises', 'sp. atk', 'stat rank']]],
  ['defenseUp', 'statUp', 'Defense ↑', '防御↑', '防御↑', [['raises', 'defense', 'stat rank']]],
  ['spDefenseUp', 'statUp', 'Sp. Def ↑', '特防↑', '特防↑', [['raises', 'sp. def', 'stat rank']]],
  ['speedUp', 'statUp', 'Speed ↑', '素早さ↑', '速度↑', [['raises', 'speed', 'stat rank']]],
  ['accuracyUp', 'statUp', 'Accuracy ↑', '命中率↑', '命中率↑', [['raises', 'accuracy', 'stat rank']]],
  ['evasionUp', 'statUp', 'Evasiveness ↑', '回避率↑', '闪避率↑', [['raises', 'evasiveness', 'stat rank']]],
  ['criticalUp', 'statUp', 'Critical rate ↑', '急所率↑', '要害率↑', [['raises', 'critical-hit rate']]],
  ['attackDown', 'statDown', 'Attack ↓', '攻撃↓', '攻击↓', [['lowers', 'attack', 'stat rank']]],
  ['spAttackDown', 'statDown', 'Sp. Atk ↓', '特攻↓', '特攻↓', [['lowers', 'sp. atk', 'stat rank']]],
  ['defenseDown', 'statDown', 'Defense ↓', '防御↓', '防御↓', [['lowers', 'defense', 'stat rank']]],
  ['spDefenseDown', 'statDown', 'Sp. Def ↓', '特防↓', '特防↓', [['lowers', 'sp. def', 'stat rank']]],
  ['speedDown', 'statDown', 'Speed ↓', '素早さ↓', '速度↓', [['lowers', 'speed', 'stat rank']]],
  ['accuracyDown', 'statDown', 'Accuracy ↓', '命中率↓', '命中率↓', [['lowers', 'accuracy', 'stat rank']]],
  ['evasionDown', 'statDown', 'Evasiveness ↓', '回避率↓', '闪避率↓', [['lowers', 'evasiveness', 'stat rank']]],
  ['poison', 'status', 'Poison', 'どく', '中毒', STATUS_INFLICT_PATTERNS.poison],
  ['burn', 'status', 'Burn', 'やけど', '灼伤', STATUS_INFLICT_PATTERNS.burn],
  ['paralysis', 'status', 'Paralysis', 'まひ', '麻痹', STATUS_INFLICT_PATTERNS.paralysis],
  ['sleep', 'status', 'Sleep', 'ねむり', '睡眠', STATUS_INFLICT_PATTERNS.sleep],
  ['freeze', 'status', 'Freeze', 'こおり', '冰冻', STATUS_INFLICT_PATTERNS.freeze],
  ['flinch', 'interference', 'Flinch', 'ひるみ', '畏缩', INTERFERENCE_INFLICT_PATTERNS.flinch],
  ['confusion', 'interference', 'Confusion', 'こんらん', '混乱', INTERFERENCE_INFLICT_PATTERNS.confusion],
  ['trap', 'interference', 'Trap', 'バインド', '束缚', INTERFERENCE_INFLICT_PATTERNS.trap],
  ['masterPhysical', 'masterPassive', 'Physical', '物理', '物理', [], 'physical'],
  ['masterSpecial', 'masterPassive', 'Special', '特殊', '特殊', [], 'special'],
  ['masterGeneral', 'masterPassive', 'General', '汎用', '泛用', [], 'general'],
].map(([value, detailOf, en, ja, zh, patterns, masterPassiveType]) => ({
  value,
  detailOf,
  group: SKILL_FILTER_CATEGORIES.find((category) => category.value === detailOf)?.group || 'utility',
  labels: { en, ja, zh },
  patterns: { en: patterns },
  ...(() => {
    const baseValue = value.startsWith('ex') ? `${value[2].toLowerCase()}${value.slice(3)}` : value;
    const icon = FIELD_DETAIL_ICON_CONFIG[baseValue];
    return icon ? { ...icon, iconOnly: true, exVariant: value.startsWith('ex') } : {};
  })(),
  ...((STAT_FILTER_ICON_URLS[value.replace(/(?:Up|Down)$/, '')] || CONDITION_FILTER_ICON_URLS[value]) ? {
    iconSrc: STAT_FILTER_ICON_URLS[value.replace(/(?:Up|Down)$/, '')] || CONDITION_FILTER_ICON_URLS[value],
    iconOnly: true,
  } : {}),
  ...(masterPassiveType ? { masterPassiveType } : {}),
  ...(value === 'masterPhysical' ? {
    iconSrc: 'https://pomatools.github.io/assets/img/battle/ROLE_001P.png', iconOnly: true,
  } : value === 'masterSpecial' ? {
    iconSrc: 'https://pomatools.github.io/assets/img/battle/ROLE_001S.png', iconOnly: true,
  } : value === 'masterGeneral' ? { iconName: 'role_multi', iconOnly: true } : {}),
}));

SKILL_FILTER_CATEGORIES.push(...SKILL_FILTER_DETAILS);
