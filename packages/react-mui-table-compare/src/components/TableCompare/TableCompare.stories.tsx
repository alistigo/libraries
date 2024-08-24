import type { Meta, StoryObj } from '@storybook/react';

import TableCompare from './TableCompare';
import { cars } from '../../../mocks/data';
import inputItemCollectionToCompareDataMapper from '../../mapper/inputItemCollectionToCompareDataMapper';

const meta: Meta<typeof TableCompare> = {
  component: TableCompare,
  title: 'TableCompare',
};

export default meta;

const compareDataCars = inputItemCollectionToCompareDataMapper(cars);

type Story = StoryObj<typeof TableCompare>;

export const Playground: Story = {
  args: {
    compareData: compareDataCars,
  },
};
