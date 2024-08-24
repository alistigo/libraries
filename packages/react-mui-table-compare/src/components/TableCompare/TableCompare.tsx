import type { TableProps } from '@mui/material';

import { TableRoot, Actions, Root } from './styles';
import { CompareData } from '../../types/data';
import TableHead from '../TableHead';
import PropertyCollection from '../PropertyCollection';
import useIsTableMode from '../../hooks/useIsTableMode';

export interface TableCompareProps extends Omit<TableProps, 'children'> {
  compareData: CompareData;
}

function TableCompare({ compareData, ...props }: TableCompareProps) {
  const isTableMode = useIsTableMode();

  if (isTableMode) {
    return (
      <TableRoot {...props}>
        <TableHead items={compareData.items} />
        <PropertyCollection compareData={compareData} />
        <Actions />
      </TableRoot>
    );
  }

  return <Root direction={'row'}></Root>;
}

export default TableCompare;
