
try {
  const preferences = JSON.parse(localStorage.getItem(PICKER_PREFERENCES_KEY) || '{}');
  const legacySort = typeof preferences.sort === 'string' ? preferences.sort.match(/^(release|name|rarity)-(asc|desc)$/) : null;
  const savedCriterion = ['updated', 'release', 'sync-dex', 'pokemon-dex', 'name', 'rarity', 'sync-countdown-reduction'].includes(preferences.sortCriterion)
    ? preferences.sortCriterion
    : legacySort?.[1];
  const migratingReleaseDefault = preferences.version < PREFERENCE_VERSION && (!savedCriterion || savedCriterion === 'release');
  if (!migratingReleaseDefault && savedCriterion) sortCriterion = savedCriterion;
  if (migratingReleaseDefault) sortDirection = 'desc';
  else if (['asc', 'desc'].includes(preferences.sortDirection)) sortDirection = preferences.sortDirection;
  else if (legacySort) sortDirection = legacySort[2];
  // v1 persisted the old list default even when the user never chose it. Migrate
  // that implicit value once, then remember every explicit view choice normally.
  if (preferences.version >= 2 && ['list', 'icons'].includes(preferences.view)) viewMode = preferences.view;
  spoilerProtectionEnabled = preferences.spoilerProtection === true;
  if (typeof preferences.lastSafePairId === 'string') lastSafePairId = preferences.lastSafePairId;
  if (Array.isArray(preferences.openFilterAccordions)) {
    openFilterAccordions = new Set(preferences.openFilterAccordions.filter((group) => typeof group === 'string'));
  }
  if (Array.isArray(preferences.closedFilterAccordions)) {
    closedFilterAccordions = new Set(preferences.closedFilterAccordions.filter((group) => typeof group === 'string'));
  }
  if (['and', 'or'].includes(preferences.filterMatchMode)) filterMatchMode = preferences.filterMatchMode;
} catch (_) {
  // Storage can be unavailable in private browsing; the picker still works for this session.
}

function savePickerPreferences() {
  try {
    localStorage.setItem(PICKER_PREFERENCES_KEY, JSON.stringify({
      version: PREFERENCE_VERSION,
      sortCriterion,
      sortDirection,
      view: viewMode,
      spoilerProtection: spoilerProtectionEnabled,
      lastSafePairId,
      filterMatchMode,
      openFilterAccordions: [...openFilterAccordions],
      closedFilterAccordions: [...closedFilterAccordions],
    }));
  } catch (_) {
    // Keep the current in-memory preference when storage is unavailable.
  }
}

function readSavedGridBuilds() {
  try {
    const saved = JSON.parse(localStorage.getItem(GRID_PREFERENCES_KEY) || '{}');
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  } catch (_) {
    return {};
  }
}

function currentPairId() {
  return String(document.getElementById('syncPairSelect')?.value || new URL(location.href).searchParams.get('pair') || '');
}

function normalizedGridBuild(value) {
  const defaults = { moveLevel: 5, maxEnergyCap: 60 };
  if (Array.isArray(value)) return { selectedCellIds: value.map(String), ...defaults };
  if (!value || typeof value !== 'object') return { selectedCellIds: [], ...defaults };
  return {
    selectedCellIds: Array.isArray(value.selectedCellIds) ? value.selectedCellIds.map(String) : [],
    moveLevel: Number(value.moveLevel) || defaults.moveLevel,
    maxEnergyCap: Number(value.maxEnergyCap) || defaults.maxEnergyCap,
  };
}

function currentMaxEnergyCap() {
  const selected = document.querySelector('input[name="energy-radio"]:checked');
  return Number(selected?.id.match(/^energy-(\d+)$/)?.[1]) || 0;
}

function saveCurrentGridBuild(grid = observedMemoryGrid) {
  if (restoringGridBuild || !grid?.isConnected) return;
  const pairId = currentPairId();
  if (!pairId) return;
  const builds = readSavedGridBuilds();
  const selectedCellIds = Array.from(grid.querySelectorAll('g[data-cell-id][selected]'), (cell) => cell.dataset.cellId);
  builds[pairId] = {
    selectedCellIds,
    moveLevel: currentMoveLevel(),
    maxEnergyCap: currentMaxEnergyCap(),
  };
  try {
    localStorage.setItem(GRID_PREFERENCES_KEY, JSON.stringify(builds));
  } catch (_) {
    // The grid remains usable when local storage is unavailable.
  }
}

function queueGridBuildSave() {
  if (gridSaveQueued || restoringGridBuild) return;
  gridSaveQueued = true;
  requestAnimationFrame(() => {
    gridSaveQueued = false;
    saveCurrentGridBuild();
  });
}

function selectRememberedGridCell(cell, grid) {
  const transform = cell.getAttribute('transform');
  const polygon = Array.from(grid.querySelectorAll('polygon:not(.be-move-level-shade)'))
    .find((candidate) => candidate.parentElement?.getAttribute('transform') === transform);
  polygon?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function selectZeroEnergyGridCells(grid) {
  grid?.querySelectorAll('g[data-cell-id][data-energy="0"]:not([selected])').forEach((cell) => {
    selectRememberedGridCell(cell, grid);
  });
}

function setupZeroEnergyReset(grid) {
  const resetButton = document.querySelector('#resetCell button');
  if (!resetButton || resetButton.dataset.beZeroEnergyBound === 'true') return;
  resetButton.dataset.beZeroEnergyBound = 'true';
  resetButton.addEventListener('click', () => {
    // Brybry clears its selection in the same click event. Run afterward so
    // free tiles remain selected in the fresh build without spending Energy.
    setTimeout(() => selectZeroEnergyGridCells(grid));
  });
}

function restoreGridControls(remembered) {
  if (remembered.moveLevel) {
    document.querySelector(`[data-sync-level="${Math.min(5, remembered.moveLevel)}"]`)?.click();
  }
  if (remembered.maxEnergyCap) {
    const energy = document.getElementById(`energy-${remembered.maxEnergyCap}`);
    if (energy && !energy.checked) energy.click();
  }
}

function setupGridBuildMemory() {
  const grid = document.getElementById('grid');
  if (!grid || grid === observedMemoryGrid || !grid.querySelector('g[data-cell-id]')) return;

  gridMemoryObserver?.disconnect();
  observedMemoryGrid = grid;
  const pairId = currentPairId();
  const sharedBuild = new URL(location.href).searchParams.has('build');
  const remembered = normalizedGridBuild(readSavedGridBuilds()[pairId]);

  if (!sharedBuild) {
    restoringGridBuild = true;
    restoreGridControls(remembered);
    const rememberedIds = new Set(remembered.selectedCellIds);
    grid.querySelectorAll('g[data-cell-id]').forEach((cell) => {
      if (rememberedIds.has(String(cell.dataset.cellId)) && !cell.hasAttribute('selected')) {
        selectRememberedGridCell(cell, grid);
      }
    });
    if (!remembered.selectedCellIds.length) selectZeroEnergyGridCells(grid);
    restoringGridBuild = false;
  }

  setupZeroEnergyReset(grid);

  if (!document.documentElement.dataset.beGridControlMemory) {
    document.documentElement.dataset.beGridControlMemory = 'true';
    document.addEventListener('click', (event) => {
      if (!event.target.closest?.('[data-sync-level]')) return;
      queueGridBuildSave();
    }, true);
    document.addEventListener('change', (event) => {
      if (!event.target.matches?.('input[name="energy-radio"]')) return;
      queueGridBuildSave();
    }, true);
  }

  gridMemoryObserver = new MutationObserver(queueGridBuildSave);
  gridMemoryObserver.observe(grid, { subtree: true, attributes: true, attributeFilter: ['selected'] });
  // A shared `build` URL becomes the new remembered build for this pair.
  saveCurrentGridBuild(grid);
}
