import { Grid2Props } from '@mui/material';

import { ItemCollection } from '../../../../types/data';
import { ItemBackground, Root } from './styles';
import useItemBackgrounds from '../../../../hooks/useItemBackgrounds';

export interface HeadProps extends Omit<Grid2Props, 'children'> {
  items: ItemCollection;
}

function Background({ items, ...props }: HeadProps) {
  const backgrounds = useItemBackgrounds();

  return (
    <Root container xs={12} {...props}>
      {Object.values(items).map((item, position) => (
        <ItemBackground
          key={item.id}
          xs
          index={position}
          backgrounds={backgrounds}
        />
      ))}
    </Root>
  );
}

export default Background;
