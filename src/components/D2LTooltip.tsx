import { TooltipProps, Tooltip, tooltipClasses, styled } from '@mui/material';

interface D2LTooltipProps extends TooltipProps {
  maxWidth?: number;
}

export const D2LTooltip = styled(({ className, ...props }: D2LTooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme, maxWidth = 120 }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: maxWidth,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: '0px',
    boxShadow: 10,
    fontFamily: 'Arial, sans-serif',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
    [theme.breakpoints.down('lg')]: {
      fontSize: 12,
    },
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: 'black',
  },
}));
