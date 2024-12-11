import type { Meta, StoryObj } from '@storybook/react';

import TableComparator from './TableComparator';
import { cars } from '../../../mocks/data';
import inputItemCollectionToCompareDataMapper from '../../mapper/inputItemCollectionToCompareDataMapper';

const meta: Meta<typeof TableComparator> = {
  component: TableComparator,
  title: 'TableComparator',
};

export default meta;

const compareDataCars = inputItemCollectionToCompareDataMapper(cars);

type Story = StoryObj<typeof TableComparator>;

export const Playground: Story = {
  args: {
    compareData: compareDataCars,
  },
};
