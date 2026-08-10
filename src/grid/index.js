function normalizeGridLabel(value) {
  return String(value || '')
    .replace(/\u3000/g, ' ')
    .replace(/[\uff01-\uff5e]/g, (character) => String.fromCharCode(character.charCodeAt(0) - 0xfee0));
}

function conciseTileName(name) {
  const compact = normalizeGridLabel(name).replace(/\s+/g, ' ').trim();
  if (!compact) return '';

  const isCjk = /[\u3040-\u30ff\u3400-\u9fff]/.test(compact);
  const limit = isCjk ? 24 : 44;
  if (Array.from(compact).length <= limit) return compact;

  const colon = compact.search(/[：:]/);
  if (colon > 0) {
    const head = Array.from(compact.slice(0, colon + 1));
    const tail = Array.from(compact.slice(colon + 1));
    if (tail.length <= (isCjk ? 13 : 24)) {
      return `${head.slice(0, isCjk ? 10 : 18).join('')}…${tail.join('')}`;
    }
  }

  const characters = Array.from(compact);
  const headLength = isCjk ? 12 : 21;
  const tailLength = isCjk ? 11 : 22;
  return `${characters.slice(0, headLength).join('')}…${characters.slice(-tailLength).join('')}`;
}

function wrapTileName(name) {
  const compact = conciseTileName(name);
  if (!compact) return [];

  const isCjk = /[\u3040-\u30ff\u3400-\u9fff]/.test(compact);
  const maxChars = isCjk ? 6 : 12;
  const characters = Array.from(compact);
  const lines = [];

  if (isCjk) {
    for (let index = 0; index < characters.length; index += maxChars) {
      lines.push(characters.slice(index, index + maxChars).join(''));
    }
  } else {
    let line = '';
    for (const word of compact.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (next.length > maxChars && line) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    if (line) lines.push(line);
  }

  if (lines.length > 4) {
    lines.length = 4;
    const last = Array.from(lines[3]);
    lines[3] = `${last.slice(0, Math.max(1, maxChars - 1)).join('')}…`;
  }
  return lines;
}

function pomaTemplateValue(template, passiveId) {
  const value = Math.abs(Number(passiveId)) % 10;
  return String(template || '')
    .replace(/{{value}}/g, String(value))
    .replace(/{{plus}}/g, String(value + 1));
}

function pomaTileAbbreviation(ability, locale = language()) {
  const passiveId = Number(ability?.passiveId);
  if (!passiveId) return '';
  const skillTemplate = POMATOOLS_SKILL_ABBR[locale]?.[String(Math.floor(passiveId / 10))];
  if (!skillTemplate) return '';

  const skill = pomaTemplateValue(skillTemplate, passiveId);
  const moveId = Number(ability.moveId);
  if (Number(ability.type) !== 8 || moveId <= 0 || moveId > 30000) return skill;
  if (moveId > 9999 && moveId < 18500) return `${TRAINER_MOVE_LABELS[locale]}: ${skill}`;

  const move = POMATOOLS_MOVE_ABBR[locale]?.[String(moveId)]
    || moveNameByLocale[locale]?.get(String(moveId));
  return move ? `${move}: ${skill}` : skill;
}

function syncPowerTileLabel(moveInfo, locale = language()) {
  if (!moveInfo?.isSyncPowerBoost || !Number.isFinite(moveInfo.abilityValue)) return '';
  const template = SYNC_POWER_TILE_LABELS[locale] || SYNC_POWER_TILE_LABELS.en;
  return normalizeGridLabel(template.replace('{value}', String(moveInfo.abilityValue)));
}

function displayTileName(tile, fullName) {
  const normalizedFullName = normalizeGridLabel(fullName);
  const syncPowerLabel = syncPowerTileLabel(moveInfoByCellId.get(String(tile.dataset.cellId)));
  if (syncPowerLabel) return syncPowerLabel;
  const abbreviated = normalizeGridLabel(tileAbbreviationByCellId.get(String(tile.dataset.cellId)));
  if (!abbreviated || abbreviated === normalizedFullName) return normalizedFullName;

  const normalized = normalizedFullName.replace(/\s+/g, ' ').trim();
  const fullLines = wrapTileName(normalizedFullName);
  const abbreviatedLines = wrapTileName(abbreviated);
  const originalWasTruncated = conciseTileName(normalizedFullName) !== normalized;
  const materiallyImprovesLayout = fullLines.length >= 3
    && abbreviatedLines.length < fullLines.length;
  return originalWasTruncated || fullLines.length >= 4 || materiallyImprovesLayout
    ? abbreviated
    : normalizedFullName;
}

const LINE_LAYOUTS = {
  1: { baseFontSize: 11.5, widths: [58] },
  2: { baseFontSize: 10, widths: [56, 52] },
  3: { baseFontSize: 9, widths: [50, 60, 48] },
  4: { baseFontSize: 9, widths: [44, 56, 56, 44] },
};
const TILE_LINE_HEIGHT = 1.15;

function fitSpanToWidth(span, maxWidth) {
  requestAnimationFrame(() => {
    const measured = span.getComputedTextLength();
    if (measured > maxWidth) {
      span.setAttribute('textLength', String(maxWidth));
      span.setAttribute('lengthAdjust', 'spacingAndGlyphs');
    }
  });
}

function addTileLabels() {
  document.querySelectorAll('g[data-cell-id]').forEach((tile) => {
    if (tile.querySelector(`.${TILE_LABEL_CLASS}`)) return;

    const fullName = normalizeGridLabel(tile.dataset.tileName);
    const lines = wrapTileName(displayTileName(tile, fullName));
    if (!lines.length) return;

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const layout = LINE_LAYOUTS[lines.length];
    label.classList.add(TILE_LABEL_CLASS);
    label.setAttribute('x', '34.5');
    label.setAttribute('text-anchor', 'middle');
    label.dataset.lineCount = String(lines.length);
    label.setAttribute('font-size', String(layout.baseFontSize));
    label.setAttribute('aria-label', fullName);
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = fullName;
    label.append(title);

    lines.forEach((line, index) => {
      const span = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      span.setAttribute('x', '34.5');
      span.setAttribute('y', '32');
      span.textContent = line;
      label.append(span);
      fitSpanToWidth(span, layout.widths[index]);
    });
    tile.append(label);
  });
}

function repositionGridTooltip(tooltip, tile) {
  const tileRect = tile.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  let left = tileRect.left + tileRect.width / 2 - tooltipRect.width / 2 + window.scrollX;
  let top = tileRect.top - tooltipRect.height - 10 + window.scrollY;
  if (top < window.scrollY) top = tileRect.bottom + 10 + window.scrollY;
  left = Math.max(window.scrollX + 8, Math.min(left, window.scrollX + window.innerWidth - tooltipRect.width - 8));
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function visibleGridTooltip() {
  return [...document.querySelectorAll('body > .tooltip')]
    .reverse()
    .find((candidate) => getComputedStyle(candidate).display !== 'none');
}

function appendPowerMultiplier(tooltip, multiplier) {
  if (!tooltip || !multiplier || tooltip.querySelector('.be-power-multiplier')) return;
  const template = multiplier.kind === 'cap' ? text().multiplierCap : text().multiplier;
  if (!template) return;
  const line = document.createElement('span');
  line.className = 'be-power-multiplier';
  line.textContent = template.replace('{value}', String(multiplier.value));
  const effect = tooltip.children[1];
  if (effect) effect.append(line);
  else tooltip.append(line);
}

function fieldDurationInfo(passiveId, englishDescription) {
  const description = String(englishDescription || '').normalize('NFKC');
  const extendsDuration = /extends the duration/i.test(description);
  const createsTimedField = [
    /makes the weather (?:sunny|rainy)/i,
    /causes (?:a sandstorm|a hailstorm|snow)/i,
    /turns the field of play(?:’s|'s) (?:terrain|zone) into/i,
    /applies [^.]*circle[^.]* to the allied field of play/i,
    /applies (?:the )?(?:physical damage reduction|special damage reduction|critical-hit defense|status condition defense|status move defense|stat reduction defense|move gauge acceleration|no stat increases) effect/i,
    /applies (?:the )?(?:fire|poison|rock|dark|steel) damage field/i,
  ].some((pattern) => pattern.test(description));
  if (!extendsDuration && !createsTimedField) return null;
  const level = Math.abs(Number(passiveId)) % 10;
  return {
    baseSeconds: 45,
    extensionSeconds: extendsDuration && level > 0 ? level * 10 : null,
  };
}

function appendFieldDuration(tooltip, moveInfo) {
  if (!tooltip || !moveInfo?.passiveId || tooltip.querySelector('.be-field-duration')) return;
  const englishDescription = passiveSkillDetails(moveInfo.passiveId, 'en')?.description;
  const duration = fieldDurationInfo(moveInfo.passiveId, englishDescription);
  if (!duration) return;
  const copy = text();
  const details = [copy.fieldDurationBase.replace('{value}', String(duration.baseSeconds))];
  if (duration.extensionSeconds) {
    details.push(copy.fieldDurationExtension.replace('{value}', String(duration.extensionSeconds)));
  }
  const line = document.createElement('span');
  line.className = 'be-field-duration';
  line.textContent = details.join(' · ');
  tooltip.append(line);
}

function requiredMoveLevel(tile) {
  return Math.max(1, Number(tile?.dataset.level) || 1);
}

function moveLevelIconUrl(level) {
  return `${MOVE_LEVEL_ICON_BASE}${Math.min(5, Math.max(1, Number(level) || 1))}.png`;
}

function appendRequiredMoveLevel(tooltip, tile) {
  if (!tooltip || tooltip.querySelector('.be-required-move-level')) return;
  const level = requiredMoveLevel(tile);
  const accessibleLabel = text().requiredMoveLevel.replace('{value}', String(level));
  const line = document.createElement('span');
  line.className = 'be-required-move-level';
  line.setAttribute('aria-label', accessibleLabel);
  line.title = accessibleLabel;
  const icon = document.createElement('img');
  icon.className = 'be-required-move-level-icon';
  icon.src = moveLevelIconUrl(level);
  icon.alt = accessibleLabel;
  line.append(icon);
  const title = tooltip.firstElementChild;
  const titleText = title?.querySelector('b') || title?.firstChild;
  if (title && titleText) title.insertBefore(line, titleText);
  else tooltip.prepend(line);
}

function appendRelatedMoveDescription(tooltip, moveInfo) {
  if (!tooltip || !moveInfo?.moveId || moveInfo.abilityType === 11
    || tooltip.querySelector('.be-related-move')) return;

  const moveDescriptionResolver = typeof window.getMoveDescr === 'function'
    ? window.getMoveDescr
    : (typeof getMoveDescr === 'function' ? getMoveDescr : null);
  const description = moveDescriptionResolver?.(Number(moveInfo.moveId));
  if (!description || description === 'undefined') return;

  const block = document.createElement('p');
  block.className = 'be-related-move';
  const name = document.createElement('strong');
  name.textContent = moveNameByLocale[language()].get(moveInfo.moveId) || moveInfo.moveId;
  const detail = document.createElement('span');
  detail.textContent = description;
  block.append(name, detail);
  tooltip.append(block);
}

function appendGridTooltipDetails(tile, moveInfo) {
  const tooltip = visibleGridTooltip();
  if (!tooltip) return;
  appendRequiredMoveLevel(tooltip, tile);
  appendPowerMultiplier(tooltip, moveInfo?.powerMultiplier);
  appendFieldDuration(tooltip, moveInfo);
  appendRelatedMoveDescription(tooltip, moveInfo);
  repositionGridTooltip(tooltip, tile);
}

function setupMoveTooltips() {
  const grid = document.getElementById('grid');
  if (!grid) return;
  const polygons = Array.from(grid.querySelectorAll('polygon'));
  grid.querySelectorAll('g[data-cell-id]').forEach((tile) => {
    const moveInfo = moveInfoByCellId.get(String(tile.dataset.cellId));
    const transform = tile.getAttribute('transform');
    const polygon = polygons.find((candidate) => candidate.parentElement?.getAttribute('transform') === transform);
    if (!polygon || polygon.dataset.beMoveTooltipBound === 'true') return;
    polygon.dataset.beMoveTooltipBound = 'true';
    polygon.addEventListener('mouseenter', () => {
      tile.classList.add('be-move-level-hovered');
      appendGridTooltipDetails(tile, moveInfo);
    });
    polygon.addEventListener('mouseleave', () => tile.classList.remove('be-move-level-hovered'));
  });
}

function currentMoveLevel() {
  const activeLevels = [...document.querySelectorAll('[data-sync-level]')]
    .filter((control) => !getComputedStyle(control).backgroundImage.includes('level-off'))
    .map((control) => Number(control.dataset.syncLevel))
    .filter(Number.isFinite);
  return activeLevels.length ? Math.max(...activeLevels) : 1;
}

function maxEnergyCapForMoveLevel(level) {
  return 60 + Math.min(5, Math.max(1, Number(level) || 1)) * 2;
}

function updateMaxEnergyCapAvailability(level = currentMoveLevel()) {
  const maximum = maxEnergyCapForMoveLevel(level);
  const energyControls = [...document.querySelectorAll('input[name="energy-radio"]')];
  energyControls.forEach((control) => {
    const cap = Number(control.id.match(/^energy-(\d+)$/)?.[1]);
    control.disabled = Number.isFinite(cap) && cap > maximum;
  });

  const selected = energyControls.find((control) => control.checked);
  const selectedCap = Number(selected?.id.match(/^energy-(\d+)$/)?.[1]);
  if (selected && Number.isFinite(selectedCap) && selectedCap <= maximum) return;

  const fallback = document.getElementById(`energy-${maximum}`);
  if (fallback && !fallback.disabled && !fallback.checked) fallback.click();
}

function updateMoveLevelAvailability() {
  const level = currentMoveLevel();
  updateMaxEnergyCapAvailability(level);
  document.querySelectorAll('#grid g[data-cell-id]').forEach((tile) => {
    let shade = tile.querySelector('.be-move-level-shade');
    if (!shade) {
      shade = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      shade.classList.add('be-move-level-shade');
      shade.setAttribute('points', '17.25,0 51.75,0 69,30 51.75,60 17.25,60 0,30');
      tile.append(shade);
    }
    const unavailable = requiredMoveLevel(tile) > level;
    tile.classList.toggle('be-move-level-disabled', unavailable);
    tile.setAttribute('aria-disabled', String(unavailable));
  });
}

function setupMoveLevelAvailability() {
  if (!document.documentElement.dataset.beMoveLevelAvailability) {
    document.documentElement.dataset.beMoveLevelAvailability = 'true';
    document.addEventListener('click', (event) => {
      if (!event.target.closest?.('[data-sync-level]')) return;
      requestAnimationFrame(updateMoveLevelAvailability);
    }, true);
  }
  updateMoveLevelAvailability();
}

function resizeGrid() {
  const svg = document.querySelector('#gridDiv > svg');
  const gridDiv = svg?.parentElement;
  const wrapper = gridDiv?.parentElement;
  if (!svg || !gridDiv || !wrapper) return;

  const naturalWidth = Number.parseFloat(svg.getAttribute('width')) || svg.viewBox.baseVal.width;
  const naturalHeight = Number.parseFloat(svg.getAttribute('height')) || svg.viewBox.baseVal.height;
  const availableWidth = Math.max(0, wrapper.clientWidth - 8);
  if (!naturalWidth || !naturalHeight || !availableWidth) return;

  const roomyViewport = window.innerWidth >= 700;
  const remainingHeight = Math.max(
    360,
    window.innerHeight - wrapper.getBoundingClientRect().top - 20,
    window.innerHeight - 40,
  );
  const widthScale = availableWidth / naturalWidth;
  const heightScale = remainingHeight / naturalHeight;
  const scale = roomyViewport
    ? Math.max(1, Math.min(widthScale, heightScale, 2.25))
    : Math.min(1, widthScale);

  svg.style.setProperty('transform', `scale(${scale})`, 'important');
  svg.style.transformOrigin = 'top left';
  gridDiv.style.width = `${naturalWidth * scale}px`;
  gridDiv.style.height = `${naturalHeight * scale}px`;
  resizeTileLabels(scale);
}

function resizeTileLabels(gridScale) {
  document.querySelectorAll(`.${TILE_LABEL_CLASS}`).forEach((label) => {
    const lineCount = Number(label.dataset.lineCount) || 1;
    const layout = LINE_LAYOUTS[lineCount];
    const screenFontSize = Math.max(9, Math.min(16, layout.baseFontSize * gridScale));
    label.setAttribute('font-size', String(screenFontSize / gridScale));
    label.style.setProperty('stroke-width', `${2.1 / gridScale}px`);

    label.querySelectorAll('tspan').forEach((span, index) => {
      const offset = index - (lineCount - 1) / 2;
      const lineHeight = screenFontSize * TILE_LINE_HEIGHT;
      span.setAttribute('y', String(32 + offset * (lineHeight / gridScale)));
      span.removeAttribute('textLength');
      span.removeAttribute('lengthAdjust');
      fitSpanToWidth(span, layout.widths[index]);
    });
  });
}

function setupResponsiveGrid() {
  const gridDiv = document.getElementById('gridDiv');
  const wrapper = gridDiv?.parentElement;
  const picker = wrapper?.parentElement;
  if (!gridDiv || !wrapper || !picker) return;

  wrapper.classList.add('be-grid-wrapper');
  picker.classList.add('be-grid-picker');

  if (responsiveGrid !== wrapper) {
    gridResizeObserver?.disconnect();
    responsiveGrid = wrapper;
    gridResizeObserver = new ResizeObserver(() => requestAnimationFrame(resizeGrid));
    gridResizeObserver.observe(wrapper);
  }
  if (!windowResizeBound) {
    windowResizeBound = true;
    window.addEventListener('resize', () => requestAnimationFrame(resizeGrid), { passive: true });
  }
  requestAnimationFrame(resizeGrid);
}

function moveSyncGridBeforeStats() {
  const documentGrid = document.getElementById('syncGridDiv');
  if (documentGrid) retainedSyncGridSection = documentGrid;
  const gridSection = documentGrid || retainedSyncGridSection;
  const activePairContent = [...document.querySelectorAll('.tabContent')]
    .find((section) => getComputedStyle(section).display !== 'none');
  if (!gridSection || !activePairContent) return;

  // Stats is the first section in every localized/form-specific pair panel.
  // Using structure instead of its translated heading keeps this language agnostic.
  const statsHeading = [...activePairContent.children]
    .find((child) => child.tagName === 'H2');
  if (!statsHeading || gridSection.nextElementSibling === statsHeading) return;
  activePairContent.insertBefore(gridSection, statsHeading);
}

function restoreSyncGridHome() {
  const documentGrid = document.getElementById('syncGridDiv');
  if (documentGrid) retainedSyncGridSection = documentGrid;
  const gridSection = documentGrid || retainedSyncGridSection;
  const content = document.getElementById('contentDiv');
  if (!gridSection || !content || gridSection.parentElement === content) return;
  content.append(gridSection);
}

function setupSectionOrdering() {
  if (!document.documentElement.dataset.beSectionOrdering) {
    document.documentElement.dataset.beSectionOrdering = 'true';
    // Brybry replaces the active pair content during a selection change. Move
    // the shared Grid back to its stable host before that replacement happens,
    // then the mutation refresh will place it before the new Stats section.
    document.addEventListener('change', (event) => {
      if (event.target.id === 'syncPairSelect') restoreSyncGridHome();
    }, true);
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.tabLinks')) return;
      requestAnimationFrame(moveSyncGridBeforeStats);
    }, true);
  }
  moveSyncGridBeforeStats();
}
