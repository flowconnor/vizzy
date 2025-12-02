# Canopy Charts

<div align="center">
  <img src="public/favicon.svg" width="180" height="180" alt="Canopy Charts Logo">
  
  <h1>Data Visualization for the AI Era</h1>
  
  <p><strong>Describe the chart you want. Get production-ready code you own.</strong></p>
</div>

## How It Works

<table>
<tr>
<td width="33%" align="center">
  <h3>📝 Describe</h3>
  <p>Use the <code>/chart</code> command in your IDE</p>
  <p><em>"Create a time series with annotations for key events"</em></p>
</td>
<td width="33%" align="center">
  <h3>✨ Generate</h3>
  <p>AI-powered visualization code</p>
  <p><em>Tailored to your data and requirements</em></p>
</td>
<td width="33%" align="center">
  <h3>🔧 Own</h3>
  <p>Your code, your way</p>
  <p><em>No dependencies, unlimited customization</em></p>
</td>
</tr>
</table>

## Features

- **AI-Powered Generation** — From simple charts to complete dashboards
- **Data-Aware Design** — Intelligent visualization based on your actual data
- **Complete Ownership** — No dependencies or black boxes, just clean code
- **One Command Setup** — `/chart init` handles all dependencies and configuration

## Architecture & Layout

This repo is a small monorepo so that the marketing site, CLI, and chart package stay in lock‑step:

```
.
├── app/                  # Next.js application
│   ├── (site)/…          # Marketing pages & layout primitives
│   ├── (docs)/…          # Localized documentation routes
│   └── (shared)/…        # Design system + chart controls/providers reused everywhere
├── _new/
│   └── packages/
        └── charts/       # `@canopy/charts` – shipping charts, hooks, ui, tests
├── cli/                  # `canopy-charts` CLI (init/add commands + templates)
├── examples/             # Small usage samples that import `@canopy/charts`
└── tests/                # Playwright / integration entry points
```

- All runtime charts live in `_new/packages/charts`. The exported surface is available via `@canopy/charts`:

  ```tsx
  import { D3BarChart, ChartStyle } from '@canopy/charts';

  export function RevenueCard() {
    return (
      <D3BarChart
        data={[{ label: 'Q1', value: 24 }, { label: 'Q2', value: 32 }]}
        showTitle
        showLegend
        title="Quarterly Revenue"
        themeColor="#22C55E"
        vibe={'rainforest' satisfies ChartStyle}
      />
    );
  }
  ```

- The CLI now scaffolds **thin wrappers** that import `@canopy/charts`. When you run `/chart add`, the generated files live next to your code – no legacy copies of the old `app/_components/charts`.
- Shared UI such as the color picker and chart controls has moved to `app/(shared)/charts-ui`. Any new site or docs feature should import from there instead of using relative paths into the Next.js app.

## Local Development

```bash
# install deps once
npm install

# run the docs/marketing app
npm run dev

# run chart package tests
npm run test:charts

# lint everything
npm run lint
```

The CLI has its own `package.json` in `cli/`; use `npm install && npm test` inside that folder for CLI-only work.

## Examples

```
# Initialize in your project
/chart init

# Create a basic chart
/chart "Line chart showing monthly revenue"

# Create a complex visualization
/chart "Dashboard showing user acquisition by channel with annotations for marketing campaigns, using our brand colors"
```

## Pricing

- **Free** — Try it out with limited generations
- **Pro** — Unlimited generations, all chart types
- **Team** — Collaboration features, higher rate limits

<div align="center">
  <h2>The Future of Data Visualization is Here</h2>
  <p><a href="#getting-started">Get Started</a> • <a href="#documentation">Documentation</a> • <a href="#community">Community</a></p>
  
  <sub>MIT © Canopy Charts</sub>
</div>
