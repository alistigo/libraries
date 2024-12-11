import type { Grid2Props } from '@mui/material';

import { CompareData } from '../../../../types/data';
import ItemsProperty from '../ItemsProperty';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

export interface PropertyCollectionProps extends Omit<Grid2Props, 'children'> {
  compareData: CompareData;
}

function PropertyCollection({
  compareData,
  ...props
}: PropertyCollectionProps) {
  return (
    <Grid2
      container
      margin={1}
      xs={12}
      rowSpacing={3}
      columnSpacing={2}
      {...props}
    >
      {Object.values(compareData.properties).map((property) => (
        <Grid2 xs={12} key={property.id}>
          <ItemsProperty
            property={compareData.properties[property.id]}
            items={compareData.items}
          />
        </Grid2>
      ))}
    </Grid2>
  );
}

export default PropertyCollection;
