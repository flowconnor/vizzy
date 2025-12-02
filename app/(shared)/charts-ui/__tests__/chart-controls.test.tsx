import { render, screen, fireEvent } from '@testing-library/react';
import type { ChartStyle } from '@vizzy/charts';

import { ChartControls } from '../chart-controls';

jest.mock('lucide-react', () => ({
  ChevronUp: () => null,
  ChevronDown: () => null,
}));

const mockSetThemeColor = jest.fn();
const mockUseTranslations = jest.fn(() => (key: string) => key);

jest.mock('next-intl', () => ({
  useTranslations: () => mockUseTranslations(),
}));

jest.mock('@/app/(shared)/providers/theme-context', () => ({
  useThemeColor: () => ({
    themeColor: '#22C55E',
    setThemeColor: mockSetThemeColor,
  }),
}));

const mockColorSelector = jest.fn();
jest.mock('../color-selector', () => ({
  ColorSelector: ({
    onThemeChange,
    currentTheme,
  }: {
    onThemeChange: (color: string) => void;
    currentTheme: string;
  }) => {
    mockColorSelector(currentTheme);
    return (
      <button
        type="button"
        data-testid="color-selector"
        onClick={() => onThemeChange('#000000')}
      >
        color-selector
      </button>
    );
  },
}));

const mockVibeSelector = jest.fn();
jest.mock('../vibe-selector', () => ({
  VibeSelector: ({
    onVibeChange,
    selectedVibe,
  }: {
    onVibeChange: (vibe: ChartStyle) => void;
    selectedVibe: ChartStyle;
  }) => {
    mockVibeSelector(selectedVibe);
    return (
      <button
        type="button"
        data-testid="vibe-selector"
        onClick={() => onVibeChange('sunset')}
      >
        vibe-selector
      </button>
    );
  },
}));

const mockChartElements = jest.fn();
jest.mock('../chart-elements', () => ({
  ChartElements: (props: {
    showLegend: boolean;
    onLegendChange: (value: boolean) => void;
    onAxesChange: (value: boolean) => void;
    onGridChange: (value: boolean) => void;
    onLabelsChange: (value: boolean) => void;
    onTitleChange: (value: boolean) => void;
    onTooltipsChange: (value: boolean) => void;
    labelSize: number;
    onLabelSizeChange: (value: number) => void;
  }) => {
    mockChartElements(props);
    return (
      <div>
        <button
          type="button"
          data-testid="legend-toggle"
          onClick={() => props.onLegendChange(!props.showLegend)}
        >
          legend
        </button>
        <button
          type="button"
          data-testid="axes-toggle"
          onClick={() => props.onAxesChange(false)}
        >
          axes
        </button>
        <button
          type="button"
          data-testid="grid-toggle"
          onClick={() => props.onGridChange(false)}
        >
          grid
        </button>
        <button
          type="button"
          data-testid="labels-toggle"
          onClick={() => props.onLabelsChange(false)}
        >
          labels
        </button>
        <button
          type="button"
          data-testid="title-toggle"
          onClick={() => props.onTitleChange(false)}
        >
          title
        </button>
        <button
          type="button"
          data-testid="tooltips-toggle"
          onClick={() => props.onTooltipsChange(false)}
        >
          tooltips
        </button>
        <button
          type="button"
          data-testid="label-size"
          onClick={() => props.onLabelSizeChange(18)}
        >
          label-size
        </button>
      </div>
    );
  },
}));

const defaultProps = {
  currentTheme: '#22C55E',
  onThemeChange: jest.fn(),
  currentVibe: 'rainforest' as ChartStyle,
  onVibeChange: jest.fn(),
  showAxes: true,
  onAxesChange: jest.fn(),
  showGrid: true,
  onGridChange: jest.fn(),
  showLabels: true,
  onLabelsChange: jest.fn(),
  showTitle: true,
  onTitleChange: jest.fn(),
  showLegend: true,
  onLegendChange: jest.fn(),
  showTooltips: true,
  onTooltipsChange: jest.fn(),
  labelSize: 12,
  onLabelSizeChange: jest.fn(),
};

const renderChartControls = (props = {}) =>
  render(<ChartControls {...defaultProps} {...props} />);

describe('ChartControls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes theme context with incoming color', () => {
    renderChartControls({ currentTheme: '#FF0000' });

    expect(mockSetThemeColor).toHaveBeenCalledWith('#FF0000');
  });

  it('bubbles option callbacks through the ChartElements bridge', () => {
    renderChartControls();

    fireEvent.click(screen.getByTestId('legend-toggle'));
    fireEvent.click(screen.getByTestId('axes-toggle'));
    fireEvent.click(screen.getByTestId('grid-toggle'));
    fireEvent.click(screen.getByTestId('labels-toggle'));
    fireEvent.click(screen.getByTestId('title-toggle'));
    fireEvent.click(screen.getByTestId('tooltips-toggle'));
    fireEvent.click(screen.getByTestId('label-size'));

    expect(defaultProps.onLegendChange).toHaveBeenCalledWith(false);
    expect(defaultProps.onAxesChange).toHaveBeenCalledWith(false);
    expect(defaultProps.onGridChange).toHaveBeenCalledWith(false);
    expect(defaultProps.onLabelsChange).toHaveBeenCalledWith(false);
    expect(defaultProps.onTitleChange).toHaveBeenCalledWith(false);
    expect(defaultProps.onTooltipsChange).toHaveBeenCalledWith(false);
    expect(defaultProps.onLabelSizeChange).toHaveBeenCalledWith(18);
  });

  it('triggers color and vibe updates via child selectors', () => {
    renderChartControls();

    fireEvent.click(screen.getByTestId('color-selector'));
    fireEvent.click(screen.getByTestId('vibe-selector'));

    expect(defaultProps.onThemeChange).toHaveBeenCalledWith('#000000');
    expect(defaultProps.onVibeChange).toHaveBeenCalledWith('sunset');
  });

  it('passes the latest props down to ChartElements', () => {
    renderChartControls({ showLegend: false, labelSize: 14 });

    expect(mockChartElements).toHaveBeenCalledWith(
      expect.objectContaining({
        showLegend: false,
        labelSize: 14,
      }),
    );
  });
});

