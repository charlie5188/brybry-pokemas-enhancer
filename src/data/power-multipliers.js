// Community-verified multiplier rules mirrored from the PomaTools calculation
// model. Rules are keyed by stable passive-skill IDs, never by localized text or
// Sync Pair IDs. Unknown and bespoke effects intentionally return no estimate.
const FIXED_POWER_MULTIPLIER_FAMILIES = new Set([
  130101, 130102, 130103, 130104, 130106, 130107, 130109,
  130111, 130112, 130113, 130114, 130115, 130116, 130117,
  130121, 130125, 130126, 130143, 130144, 130151, 130154,
  130171,
  130118, 130122, 130127, 130128, 130137, 130148, 130158,
  130160, 130161, 130162, 130163, 130164, 130165, 130168,
  130169, 130170, 130173, 130174, 130175, 130177, 130178,
  130180, 130181, 130182, 130183, 130184, 130185, 130188,
  130194, 130197, 130198, 130199,
  130801, 130802, 130803, 130804, 130806, 130807, 130808,
  130809, 130810, 130814, 130815, 130819, 130820, 130822,
  130824, 130828, 130835, 130837, 130842, 130843, 130845,
  130848, 130849, 130852, 130856,
  160103, 160104, 160108, 160109, 160110, 160111, 160112,
  160117, 160118, 160120, 160121, 160123, 160126, 160129,
  160130, 160131, 160132, 160133, 160134, 160135, 160140,
  160141, 160143, 160145, 160146, 160147, 160148, 160149,
  160150, 160152, 160154, 160155, 160156, 160157, 160158,
  160159, 160160, 160161, 160162, 160163, 160164, 160165,
  160167, 160168, 160169, 160170, 160171, 160173, 160174,
  160175, 160176, 160177, 160178, 160179, 160180, 160181,
  160182, 160183, 160186, 160187, 160193, 160194, 160197,
  160198, 160199, 160302, 160305, 160307, 160308, 160313,
  160315, 160316, 160318,
]);

// These use an HP percentage rather than a conventional stat rank. Their
// maximums are 10% per level at full HP and 5% per level at minimum HP.
const HIGH_HP_POWER_MULTIPLIER_FAMILIES = new Set([130110]);
const LOW_HP_POWER_MULTIPLIER_FAMILIES = new Set([130136]);
const MOVE_GAUGE_POWER_MULTIPLIER_FAMILIES = new Set([130105]);

// Hostile Environment repeats a move's original additional-effect chance once
// per rank, so rank 1 doubles it and rank 9 multiplies it by ten. This is not
// an additive percentage-point bonus.
function statusChanceMultiplierForPassiveId(passiveId) {
  const id = Number(passiveId);
  if (Math.floor(id / 100) !== 220101) return null;
  const rank = id % 10;
  return rank > 0 ? rank + 1 : null;
}

// The localized name says "2×"; its passive ID level is not the multiplier.
const EXACT_POWER_MULTIPLIERS = new Map([
  [13085301, { kind: 'fixed', value: 100 }],
  [13085001, { kind: 'cap', value: 30 }],
  [16013701, { kind: 'cap', value: 100 }],
]);

const SINGLE_STAT_SYNC_MULTIPLIERS = new Set([
  16010501, 16010601, 16010701, 16011301, 16011501, 16011601,
  16012201, 16012501, 16012801, 16013601, 16013801, 16013901,
  16014401,
]);

const MULTI_STAT_SYNC_MULTIPLIERS = new Set([16012401, 16014201]);

const SINGLE_STAT_MOVE_MULTIPLIERS = new Set([
  13011901, 13012301, 13012401, 13013001, 13013101, 13013201,
  13013301, 13013401, 13013501, 13013801, 13013901, 13014001,
  13014101, 13014901,
]);

const TWO_STAT_MOVE_MULTIPLIERS = new Set([13016701]);
const MULTI_STAT_MOVE_MULTIPLIERS = new Set([13014201, 13015701]);

function powerMultiplierForPassiveId(passiveId) {
  const id = Number(passiveId);
  if (!Number.isFinite(id) || id <= 0) return null;

  const exact = EXACT_POWER_MULTIPLIERS.get(id);
  if (exact) return { ...exact };

  const family = Math.floor(id / 100);
  if (FIXED_POWER_MULTIPLIER_FAMILIES.has(family)) {
    const level = id % 10;
    return level > 0 ? { kind: 'fixed', value: level * 10 } : null;
  }
  if (HIGH_HP_POWER_MULTIPLIER_FAMILIES.has(family)) {
    const level = id % 10;
    return level > 0 ? { kind: 'cap', value: level * 10 } : null;
  }
  if (LOW_HP_POWER_MULTIPLIER_FAMILIES.has(family)) {
    const level = id % 10;
    return level > 0 ? { kind: 'cap', value: level * 5 } : null;
  }
  if (MOVE_GAUGE_POWER_MULTIPLIER_FAMILIES.has(family)) {
    const level = id % 10;
    return level > 0 ? { kind: 'cap', value: level * 6 } : null;
  }
  if (SINGLE_STAT_SYNC_MULTIPLIERS.has(id)) return { kind: 'cap', value: 100 };
  if (MULTI_STAT_SYNC_MULTIPLIERS.has(id)) return { kind: 'cap', value: 120 };
  if (SINGLE_STAT_MOVE_MULTIPLIERS.has(id)) return { kind: 'cap', value: 30 };
  if (TWO_STAT_MOVE_MULTIPLIERS.has(id)) return { kind: 'cap', value: 60 };
  if (MULTI_STAT_MOVE_MULTIPLIERS.has(id)) return { kind: 'cap', value: 110 };
  return null;
}

// Type Guard skills use stable passive families. The normal version reduces
// damage by 10%, while the group version ("Guard G") reduces it by 30%.
function damageReductionForPassiveId(passiveId, englishDescription = '') {
  const id = Number(passiveId);
  const family = Math.floor(id / 10);
  if (family >= 240101 && family <= 240118) return 10;
  if (family >= 240120 && family <= 240129) return 30;

  // Most conditional reduction families state their verified rate in the
  // resolved description (for example, "10% per rank"). Use the passive's
  // final digit as the rank only when the description explicitly says so.
  const description = String(englishDescription || '').normalize('NFKC');
  const perRank = description.match(/(?:reduce|reduced|reduction)[^.]*damage[^.]*by\s+(\d+)%\s+per\s+rank/i);
  if (perRank) {
    const rank = Math.abs(id) % 10;
    return rank > 0 ? Number(perRank[1]) * rank : null;
  }
  const fixed = description.match(/(?:reduce|reduced|reduction)[^.]*damage[^.]*by\s+(\d+)%/i);
  if (fixed) return Number(fixed[1]);
  return null;
}
