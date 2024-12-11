import { useTheme } from '@mui/material';

export default function useItemBackgrounds(): string[] {
  const theme = useTheme();
  return [
    theme.palette.grey[300],
    theme.palette.grey[500],
    theme.palette.grey[400],
  ];
}
