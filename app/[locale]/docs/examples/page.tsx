'use client';

import type { ComponentType } from 'react';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { Card, Badge, Button } from '@/app/(shared)/ui';
import BasicBarChart from '@/examples/basic/bar-chart';
import DonutChart from '@/examples/basic/donut-chart';
import StackedBarChart from '@/examples/basic/stacked-bar-chart';
import StreamChart from '@/examples/basic/stream-chart';
import TreeMap from '@/examples/basic/tree-map';
import InteractiveLineChart from '@/examples/advanced/interactive-line-chart';

type ExampleId = 'basicBar' | 'donut' | 'stacked' | 'stream' | 'tree' | 'interactiveLine';
type ExampleLevel = 'basic' | 'advanced';
type ExampleTag = 'comparison' | 'composition' | 'timeSeries' | 'interaction' | 'advanced';

type ExampleCard = {
  id: ExampleId;
  component: ComponentType;
  level: ExampleLevel;
  tags: ExampleTag[];
};

const README_URL =
  'https://github.com/connorbarrett/vizzy/tree/main/examples#readme';

const EXAMPLE_CARDS: ExampleCard[] = [
  {
    id: 'basicBar',
    component: BasicBarChart,
    level: 'basic',
    tags: ['comparison'],
  },
  {
    id: 'donut',
    component: DonutChart,
    level: 'basic',
    tags: ['composition'],
  },
  {
    id: 'stacked',
    component: StackedBarChart,
    level: 'basic',
    tags: ['composition', 'comparison'],
  },
  {
    id: 'stream',
    component: StreamChart,
    level: 'advanced',
    tags: ['timeSeries', 'interaction'],
  },
  {
    id: 'tree',
    component: TreeMap,
    level: 'advanced',
    tags: ['composition'],
  },
  {
    id: 'interactiveLine',
    component: InteractiveLineChart,
    level: 'advanced',
    tags: ['timeSeries', 'interaction', 'advanced'],
  },
];

export default function ExamplesPage() {
  const t = useTranslations('Docs.examplesPage');
  const playgroundT = useTranslations('Docs.playground');

  return (
    <div className="space-y-12">
      <header className="space-y-5 rounded-2xl border border-border/40 bg-background/70 p-8 text-center shadow-lg shadow-black/5 backdrop-blur">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/60 px-4 py-1 text-sm text-muted-foreground">
          {playgroundT('title')}
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mx-auto max-w-3xl text-base text-muted-foreground sm:text-lg">
            {t('description')}
          </p>
        </div>
        <div className="space-y-3">
          <Button asChild size="lg" className="gap-2">
            <Link href={README_URL} target="_blank" rel="noreferrer">
              {t('ctaButton')}
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">{t('ctaDescription')}</p>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {EXAMPLE_CARDS.map(({ id, component: Component, level, tags }, index) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.4 }}
          >
            <Card className="relative flex h-full flex-col gap-4 overflow-hidden border-border/40 bg-background/75 p-6 shadow-lg shadow-black/5 backdrop-blur supports-[backdrop-filter]:bg-background/40">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="uppercase tracking-wide">
                  {t(`level.${level}`)}
                </Badge>
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {t(`tags.${tag}`)}
                  </Badge>
                ))}
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">{t(`cards.${id}.title`)}</h2>
                <p className="text-sm text-muted-foreground">{t(`cards.${id}.description`)}</p>
              </div>
              <div className="flex-1 rounded-2xl border border-border/30 bg-card/80 p-4 shadow-inner dark:border-border/20">
                <div
                  className={cn(
                    'relative isolate overflow-hidden rounded-xl border border-border/30 bg-background/70 p-4',
                    level === 'advanced'
                      ? 'dark:bg-[#0F0F0F]/80'
                      : 'dark:bg-[#1B1B1B]/70',
                  )}
                >
                  <Component />
                  <div className="pointer-events-none absolute inset-0 rounded-xl border border-white/5 shadow-[0_0_60px_-24px_rgba(0,0,0,0.6)]" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
