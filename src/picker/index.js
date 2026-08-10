function roleFamily(role) {
  return ROLE_FAMILIES.find((family) => family.roles.includes(Number(role)))?.value || '';
}

function roleCombination(baseRole, exRole) {
  const order = ROLE_FAMILIES.map((family) => family.value);
  return [roleFamily(baseRole), roleFamily(exRole)]
    .filter(Boolean)
    .sort((first, second) => order.indexOf(first) - order.indexOf(second))
    .join('-');
}

function pairIconUrl(trainer) {
  const trainerBase = trainerBaseById.get(String(trainer?.trainerBaseId));
  const monster = monsterById.get(String(trainer?.monsterId));
  const monsterBase = monsterBaseById.get(String(monster?.monsterBaseId));
  if (!trainerBase?.actorId || !monsterBase) return '';
  const trainerUid = trainerBase.actorId === 'hero' ? '8000_00' : String(trainerBase.actorId).substring(2, 9);
  const dexNumber = String(monsterBase.dexNumber).padStart(4, '0');
  const actorVariant = String(monsterBase.actorVariant).padStart(2, '0');
  const shinySuffix = monsterBase.isShiny ? 's' : '';
  return new URL(`./data/icons/trainers/${trainerUid}-${dexNumber}_${actorVariant}${shinySuffix}.png`, location.href).href;
}

function pairFallbackIconUrls(trainer) {
  const trainerBase = trainerBaseById.get(String(trainer?.trainerBaseId));
  const monster = monsterById.get(String(trainer?.monsterId));
  const monsterBase = monsterBaseById.get(String(monster?.monsterBaseId));
  return [
    trainerBase?.actorId
      ? new URL(`./data/actor/Trainer/${trainerBase.actorId}/${trainerBase.actorId}_1024.png`, location.href).href
      : '',
    monsterBase?.actorId
      ? new URL(`./data/actor/Monster/${monsterBase.actorId}/${monsterBase.actorId}_256.png`, location.href).href
      : '',
    new URL('./data/icons/trainers/unknown.png', location.href).href,
  ].filter(Boolean);
}

function typeMark(locale, trainer) {
  const mark = document.createElement('span');
  mark.className = 'be-result-type';
  mark.style.setProperty('--be-type-color', TYPE_COLORS[trainer.type - 1] || '#6aafc0');
  mark.textContent = TYPE_NAMES[locale][trainer.type - 1]?.slice(0, locale === 'ja' ? 1 : 2) || '?';
  return mark;
}

function captureSiteAvatars() {
  if (pairImageById.size) return false;
  const resultList = document.getElementById('pairSearchResults');
  const pairs = currentPairs(true);
  const rows = resultList ? Array.from(resultList.children) : [];
  if (!resultList || rows.length !== pairs.length) return false;

  rows.forEach((row, index) => {
    const src = row.querySelector('img')?.src;
    if (src) pairImageById.set(pairs[index].id, src);
  });
  return pairImageById.size > 0;
}

function selectedCount() {
  return selectedTypes.size + selectedMoveTypes.size + selectedRoles.size + selectedWeaknesses.size + selectedRarities.size
    + selectedAcquisitions.size + selectedExclusivities.size + selectedRegions.size
    + selectedExRoles.size + selectedRoleCombinations.size + selectedSuperawakening.size
    + selectedTrainerGroups.size + selectedFashion.size + selectedOther.size
    + selectedSkillIds.size + selectedSkillCategories.size;
}

function exclusionForGroup(group) {
  if (!excludedFilters.has(group)) excludedFilters.set(group, new Set());
  return excludedFilters.get(group);
}

function excludedCount() {
  return [...excludedFilters.values()].reduce((count, values) => count + values.size, 0)
    + excludedSkillCategories.size;
}

function filterButtonLabel() {
  const included = selectedCount();
  const excluded = excludedCount();
  const summary = [included ? `✓${included}` : '', excluded ? `−${excluded}` : ''].filter(Boolean).join(' ');
  return `${text().filter}${summary ? ` (${summary})` : ''}`;
}

function activeFilterEntries() {
  const locale = language();
  const entries = [];
  const chipLabel = (group, value) => Array.from(document.querySelectorAll('.be-chip'))
    .find((chip) => chip.dataset.beGroup === group && chip.dataset.beValue === String(value))
    ?.dataset.beLabel || String(value);

  Object.entries({
    type: selectedTypes,
    moveType: selectedMoveTypes,
    role: selectedRoles,
    weakness: selectedWeaknesses,
    rarity: selectedRarities,
    acquisition: selectedAcquisitions,
    exclusivity: selectedExclusivities,
    region: selectedRegions,
    exRole: selectedExRoles,
    roleCombination: selectedRoleCombinations,
    superawakening: selectedSuperawakening,
    trainerGroup: selectedTrainerGroups,
    fashion: selectedFashion,
    other: selectedOther,
  }).forEach(([group, values]) => {
    values.forEach((value) => entries.push({ group, value, state: 'include', label: chipLabel(group, value) }));
    excludedFilters.get(group)?.forEach((value) => {
      entries.push({ group, value, state: 'exclude', label: chipLabel(group, value) });
    });
  });

  const categoryLabel = (value) => {
    const category = SKILL_FILTER_CATEGORIES.find((candidate) => candidate.value === value);
    return category?.labels[locale] || category?.labels.en || value;
  };
  selectedSkillCategories.forEach((value) => entries.push({
    group: 'skillCategory', value, state: 'include', label: categoryLabel(value),
  }));
  excludedSkillCategories.forEach((value) => entries.push({
    group: 'skillCategory', value, state: 'exclude', label: categoryLabel(value),
  }));
  selectedSkillIds.forEach((value) => entries.push({
    group: 'skill', value, state: 'include', label: passiveSkillDetails(value, locale)?.name || value,
  }));
  return entries;
}

function removeActiveFilter({ group, value, state }) {
  if (group === 'skill') {
    selectedSkillIds.delete(value);
  } else if (group === 'skillCategory') {
    (state === 'exclude' ? excludedSkillCategories : selectedSkillCategories).delete(value);
  } else {
    (state === 'exclude' ? exclusionForGroup(group) : selectionForGroup(group))?.delete(value);
  }
  savePickerPreferences();
  refreshPicker();
}

function renderActiveFilterTags() {
  const container = document.querySelector('.be-active-filter-tags');
  if (!container) return;
  const fragment = document.createDocumentFragment();
  const entries = activeFilterEntries();
  const included = entries.filter((entry) => entry.state === 'include');
  const excluded = entries.filter((entry) => entry.state === 'exclude');
  const appendOperator = (operator) => {
    const node = document.createElement('span');
    node.className = 'be-filter-operator';
    node.textContent = operator;
    node.setAttribute('aria-hidden', 'true');
    fragment.append(node);
  };
  const appendTag = (entry) => {
    const tag = document.createElement('button');
    tag.className = 'be-active-filter-tag';
    tag.type = 'button';
    tag.dataset.beFilterState = entry.state;
    tag.setAttribute('aria-label', `${text().clear}: ${entry.state === 'exclude' ? `! ${entry.label}` : entry.label}`);
    const label = document.createElement('span');
    label.textContent = `${entry.state === 'exclude' ? '! ' : ''}${entry.label}`;
    const remove = document.createElement('span');
    remove.className = 'be-active-filter-tag-remove';
    remove.setAttribute('aria-hidden', 'true');
    remove.textContent = '×';
    tag.append(label, remove);
    tag.addEventListener('click', () => removeActiveFilter(entry));
    fragment.append(tag);
  };
  included.forEach((entry, index) => {
    if (index) appendOperator(filterMatchMode === 'and' ? '&' : '|');
    appendTag(entry);
  });
  excluded.forEach((entry, index) => {
    if (included.length || index) appendOperator('&');
    appendTag(entry);
  });
  const clearButton = document.querySelector('.be-clear-button');
  if (clearButton) fragment.append(clearButton);
  container.replaceChildren(fragment);
  container.hidden = !entries.length && (!clearButton || clearButton.hidden);
}

function selectionForGroup(group) {
  return {
    type: selectedTypes,
    moveType: selectedMoveTypes,
    role: selectedRoles,
    weakness: selectedWeaknesses,
    rarity: selectedRarities,
    acquisition: selectedAcquisitions,
    exclusivity: selectedExclusivities,
    region: selectedRegions,
    exRole: selectedExRoles,
    roleCombination: selectedRoleCombinations,
    superawakening: selectedSuperawakening,
    trainerGroup: selectedTrainerGroups,
    fashion: selectedFashion,
    other: selectedOther,
  }[group];
}

function filterState(group, value) {
  if (selectionForGroup(group)?.has(value)) return 'include';
  if (exclusionForGroup(group).has(value)) return 'exclude';
  return 'off';
}

function cycleFilterState(group, value) {
  const included = selectionForGroup(group);
  const excluded = exclusionForGroup(group);
  if (!included) return 'off';
  if (included.has(value)) {
    included.delete(value);
    excluded.add(value);
    return 'exclude';
  }
  if (excluded.has(value)) {
    excluded.delete(value);
    return 'off';
  }
  included.add(value);
  return 'include';
}

function filterTooltip(label, state) {
  const copy = text();
  if (state === 'include') return `${label} · ✓ ${copy.include}`;
  if (state === 'exclude') return `${label} · − ${copy.exclude}`;
  return label;
}

function expandedDirectionLabel(label, locale) {
  const directionWords = {
    en: { '↑': 'Increase', '↓': 'Decrease' },
    fr: { '↑': 'en hausse', '↓': 'en baisse' },
    de: { '↑': 'erhöht', '↓': 'gesenkt' },
    es: { '↑': 'aumentado', '↓': 'reducido' },
    it: { '↑': 'aumentata', '↓': 'ridotta' },
    ja: { '↑': '上昇', '↓': '低下' },
    ko: { '↑': '상승', '↓': '하락' },
    zh: { '↑': '上升', '↓': '下降' },
  };
  const words = directionWords[locale] || directionWords.en;
  return label.replace(/[↑↓]/g, (direction) => words[direction]).replace(/\s+/g, ' ').trim();
}

function updateFilterButtonState(button, state, label) {
  const tooltip = filterTooltip(label, state);
  const needsTooltip = button.matches('.be-chip--icon-only, .be-skill-category-chip--icon-only, .be-skill-category-chip--compact-label, .be-skill-category-chip--has-note');
  button.dataset.beFilterState = state;
  if (needsTooltip) button.dataset.beTooltip = tooltip;
  else delete button.dataset.beTooltip;
  button.removeAttribute('title');
  button.setAttribute('aria-pressed', state === 'exclude' ? 'mixed' : String(state === 'include'));
  button.setAttribute('aria-label', tooltip);
  const marker = button.querySelector('.be-filter-state-mark');
  if (marker) marker.textContent = state === 'include' ? '✓' : state === 'exclude' ? '−' : '';
}

function filterTooltipElement() {
  let tooltip = document.getElementById('beFilterTooltip');
  if (tooltip) return tooltip;
  tooltip = document.createElement('div');
  tooltip.id = 'beFilterTooltip';
  tooltip.className = 'be-floating-filter-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;
  document.body.append(tooltip);
  return tooltip;
}

function showFilterTooltip(button) {
  const copy = button?.dataset.beTooltip;
  if (!copy) return;
  const tooltip = filterTooltipElement();
  tooltip.textContent = copy;
  tooltip.hidden = false;

  const buttonRect = button.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const modalRect = document.querySelector('#pairSearchModal .modal-content')?.getBoundingClientRect();
  const margin = 8;
  const minLeft = Math.max(margin, (modalRect?.left || 0) + margin);
  const maxRight = Math.min(window.innerWidth - margin, (modalRect?.right || window.innerWidth) - margin);
  const preferredLeft = buttonRect.left + buttonRect.width / 2 - tooltipRect.width / 2;
  tooltip.style.left = `${Math.max(minLeft, Math.min(preferredLeft, maxRight - tooltipRect.width))}px`;

  const below = buttonRect.bottom + 7;
  const modalBottom = Math.min(window.innerHeight - margin, (modalRect?.bottom || window.innerHeight) - margin);
  tooltip.style.top = `${below + tooltipRect.height <= modalBottom
    ? below
    : Math.max(margin, buttonRect.top - tooltipRect.height - 7)}px`;
}

function hideFilterTooltip() {
  const tooltip = document.getElementById('beFilterTooltip');
  if (tooltip) tooltip.hidden = true;
}

function pairTooltipElement() {
  let tooltip = document.getElementById('bePairTooltip');
  if (tooltip) return tooltip;
  tooltip = document.createElement('div');
  tooltip.id = 'bePairTooltip';
  tooltip.className = 'be-floating-pair-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;
  document.body.append(tooltip);
  return tooltip;
}

function pairSortMetadata(pair, locale) {
  const copy = text();
  const dateValue = (timestamp) => timestamp > 0
    ? new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' })
      .format(new Date(timestamp * 1000))
    : '—';
  if (sortCriterion === 'updated') return `${copy.sortUpdated}: ${dateValue(pair.updateDate)}`;
  if (sortCriterion === 'release') return `${copy.sortRelease}: ${dateValue(pair.releaseDate)}`;
  if (sortCriterion === 'sync-dex') return `${copy.sortSyncDex}: ${pair.syncDexNumber || '—'}`;
  if (sortCriterion === 'pokemon-dex') return `${copy.sortPokemonDex}: ${pair.pokemonNumber || '—'}`;
  if (sortCriterion === 'sync-countdown-reduction') return `${copy.sortSyncCountdownReduction}: ${pairSyncCountdownReduction(pair)}`;
  return '';
}

function showPairTooltip(row) {
  if (!row) return;
  const tooltip = pairTooltipElement();
  tooltip.replaceChildren();
  ['pair-stars', 'pair-name'].forEach((className) => {
    const source = row.querySelector(`.${className}`);
    if (!source) return;
    const line = document.createElement('span');
    line.className = className;
    line.textContent = source.textContent;
    tooltip.append(line);
  });
  const sortMetadata = row.querySelector('.be-pair-sort-meta');
  if (sortMetadata) {
    const line = document.createElement('span');
    line.className = 'be-pair-meta';
    line.textContent = sortMetadata.textContent;
    tooltip.append(line);
  }
  tooltip.hidden = false;

  const rowRect = row.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const modalRect = document.querySelector('#pairSearchModal .modal-content')?.getBoundingClientRect();
  const margin = 8;
  const minLeft = Math.max(margin, (modalRect?.left || 0) + margin);
  const maxRight = Math.min(window.innerWidth - margin, (modalRect?.right || window.innerWidth) - margin);
  const rightSide = rowRect.right + 8;
  tooltip.style.left = `${rightSide + tooltipRect.width <= maxRight
    ? rightSide
    : Math.max(minLeft, rowRect.left - tooltipRect.width - 8)}px`;
  const minTop = Math.max(margin, (modalRect?.top || 0) + margin);
  const maxBottom = Math.min(window.innerHeight - margin, (modalRect?.bottom || window.innerHeight) - margin);
  tooltip.style.top = `${Math.max(minTop, Math.min(rowRect.top, maxBottom - tooltipRect.height))}px`;
}

function hidePairTooltip() {
  const tooltip = document.getElementById('bePairTooltip');
  if (tooltip) tooltip.hidden = true;
}

function bindPairTooltips(resultList) {
  if (resultList.dataset.bePairTooltipsBound === 'true') return;
  resultList.dataset.bePairTooltipsBound = 'true';
  const pairRow = (target) => target.closest?.('.be-pair-result');
  resultList.addEventListener('pointerover', (event) => showPairTooltip(pairRow(event.target)));
  resultList.addEventListener('pointerout', (event) => {
    const row = pairRow(event.target);
    if (!row || row.contains(event.relatedTarget)) return;
    hidePairTooltip();
  });
  resultList.addEventListener('focusin', (event) => showPairTooltip(pairRow(event.target)));
  resultList.addEventListener('focusout', hidePairTooltip);
  resultList.addEventListener('scroll', hidePairTooltip, { passive: true });
}

function bindFilterTooltips(panel) {
  const tooltipButton = (target) => target.closest?.('.be-chip, .be-skill-category-chip, .be-filter-anchor, .be-sort-direction, .be-view-button');
  panel.addEventListener('pointerover', (event) => showFilterTooltip(tooltipButton(event.target)));
  panel.addEventListener('pointerout', (event) => {
    const button = tooltipButton(event.target);
    if (!button || button.contains(event.relatedTarget)) return;
    hideFilterTooltip();
  });
  panel.addEventListener('focusin', (event) => showFilterTooltip(tooltipButton(event.target)));
  panel.addEventListener('focusout', hideFilterTooltip);
}

function currentPairs(includeUnreleased = false) {
  const select = document.getElementById('syncPairSelect');
  if (!select) return [];
  const firstOption = select.options[0];
  const lastOption = select.options[select.options.length - 1];
  const cacheKey = [
    language(),
    spoilerProtectionEnabled ? 'safe' : 'all',
    select.options.length,
    firstOption?.value || '',
    lastOption?.value || '',
  ].join(':');
  if (pairListCacheKey !== cacheKey) {
    pairListCacheKey = cacheKey;
    pairListCache = Array.from(select.options)
    .map((option) => {
      const trainer = trainerById.get(String(option.value));
      const monster = monsterById.get(String(trainer?.monsterId));
      const teamSkillTags = [1, 2, 3, 4, 5]
        .map((index) => teamSkillTagById.get(String(trainer?.[`teamSkill${index}Id`])))
        .filter(Boolean);
      const region = teamSkillTags.find((tag) => tag.startsWith('200200')) || '';
      const exRole = exRoleByTrainerId.has(String(option.value)) ? exRoleByTrainerId.get(String(option.value)) : null;
      const releaseDate = releaseDateByScheduleId.get(String(trainer?.scheduleId)) || 0;
      const now = Date.now() / 1000;
      const gridUpdateDates = [...(gridUpdateDatesByTrainerId.get(String(option.value)) || [])]
        .filter((date) => !spoilerProtectionEnabled || date <= now);
      return {
        id: String(option.value),
        name: option.textContent.trim(),
        trainer,
        releaseDate,
        updateDate: Math.max(releaseDate, ...gridUpdateDates),
        syncDexNumber: Number(trainer?.number) || 0,
        pokemonNumber: pokemonNumberByBaseId.get(String(monster?.monsterBaseId)) || 0,
        region,
        teamSkillTags,
        moveTypes: pairDamagingMoveTypes(option.value),
        iconUrl: pairIconUrl(trainer),
        fallbackIconUrls: pairFallbackIconUrls(trainer),
        exRole,
        exRoleFamily: exRole === null ? '' : roleFamily(exRole),
        roleCombination: exRole === null ? '' : roleCombination(trainer?.role, exRole),
        hasSuperawakening: superawakeningTrainerIds.has(String(option.value)),
      };
    })
      .filter((pair) => pair.trainer);
  }
  return includeUnreleased || !spoilerProtectionEnabled
    ? pairListCache
    : pairListCache.filter((pair) => pair.releaseDate <= Date.now() / 1000);
}

function pairMatches(pair, query, locale = language()) {
  const matchesQuery = normalizeSearchText(pair.name).includes(normalizeSearchText(query));
  const skillIds = selectedSkillIds.size ? pairSkillIds(pair) : null;
  const scalarValues = [
    [selectedTypes, String(pair.trainer.type)],
    [selectedRoles, String(pair.trainer.role)],
    [selectedWeaknesses, String(pair.trainer.weakness)],
    [selectedRarities, String(pair.trainer.rarity)],
    [selectedAcquisitions, String(pair.trainer.scoutMethod)],
    [selectedExclusivities, pair.trainer.scoutMethod === 1 ? String(pair.trainer.exclusivity) : ''],
    [selectedRegions, pair.region],
    [selectedExRoles, pair.exRoleFamily],
    [selectedRoleCombinations, pair.roleCombination],
    [selectedSuperawakening, pair.hasSuperawakening ? 'yes' : ''],
  ];
  const tagValues = [
    [selectedMoveTypes, pair.moveTypes],
    [selectedTrainerGroups, pair.teamSkillTags],
    [selectedFashion, pair.teamSkillTags],
    [selectedOther, pair.teamSkillTags],
  ];
  const contains = (values, value) => values?.has?.(value) || values?.includes?.(value);
  const includedMatches = [
    ...scalarValues.flatMap(([selected, actual]) => [...selected].map((value) => value === actual)),
    ...tagValues.flatMap(([selected, actual]) => [...selected].map((value) => contains(actual, value))),
    ...[...selectedSkillCategories].map((value) => {
      const category = SKILL_FILTER_CATEGORIES.find((option) => option.value === value);
      return category ? pairMatchesSkillCategory(pair, category, locale) : true;
    }),
    ...[...selectedSkillIds].map((id) => skillIds.has(id)),
  ];
  const matchesIncluded = !includedMatches.length
    || (filterMatchMode === 'and' ? includedMatches.every(Boolean) : includedMatches.some(Boolean));
  const matchesExcludedSkillCategories = [...excludedSkillCategories].every((value) => {
    const category = SKILL_FILTER_CATEGORIES.find((option) => option.value === value);
    return category ? !pairMatchesSkillCategory(pair, category, locale) : true;
  });
  const matchesExcludedScalars = [
    ['type', String(pair.trainer.type)], ['role', String(pair.trainer.role)],
    ['weakness', String(pair.trainer.weakness)], ['rarity', String(pair.trainer.rarity)],
    ['acquisition', String(pair.trainer.scoutMethod)],
    ['exclusivity', pair.trainer.scoutMethod === 1 ? String(pair.trainer.exclusivity) : ''],
    ['region', pair.region], ['exRole', pair.exRoleFamily], ['roleCombination', pair.roleCombination],
    ['superawakening', pair.hasSuperawakening ? 'yes' : ''],
  ].every(([group, actual]) => !exclusionForGroup(group).has(actual));
  const matchesExcludedTags = [
    ['moveType', pair.moveTypes], ['trainerGroup', pair.teamSkillTags],
    ['fashion', pair.teamSkillTags], ['other', pair.teamSkillTags],
  ].every(([group, actual]) => ![...actual].some((value) => exclusionForGroup(group).has(value)));
  return matchesQuery && matchesIncluded && matchesExcludedSkillCategories
    && matchesExcludedScalars && matchesExcludedTags;
}

function sortPairs(pairs, locale) {
  const collator = new Intl.Collator(locale, { numeric: true, sensitivity: 'base' });
  return [...pairs].sort((first, second) => {
    let difference = 0;
    if (sortCriterion === 'updated') difference = first.updateDate - second.updateDate;
    if (sortCriterion === 'release') difference = first.releaseDate - second.releaseDate;
    if (sortCriterion === 'sync-dex') difference = first.syncDexNumber - second.syncDexNumber;
    if (sortCriterion === 'pokemon-dex') difference = first.pokemonNumber - second.pokemonNumber;
    if (sortCriterion === 'rarity') difference = (first.trainer.rarity || 0) - (second.trainer.rarity || 0);
    if (sortCriterion === 'sync-countdown-reduction') difference = pairSyncCountdownReduction(first) - pairSyncCountdownReduction(second);
    if (sortCriterion === 'name') difference = collator.compare(first.name, second.name);
    if (difference) return sortDirection === 'asc' ? difference : -difference;
    if (sortCriterion === 'updated' && first.releaseDate !== second.releaseDate) {
      const releaseDifference = first.releaseDate - second.releaseDate;
      return sortDirection === 'asc' ? releaseDifference : -releaseDifference;
    }
    return collator.compare(first.name, second.name);
  });
}

function resultsToolbar() {
  const copy = text();
  const toolbar = document.createElement('div');
  toolbar.className = 'be-results-toolbar';

  const sortControl = document.createElement('label');
  sortControl.className = 'be-sort-control';
  const sortLabel = document.createElement('span');
  sortLabel.className = 'be-sort-label';
  sortLabel.textContent = copy.sort;
  const sortSelect = document.createElement('select');
  sortSelect.className = 'be-sort-select';
  sortSelect.setAttribute('aria-label', copy.sort);
  [
    ['updated', copy.sortUpdated],
    ['release', copy.sortRelease],
    ['sync-dex', copy.sortSyncDex],
    ['pokemon-dex', copy.sortPokemonDex],
    ['name', copy.sortName],
    ['rarity', copy.sortRarity],
    ['sync-countdown-reduction', copy.sortSyncCountdownReduction],
  ].forEach(([value, label]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    sortSelect.append(option);
  });
  sortSelect.value = sortCriterion;
  sortSelect.addEventListener('change', () => {
    sortCriterion = sortSelect.value;
    savePickerPreferences();
    queuePairRender();
  });
  sortControl.append(sortLabel, sortSelect);

  const directionButton = document.createElement('button');
  directionButton.className = 'be-sort-direction';
  directionButton.type = 'button';
  directionButton.dataset.direction = sortDirection;
  directionButton.innerHTML = SORT_DIRECTION_ICON;
  const updateDirectionLabel = () => {
    directionButton.dataset.direction = sortDirection;
    const label = sortDirection === 'asc' ? copy.ascending : copy.descending;
    directionButton.setAttribute('aria-label', label);
    directionButton.dataset.beTooltip = label;
    directionButton.removeAttribute('title');
  };
  updateDirectionLabel();
  directionButton.addEventListener('click', () => {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    updateDirectionLabel();
    savePickerPreferences();
    queuePairRender();
  });
  sortControl.append(directionButton);

  const viewToggle = document.createElement('div');
  viewToggle.className = 'be-view-toggle';
  viewToggle.setAttribute('role', 'group');
  [
    ['list', copy.listView],
    ['icons', copy.iconView],
  ].forEach(([value, label]) => {
    const button = document.createElement('button');
    button.className = 'be-view-button';
    button.type = 'button';
    button.dataset.beView = value;
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-pressed', String(viewMode === value));
    button.dataset.beTooltip = label;
    button.removeAttribute('title');
    button.innerHTML = VIEW_ICONS[value];
    button.addEventListener('click', () => {
      viewMode = value;
      savePickerPreferences();
      queuePairRender();
    });
    viewToggle.append(button);
  });

  toolbar.append(sortControl, viewToggle);
  return toolbar;
}

function createChip({ label, value, group, iconName, iconUrl, iconSrc, iconText, iconNames, textContent, iconOnly = false, detail = false }) {
  const chip = document.createElement('button');
  chip.className = 'be-chip';
  if (iconOnly) chip.classList.add('be-chip--icon-only');
  if (detail) chip.classList.add('be-chip--detail');
  chip.type = 'button';
  chip.dataset.beGroup = group;
  chip.dataset.beValue = value;
  chip.dataset.beLabel = label;

  (iconNames || (iconName ? [iconName] : [])).forEach((name) => {
    const icon = document.createElement('img');
    icon.className = 'be-chip-icon';
    icon.src = `${FILTER_ICON_BASE}${name}.png`;
    icon.alt = '';
    chip.append(icon);
  });
  if (iconSrc) {
    const icon = document.createElement('img');
    icon.className = 'be-chip-icon be-role-variant-icon';
    icon.src = iconSrc;
    icon.alt = '';
    chip.append(icon);
  }
  if (iconUrl) {
    const icon = document.createElement('img');
    icon.className = 'be-chip-icon be-origin-mark-icon';
    icon.src = iconUrl;
    icon.alt = '';
    icon.addEventListener('error', () => chip.classList.remove('be-chip--icon-only'), { once: true });
    chip.append(icon);
  }
  if (iconText) {
    const icon = document.createElement('span');
    icon.className = 'be-chip-symbol';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = iconText;
    chip.append(icon);
  }

  const visibleLabel = document.createElement('span');
  visibleLabel.className = 'be-chip-text';
  visibleLabel.textContent = textContent || label;
  chip.append(visibleLabel);

  const marker = document.createElement('span');
  marker.className = 'be-filter-state-mark';
  marker.setAttribute('aria-hidden', 'true');
  chip.append(marker);
  updateFilterButtonState(chip, filterState(group, value), label);
  return chip;
}

function accordionSection(group, title, contentNode, { defaultOpen = false, active = false, iconSrc = '' } = {}) {
  const section = document.createElement('details');
  section.className = 'be-filter-section';
  section.dataset.beGroup = group;
  section.open = active
    || Boolean(selectionForGroup(group)?.size)
    || Boolean(exclusionForGroup(group).size)
    || openFilterAccordions.has(group)
    || (defaultOpen && !closedFilterAccordions.has(group));
  const summary = document.createElement('summary');
  summary.className = 'be-filter-title be-accordion-trigger';
  const heading = document.createElement('span');
  heading.className = 'be-accordion-heading';
  if (iconSrc) {
    const icon = document.createElement('img');
    icon.className = 'be-accordion-heading-icon';
    icon.src = iconSrc;
    icon.alt = '';
    heading.append(icon);
  }
  const label = document.createElement('span');
  label.textContent = title;
  heading.append(label);
  const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  chevron.classList.add('be-accordion-chevron');
  chevron.setAttribute('aria-hidden', 'true');
  chevron.setAttribute('viewBox', '0 0 24 24');
  chevron.innerHTML = '<path d="m6 9 6 6 6-6"/>';
  summary.append(heading, chevron);
  const content = document.createElement('div');
  content.className = 'be-accordion-content';
  content.append(contentNode);
  section.append(summary, content);
  section.addEventListener('toggle', () => {
    if (section.open) {
      openFilterAccordions.add(group);
      closedFilterAccordions.delete(group);
    } else {
      openFilterAccordions.delete(group);
      closedFilterAccordions.add(group);
    }
    savePickerPreferences();
  });
  return section;
}

function teamTagOptions(prefix, locale) {
  const usedTags = new Set(currentPairs().flatMap((pair) => pair.teamSkillTags));
  return [...usedTags]
    .filter((tag) => tag.startsWith(prefix))
    .sort((first, second) => Number(first) - Number(second))
    .map((value) => ({ value, label: teamSkillNameByLocale[locale].get(value) || value }));
}

function availableSkillSuggestions(locale, query, limit = 30) {
  const terms = normalizeSearchText(query).split(' ').filter(Boolean);
  if (!terms.length || !passiveSkillTextDataByLocale.has(locale)) return [];
  const ids = new Set();
  currentPairs().forEach((pair) => pairSkillIds(pair).forEach((id) => ids.add(id)));
  const collator = new Intl.Collator(locale, { numeric: true, sensitivity: 'base' });
  return [...ids]
    .filter((id) => !selectedSkillIds.has(id))
    .map((id) => passiveSkillDetails(id, locale))
    .filter(Boolean)
    .filter((skill) => terms.every((term) => skill.searchText.includes(term)))
    .sort((first, second) => {
      const firstName = normalizeSearchText(first.name);
      const secondName = normalizeSearchText(second.name);
      const queryText = normalizeSearchText(query);
      const rank = (skill, name) => {
        if (name === queryText) return 0;
        if (name.startsWith(queryText)) return 1;
        if (name.includes(queryText)) return 2;
        if (normalizeSearchText(skill.description).includes(queryText)) return 3;
        return 4;
      };
      return rank(first, firstName) - rank(second, secondName) || collator.compare(first.name, second.name);
    })
    .slice(0, limit);
}

function refreshSkillSearchSuggestions() {
  const input = document.getElementById('beSkillSearchInput');
  if (input) input.dispatchEvent(new Event('input', { bubbles: true }));
}

function createSkillCategoryChip(category, locale) {
  const categoryLabel = category.labels[locale] || category.labels.en;
  const tooltipNote = category.tooltipNotes?.[locale] || category.tooltipNotes?.en;
  const explicitTooltipLabel = category.tooltipLabels?.[locale] || category.tooltipLabels?.en;
  const tooltipLabel = [explicitTooltipLabel || expandedDirectionLabel(categoryLabel, locale), tooltipNote].filter(Boolean).join(' — ');
  const button = document.createElement('button');
  button.className = 'be-skill-category-chip';
  if (tooltipNote || explicitTooltipLabel) button.classList.add('be-skill-category-chip--has-note');
  if (category.detailOf) button.classList.add('be-skill-category-chip--detail');
  if (category.compactLabels) button.classList.add('be-skill-category-chip--compact-label');
  if (category.rebuffDirection) button.classList.add('be-skill-category-chip--directional-icon');
  if (category.iconOnly) button.classList.add('be-skill-category-chip--icon-only');
  if (category.exVariant) button.classList.add('be-skill-category-chip--ex-detail');
  if (!category.suppressStatDirection && (category.detailOf === 'statUp' || category.detailOf === 'statDown')) {
    button.classList.add('be-skill-category-chip--stat-direction');
  }
  button.type = 'button';
  button.setAttribute('aria-label', categoryLabel);
  button.dataset.beSkillCategory = category.value;
  if (category.iconName) {
    const icon = document.createElement('img');
    icon.src = `${FILTER_ICON_BASE}${category.iconName}.png`;
    icon.alt = '';
    button.append(icon);
  } else if (category.iconSrc) {
    const icon = document.createElement('img');
    icon.referrerPolicy = 'no-referrer';
    icon.src = category.iconSrc;
    icon.alt = '';
    button.append(icon);
  } else if (category.iconSvg) {
    const icon = document.createElement('span');
    icon.className = 'be-skill-category-icon';
    icon.innerHTML = category.iconSvg;
    button.append(icon);
  } else if (category.iconSrcs) {
    const icons = document.createElement('span');
    icons.className = 'be-skill-category-icon-pair';
    category.iconSrcs.forEach((src) => {
      const icon = document.createElement('img');
      icon.referrerPolicy = 'no-referrer';
      icon.src = src;
      icon.alt = '';
      icons.append(icon);
    });
    button.append(icons);
  }
  if (category.exVariant) {
    const exBadge = document.createElement('span');
    exBadge.className = 'be-skill-category-ex-badge';
    exBadge.setAttribute('aria-hidden', 'true');
    exBadge.textContent = 'EX';
    button.append(exBadge);
  }
  if (!category.suppressStatDirection && (category.detailOf === 'statUp' || category.detailOf === 'statDown')) {
    const direction = document.createElement('span');
    direction.className = 'be-stat-direction';
    direction.setAttribute('aria-hidden', 'true');
    direction.textContent = category.detailOf === 'statUp' ? '↑' : '↓';
    button.append(direction);
  }
  if (category.rebuffDirection || category.attributeDirection) {
    const direction = document.createElement('span');
    direction.className = 'be-stat-direction';
    direction.setAttribute('aria-hidden', 'true');
    direction.textContent = category.rebuffDirection || category.attributeDirection;
    button.append(direction);
  }
  const label = document.createElement('span');
  label.className = 'be-skill-category-label';
  label.textContent = category.compactLabels?.[locale] || category.compactLabels?.en || categoryLabel;
  button.append(label);
  const marker = document.createElement('span');
  marker.className = 'be-filter-state-mark';
  marker.setAttribute('aria-hidden', 'true');
  button.append(marker);
  const categoryState = () => {
    if (selectedSkillCategories.has(category.value)) return 'include';
    if (excludedSkillCategories.has(category.value)) return 'exclude';
    return 'off';
  };
  updateFilterButtonState(button, categoryState(), tooltipLabel);
  button.addEventListener('click', () => {
    if (selectedSkillCategories.has(category.value)) {
      selectedSkillCategories.delete(category.value);
      excludedSkillCategories.add(category.value);
    } else if (excludedSkillCategories.has(category.value)) {
      excludedSkillCategories.delete(category.value);
    } else {
      selectedSkillCategories.add(category.value);
    }
    updateFilterButtonState(button, categoryState(), tooltipLabel);
    queuePairRender(FILTER_RENDER_DELAY_MS);
  });
  return button;
}

function createCircleRegionAnchor(locale) {
  const copy = CIRCLE_REGION_ANCHOR_TRANSLATIONS[locale] || CIRCLE_REGION_ANCHOR_TRANSLATIONS.en;
  const anchor = document.createElement('button');
  anchor.className = 'be-filter-anchor';
  anchor.type = 'button';
  anchor.textContent = copy.label;
  anchor.dataset.beTooltip = copy.tooltip;
  anchor.setAttribute('aria-label', copy.tooltip);
  anchor.addEventListener('click', () => {
    const regionSection = document.querySelector('details.be-filter-section[data-be-group="region"]');
    if (!regionSection) return;
    regionSection.open = true;
    const summary = regionSection.querySelector(':scope > summary');
    regionSection.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
    summary?.focus({ preventScroll: true });
    regionSection.classList.remove('be-filter-section--jump-target');
    window.requestAnimationFrame(() => regionSection.classList.add('be-filter-section--jump-target'));
    window.setTimeout(() => regionSection.classList.remove('be-filter-section--jump-target'), 1400);
  });
  return anchor;
}

function skillSearchField() {
  const locale = language();
  const copy = text();
  const skillSearchSection = document.createElement('section');
  skillSearchSection.className = 'be-skill-search-section';
  const skillSearchLabel = document.createElement('label');
  skillSearchLabel.className = 'be-filter-title';
  skillSearchLabel.htmlFor = 'beSkillSearchInput';
  skillSearchLabel.textContent = copy.skillSearch;

  const combobox = document.createElement('div');
  combobox.className = 'be-skill-combobox';
  const tokenField = document.createElement('div');
  tokenField.className = 'be-skill-token-field';
  const skillSearchInput = document.createElement('input');
  skillSearchInput.id = 'beSkillSearchInput';
  skillSearchInput.className = 'be-skill-search-input';
  skillSearchInput.type = 'search';
  skillSearchInput.autocomplete = 'off';
  skillSearchInput.placeholder = copy.skillSearchPlaceholder;
  skillSearchInput.value = skillSearchQuery;
  skillSearchInput.setAttribute('role', 'combobox');
  skillSearchInput.setAttribute('aria-autocomplete', 'list');
  skillSearchInput.setAttribute('aria-expanded', 'false');
  skillSearchInput.setAttribute('aria-controls', 'beSkillSuggestions');
  const suggestions = document.createElement('ul');
  suggestions.id = 'beSkillSuggestions';
  suggestions.className = 'be-skill-suggestions';
  suggestions.setAttribute('role', 'listbox');
  suggestions.hidden = true;
  let activeIndex = -1;
  let suggestionTimer = 0;
  let isComposing = false;

  const renderTokens = () => {
    tokenField.querySelectorAll('.be-skill-token').forEach((token) => token.remove());
    [...selectedSkillIds].forEach((id) => {
      const skill = passiveSkillDetails(id, locale);
      const token = document.createElement('button');
      token.className = 'be-skill-token';
      token.type = 'button';
      token.title = skill?.description || skill?.name || id;
      token.setAttribute('aria-label', `${copy.removeSkill}: ${skill?.name || id}`);
      const name = document.createElement('span');
      name.textContent = skill?.name || id;
      const remove = document.createElement('span');
      remove.setAttribute('aria-hidden', 'true');
      remove.textContent = '×';
      token.append(name, remove);
      token.addEventListener('click', () => {
        selectedSkillIds.delete(id);
        renderTokens();
        renderSuggestions();
        queuePairRender();
        skillSearchInput.focus();
      });
      tokenField.insertBefore(token, skillSearchInput);
    });
  };

  const addSkill = (skill) => {
    if (!skill) return;
    selectedSkillIds.add(String(skill.id));
    skillSearchQuery = '';
    skillSearchInput.value = '';
    renderTokens();
    suggestions.hidden = true;
    skillSearchInput.setAttribute('aria-expanded', 'false');
    queuePairRender();
    skillSearchInput.focus();
  };

  const renderSuggestions = () => {
    skillSearchQuery = skillSearchInput.value;
    const options = availableSkillSuggestions(locale, skillSearchQuery);
    suggestions.replaceChildren();
    activeIndex = -1;
    if (!skillSearchQuery.trim()) {
      suggestions.hidden = true;
      skillSearchInput.setAttribute('aria-expanded', 'false');
      return;
    }
    if (!options.length) {
      const empty = document.createElement('li');
      empty.className = 'be-skill-suggestion-empty';
      empty.textContent = copy.skillNoResults;
      suggestions.append(empty);
    } else {
      options.forEach((skill, index) => {
        const option = document.createElement('li');
        option.className = 'be-skill-suggestion';
        option.setAttribute('role', 'option');
        option.dataset.index = String(index);
        const name = document.createElement('strong');
        name.textContent = skill.name;
        option.append(name);
        if (skill.description) {
          const description = document.createElement('span');
          description.textContent = skill.description;
          option.append(description);
        }
        option.addEventListener('mousedown', (event) => event.preventDefault());
        option.addEventListener('click', () => addSkill(skill));
        suggestions.append(option);
      });
    }
    suggestions.hidden = false;
    skillSearchInput.setAttribute('aria-expanded', 'true');
  };

  const scheduleSuggestions = (delay = 180) => {
    window.clearTimeout(suggestionTimer);
    suggestionTimer = window.setTimeout(() => {
      if (skillSearchInput.isConnected && !isComposing) renderSuggestions();
    }, delay);
  };

  const moveActiveSuggestion = (offset) => {
    const options = [...suggestions.querySelectorAll('.be-skill-suggestion')];
    if (!options.length) return;
    activeIndex = (activeIndex + offset + options.length) % options.length;
    options.forEach((option, index) => {
      const active = index === activeIndex;
      option.classList.toggle('is-active', active);
      option.setAttribute('aria-selected', String(active));
    });
    options[activeIndex].scrollIntoView({ block: 'nearest' });
  };

  skillSearchInput.addEventListener('input', (event) => {
    event.stopImmediatePropagation();
    if (!isComposing) scheduleSuggestions();
  }, true);
  skillSearchInput.addEventListener('compositionstart', () => {
    isComposing = true;
    window.clearTimeout(suggestionTimer);
  });
  skillSearchInput.addEventListener('compositionend', () => {
    isComposing = false;
    scheduleSuggestions(0);
  });
  skillSearchInput.addEventListener('focus', renderSuggestions);
  skillSearchInput.addEventListener('blur', () => {
    setTimeout(() => {
      suggestions.hidden = true;
      skillSearchInput.setAttribute('aria-expanded', 'false');
    }, 100);
  });
  skillSearchInput.addEventListener('keydown', (event) => {
    if (event.isComposing || isComposing || event.keyCode === 229) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      moveActiveSuggestion(event.key === 'ArrowDown' ? 1 : -1);
    }
    if (event.key === 'Enter') {
      const options = availableSkillSuggestions(locale, skillSearchInput.value);
      const selected = activeIndex < 0 ? null : options[activeIndex];
      if (selected) {
        event.preventDefault();
        addSkill(selected);
      }
    }
    if (event.key === 'Escape') {
      suggestions.hidden = true;
      skillSearchInput.setAttribute('aria-expanded', 'false');
    }
  });

  tokenField.append(skillSearchInput);
  combobox.append(tokenField, suggestions);
  renderTokens();

  const categories = document.createElement('div');
  categories.className = 'be-skill-category-groups';
  const battleGrid = document.createElement('div');
  battleGrid.className = 'be-skill-battle-grid';
  [
    [copy.skillFieldEffects, ['weather', 'terrain', 'zone', 'weatherEx', 'terrainEx', 'zoneEx', 'circle', 'alliedField', 'opponentField']],
    [copy.skillStatChanges, ['statUp', 'statDown', 'statReductionImmunity', 'rebuffUp', 'rebuff']],
    [copy.skillConditions, ['status', 'interference', 'sureHitNext', 'statusImmunity', 'interferenceImmunity', 'criticalHitImmunity']],
    [SKILL_FILTER_CATEGORIES.find((category) => category.value === 'masterPassive')?.labels?.[locale]
      || 'Master Passive', ['masterPassive']],
  ].forEach(([title, parentValues]) => {
    const row = document.createElement('div');
    row.className = 'be-skill-category-row';
    const groupByParent = parentValues[0] === 'weather'
      || parentValues[0] === 'statUp'
      || parentValues[0] === 'status';
    if (groupByParent) row.classList.add('be-skill-category-row--grouped');
    SKILL_FILTER_CATEGORIES.filter((category) => parentValues.includes(category.value) && !category.detailOf)
      .sort((first, second) => parentValues.indexOf(first.value) - parentValues.indexOf(second.value))
      .forEach((category) => {
        if (category.value === 'criticalHitImmunity' && parentValues.includes('sureHitNext')) return;
        const categoryRow = groupByParent ? document.createElement('div') : row;
        if (groupByParent) categoryRow.className = 'be-skill-category-cluster';
        if (category.value !== 'masterPassive') categoryRow.append(createSkillCategoryChip(category, locale));
        if (category.value === 'sureHitNext' && parentValues.includes('criticalHitImmunity')) {
          const criticalHitImmunity = SKILL_FILTER_CATEGORIES
            .find((item) => item.value === 'criticalHitImmunity');
          if (criticalHitImmunity) categoryRow.append(createSkillCategoryChip(criticalHitImmunity, locale));
        }
        SKILL_FILTER_CATEGORIES.filter((detail) => detail.detailOf === category.value)
          .forEach((detail) => categoryRow.append(createSkillCategoryChip(detail, locale)));
        if (category.value === 'circle') categoryRow.append(createCircleRegionAnchor(locale));
        if (groupByParent) row.append(categoryRow);
      });
    const categoryValues = new Set(SKILL_FILTER_CATEGORIES
      .filter((category) => parentValues.includes(category.value) || parentValues.includes(category.detailOf))
      .map((category) => category.value));
    const active = [...categoryValues]
      .some((value) => selectedSkillCategories.has(value) || excludedSkillCategories.has(value));
    battleGrid.append(accordionSection(`skill-${parentValues[0]}`, title, row, { defaultOpen: true, active }));
  });
  categories.append(battleGrid);

  skillSearchSection.append(skillSearchLabel, combobox, categories);
  return skillSearchSection;
}

function nameSearchField(input) {
  const section = document.createElement('section');
  section.className = 'be-name-search-section';
  const label = document.createElement('label');
  label.className = 'be-filter-title';
  label.htmlFor = input.id;
  label.textContent = text().nameSearch;
  input.placeholder = text().nameSearchPlaceholder;
  section.append(label, input);
  return section;
}

function filterPanel() {
  const locale = language();
  const panel = document.createElement('form');
  panel.className = 'be-filter-panel be-filter-form';
  panel.dataset.open = String(filterIsOpen);
  panel.addEventListener('submit', (event) => event.preventDefault());

  const typeRow = document.createElement('div');
  typeRow.className = 'be-chip-row';
  TYPE_NAMES[locale].forEach((name, index) => typeRow.append(createChip({
    label: name,
    value: String(index + 1),
    group: 'type',
    iconName: `type_${TYPE_ICON_NAMES[index]}`,
    iconOnly: true,
  })));
  const typeSection = accordionSection('type', text().type, typeRow, { defaultOpen: true });

  const roleRow = document.createElement('div');
  roleRow.className = 'be-chip-row';
  ROLE_NAMES[locale].forEach((name, index) => roleRow.append(createChip({
    label: name,
    value: String(index),
    group: 'role',
    iconName: index < 2 ? null : `role_${ROLE_ICON_NAMES[index]}`,
    iconSrc: index === 0
      ? 'https://pomatools.github.io/assets/img/battle/ROLE_001P.png'
      : index === 1 ? 'https://pomatools.github.io/assets/img/battle/ROLE_001S.png' : null,
    iconOnly: true,
  })));
  const roleSection = accordionSection('role', text().role, roleRow, { defaultOpen: true });

  const exRoleRow = document.createElement('div');
  exRoleRow.className = 'be-chip-row';
  ROLE_FAMILIES.filter((family) => family.value !== 'multi').forEach((family) => exRoleRow.append(createChip({
    label: family.labels[locale],
    value: family.value,
    group: 'exRole',
    iconName: `role_ex_${family.icon}`,
    iconOnly: true,
  })));
  const exRoleSection = accordionSection('exRole', text().exRole, exRoleRow, { defaultOpen: true });

  const roleCombinationRow = document.createElement('div');
  roleCombinationRow.className = 'be-chip-row';
  const familyOrder = ROLE_FAMILIES.map((family) => family.value);
  const combinations = [...new Set(currentPairs().map((pair) => pair.roleCombination).filter(Boolean))]
    .sort((first, second) => {
      const [firstA, firstB] = first.split('-').map((value) => familyOrder.indexOf(value));
      const [secondA, secondB] = second.split('-').map((value) => familyOrder.indexOf(value));
      return firstA - secondA || firstB - secondB;
    });
  combinations.forEach((combination) => {
    const families = combination.split('-').map((value) => ROLE_FAMILIES.find((family) => family.value === value));
    roleCombinationRow.append(createChip({
      label: families.map((family) => family.labels[locale]).join(' + '),
      value: combination,
      group: 'roleCombination',
      iconNames: families.map((family) => `role_${family.icon}`),
      iconOnly: true,
    }));
  });
  const roleCombinationSection = accordionSection('roleCombination', text().roleCombination, roleCombinationRow);

  const regionRow = document.createElement('div');
  regionRow.className = 'be-chip-row';
  REGION_OPTIONS.forEach((region) => regionRow.append(createChip({
    label: region.labels[locale],
    value: region.value,
    group: 'region',
    iconUrl: region.iconUrl,
    iconText: region.iconText,
  })));
  const regionSection = accordionSection('region', text().region, regionRow, {
    defaultOpen: true,
    iconSrc: FILTER_SECTION_ICON_URLS.region,
  });

  const weaknessRow = document.createElement('div');
  weaknessRow.className = 'be-chip-row';
  TYPE_NAMES[locale].forEach((name, index) => weaknessRow.append(createChip({
    label: name,
    value: String(index + 1),
    group: 'weakness',
    iconName: `type_${TYPE_ICON_NAMES[index]}`,
    iconOnly: true,
  })));
  const weaknessSection = accordionSection('weakness', text().weakness, weaknessRow);

  const moveTypeRow = document.createElement('div');
  moveTypeRow.className = 'be-chip-row';
  TYPE_NAMES[locale].forEach((name, index) => moveTypeRow.append(createChip({
    label: name,
    value: String(index + 1),
    group: 'moveType',
    iconName: `type_${TYPE_ICON_NAMES[index]}`,
    iconOnly: true,
  })));
  const moveTypeSection = accordionSection('moveType', text().damagingMoveType, moveTypeRow);

  const rarityRow = document.createElement('div');
  rarityRow.className = 'be-chip-row';
  const rarities = [...new Set(currentPairs().map((pair) => pair.trainer.rarity))].sort((a, b) => a - b);
  rarities.forEach((rarity) => rarityRow.append(createChip({
    label: `${rarity}★`,
    value: String(rarity),
    group: 'rarity',
    iconName: `star${rarity}`,
    iconOnly: true,
  })));
  const raritySection = accordionSection('rarity', text().rarity, rarityRow, { defaultOpen: true });

  const superawakeningRow = document.createElement('div');
  superawakeningRow.className = 'be-chip-row';
  superawakeningRow.append(createChip({
    label: text().superawakening,
    value: 'yes',
    group: 'superawakening',
    iconName: '0_2',
  }));
  const superawakeningSection = accordionSection('superawakening', text().superawakening, superawakeningRow);

  const acquisitionGroups = document.createElement('div');
  acquisitionGroups.className = 'be-acquisition-groups be-skill-category-row--grouped';
  const scoutCluster = document.createElement('div');
  scoutCluster.className = 'be-skill-category-cluster';
  const otherAcquisitionCluster = document.createElement('div');
  otherAcquisitionCluster.className = 'be-skill-category-cluster';
  ACQUISITION_OPTIONS.forEach((option) => {
    const chip = createChip({
      label: option.labels[locale],
      value: option.value,
      group: 'acquisition',
      iconName: option.icon,
    });
    (option.value === '1' ? scoutCluster : otherAcquisitionCluster).append(chip);
  });
  EXCLUSIVITY_OPTIONS.forEach((option) => scoutCluster.append(createChip({
    label: option.labels[locale],
    value: option.value,
    group: 'exclusivity',
    iconName: option.icon,
    detail: true,
  })));
  acquisitionGroups.append(scoutCluster, otherAcquisitionCluster);
  const acquisitionActive = selectedExclusivities.size > 0 || exclusionForGroup('exclusivity').size > 0;
  const acquisitionSection = accordionSection('acquisition', text().acquisition, acquisitionGroups, {
    active: acquisitionActive,
  });

  const trainerGroupRow = document.createElement('div');
  trainerGroupRow.className = 'be-chip-row';
  teamTagOptions('2003', locale).forEach((option) => trainerGroupRow.append(createChip({
    label: option.label,
    value: option.value,
    group: 'trainerGroup',
    textContent: option.label,
  })));
  const trainerGroupSection = accordionSection('trainerGroup', text().trainerGroup, trainerGroupRow, {
    iconSrc: FILTER_SECTION_ICON_URLS.trainerGroup,
  });

  const fashionRow = document.createElement('div');
  fashionRow.className = 'be-chip-row';
  teamTagOptions('2004', locale).forEach((option) => fashionRow.append(createChip({
    label: option.label,
    value: option.value,
    group: 'fashion',
    textContent: option.label,
  })));
  const fashionSection = accordionSection('fashion', text().fashion, fashionRow, {
    iconSrc: FILTER_SECTION_ICON_URLS.fashion,
  });

  const otherRow = document.createElement('div');
  otherRow.className = 'be-chip-row';
  teamTagOptions('2999', locale).forEach((option) => otherRow.append(createChip({
    label: option.label,
    value: option.value,
    group: 'other',
    textContent: option.label,
  })));
  const otherSection = accordionSection('other', text().other, otherRow, {
    iconSrc: FILTER_SECTION_ICON_URLS.other,
  });

  panel.append(
    typeSection,
    weaknessSection,
    moveTypeSection,
    roleSection,
    exRoleSection,
    roleCombinationSection,
    raritySection,
    superawakeningSection,
    acquisitionSection,
    regionSection,
    trainerGroupSection,
    fashionSection,
    otherSection,
  );
  return panel;
}

function setPairResultsLoading(loading) {
  const resultList = document.getElementById('pairSearchResults');
  const indicator = document.querySelector('.be-results-loading');
  resultList?.setAttribute('aria-busy', String(loading));
  document.querySelector('.be-results-column')?.classList.toggle('is-loading', loading);
  if (indicator) indicator.hidden = !loading;
}

function queuePairRender(delay = 0) {
  if (delay > 0) {
    window.clearTimeout(pairRenderTimer);
    pairRenderTimer = window.setTimeout(() => {
      pairRenderTimer = 0;
      queuePairRender();
    }, delay);
    return;
  }
  window.clearTimeout(pairRenderTimer);
  pairRenderTimer = 0;
  setPairResultsLoading(true);
  if (pairRenderQueued) return;
  pairRenderQueued = true;
  // Two frames let the loading feedback paint before filtering and DOM work.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    pairRenderQueued = false;
    try {
      renderPairs();
    } finally {
      setPairResultsLoading(false);
    }
  }));
}

function renderPairs() {
  const input = document.getElementById('pairSearchInput');
  const skillInput = document.getElementById('beSkillSearchInput');
  const resultList = document.getElementById('pairSearchResults');
  const count = document.querySelector('.be-filter-count');
  const clearButton = document.querySelector('.be-clear-button');
  if (!input || !resultList || !count) return;
  hidePairTooltip();

  const locale = language();
  if (skillInput) skillSearchQuery = skillInput.value;
  const pairs = sortPairs(currentPairs()
    .filter((pair) => pairMatches(pair, input.value, locale)), locale);
  count.textContent = text().results(pairs.length);
  if (clearButton) {
    clearButton.hidden = selectedCount() === 0 && excludedCount() === 0
      && !input.value.trim() && !skillSearchQuery.trim();
  }
  const filterButton = document.querySelector('.be-filter-button');
  if (filterButton) {
    filterButton.textContent = filterButtonLabel();
  }
  renderActiveFilterTags();
  resultList.dataset.beView = viewMode;
  document.querySelectorAll('.be-view-button').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.beView === viewMode));
  });
  if (!pairs.length) {
    const empty = document.createElement('li');
    empty.className = 'be-empty';
    empty.textContent = text().empty;
    resultList.replaceChildren(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const pair of pairs) {
    const row = document.createElement('li');
    row.className = 'be-pair-result';
    row.tabIndex = 0;
    row.setAttribute('role', 'button');
    row.setAttribute('aria-label', pair.name);

    const images = document.createElement('div');
    images.className = 'pair-images';
    const iconUrls = [...new Set([
      pair.iconUrl || pairImageById.get(pair.id),
      ...(pair.fallbackIconUrls || []),
    ].filter(Boolean))];
    if (iconUrls.length) {
      const icon = document.createElement('img');
      icon.className = 'be-pair-avatar';
      icon.loading = 'lazy';
      icon.decoding = 'async';
      let fallbackIndex = 0;
      icon.src = iconUrls[fallbackIndex];
      icon.alt = '';
      icon.addEventListener('error', () => {
        fallbackIndex += 1;
        if (iconUrls[fallbackIndex]) icon.src = iconUrls[fallbackIndex];
      });
      images.append(icon);
    } else {
      const icon = document.createElement('img');
      icon.className = 'be-pair-avatar';
      icon.loading = 'lazy';
      icon.decoding = 'async';
      icon.src = new URL('./data/icons/trainers/unknown.png', location.href).href;
      icon.alt = '';
      images.append(icon);
    }

    const info = document.createElement('div');
    info.className = 'pair-info';
    const stars = document.createElement('span');
    stars.className = 'pair-stars';
    stars.textContent = '★'.repeat(pair.trainer.rarity || 0);
    const name = document.createElement('span');
    name.className = 'pair-name';
    name.textContent = pair.name;
    const meta = document.createElement('span');
    meta.className = 'be-pair-meta';
    meta.textContent = `${TYPE_NAMES[locale][pair.trainer.type - 1] || '—'} · ${ROLE_NAMES[locale][pair.trainer.role] || '—'}`;
    const sortMetadataText = pairSortMetadata(pair, locale);
    info.append(stars, name, meta);
    if (sortMetadataText) {
      const sortMetadata = document.createElement('span');
      sortMetadata.className = 'be-pair-sort-meta';
      sortMetadata.hidden = true;
      sortMetadata.textContent = sortMetadataText;
      info.append(sortMetadata);
    }
    row.append(images, info);

    const selectPair = () => {
      const select = document.getElementById('syncPairSelect');
      if (!select) return;
      rememberSafePair(pair.id);
      restoreSyncGridHome();
      select.value = pair.id;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      document.querySelector('.close-modal')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    };
    row.addEventListener('click', selectPair);
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectPair();
      }
    });
    fragment.append(row);
  }
  resultList.replaceChildren(fragment);
}

function mountPickerLayout(body, input, skillSearch, resultList, toolbar, tools, panel) {
  let layout = body.querySelector('.be-modal-layout');
  let resultsColumn = body.querySelector('.be-results-column');
  let filterSidebar = body.querySelector('.be-filter-sidebar');

  if (!layout) {
    layout = document.createElement('div');
    layout.className = 'be-modal-layout';
    resultsColumn = document.createElement('div');
    resultsColumn.className = 'be-results-column';
    filterSidebar = document.createElement('aside');
    filterSidebar.className = 'be-filter-sidebar';
    layout.append(resultsColumn, filterSidebar);
    body.append(layout);
  }

  let loading = resultsColumn.querySelector('.be-results-loading');
  if (!loading) {
    loading = document.createElement('div');
    loading.className = 'be-results-loading';
    loading.hidden = true;
    loading.innerHTML = '<span class="be-loading-spinner" aria-hidden="true"></span>';
    const loadingText = document.createElement('span');
    loadingText.className = 'be-loading-text';
    loading.append(loadingText);
  }
  loading.querySelector('.be-loading-text').textContent = text().loading;
  resultsColumn.append(toolbar, resultList, loading);
  panel.prepend(nameSearchField(input), skillSearch);
  filterSidebar.append(tools, panel);
}

function ensurePicker() {
  const body = document.querySelector('#pairSearchModal .modal-body');
  const input = document.getElementById('pairSearchInput');
  const resultList = document.getElementById('pairSearchResults');
  const modalTitle = document.querySelector('#pairSearchModal .modal-header h1, #pairSearchModal .modal-header h2, #pairSearchModal .modal-title');
  const locale = language();
  const existingTools = document.querySelector('.be-picker-tools');
  const existingResultsToolbar = document.querySelector('.be-results-toolbar');
  if (!body || !input || !resultList) return;
  if (locale === 'en' && modalTitle && /^change sync pair$/i.test(modalTitle.textContent.trim())) {
    modalTitle.textContent = 'Change sync pair';
  }
  if (!currentPairs(true).length) return;
  const dynamicFiltersReady = Boolean(document.querySelector('.be-filter-section[data-be-group="rarity"] .be-chip'));
  if (existingTools?.dataset.beLocale === locale && existingResultsToolbar && dynamicFiltersReady) return;
  captureSiteAvatars();
  if (existingTools) {
    existingTools.remove();
    document.querySelector('.be-skill-search-section')?.remove();
    document.querySelector('.be-filter-panel')?.remove();
  }
  existingResultsToolbar?.remove();

  const tools = document.createElement('div');
  tools.className = 'be-picker-tools';
  tools.dataset.beLocale = locale;
  const filterButton = document.createElement('button');
  filterButton.className = 'be-filter-button';
  filterButton.type = 'button';
  filterButton.textContent = filterButtonLabel();
  filterButton.setAttribute('aria-expanded', String(filterIsOpen));
  const count = document.createElement('span');
  count.className = 'be-filter-count';
  const clearButton = document.createElement('button');
  clearButton.className = 'be-clear-button';
  clearButton.type = 'button';
  clearButton.textContent = text().clear;
  clearButton.hidden = selectedCount() === 0 && excludedCount() === 0
    && !input.value.trim() && !skillSearchQuery.trim();
  const activeFilterTags = document.createElement('div');
  activeFilterTags.className = 'be-active-filter-tags';
  activeFilterTags.setAttribute('aria-label', text().filters);
  activeFilterTags.hidden = true;
  activeFilterTags.append(clearButton);
  const matchModeLabel = document.createElement('label');
  matchModeLabel.className = 'be-filter-match-mode';
  const matchModeText = document.createElement('span');
  matchModeText.textContent = text().filterMatch;
  const matchMode = document.createElement('select');
  matchMode.setAttribute('aria-label', text().filterMatch);
  [['and', text().filterMatchAll], ['or', text().filterMatchAny]].forEach(([value, label]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    matchMode.append(option);
  });
  matchMode.value = filterMatchMode;
  matchMode.addEventListener('change', () => {
    filterMatchMode = matchMode.value;
    savePickerPreferences();
    renderActiveFilterTags();
    queuePairRender();
  });
  matchModeLabel.append(matchModeText, matchMode);
  tools.append(count, filterButton, matchModeLabel, activeFilterTags);

  const toolbar = resultsToolbar();
  const skillSearch = skillSearchField();
  const panel = filterPanel();
  mountPickerLayout(body, input, skillSearch, resultList, toolbar, tools, panel);
  bindFilterTooltips(panel);
  bindFilterTooltips(toolbar);
  bindPairTooltips(resultList);

  pickerAvatarObserver?.disconnect();
  pickerAvatarObserver = new MutationObserver(() => {
    requestAnimationFrame(() => {
      const hasSiteRows = Array.from(resultList.children)
        .some((row) => !row.classList.contains('be-pair-result') && !row.classList.contains('be-empty'));
      if (!hasSiteRows) return;
      captureSiteAvatars();
      queuePairRender();
    });
  });
  pickerAvatarObserver.observe(resultList, { childList: true });

  filterButton.addEventListener('click', () => {
    filterIsOpen = !filterIsOpen;
    filterButton.setAttribute('aria-expanded', String(filterIsOpen));
    panel.dataset.open = String(filterIsOpen);
  });

  clearButton.addEventListener('click', () => {
    selectedTypes.clear();
    selectedMoveTypes.clear();
    selectedRoles.clear();
    selectedWeaknesses.clear();
    selectedRarities.clear();
    selectedAcquisitions.clear();
    selectedExclusivities.clear();
    selectedRegions.clear();
    selectedExRoles.clear();
    selectedRoleCombinations.clear();
    selectedSuperawakening.clear();
    selectedTrainerGroups.clear();
    selectedFashion.clear();
    selectedOther.clear();
    selectedSkillIds.clear();
    selectedSkillCategories.clear();
    excludedFilters.clear();
    excludedSkillCategories.clear();
    openFilterAccordions.clear();
    closedFilterAccordions.clear();
    input.value = '';
    skillSearchQuery = '';
    const skillInput = document.getElementById('beSkillSearchInput');
    if (skillInput) skillInput.value = '';
    savePickerPreferences();
    refreshPicker();
  });

  panel.addEventListener('click', (event) => {
    const chip = event.target.closest('.be-chip');
    if (!chip) return;
    const group = chip.dataset.beGroup;
    const value = chip.dataset.beValue;
    if (!selectionForGroup(group)) return;
    const state = cycleFilterState(group, value);
    updateFilterButtonState(chip, state, chip.dataset.beLabel);
    queuePairRender(FILTER_RENDER_DELAY_MS);
  });

  if (input.dataset.beNameSearchBound !== 'true') {
    input.dataset.beNameSearchBound = 'true';
    input.addEventListener('input', (event) => {
      event.stopImmediatePropagation();
      queuePairRender();
    }, true);
  }

  if (getComputedStyle(document.getElementById('pairSearchModal')).display !== 'none') queuePairRender();
}

function refreshPicker() {
  const input = document.getElementById('pairSearchInput');
  const body = document.querySelector('#pairSearchModal .modal-body');
  if (input && body) body.append(input);
  document.querySelector('.be-picker-tools')?.remove();
  document.querySelector('.be-skill-search-section')?.remove();
  document.querySelector('.be-filter-panel')?.remove();
  document.querySelector('.be-results-toolbar')?.remove();
  ensurePicker();
  queuePairRender();
}
