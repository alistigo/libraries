import { styled } from '@mui/material/styles';
import { Box, CardHeader, IconButtonProps } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import { alpha } from '@mui/material';

export const StyledItemsProperty = styled(Box)(({ theme }) => ({}));

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

export const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const Root = styled(Card)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.common.white, 0.3),
}));

export const Header = styled(CardHeader)(({ theme }) => ({
  padding: theme.spacing(1),
}));
