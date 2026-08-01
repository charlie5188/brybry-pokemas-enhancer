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
  const heading = document.createElement('p');
  heading.className = 'be-settings-heading';
  heading.textContent = copy.settings;
  const toggleRow = document.createElement('label');
  toggleRow.className = 'be-toggle-row';
  const toggleCopy = document.createElement('span');
  toggleCopy.className = 'be-toggle-copy';
  const toggleTitle = document.createElement('strong');
  toggleTitle.textContent = copy.spoilerProtection;
  const toggleDescription = document.createElement('small');
  toggleDescription.textContent = copy.spoilerDescription;
  toggleCopy.append(toggleTitle, toggleDescription);
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = spoilerProtectionEnabled;
  const switchVisual = document.createElement('span');
  switchVisual.className = 'be-switch';
  switchVisual.setAttribute('aria-hidden', 'true');
  toggleRow.append(toggleCopy, checkbox, switchVisual);
  popover.append(heading, toggleRow);
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
  checkbox.addEventListener('change', async () => {
    spoilerProtectionEnabled = checkbox.checked;
    savePickerPreferences();
    updateSpoilerSensitiveSections();
    if (spoilerProtectionEnabled && !(await preflightSpoilerProtection())) return;
    refreshPicker();
  });
}
