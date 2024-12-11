import type { TableProps } from '@mui/material';

import { TableRoot, Actions } from './styles';
import TableHead from './components/TableHead';
import PropertyCollection from './components/PropertyCollection';
import { UIComparator } from '../../types/components';

export type TableComparatorProps = Omit<TableProps, 'children'> & UIComparator;

function TableComparator({ compareData, ...props }: TableComparatorProps) {
  return (
    <TableRoot {...props}>
      <TableHead items={compareData.items} />
      <PropertyCollection compareData={compareData} />
      <Actions />
    </TableRoot>
  );
}

export default TableComparator;
