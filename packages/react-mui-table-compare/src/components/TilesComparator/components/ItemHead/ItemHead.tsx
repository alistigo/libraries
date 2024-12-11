import { Grid2Props, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

import { Item } from '../../../../types/data';

export interface ItemHeadProps extends Omit<Grid2Props, 'children'> {
  item: Item;
}

function ItemHead({ item, ...props }: ItemHeadProps) {
  return (
    <Grid2 xs {...props}>
      <Typography variant="h6" align="center">
        {item.name}
      </Typography>
    </Grid2>
  );
}

export default ItemHead;
