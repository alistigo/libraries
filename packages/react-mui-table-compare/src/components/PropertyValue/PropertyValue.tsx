import type { BoxProps } from '@mui/material';
import { Box, Typography } from '@mui/material';
import { ItemProperty } from '../../types/data';

export interface PropertyValueProps extends Omit<BoxProps, 'children'> {
  itemProperty: ItemProperty;
}

function PropertyValue({ itemProperty, ...props }: PropertyValueProps) {
  let content: JSX.Element;
  switch (itemProperty.type) {
    case 'boolean': {
      if (itemProperty.value) {
        content = <Typography align="center">True</Typography>;
      } else {
        content = <Typography align="center">False</Typography>;
      }
      break;
    }
    case 'string':
      content = <Typography align="center">{itemProperty.value}</Typography>;
      break;

    case 'number':
      content = (
        <Typography align="center">{itemProperty.value.toString()}</Typography>
      );
      break;

    case 'stringList':
      content = (
        <Typography align="center">
          {(itemProperty.value as string[]).join('; ')}
        </Typography>
      );
      break;
  }

  return <Box {...props}>{content}</Box>;
}

export default PropertyValue;
