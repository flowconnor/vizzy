import { Metadata } from 'next';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: 'Responsiveness - Vizzy',
  description: 'Learn about the responsive design features of Vizzy',
};

export default function ResponsivenessPage() {
  const t = useTranslations('Docs');

  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>Responsiveness</h1>
      <p>
        Vizzy components are designed to be fully responsive, automatically
        adjusting to their container size while maintaining optimal readability and
        interaction capabilities.
      </p>

      <h2>Key Features</h2>
      <ul>
        <li>Fluid sizing that adapts to container dimensions</li>
        <li>Responsive typography that scales with chart size</li>
        <li>Mobile-friendly touch interactions</li>
        <li>Automatic legend positioning based on available space</li>
      </ul>

      <h2>Implementation</h2>
      <p>
        Each chart component uses a combination of CSS Grid, Flexbox, and dynamic
        SVG viewBox calculations to ensure proper scaling and positioning across
        different screen sizes and devices.
      </p>
    </div>
  );
}