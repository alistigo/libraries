import {
  TableRow,
  TableHeadProps as TableHeadPropsMui,
  TableCell,
} from '@mui/material';

import { Root } from './styles';
import { ItemCollection } from '../../../../types/data';
import ItemHead from '../ItemHead';

export interface TableHeadProps extends Omit<TableHeadPropsMui, 'children'> {
  items: ItemCollection;
}

function TableHead({ items, ...props }: TableHeadProps) {
  return (
    <Root {...props}>
      <TableRow>
        <TableCell>Properties</TableCell>
        {Object.values(items).map((item) => (
          <ItemHead item={item} />
        ))}
      </TableRow>
    </Root>
  );
}

export default TableHead;
