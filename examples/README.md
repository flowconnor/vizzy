# Examples

The `examples/` directory contains small React components that import `@vizzy/charts`. You can render any of them inside the Next.js app or in a standalone sand-box:

```bash
# run the main app
npm run dev

# then import a snippet (e.g. /examples/basic/bar-chart)
# into a docs page or temporary route for manual testing.
```

Structure:

```
examples/
├── basic/          # minimal, single-chart usage
├── advanced/       # interactive dashboards
└── customization/  # extending charts with custom styling/data
```

Each file exports a React component; simply import it into `app/(site)` or `app/(docs)` during development:

```tsx
import BasicBarChart from '@/examples/basic/bar-chart';

export default function Playground() {
  return <BasicBarChart />;
}
```


