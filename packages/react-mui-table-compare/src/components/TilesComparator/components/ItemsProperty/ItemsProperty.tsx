import type { TableRowProps } from '@mui/material';
import {
  Card,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
} from '@mui/material';
import { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import type {
  ItemCollection,
  Property as PropertyType,
} from '../../../../types/data';
import { ExpandMore, Header, Root } from './styles';
import PropertyValue from '../../../PropertyValue';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

export interface ItemsPropertyProps
  extends Omit<TableRowProps, 'children' | 'property'> {
  property: PropertyType;
  items: ItemCollection;
}

function ItemsProperty({ property, items, ...props }: ItemsPropertyProps) {
  const [expanded, setExpanded] = useState(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Root {...props}>
      <Header
        title={property.name}
        action={
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="reduce"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        }
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Grid2 container>
            {Object.values(items).map((item) => {
              if (property.valuesByItemId[item.id]) {
                return (
                  <Grid2 xs={4}>
                    <PropertyValue
                      itemProperty={property.valuesByItemId[item.id]}
                    />
                  </Grid2>
                );
              }
              return <Grid2 xs={4}></Grid2>;
            })}
          </Grid2>
        </CardContent>
      </Collapse>
    </Root>
  );
}

export default ItemsProperty;
