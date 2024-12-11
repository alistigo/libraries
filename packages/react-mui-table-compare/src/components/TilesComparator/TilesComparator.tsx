import type { BoxProps } from '@mui/material';

import { UIComparator } from '../../types/components';
import Head from './components/Head';
import PropertyCollection from './components/PropertyCollection';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Background from './components/Background';
import { Root } from './styles';

export type TilesComparatorProps = Omit<BoxProps, 'children'> & UIComparator;

function TilesComparator({ compareData, ...props }: TilesComparatorProps) {
  return (
    <Root {...props}>
      <Background items={compareData.items} />
      <Grid2 container>
        <Head items={compareData.items} />
        <PropertyCollection compareData={compareData} />
      </Grid2>
    </Root>
  );
}

export default TilesComparator;
