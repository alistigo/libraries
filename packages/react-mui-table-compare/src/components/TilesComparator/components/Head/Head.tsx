import { Grid2Props } from '@mui/material';

import { ItemCollection } from '../../../../types/data';
import ItemHead from '../ItemHead';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

export interface HeadProps extends Omit<Grid2Props, 'children'> {
  items: ItemCollection;
}

function Head({ items, ...props }: HeadProps) {
  return (
    <Grid2 container xs={12} sx={{ position: 'sticky', top: 0 }} {...props}>
      {Object.values(items).map((item, k) => (
        <ItemHead key={item.id} item={item} />
      ))}
    </Grid2>
  );
}

export default Head;
