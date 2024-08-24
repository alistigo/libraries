import { useMediaQuery, useTheme } from '@mui/material';

export default function useIsTableMode(): boolean {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up('sm'));
}
