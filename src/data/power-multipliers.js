// Community-verified multiplier rules mirrored from the PomaTools calculation
// model. Rules are keyed by stable passive-skill IDs, never by localized text or
// Sync Pair IDs. Unknown and bespoke effects intentionally return no estimate.
const FIXED_POWER_MULTIPLIER_FAMILIES = new Set([
  130101, 130102, 130103, 130104, 130106, 130107, 130109,
  130111, 130112, 130113, 130114, 130115, 130116, 130117,
  130121, 130125, 130126, 130143, 130144, 130151, 130154,
  160103, 160108, 160112, 160126,
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

  const family = Math.floor(id / 100);
  if (FIXED_POWER_MULTIPLIER_FAMILIES.has(family)) {
    const level = id % 10;
    return level > 0 ? { kind: 'fixed', value: level * 10 } : null;
  }
  if (SINGLE_STAT_SYNC_MULTIPLIERS.has(id)) return { kind: 'cap', value: 100 };
  if (MULTI_STAT_SYNC_MULTIPLIERS.has(id)) return { kind: 'cap', value: 120 };
  if (SINGLE_STAT_MOVE_MULTIPLIERS.has(id)) return { kind: 'cap', value: 30 };
  if (TWO_STAT_MOVE_MULTIPLIERS.has(id)) return { kind: 'cap', value: 60 };
  if (MULTI_STAT_MOVE_MULTIPLIERS.has(id)) return { kind: 'cap', value: 110 };
  return null;
}
