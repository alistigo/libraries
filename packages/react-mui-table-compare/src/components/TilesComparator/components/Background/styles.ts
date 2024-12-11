import { styled } from '@mui/material/styles';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

interface ItemBackgroundProps {
  index: number;
  backgrounds: string[];
}

export const ItemBackground = styled(Grid2)<ItemBackgroundProps>(
  ({ index, backgrounds }) => ({
    backgroundColor: backgrounds[index % backgrounds.length],
    minHeight: '100%',
    opacity: 0.5,
  })
);

export const Root = styled(Grid2)({
  position: 'fixed',
  height: '100vh',
  zIndex: -1,
});
