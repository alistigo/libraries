import type { TableCellProps } from '@mui/material';
import { TableCell } from '@mui/material';

import { Item } from '../../types/data';

export interface ItemHeadProps extends Omit<TableCellProps, 'children'> {
  item: Item;
}

function ItemHead({ item, ...props }: ItemHeadProps) {
  return <TableCell {...props}>{item.name}</TableCell>;
}

export default ItemHead;
