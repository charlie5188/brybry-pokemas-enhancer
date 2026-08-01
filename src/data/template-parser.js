function brybryParameterValues(entry) {
  if (!entry) return [];
  const values = [];
  for (let index = 1; index < 50; index += 2) {
    values.push(Number(entry[`param${index}`]) >= 0 ? entry[`param${index + 1}`] : null);
  }
  return values;
}

function brybryTemplateAttributes(source) {
  const attributes = { Idx: '0', Ref: '0' };
  String(source || '').replace(/(\w+)="([^"]*)"/g, (match, name, value) => {
    attributes[name] = value;
    return match;
  });
  return attributes;
}

function brybryDocumentsMatchPatterns(documents, patterns) {
  const normalize = (value) => String(value || '').normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
  return documents.some((documentText) => {
    // A move can contain several independent effects. Match every capability
    // within one effect sentence so terms from e.g. "poisons the target" and
    // "removes trap from the user" cannot be combined into a false result.
    // Protect "Sp." because it is part of stat names rather than a sentence end.
    const protectedText = String(documentText || '').replace(/\bSp\./gi, (value) => value.replace('.', '\u2024'));
    const segments = protectedText
      .split(/(?:[.!?。！？]\s+|\r?\n+)(?=[A-Z0-9\[(])/)
      .map((segment) => normalize(segment.replace(/\u2024/g, '.')))
      .filter(Boolean);
    return segments.some((segment) => (
      patterns.some((requiredTerms) => requiredTerms.every((term) => segment.includes(normalize(term))))
    ));
  });
}

function brybryMasterPassiveKind(passiveId, resolvedEnglishName = '') {
  const numericId = Number(passiveId);
  if (!Number.isFinite(numericId) || numericId < 28000000 || numericId >= 29000000) return '';
  const normalizedName = String(resolvedEnglishName).normalize('NFKC').toLocaleLowerCase();
  if (normalizedName.includes('pride')) return 'physical';
  if (normalizedName.includes('spirit')) return 'special';
  return 'general';
}

function expandBrybryParts(template, partTag, parts, onPart, maxPasses = 16) {
  let result = String(template ?? '');
  if (!partTag || !parts) return result;
  const pattern = new RegExp(`\\[Name:${partTag}\\s+Idx="([^"]+)"\\s*\\]`, 'gi');
  for (let pass = 0; pass < maxPasses; pass += 1) {
    let changed = false;
    result = result.replace(pattern, (placeholder, id) => {
      if (parts[String(id)] === undefined) return placeholder;
      changed = true;
      return onPart ? onPart(String(parts[String(id)]), String(id)) : String(parts[String(id)]);
    });
    if (!changed) break;
  }
  return result;
}

function createBrybryTemplateResolver({
  parametersById,
  numbers,
  referencedMessages,
  moveNames,
  passiveNames,
  passiveNameParts,
  moveDescriptions,
  moveDescriptionParts,
  passiveDescriptions,
  passiveDescriptionParts,
}) {
  const passiveNameCache = new Map();
  const resolvingPassiveNames = new Set();
  const parameterValues = (id) => brybryParameterValues(parametersById.get(String(id)));
  const localizedValue = (table, key) => table instanceof Map ? table.get(String(key)) : table?.[String(key)];

  function resolvePlaceholders(id, template) {
    const params = parameterValues(id);
    return String(template ?? '').replace(/\[([A-Z]{2}|Digit|Name):([^\s\]]+)([^\]]*)\]/g, (placeholder, type, subtype, rawAttributes) => {
      const attributes = brybryTemplateAttributes(rawAttributes);
      if (type === 'Digit') {
        return localizedValue(numbers, params[Number(attributes.Idx) || 0]) ?? placeholder;
      }
      if (type === 'Name' && subtype === 'ReferencedMessageTag') {
        return localizedValue(referencedMessages, params[Number(attributes.Idx) || 0]) ?? placeholder;
      }
      if (type === 'Name' && subtype === 'MoveId') {
        return localizedValue(moveNames, attributes.Idx) ?? placeholder;
      }
      if (type === 'Name' && subtype === 'PassiveSkillId') {
        return resolvePassiveName(attributes.Idx) || placeholder;
      }
      if (['DE', 'EN', 'ES', 'FR', 'IT'].includes(type) && subtype === 'Qty') {
        const quantity = Number(params[Number(attributes.Ref) || 0]);
        return quantity > 1 ? (attributes.P ?? placeholder) : (attributes.S ?? placeholder);
      }
      return placeholder;
    });
  }

  function resolvePassiveName(id) {
    const key = String(id);
    if (passiveNameCache.has(key)) return passiveNameCache.get(key);
    if (resolvingPassiveNames.has(key)) return String(passiveNames?.[key] || '');
    resolvingPassiveNames.add(key);
    const expanded = expandBrybryParts(passiveNames?.[key], 'PassiveSkillNameParts', passiveNameParts, (part, partId) => (
      part.replace(/\[Name:PassiveSkillNameDigit \]/gi, String(Math.max(0, Number(key) - Number(partId))))
    ));
    const resolved = resolvePlaceholders(key, expanded);
    resolvingPassiveNames.delete(key);
    passiveNameCache.set(key, resolved);
    return resolved;
  }

  function resolvePassiveDescription(id) {
    const key = String(id);
    const expanded = expandBrybryParts(passiveDescriptions?.[key], 'PassiveSkillDescriptionPartsIdTag', passiveDescriptionParts);
    return resolvePlaceholders(key, expanded);
  }

  function resolveMoveDescription(id) {
    const key = String(id);
    const expanded = expandBrybryParts(moveDescriptions?.[key], 'MoveDescriptionPartsIdTag', moveDescriptionParts);
    return resolvePlaceholders(key, expanded);
  }

  return { resolveMoveDescription, resolvePassiveDescription, resolvePassiveName, resolvePlaceholders };
}
