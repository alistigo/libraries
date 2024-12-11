import type { TableBodyProps } from '@mui/material';

import { Root } from './styles';
import { CompareData } from '../../../../types/data';
import ItemsProperty from '../ItemsProperty';

export interface PropertyCollectionProps
  extends Omit<TableBodyProps, 'children'> {
  compareData: CompareData;
}

function PropertyCollection({
  compareData,
  ...props
}: PropertyCollectionProps) {
  return (
    <Root {...props}>
      {Object.values(compareData.properties).map((property) => (
        <ItemsProperty
          property={compareData.properties[property.id]}
          items={compareData.items}
        />
      ))}
    </Root>
  );
}

export default PropertyCollection;
