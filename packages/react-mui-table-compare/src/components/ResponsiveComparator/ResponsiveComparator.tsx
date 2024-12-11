import type { BoxProps } from '@mui/material';

import { UIComparator } from '../../types/components';
import useIsTableMode from '../../hooks/useIsTableMode';
import TableComparator from '../TableComparator';
import TilesComparator from '../TilesComparator';

export type ResponsiveComparatorProps = Omit<BoxProps, 'children'> &
  UIComparator;

function ResponsiveComparator({ compareData }: ResponsiveComparatorProps) {
  const isTableMode = useIsTableMode();

  if (isTableMode) {
    return <TableComparator compareData={compareData} />;
  }

  return <TilesComparator compareData={compareData} />;
}

export default ResponsiveComparator;
