import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';
import { ItemProperty } from '../../types/data';

export interface PropertyValueProps extends Omit<BoxProps, 'children'> {
  itemProperty: ItemProperty;
}

function PropertyValue({ itemProperty, ...props }: PropertyValueProps) {
  let content: JSX.Element;
  switch (itemProperty.type) {
    case 'boolean': {
      if (itemProperty.value) {
        content = <span>True</span>;
      } else {
        content = <span>False</span>;
      }
      break;
    }
    case 'string':
      content = <span>{itemProperty.value}</span>;
      break;

    case 'number':
      content = <span>{itemProperty.value.toString()}</span>;
      break;

    case 'stringList':
      content = <span>{(itemProperty.value as string[]).join('; ')}</span>;
      break;
  }

  return <Box {...props}>{content}</Box>;
}

export default PropertyValue;
