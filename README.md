# Brybry Pokemas Enhancer

A plain-JavaScript userscript that improves the Sync Pair page at `pokemon.brybry.ch`. Development happens in small, responsibility-based files under `src/`; users still install one generated file from the repository root.

[Install Brybry Pokemas Enhancer](https://raw.githubusercontent.com/charlie5188/brybry-pokemas-enhancer/main/brybry-enhancer.user.js)

> `brybry-enhancer.user.js` is generated. Do not edit it directly. Change `src/`, then run `npm run build`.

## Install

### Safari

1. Install Userscripts for Safari from the App Store.
2. Enable it in Safari Extensions and allow it on `pokemon.brybry.ch`.
3. Open the install link above and add the userscript to Userscripts for Safari.
4. Open or reload the Brybry Pokemas Sync Pair page.

### Tampermonkey

1. Install Tampermonkey in a supported browser.
2. Open the install link above and confirm installation.
3. Open or reload the Brybry Pokemas Sync Pair page.

The generated root file remains a self-contained userscript with its metadata header at the first byte. The existing Codex/Playwright development workflow can continue injecting that same file into the live page without a userscript manager.

## Development

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

`npm run dev` watches `src/` and rebuilds the root userscript after each save.

Available commands:

- `npm run build` — bundles all source, CSS and data into `brybry-enhancer.user.js` using esbuild.
- `npm run dev` — builds once, then watches `src/`.
- `npm run check` — rebuilds in memory and checks metadata placement, JavaScript syntax and that the committed generated file is current.
- `npm test` — alias for `npm run check`.
- `npm run update:pomatools -- /path/to/pomatools.github.io` — regenerates the eight locale-specific abbreviation datasets from a PomaTools checkout.

Before opening a pull request, run:

```sh
npm run build
npm run check
```

Commit both the source changes and the regenerated root userscript. CI repeats the build and fails if the committed artifact differs.

## Project structure

```text
src/
  index.js                 Initialization and feature orchestration
  config.js                URLs, storage keys and shared configuration
  i18n.js                  Locale detection data and UI copy
  state.js                 Shared runtime state and defaults
  storage.js               Picker preferences and per-pair Sync Grid builds
  spoiler-protection.js    Spoiler redirect, settings and sensitive sections
  styles.css               All injected styles
  styles.js                Style element mounting
  data/
    index.js               Brybry loading, indexes and skill-search text
    pomatools-abbreviations/
      *-skills.json        Locale-specific authored Grid skill abbreviations
      *-moves.json         Locale-specific authored move abbreviations
  grid/
    index.js               Labels, wrapping, responsive sizing and tooltips
  picker/
    index.js               Dialog, filters, sorting and list/icon results
scripts/
  build.js                 Deterministic esbuild pipeline and watch mode
  check.js                 Artifact, metadata and syntax checks
```

The JavaScript files are plain source modules combined in the fixed order declared by `scripts/build.js`. They intentionally share the userscript's single runtime scope, which preserves the current behavior without introducing a framework or runtime module loader. Put changes in the narrowest relevant source file; keep large static datasets in `src/data/`.

## Current features

- Up to four responsive text lines per Sync Grid tile, capped at 16px with PomaTools abbreviations when useful.
- Related move descriptions in Grid tooltips, responsive Grid sizing and locally remembered Grid builds.
- A two-column Sync Pair picker with icon/list views, localized search, skill search, filters and sorting.
- Type, Role, EX Role, Role Combination, Weakness, stars, acquisition, scout type, region, team-skill and Superawakening filters.
- Optional spoiler protection for unreleased pairs and Grid updates.
- Sync Grid section placement before Stats.
- Persistent picker preferences and per-pair Sync Grid configurations using the existing storage keys.

Pair names and filter metadata continue to come from Brybry's current data files. No separate Sync Pair catalog is maintained.

The enhancer follows Brybry's content-language URL/cookie and supports the same eight languages: English, French, German, Spanish, Italian, Japanese, Korean and Traditional Chinese. Localized game terms and skill text come from Brybry; authored Grid abbreviations come from PomaTools.
The current abbreviation snapshot is generated from PomaTools commit `47943a730951580152bae7fa3d223c9ac97f80b1`.

## License and attribution

Project source code is available under the [MIT License](LICENSE). Generated
PomaTools abbreviation datasets are excluded from that license; see
[NOTICE.md](NOTICE.md) for their source and attribution.

This is an unofficial, fan-made project. Pokémon, Pokémon Masters EX, and
related names and assets belong to their respective owners. The project is not
affiliated with or endorsed by Pokémon, DeNA, Nintendo, Creatures, GAME FREAK,
Brybry, or PomaTools.
