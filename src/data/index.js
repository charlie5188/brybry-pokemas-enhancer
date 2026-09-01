async function loadCoreData() {
  if (trainerById.size) return;
  const [trainerResponse, scheduleResponse] = await Promise.all([
    fetch(TRAINER_DATA_URL),
    fetch(SCHEDULE_DATA_URL),
  ]);
  if (!trainerResponse.ok) throw new Error(`Unable to load ${TRAINER_DATA_URL} (${trainerResponse.status})`);
  if (!scheduleResponse.ok) throw new Error(`Unable to load ${SCHEDULE_DATA_URL} (${scheduleResponse.status})`);
  const [trainers, schedules] = await Promise.all([trainerResponse.json(), scheduleResponse.json()]);
  trainerById = new Map((trainers.entries || []).map((trainer) => [String(trainer.trainerId), trainer]));
  releaseDateByScheduleId = new Map((schedules.entries || []).map((schedule) => [
    String(schedule.scheduleId),
    Number(schedule.startDate) || 0,
  ]));
}

function addSkillEntry(index, trainerId, passiveId, availableDate = 0) {
  const id = Number(passiveId);
  if (!trainerId || !id) return;
  const pairSkills = index.get(String(trainerId)) || new Map();
  const existingDate = pairSkills.get(String(id));
  const date = Number(availableDate) || 0;
  if (existingDate === undefined || date < existingDate) pairSkills.set(String(id), date);
  index.set(String(trainerId), pairSkills);
}

function addMoveEntry(index, trainerId, moveId, availableDate = 0) {
  const id = Number(moveId);
  if (!trainerId || id <= 0) return;
  const pairMoves = index.get(String(trainerId)) || new Map();
  const existingDate = pairMoves.get(String(id));
  const date = Number(availableDate) || 0;
  if (existingDate === undefined || date < existingDate) pairMoves.set(String(id), date);
  index.set(String(trainerId), pairMoves);
}

function gridAbilitySkillTemplate(ability) {
  const passiveId = Number(ability?.passiveId);
  return POMATOOLS_SKILL_ABBR.ja?.[String(Math.floor(passiveId / 10))] || '';
}

function abilityTargetsWholeMoveSet(ability) {
  return gridAbilitySkillTemplate(ability).includes(' 技回数回復');
}

function relatedMoveIdsForAbilityPanel(panel, ability) {
  const directMoveId = Number(ability?.moveId);
  if (directMoveId > 0) return [String(directMoveId)];

  // Some generic passive-grid abilities do not store a moveId. Resolve the
  // relevant slots from the pair's move data instead of guessing one slot.
  const skillTemplate = gridAbilitySkillTemplate(ability);
  if (!skillTemplate) return [];

  const trainer = trainerById.get(String(panel?.trainerId));
  const moveIds = [1, 2, 3, 4]
    .map((slot) => String(trainer?.[`move${slot}Id`] || ''))
    .filter((moveId) => moveById.has(moveId));
  const targetsTrainerMove = skillTemplate.includes('T技');
  const targetsPokemonMove = skillTemplate.includes('P技');
  // Generic MP-recovery passives such as 「初B技後 技回数回復」 affect the
  // whole move set; tooltip presentation later filters this to limited-use moves.
  const targetsAllMoves = abilityTargetsWholeMoveSet(ability);
  return moveIds.filter((moveId) => {
    const user = moveById.get(moveId)?.user;
    return targetsAllMoves
      || (targetsTrainerMove && user === 'Trainer')
      || (targetsPokemonMove && user === 'Pokemon');
  });
}

function buildPairSkillIndex(trainers, monsterVariations, abilityPanels, abilityById, superawakenings) {
  const index = new Map();
  const syncCountdownIndex = new Map();
  const moveIndex = new Map();
  const theoreticalMoveIndex = new Map();
  const moveEntryIndex = new Map();
  const variationsByMonsterId = new Map();
  (monsterVariations.entries || []).forEach((variation) => {
    const variations = variationsByMonsterId.get(String(variation.monsterId)) || [];
    variations.push(variation);
    variationsByMonsterId.set(String(variation.monsterId), variations);
  });
  (trainers.entries || []).forEach((trainer) => {
    const trainerMoves = new Set([1, 2, 3, 4].map((slot) => Number(trainer[`move${slot}Id`])).filter((id) => id > 0));
    trainerMoves.forEach((moveId) => addMoveEntry(moveEntryIndex, trainer.trainerId, moveId));
    [1, 2, 3, 4, 5].forEach((slot) => {
      addSkillEntry(index, trainer.trainerId, trainer[`passive${slot}Id`]);
      addSkillEntry(syncCountdownIndex, trainer.trainerId, trainer[`passive${slot}Id`]);
    });
    const monster = monsterById.get(String(trainer.monsterId));
    [monster?.syncMoveId, monster?.move1ChangeId, monster?.move2ChangeId, monster?.move3ChangeId, monster?.move4ChangeId]
      .map(Number).filter((id) => id > 0).forEach((id) => {
        trainerMoves.add(id);
        addMoveEntry(moveEntryIndex, trainer.trainerId, id);
      });
    const monsterBase = monsterBaseById.get(String(monster?.monsterBaseId));
    addSkillEntry(index, trainer.trainerId, monsterBase?.formPassiveId);
    addSkillEntry(syncCountdownIndex, trainer.trainerId, monsterBase?.formPassiveId);
    theoreticalMoveIndex.set(String(trainer.trainerId), new Set([...trainerMoves].filter((id) => id > 0).map(String)));
    (variationsByMonsterId.get(String(trainer.monsterId)) || []).forEach((variation) => {
      const availableDate = releaseDateByScheduleId.get(String(variation.scheduleId)) || 0;
      [1, 2, 3, 4, 5].forEach((slot) => {
        addSkillEntry(index, trainer.trainerId, variation[`passive${slot}Id`], availableDate);
        addSkillEntry(syncCountdownIndex, trainer.trainerId, variation[`passive${slot}Id`], availableDate);
      });
      [1, 2, 3, 4].forEach((slot) => {
        const moveId = Number(variation[`move${slot}Id`]);
        trainerMoves.add(moveId);
        addMoveEntry(moveEntryIndex, trainer.trainerId, moveId, availableDate);
        if (moveId > 0) theoreticalMoveIndex.get(String(trainer.trainerId))?.add(String(moveId));
      });
      [variation.syncMoveId, variation.moveDynamax1Id, variation.moveDynamax2Id, variation.moveDynamax3Id,
        variation.moveDynamax4Id, variation.terastalMoveId]
        .map(Number).filter((id) => id > 0).forEach((id) => {
          trainerMoves.add(id);
          addMoveEntry(moveEntryIndex, trainer.trainerId, id, availableDate);
          theoreticalMoveIndex.get(String(trainer.trainerId))?.add(String(id));
        });
    });
    moveIndex.set(String(trainer.trainerId), new Set([...trainerMoves].filter((id) => id > 0).map(String)));
  });
  (abilityPanels.entries || []).forEach((panel) => {
    const ability = abilityById.get(String(panel.abilityId));
    const availableDate = releaseDateByScheduleId.get(String(panel.scheduleId)) || 0;
    addSkillEntry(index, panel.trainerId, ability?.passiveId, availableDate);
    addSkillEntry(syncCountdownIndex, panel.trainerId, ability?.passiveId, availableDate);
  });
  (superawakenings.entries || []).forEach((entry) => {
    const availableDate = releaseDateByScheduleId.get(String(entry.scheduleId)) || 0;
    addSkillEntry(index, entry.trainerId, entry.passiveSkillId, availableDate);
    addSkillEntry(syncCountdownIndex, entry.trainerId, entry.passiveSkillId, availableDate);
  });
  skillEntriesByTrainerId = index;
  syncCountdownSkillEntriesByTrainerId = syncCountdownIndex;
  moveIdsByTrainerId = moveIndex;
  moveEntriesByTrainerId = moveEntryIndex;
  theoreticalMoveIdsByTrainerId = theoreticalMoveIndex;
  passiveSkillSearchCache.clear();
  pairSkillSearchCache.clear();
  pairMoveSearchCache.clear();
  pairSkillSearchDocumentsCache.clear();
  pairMoveSearchDocumentsCache.clear();
  passiveSkillDetailCache.clear();
  pairSkillIdCache.clear();
  pairSkillCategoryMatchCache.clear();
  pairSyncCountdownReductionCache.clear();
  pairListCacheKey = '';
}

function pairDamagingMoveTypes(pairId) {
  const result = new Set();
  const now = Date.now() / 1000;
  moveEntriesByTrainerId.get(String(pairId))?.forEach((availableDate, moveId) => {
    if (spoilerProtectionEnabled && availableDate > now) return;
    const move = moveById.get(String(moveId));
    if (!move || move.group === 'Sync' || !['Physical', 'Special'].includes(move.category) || Number(move.power) <= 0) return;
    if (Number(move.type) > 0) result.add(String(move.type));
  });
  return result;
}

async function loadLocalizedSkillSearchData(resolvedLocale) {
  if (passiveSkillTextDataByLocale.has(resolvedLocale) && moveTextDataByLocale.has(resolvedLocale)) return;
  if (!skillTemplateParameterLoadPromise) {
    skillTemplateParameterLoadPromise = fetch(SKILL_TEMPLATE_PARAMETER_DATA_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load ${SKILL_TEMPLATE_PARAMETER_DATA_URL} (${response.status})`);
        return response.json();
      })
      .then((data) => {
        skillTemplateParametersById = new Map((data.entries || []).map((entry) => [String(entry.id), entry]));
      });
  }
  await skillTemplateParameterLoadPromise;
  const sources = PASSIVE_SKILL_SEARCH_URLS[resolvedLocale];
  const keys = ['names', 'nameParts', 'descriptions', 'descriptionParts'];
  const responses = await Promise.all(keys.map((key) => fetch(sources[key])));
  responses.forEach((response, index) => {
    if (!response.ok) throw new Error(`Unable to load ${sources[keys[index]]} (${response.status})`);
  });
  const values = await Promise.all(responses.map((response) => response.json()));
  const passiveData = Object.fromEntries(keys.map((key, index) => [key, values[index]]));
  const moveSources = MOVE_DESCRIPTION_URLS[resolvedLocale];
  const moveKeys = ['descriptions', 'descriptionParts'];
  const moveResponses = await Promise.all(moveKeys.map((key) => fetch(moveSources[key])));
  moveResponses.forEach((response, index) => {
    if (!response.ok) throw new Error(`Unable to load ${moveSources[moveKeys[index]]} (${response.status})`);
  });
  const moveValues = await Promise.all(moveResponses.map((response) => response.json()));
  const moveData = Object.fromEntries(moveKeys.map((key, index) => [key, moveValues[index]]));
  const templateSources = SKILL_TEMPLATE_LOCALE_URLS[resolvedLocale];
  const [numbersResponse, referencedMessagesResponse] = await Promise.all([
    fetch(templateSources.numbers),
    fetch(templateSources.referencedMessages),
  ]);
  if (!numbersResponse.ok) throw new Error(`Unable to load ${templateSources.numbers} (${numbersResponse.status})`);
  if (!referencedMessagesResponse.ok) throw new Error(`Unable to load ${templateSources.referencedMessages} (${referencedMessagesResponse.status})`);
  const [numbers, referencedMessages] = await Promise.all([numbersResponse.json(), referencedMessagesResponse.json()]);
  const resolver = createBrybryTemplateResolver({
    parametersById: skillTemplateParametersById,
    numbers,
    referencedMessages,
    moveNames: moveNameByLocale[resolvedLocale],
    passiveNames: passiveData.names,
    passiveNameParts: passiveData.nameParts,
    moveDescriptions: moveData.descriptions,
    moveDescriptionParts: moveData.descriptionParts,
    passiveDescriptions: passiveData.descriptions,
    passiveDescriptionParts: passiveData.descriptionParts,
  });
  passiveData.resolver = resolver;
  moveData.resolver = resolver;
  passiveSkillTextDataByLocale.set(resolvedLocale, passiveData);
  moveTextDataByLocale.set(resolvedLocale, moveData);
  skillTemplateResolverByLocale.set(resolvedLocale, resolver);
  passiveSkillSearchCache.clear();
  pairSkillSearchCache.clear();
  pairMoveSearchCache.clear();
  pairSkillSearchDocumentsCache.clear();
  pairMoveSearchDocumentsCache.clear();
  passiveSkillDetailCache.clear();
  pairSkillCategoryMatchCache.clear();
  pairSyncCountdownReductionCache.clear();
}

async function loadPassiveSkillSearchData(locale) {
  const resolvedLocale = PASSIVE_SKILL_SEARCH_URLS[locale] ? locale : 'en';
  await Promise.all([
    loadLocalizedSkillSearchData(resolvedLocale),
    resolvedLocale === 'en' ? Promise.resolve() : loadLocalizedSkillSearchData('en'),
  ]);
}

async function loadTrainerData() {
  await loadCoreData();
  if (monsterById.size) return;
  const activeLocale = language();
  const localeKeys = activeLocale === 'en' ? ['en'] : [activeLocale, 'en'];
  const responses = await Promise.all([
    fetch(MONSTER_DATA_URL),
    fetch(MOVE_DATA_URL),
    fetch(MONSTER_BASE_DATA_URL),
    fetch(MONSTER_VARIATION_DATA_URL),
    fetch(TRAINER_BASE_DATA_URL),
    fetch(TEAM_SKILL_DATA_URL),
    fetch(TRAINER_EX_ROLE_DATA_URL),
    fetch(SUPERAWAKENING_DATA_URL),
    fetch(ABILITY_PANEL_DATA_URL),
    fetch(ABILITY_DATA_URL),
    fetch(PASSIVE_SKILL_CHILD_DATA_URL),
    ...localeKeys.map((locale) => fetch(TEAM_SKILL_TAG_URLS[locale])),
    ...localeKeys.map((locale) => fetch(MOVE_NAME_URLS[locale])),
  ]);
  const urls = [
    MONSTER_DATA_URL,
    MOVE_DATA_URL,
    MONSTER_BASE_DATA_URL,
    MONSTER_VARIATION_DATA_URL,
    TRAINER_BASE_DATA_URL,
    TEAM_SKILL_DATA_URL,
    TRAINER_EX_ROLE_DATA_URL,
    SUPERAWAKENING_DATA_URL,
    ABILITY_PANEL_DATA_URL,
    ABILITY_DATA_URL,
    PASSIVE_SKILL_CHILD_DATA_URL,
    ...localeKeys.map((locale) => TEAM_SKILL_TAG_URLS[locale]),
    ...localeKeys.map((locale) => MOVE_NAME_URLS[locale]),
  ];
  responses.forEach((response, index) => {
    if (!response.ok) throw new Error(`Unable to load ${urls[index]} (${response.status})`);
  });
  const values = await Promise.all(responses.map((response) => response.json()));
  const [
    monsters, moves, monsterBases, monsterVariations, trainerBases, teamSkills, exRoles, superawakenings,
    abilityPanels, abilities, passiveSkillChildren,
  ] = values;
  const localizedTags = values.slice(11, 11 + localeKeys.length);
  const localizedMoveNames = values.slice(11 + localeKeys.length, 11 + localeKeys.length * 2);
  monsterById = new Map((monsters.entries || []).map((monster) => [String(monster.monsterId), monster]));
  moveById = new Map((moves.entries || []).map((move) => [String(move.moveId), move]));
  monsterBaseById = new Map((monsterBases.entries || []).map((monster) => [String(monster.monsterBaseId), monster]));
  trainerBaseById = new Map((trainerBases.entries || []).map((trainer) => [String(trainer.id), trainer]));
  pokemonNumberByBaseId = new Map((monsterBases.entries || []).map((monster) => [String(monster.monsterBaseId), Number(monster.dexNumber) || Number(monster.actorNumber) || 0]));
  teamSkillTagById = new Map((teamSkills.entries || [])
    .filter((skill) => skill.teamSkillPropNum === 1)
    .map((skill) => [String(skill.teamSkillId), String(skill.teamSkillPropValue)]));
  teamSkillNameByLocale = Object.fromEntries(localeKeys.map((locale, index) => [
    locale,
    new Map(Object.entries(localizedTags[index] || {}).map(([id, name]) => [String(id), name])),
  ]));
  moveNameByLocale = Object.fromEntries(localeKeys.map((locale, index) => [
    locale,
    new Map(Object.entries(localizedMoveNames[index] || {}).map(([id, name]) => [String(id), name])),
  ]));
  const abilityById = new Map((abilities.entries || []).map((ability) => [String(ability.abilityId), ability]));
  passiveSkillChildrenById = new Map((passiveSkillChildren.entries || []).map((entry) => [
    String(entry.passiveSkillId),
    (entry.passiveSkillChildIds || []).map(String),
  ]));
  buildPairSkillIndex({ entries: [...trainerById.values()] }, monsterVariations, abilityPanels, abilityById, superawakenings);
  tileAbbreviationByCellId = new Map((abilityPanels.entries || []).flatMap((panel) => {
    const abbreviated = pomaTileAbbreviation(abilityById.get(String(panel.abilityId)), language());
    return abbreviated ? [[String(panel.cellId), abbreviated]] : [];
  }));
  moveInfoByCellId = new Map((abilityPanels.entries || []).flatMap((panel) => {
    const ability = abilityById.get(String(panel.abilityId));
    if (!ability) return [];
    const relatedMoves = relatedMoveIdsForAbilityPanel(panel, ability).map((moveId) => {
      const move = moveById.get(moveId);
      return {
        moveId,
        movePower: Number(move?.power),
        moveAccuracy: Number(move?.accuracy),
        moveUses: Number(move?.uses),
      };
    });
    const [relatedMove = {}] = relatedMoves;
    return [[String(panel.cellId), {
      ...relatedMove,
      relatedMoves,
      targetsWholeMoveSet: abilityTargetsWholeMoveSet(ability),
      passiveId: Number(ability.passiveId),
      abilityType: Number(ability.type),
      abilityValue: Number(ability.value),
      isSyncPowerBoost: Number(ability.type) === 9 && moveById.get(relatedMove.moveId)?.group === 'Sync',
      powerMultiplier: powerMultiplierForPassiveId(ability.passiveId),
      additionalEffectChanceMultiplier: additionalEffectChanceMultiplierForPassiveId(ability.passiveId),
      damageReduction: damageReductionForPassiveId(ability.passiveId),
      healingBoost: healingBoostForPassiveId(ability.passiveId),
      statusEffectReduction: statusEffectReductionForPassiveId(ability.passiveId),
    }]];
  }));
  gridUpdateDatesByTrainerId = new Map();
  (abilityPanels.entries || []).forEach((panel) => {
    const updateDate = releaseDateByScheduleId.get(String(panel.scheduleId)) || 0;
    if (!updateDate) return;
    const trainerId = String(panel.trainerId);
    const dates = gridUpdateDatesByTrainerId.get(trainerId) || new Set();
    dates.add(updateDate);
    gridUpdateDatesByTrainerId.set(trainerId, dates);
  });
  exRoleByTrainerId = new Map((exRoles.entries || []).map((entry) => [String(entry.trainerId), Number(entry.role)]));
  superawakeningTrainerIds = new Set((superawakenings.entries || []).map((entry) => String(entry.trainerId)));
  // Load the relatively large localized search index in the background so it
  // never delays the grid, picker or spoiler protection becoming usable.
  loadPassiveSkillSearchData(language())
    .then(() => {
      refreshSkillSearchSuggestions();
      if (document.getElementById('pairSearchModal') && (
        selectedSkillIds.size || selectedSkillCategories.size || sortCriterion === 'sync-countdown-reduction'
      )) queuePairRender();
    })
    .catch((error) => console.warn('[Brybry Enhancer] Skill search data could not be loaded.', error));
}

function normalizeSearchText(value) {
  return String(value || '').normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
}

function replaceSkillTemplateParts(value, parts, tagName) {
  let result = String(value || '');
  const pattern = new RegExp(`\\[Name:${tagName} Idx="([^"]+)" \\]`, 'gi');
  for (let pass = 0; pass < 8; pass += 1) {
    let changed = false;
    result = result.replace(pattern, (match, id) => {
      if (parts[id] === undefined) return match;
      changed = true;
      return parts[id];
    });
    if (!changed) break;
  }
  return result;
}

function resolvedPassiveSkillName(passiveId, data) {
  if (data?.resolver) return data.resolver.resolvePassiveName(passiveId);
  let name = String(data?.names?.[String(passiveId)] || '');
  const partPattern = /\[Name:PassiveSkillNameParts Idx="([^"]+)" \]/i;
  for (let pass = 0; pass < 8; pass += 1) {
    const match = name.match(partPattern);
    if (!match || data.nameParts?.[match[1]] === undefined) break;
    const digit = Math.max(0, Number(passiveId) - Number(match[1]));
    name = name.replace(match[0], data.nameParts[match[1]])
      .replace(/\[Name:PassiveSkillNameDigit \]/gi, String(digit));
  }
  return name;
}

function searchableSkillTemplateText(value, locale, data) {
  let result = replaceSkillTemplateParts(value, data?.descriptionParts || {}, 'PassiveSkillDescriptionPartsIdTag');
  result = replaceSkillTemplateParts(result, data?.nameParts || {}, 'PassiveSkillNameParts');
  result = result.replace(/\[Name:MoveId Idx="([^"]+)" \]/gi, (match, id) => moveNameByLocale[locale]?.get(String(id)) || '');
  result = result.replace(/\[(?:DE|EN|ES|FR|IT):[^\]]*?\bS="([^"]*)"[^\]]*?\bP="([^"]*)"[^\]]*\]/gi, ' $1 $2 ');
  return result
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[[^\]]+\]/g, ' ');
}

function passiveSkillSearchText(passiveId, locale) {
  const cacheKey = `${locale}:${passiveId}`;
  if (passiveSkillSearchCache.has(cacheKey)) return passiveSkillSearchCache.get(cacheKey);
  const data = passiveSkillTextDataByLocale.get(locale);
  if (!data) return '';
  const name = resolvedPassiveSkillName(passiveId, data);
  const description = data.resolver?.resolvePassiveDescription(passiveId) || replaceSkillTemplateParts(
    data.descriptions?.[String(passiveId)] || '', data.descriptionParts || {}, 'PassiveSkillDescriptionPartsIdTag',
  );
  const pomaAbbreviation = pomaTemplateValue(
    POMATOOLS_SKILL_ABBR[locale]?.[String(Math.floor(Number(passiveId) / 10))],
    passiveId,
  );
  const searchText = normalizeSearchText(searchableSkillTemplateText(`${name} ${description} ${pomaAbbreviation}`, locale, data));
  passiveSkillSearchCache.set(cacheKey, searchText);
  return searchText;
}

function passiveSkillDetails(passiveId, locale) {
  const cacheKey = `${locale}:${passiveId}`;
  if (passiveSkillDetailCache.has(cacheKey)) return passiveSkillDetailCache.get(cacheKey);
  const data = passiveSkillTextDataByLocale.get(locale);
  if (!data) return null;
  const name = searchableSkillTemplateText(resolvedPassiveSkillName(passiveId, data), locale, data)
    .replace(/\s+/g, ' ').trim();
  const descriptionTemplate = data.resolver?.resolvePassiveDescription(passiveId) || replaceSkillTemplateParts(
    data.descriptions?.[String(passiveId)] || '', data.descriptionParts || {}, 'PassiveSkillDescriptionPartsIdTag',
  );
  const description = searchableSkillTemplateText(descriptionTemplate, locale, data)
    .replace(/\s+/g, ' ').trim();
  const details = name ? {
    id: String(passiveId),
    name,
    description,
    searchText: passiveSkillSearchText(passiveId, locale),
  } : null;
  passiveSkillDetailCache.set(cacheKey, details);
  return details;
}

function passiveSkillIdsIncludingChildren(passiveId) {
  const pending = [String(passiveId)];
  const result = [];
  const seen = new Set();
  while (pending.length) {
    const id = pending.shift();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    result.push(id);
    pending.push(...(passiveSkillChildrenById.get(id) || []));
  }
  return result;
}

function pairSkillSearchDocuments(pair, locale, includeChildren = true) {
  const cacheKey = `${locale}:${spoilerProtectionEnabled ? 'safe' : 'all'}:${includeChildren ? 'expanded' : 'direct'}:${pair.id}`;
  if (pairSkillSearchDocumentsCache.has(cacheKey)) return pairSkillSearchDocumentsCache.get(cacheKey);
  const entries = skillEntriesByTrainerId.get(pair.id);
  if (!entries) return [];

  const now = Date.now() / 1000;
  const texts = [];
  entries.forEach((availableDate, passiveId) => {
    if (spoilerProtectionEnabled && availableDate > now) return;
    const searchableIds = includeChildren ? passiveSkillIdsIncludingChildren(passiveId) : [String(passiveId)];
    searchableIds.forEach((id) => {
      const textValue = passiveSkillSearchText(id, locale);
      if (textValue) texts.push(textValue);
    });
  });
  pairSkillSearchDocumentsCache.set(cacheKey, texts);
  return texts;
}

function pairSkillSearchText(pair, locale) {
  const cacheKey = `${locale}:${spoilerProtectionEnabled ? 'safe' : 'all'}:${pair.id}`;
  if (pairSkillSearchCache.has(cacheKey)) return pairSkillSearchCache.get(cacheKey);
  const combined = pairSkillSearchDocuments(pair, locale).join(' ');
  pairSkillSearchCache.set(cacheKey, combined);
  return combined;
}

function pairMoveSearchDocuments(pair, locale) {
  const cacheKey = `${locale}:${pair.id}`;
  if (pairMoveSearchDocumentsCache.has(cacheKey)) return pairMoveSearchDocumentsCache.get(cacheKey);
  const data = moveTextDataByLocale.get(locale);
  if (!data) return [];
  const documents = [...(moveIdsByTrainerId.get(String(pair.id)) || [])]
    .map((moveId) => {
      const description = data.resolver?.resolveMoveDescription(moveId) || replaceSkillTemplateParts(
        data.descriptions?.[moveId] || '', data.descriptionParts || {}, 'MoveDescriptionPartsIdTag',
      );
      return normalizeSearchText(searchableSkillTemplateText(`${moveNameByLocale[locale]?.get(moveId) || ''} ${description}`, locale, data));
    });
  pairMoveSearchDocumentsCache.set(cacheKey, documents);
  return documents;
}

function pairMoveSearchText(pair, locale) {
  const cacheKey = `${locale}:${pair.id}`;
  if (pairMoveSearchCache.has(cacheKey)) return pairMoveSearchCache.get(cacheKey);
  const normalized = pairMoveSearchDocuments(pair, locale).join(' ');
  pairMoveSearchCache.set(cacheKey, normalized);
  return normalized;
}

function pairSkillIds(pair) {
  const cacheKey = `${spoilerProtectionEnabled ? 'safe' : 'all'}:${pair.id}`;
  if (pairSkillIdCache.has(cacheKey)) return pairSkillIdCache.get(cacheKey);
  const result = new Set();
  const now = Date.now() / 1000;
  const entries = skillEntriesByTrainerId.get(pair.id);
  entries?.forEach((availableDate, passiveId) => {
    if (spoilerProtectionEnabled && availableDate > now) return;
    passiveSkillIdsIncludingChildren(passiveId).forEach((id) => result.add(String(id)));
  });
  pairSkillIdCache.set(cacheKey, result);
  return result;
}

function passiveSyncCountdownReduction(passiveId) {
  const detail = passiveSkillDetails(passiveId, 'en');
  if (!detail) return 0;
  return syncCountdownReductionInDescription(detail.description);
}

function syncCountdownReductionInDescription(description) {
  const values = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 };
  const text = String(description || '');
  const valueOf = (value) => values[String(value).toLowerCase()] || Number(value) || 0;
  const total = (text.match(/[^.!?]+[.!?]?/g) || [])
    .filter((sentence) => !/\bchance\b/i.test(sentence) && !/\bco-op battle\b/i.test(sentence))
    .flatMap((sentence) => [...sentence.matchAll(/reduc(?:es|ing)\b[^.!?]*?\b(?:sync move countdown|sync countdown)\s+by\s+(one|two|three|four|five|six|seven|eight|nine|\d+)/gi)])
    .reduce((sum, match) => sum + valueOf(match[1]), 0);
  // Team-scaling passives state their solo value in the main effect and their
  // ideal-party ceiling later. The β sort intentionally uses that ceiling.
  const maximum = text.match(/maximum reduction is\s+(one|two|three|four|five|six|seven|eight|nine|\d+)/i);
  return Math.max(total, valueOf(maximum?.[1]));
}

function resolvedMoveDescription(moveId) {
  const data = moveTextDataByLocale.get('en');
  if (!data) return '';
  return data.resolver?.resolveMoveDescription(moveId) || replaceSkillTemplateParts(
    data.descriptions?.[String(moveId)] || '', data.descriptionParts || {}, 'MoveDescriptionPartsIdTag',
  );
}

function moveSyncCountdownReduction(moveId) {
  return syncCountdownReductionInDescription(resolvedMoveDescription(moveId));
}

function moveSyncCountdownReductionUses(moveId, availableUses) {
  const description = resolvedMoveDescription(moveId);
  const replacement = description.match(/replaces the effects of the user[’']s moves with the following when it is in [^.]*form\./i);
  if (!replacement) return availableUses;
  const replacementIndex = replacement.index || 0;
  const beforeReplacement = description.slice(0, replacementIndex);
  const afterReplacement = description.slice(replacementIndex + replacement[0].length);
  if (syncCountdownReductionInDescription(beforeReplacement) > 0
    && syncCountdownReductionInDescription(afterReplacement) === 0) return Math.min(availableUses, 1);
  return availableUses;
}

function passiveTemplate(passiveId) {
  return POMATOOLS_SKILL_ABBR.ja?.[String(Math.floor(Math.abs(Number(passiveId)) / 10))] || '';
}

function passiveRank(passiveId) {
  return Math.abs(Number(passiveId)) % 10;
}

function pairTheoreticalMoveUses(pair) {
  const moves = [...(theoreticalMoveIdsByTrainerId.get(pair.id) || [])]
    .map((moveId) => moveById.get(String(moveId)))
    .filter(Boolean);
  let pokemonStatusUses = moves
    .filter((move) => move.group === 'Regular' && move.user === 'Pokemon' && move.category === 'Status')
    .reduce((total, move) => total + Number(move.uses || 0), 0);
  let syncroMoveUses = moves
    .filter((move) => move.group === 'Buddy')
    .reduce((total, move) => total + Number(move.uses || 0), 0);
  let syncroMoveRecovery = 0;
  const now = Date.now() / 1000;
  syncCountdownSkillEntriesByTrainerId.get(pair.id)?.forEach((availableDate, passiveId) => {
    if (spoilerProtectionEnabled && availableDate > now) return;
    const template = passiveTemplate(passiveId);
    // These effects occur once after the pair's first sync move, so their
    // recovery is a finite, self-contained addition to the move-use ceiling.
    if (template.includes('初B技後 P変化技 回数回復')) pokemonStatusUses += passiveRank(passiveId);
    if (template.includes('初B技後 S技 回数回復')) {
      const recovery = passiveRank(passiveId);
      syncroMoveUses += recovery;
      syncroMoveRecovery += recovery;
    }
  });
  return { pokemonStatusUses, syncroMoveUses, syncroMoveRecovery };
}

function pairSyncCountdownReduction(pair) {
  const cacheKey = `${spoilerProtectionEnabled ? 'safe' : 'all'}:${pair.id}`;
  if (pairSyncCountdownReductionCache.has(cacheKey)) return pairSyncCountdownReductionCache.get(cacheKey);
  const now = Date.now() / 1000;
  // Sprint is a built-in Sync Role effect, not a passive stored in Brybry's
  // skill data: the first sync move used reduces the countdown by three.
  let total = Number(pair.trainer.role) === 4 || Number(pair.exRole) === 4 ? 3 : 0;
  const moveUses = pairTheoreticalMoveUses(pair);
  // Only direct skills count: child effects implement their parent and would
  // double-count it. Form passives remain included because this is a maximum
  // theoretical total and forms reached during a battle can add their own BC reduction.
  syncCountdownSkillEntriesByTrainerId.get(pair.id)?.forEach((availableDate, passiveId) => {
    if (spoilerProtectionEnabled && availableDate > now) return;
    let uses = 1;
    const template = passiveTemplate(passiveId);
    if (template.includes('P変化技使用時 BC加速')) uses = moveUses.pokemonStatusUses;
    if (template.includes('S技後 BC加速')) uses = moveUses.syncroMoveUses;
    total += passiveSyncCountdownReduction(passiveId) * uses;
  });
  [...(theoreticalMoveIdsByTrainerId.get(pair.id) || [])].forEach((moveId) => {
    const move = moveById.get(String(moveId));
    if (!move || Number(move.uses) <= 0) return;
    const availableUses = Number(move.uses) + (move.group === 'Buddy' ? moveUses.syncroMoveRecovery : 0);
    const uses = moveSyncCountdownReductionUses(moveId, availableUses);
    total += moveSyncCountdownReduction(moveId) * uses;
  });
  pairSyncCountdownReductionCache.set(cacheKey, total);
  return total;
}

function pairMatchesSkillCategory(pair, category, locale) {
  const cacheKey = `${spoilerProtectionEnabled ? 'safe' : 'all'}:${locale}:${pair.id}:${category.value}`;
  if (pairSkillCategoryMatchCache.has(cacheKey)) return pairSkillCategoryMatchCache.get(cacheKey);
  let matches = false;
  if (category.masterPassiveType) {
    const englishData = passiveSkillTextDataByLocale.get('en');
    if (!englishData) return false;
    const kinds = [...pairSkillIds(pair)].map((passiveId) => (
      brybryMasterPassiveKind(passiveId, resolvedPassiveSkillName(passiveId, englishData))
    )).filter(Boolean);
    matches = category.masterPassiveType === 'all'
      ? kinds.length > 0
      : kinds.includes(category.masterPassiveType);
    pairSkillCategoryMatchCache.set(cacheKey, matches);
    return matches;
  }
  // Capability categories use the canonical English data index so matching is
  // identical in every UI language. Exact skill suggestions remain localized.
  const categoryLocale = passiveSkillTextDataByLocale.has('en') ? 'en' : locale;
  // Child passives are implementation details of their parent in Brybry's data.
  // Keep them in keyword/exact-skill search, but do not treat a child effect as a
  // capability the pair independently owns. For example, an interference-rate
  // modifier can reference trapped-condition children without inflicting trap.
  const documents = [...pairSkillSearchDocuments(pair, categoryLocale, false), ...pairMoveSearchDocuments(pair, categoryLocale)];
  const patterns = category.patterns.en || [];
  matches = brybryDocumentsMatchPatterns(documents, patterns);
  pairSkillCategoryMatchCache.set(cacheKey, matches);
  return matches;
}
