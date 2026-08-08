function queueRefresh() {
  if (refreshQueued) return;
  refreshQueued = true;
  requestAnimationFrame(() => {
    refreshQueued = false;
    addTileLabels();
    setupMoveTooltips();
    setupMoveLevelAvailability();
    setupResponsiveGrid();
    setupGridBuildMemory();
    setupSectionOrdering();
    ensurePicker();
    ensureSettingsControl();
    updateSpoilerSensitiveSections();
    showSpoilerBanner();
  });
}

async function init() {
  addStyles();
  updateSpoilerSensitiveSections();
  try {
    await loadTrainerData();
    const currentPairId = new URL(location.href).searchParams.get('pair');
    if (currentPairId) rememberSafePair(currentPairId);
  } catch (error) {
    console.warn('[Brybry Enhancer] Pair filters could not load.', error);
  }

  queueRefresh();
  new MutationObserver(queueRefresh).observe(document.body, { childList: true, subtree: true });
}

async function bootstrap() {
  if (!(await preflightSpoilerProtection())) return;
  if (document.readyState === 'loading') {
    await new Promise((resolve) => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
  }
  await init();
}

bootstrap();
