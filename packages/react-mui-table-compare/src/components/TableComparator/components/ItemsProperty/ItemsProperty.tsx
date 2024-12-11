import type { TableRowProps } from '@mui/material';
import { TableCell, TableRow } from '@mui/material';

import type {
  ItemCollection,
  Property as PropertyType,
} from '../../../../types/data';
import PropertyValue from '../../../PropertyValue';

export interface ItemsPropertyProps
  extends Omit<TableRowProps, 'children' | 'property'> {
  property: PropertyType;
  items: ItemCollection;
}

function ItemsProperty({ property, items, ...props }: ItemsPropertyProps) {
  return (
    <TableRow {...props}>
      <TableCell component="th" scope="row">
        {property.name}
      </TableCell>

      {Object.values(items).map((item) => {
        if (property.valuesByItemId[item.id]) {
          return (
            <TableCell>
              <PropertyValue itemProperty={property.valuesByItemId[item.id]} />
            </TableCell>
          );
        }
        return <TableCell></TableCell>;
      })}
    </TableRow>
  );
}

export default ItemsProperty;
