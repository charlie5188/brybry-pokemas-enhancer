function isSelectableTrainer(trainer) {
  return trainer && trainer.scheduleId !== 'NEVER_CHECK_DICTIONARY'
    && trainer.scheduleId !== 'NEVER' && trainer.scoutMethod !== 3;
}

function isReleasedTrainer(trainer, now = Date.now() / 1000) {
  return (releaseDateByScheduleId.get(String(trainer?.scheduleId)) || 0) <= now;
}

function rememberSafePair(pairId) {
  const trainer = trainerById.get(String(pairId));
  if (!isSelectableTrainer(trainer) || !isReleasedTrainer(trainer)) return;
  lastSafePairId = String(pairId);
  savePickerPreferences();
}

async function preflightSpoilerProtection() {
  if (!spoilerProtectionEnabled) return true;
  const requestedPairId = new URL(location.href).searchParams.get('pair');
  if (!requestedPairId) return true;

  const root = document.documentElement;
  if (root) root.style.visibility = 'hidden';
  let redirecting = false;
  try {
    await loadCoreData();
    const requestedTrainer = trainerById.get(String(requestedPairId));
    if (isSelectableTrainer(requestedTrainer) && !isReleasedTrainer(requestedTrainer)) {
      const releasedTrainers = [...trainerById.values()]
        .filter((trainer) => isSelectableTrainer(trainer) && isReleasedTrainer(trainer))
        .sort((first, second) => {
          const firstDate = releaseDateByScheduleId.get(String(first.scheduleId)) || 0;
          const secondDate = releaseDateByScheduleId.get(String(second.scheduleId)) || 0;
          return firstDate - secondDate;
        });
      const rememberedTrainer = trainerById.get(String(lastSafePairId));
      const fallback = isSelectableTrainer(rememberedTrainer) && isReleasedTrainer(rememberedTrainer)
        ? rememberedTrainer
        : releasedTrainers[0];
      if (fallback) {
        const safeUrl = new URL(location.href);
        safeUrl.searchParams.set('pair', String(fallback.trainerId));
        ['monsterId', 'baseId', 'formId', 'build'].forEach((parameter) => safeUrl.searchParams.delete(parameter));
        sessionStorage.setItem(SPOILER_REDIRECT_KEY, 'true');
        redirecting = true;
        location.replace(safeUrl.toString());
        return false;
      }
    }
    rememberSafePair(requestedPairId);
  } catch (error) {
    console.warn('[Brybry Enhancer] Spoiler protection could not verify this Sync Pair.', error);
  } finally {
    if (root && !redirecting) root.style.visibility = '';
  }
  return true;
}

function showSpoilerBanner() {
  if (sessionStorage.getItem(SPOILER_REDIRECT_KEY) !== 'true' || document.querySelector('.be-spoiler-banner')) return;
  sessionStorage.removeItem(SPOILER_REDIRECT_KEY);
  const banner = document.createElement('div');
  banner.className = 'be-spoiler-banner';
  banner.setAttribute('role', 'status');
  const message = document.createElement('span');
  message.textContent = text().spoilerBanner;
  const close = document.createElement('button');
  close.type = 'button';
  close.setAttribute('aria-label', text().close);
  close.textContent = '×';
  close.addEventListener('click', () => banner.remove());
  banner.append(message, close);
  document.body.append(banner);
}

function updateSpoilerSensitiveSections() {
  document.documentElement?.toggleAttribute('data-be-spoiler-protection', spoilerProtectionEnabled);
  const lastUpdateSection = document.getElementById('lastReleasedPairs');
  if (lastUpdateSection) lastUpdateSection.hidden = spoilerProtectionEnabled;
}

function createSettingsSection(title) {
  const heading = document.createElement('h3');
  heading.className = 'be-settings-section';
  heading.textContent = title;
  return heading;
}

function createSettingsToggle(title, description, checked, onChange) {
  const row = document.createElement('label');
  row.className = 'be-toggle-row';
  const copy = document.createElement('span');
  copy.className = 'be-toggle-copy';
  const label = document.createElement('strong');
  label.textContent = title;
  const detail = document.createElement('small');
  detail.textContent = description;
  copy.append(label, detail);
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = checked;
  const switchVisual = document.createElement('span');
  switchVisual.className = 'be-switch';
  switchVisual.setAttribute('aria-hidden', 'true');
  row.append(copy, checkbox, switchVisual);
  checkbox.addEventListener('change', () => onChange(checkbox.checked));
  return { row, checkbox };
}

function removeLocalValue(key) {
  try {
    localStorage.removeItem(key);
  } catch (_) {
    // The active page remains usable when storage is unavailable.
  }
}

function ensureSettingsControl() {
  const header = document.getElementById('headerBody');
  if (!header || document.getElementById('brybry-enhancer-settings')) return;
  const copy = text();
  const wrapper = document.createElement('div');
  wrapper.id = 'brybry-enhancer-settings';
  wrapper.className = 'be-settings';

  const button = document.createElement('button');
  button.className = 'be-settings-button';
  button.type = 'button';
  button.innerHTML = SETTINGS_ICON;
  button.setAttribute('aria-label', copy.settings);
  button.setAttribute('aria-expanded', 'false');
  button.title = copy.settings;

  const popover = document.createElement('div');
  popover.id = 'brybry-enhancer-settings-popover';
  popover.className = 'be-settings-popover';
  popover.hidden = true;
  button.setAttribute('aria-controls', popover.id);
  const heading = document.createElement('h2');
  heading.className = 'be-settings-heading';
  heading.textContent = ENHANCER_NAME;
  const contentSection = createSettingsSection(copy.contentSettings);
  const spoilerToggle = createSettingsToggle(
    copy.spoilerProtection,
    copy.spoilerDescription,
    spoilerProtectionEnabled,
    async (enabled) => {
      spoilerProtectionEnabled = enabled;
      savePickerPreferences();
      updateSpoilerSensitiveSections();
      if (spoilerProtectionEnabled && !(await preflightSpoilerProtection())) return;
      refreshPicker();
    },
  );
  const gridSection = createSettingsSection(copy.gridSettings);
  const finalFormToggle = createSettingsToggle(
    copy.finalBattleForm,
    copy.finalBattleFormDescription,
    finalBattleFormEnabled,
    (enabled) => {
      finalBattleFormEnabled = enabled;
      savePickerPreferences();
    },
  );
  const buildMemoryToggle = createSettingsToggle(
    copy.gridBuildMemory,
    copy.gridBuildMemoryDescription,
    gridBuildMemoryEnabled,
    (enabled) => {
      gridBuildMemoryEnabled = enabled;
      savePickerPreferences();
      queueRefresh();
    },
  );
  const zeroEnergyToggle = createSettingsToggle(
    copy.zeroEnergyReset,
    copy.zeroEnergyResetDescription,
    zeroEnergyResetEnabled,
    (enabled) => {
      zeroEnergyResetEnabled = enabled;
      savePickerPreferences();
    },
  );
  const labelsToggle = createSettingsToggle(
    copy.gridLabels,
    copy.gridLabelsDescription,
    gridLabelsEnabled,
    (enabled) => {
      gridLabelsEnabled = enabled;
      savePickerPreferences();
      queueRefresh();
    },
  );
  const tooltipToggle = createSettingsToggle(
    copy.detailedGridTooltips,
    copy.detailedGridTooltipsDescription,
    detailedGridTooltipsEnabled,
    (enabled) => {
      detailedGridTooltipsEnabled = enabled;
      savePickerPreferences();
    },
  );
  const responsiveToggle = createSettingsToggle(
    copy.responsiveGrid,
    copy.responsiveGridDescription,
    responsiveGridEnabled,
    (enabled) => {
      responsiveGridEnabled = enabled;
      savePickerPreferences();
      queueRefresh();
    },
  );
  const dataSection = createSettingsSection(copy.localData);
  const clearBuilds = document.createElement('button');
  clearBuilds.className = 'be-settings-action';
  clearBuilds.type = 'button';
  clearBuilds.textContent = copy.clearSavedBuilds;
  clearBuilds.addEventListener('click', () => {
    if (window.confirm(copy.clearSavedBuildsConfirm)) removeLocalValue(GRID_PREFERENCES_KEY);
  });
  const clearPreferences = document.createElement('button');
  clearPreferences.className = 'be-settings-action';
  clearPreferences.type = 'button';
  clearPreferences.textContent = copy.resetPreferences;
  clearPreferences.addEventListener('click', () => {
    if (!window.confirm(copy.resetPreferencesConfirm)) return;
    removeLocalValue(PICKER_PREFERENCES_KEY);
    spoilerProtectionEnabled = false;
    gridBuildMemoryEnabled = true;
    zeroEnergyResetEnabled = true;
    gridLabelsEnabled = true;
    detailedGridTooltipsEnabled = true;
    responsiveGridEnabled = true;
    finalBattleFormEnabled = true;
    lastSafePairId = '';
    sortCriterion = 'updated';
    sortDirection = 'desc';
    viewMode = 'icons';
    openFilterAccordions = new Set();
    closedFilterAccordions = new Set();
    filterSectionOrder = [];
    spoilerToggle.checkbox.checked = spoilerProtectionEnabled;
    buildMemoryToggle.checkbox.checked = gridBuildMemoryEnabled;
    zeroEnergyToggle.checkbox.checked = zeroEnergyResetEnabled;
    labelsToggle.checkbox.checked = gridLabelsEnabled;
    tooltipToggle.checkbox.checked = detailedGridTooltipsEnabled;
    responsiveToggle.checkbox.checked = responsiveGridEnabled;
    finalFormToggle.checkbox.checked = finalBattleFormEnabled;
    updateSpoilerSensitiveSections();
    queueRefresh();
    refreshPicker();
  });
  const contributeLink = document.createElement('a');
  contributeLink.className = 'be-settings-item';
  contributeLink.href = PROJECT_GITHUB_URL;
  contributeLink.target = '_blank';
  contributeLink.rel = 'noopener noreferrer';
  contributeLink.textContent = copy.contributeOnGitHub;
  const version = document.createElement('div');
  version.className = 'be-settings-item be-settings-version';
  const versionLabel = document.createElement('span');
  versionLabel.textContent = copy.version;
  const versionValue = document.createElement('strong');
  versionValue.textContent = `v${ENHANCER_VERSION}`;
  version.append(versionLabel, versionValue);
  popover.append(
    heading,
    contentSection,
    spoilerToggle.row,
    finalFormToggle.row,
    gridSection,
    buildMemoryToggle.row,
    zeroEnergyToggle.row,
    labelsToggle.row,
    tooltipToggle.row,
    responsiveToggle.row,
    dataSection,
    clearBuilds,
    clearPreferences,
    contributeLink,
    version,
  );
  wrapper.append(button, popover);
  header.append(wrapper);

  const setOpen = (open) => {
    popover.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
  };
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    setOpen(popover.hidden);
  });
  popover.addEventListener('click', (event) => event.stopPropagation());
  document.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
}
