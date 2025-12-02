# Contributing to Vizzy

Thanks for helping improve the project! This repo bundles three pieces:

1. **`_new/packages/charts/`** – the published `@vizzy/charts` package (D3 renderers, hooks, shared UI, Jest tests).
2. **`app/`** – the Next.js site (marketing pages + documentation). We use route groups for clarity: `(site)` for marketing, `(docs)` for documentation, `(shared)` for common UI/providers.
3. **`cli/`** – the `vizzy` CLI that scaffolds wrapper components and installs dependencies.

## Local setup

```bash
git clone https://github.com/cbarrett3/vizzy.git
cd vizzy
npm install
```

Common scripts:

| Command               | Description                                    |
| --------------------- | ---------------------------------------------- |
| `npm run dev`         | Start the Next.js app                          |
| `npm run lint`        | Lint the entire repo                           |
| `npm run test:app`    | UI/interaction tests for shared app components |
| `npm run test:charts` | Jest suite for `@vizzy/charts`                |
| `cd cli && npm test`  | Run CLI unit tests                             |

## Working in the app

- Use the `(site)/(docs)/(shared)` structure. Shared UI (chart controls, providers, icons, etc.) should live in `app/(shared)/…`.
- Import charts from `@vizzy/charts`; the old `app/_components/charts` directory has been removed and is lint-restricted.
- Add docs/examples under `app/(docs)` or `examples/` and reuse shared components instead of duplicating UI.

## Working in the chart package

- All charts (`D3BarChart`, `D3LineChart`, etc.) live in `_new/packages/charts/src/charts`. Shared hooks/UI go under `src/hooks` and `src/utils`.
- Keep the package README in sync with the public API. If you add a new chart or prop, update the table there.
- Run `npm run test:charts` locally before committing.

## Working in the CLI

- CLI templates now live in `cli/templates/charts` and simply import from `@vizzy/charts`.
- `cli/src/utils/project-structure.ts` encapsulates destination detection; `cli/src/utils/dashboard.ts` handles file writes.
- After modifying CLI behavior, run the CLI tests from `cli/` (`npm test`) and update `cli/README.md` if the workflow changes.

## Pull requests

- Please include relevant tests (Jest for chart/package changes, CLI tests for scaffolding, or Playwright once we wire it up).
- Keep commits focused: separate refactors vs. feature work.
- Run `npm run lint && npm run test:app && npm run test:charts` (and `cli` tests if touched) so CI stays green.

Thanks again for contributing! Feel free to open a discussion if you’re unsure where something should live.


