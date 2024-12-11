import type { Meta, StoryObj } from '@storybook/react';

import TilesComparator from './TilesComparator';
import { cars } from '../../../mocks/data';
import inputItemCollectionToCompareDataMapper from '../../mapper/inputItemCollectionToCompareDataMapper';

const meta: Meta<typeof TilesComparator> = {
  component: TilesComparator,
  title: 'TilesComparator',
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    layout: 'fullscreen',
  },
};

export default meta;

const compareDataCars = inputItemCollectionToCompareDataMapper(cars);

type Story = StoryObj<typeof TilesComparator>;

export const Playground: Story = {
  args: {
    compareData: compareDataCars,
  },
};
