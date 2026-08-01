# Agent development rules

## Generated artifact

- Never edit `brybry-enhancer.user.js` directly. It is the generated install artifact.
- Make all product and behavior changes under `src/`.
- Run `npm run build` after changing source and commit the regenerated root userscript.
- Run `npm run check` before handing work back. It verifies metadata, syntax and source/artifact consistency.

## Architecture

- Keep the project in plain JavaScript. Do not add React, Vue, TypeScript or a runtime framework.
- Preserve the responsibility-based boundaries documented in `README.md`; do not create many tiny modules.
- Large static tables belong under `src/data/`, not in feature logic. Do not read or hand-edit every file in `src/data/pomatools-abbreviations/`; regenerate them with `npm run update:pomatools -- /path/to/pomatools.github.io`.
- CSS belongs in `src/styles.css`; the build embeds it in the final userscript.
- The ordered source files share one userscript runtime scope. If a new source module is necessary, add it to `sourceFiles` in `scripts/build.js` in dependency-safe order.

## Compatibility contract

- Preserve userscript metadata, storage keys, URL parameters, Brybry data URLs, DOM selectors and defaults unless a task explicitly requests a behavior change.
- The repository-root userscript must remain directly installable and directly injectable for browser debugging.
- A pull request that changes `src/` must also include the rebuilt `brybry-enhancer.user.js`.
