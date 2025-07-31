import type { CheckboxGroupProps } from 'antd/es/checkbox';

export const priceToImageRatioOptions: CheckboxGroupProps<string>['options'] = [
  { label: '0.05 Mon', value: 'Mouch' },
  { label: '0.1 Mon', value: 'Moyaki' },
  { label: '0.5 Mon', value: 'Molandak' },
  { label: '1 Mon', value: 'Chog' },
  { label: '5 Mon', value: 'Salmonad' },
];
