import { Box, IconButton, Tooltip } from '@mui/material';
import { LocalCafe } from '@mui/icons-material';
import { useSpring, animated } from '@react-spring/web';

export default function CoffeeButton() {
  const props = useSpring({
    loop: false,
    to: [{ rotateZ: 10 }, { rotateZ: -10 }, { rotateZ: 10 }, { rotateZ: -10 }, { rotateZ: 0 }],
    from: { rotateZ: 0 },
    config: { tension: 600, friction: 5, duration: 200 },
  });

  return (
    <animated.div style={{ ...props, display: 'inline-block' }}>
      <Box>
        <Tooltip title="Buy us a Coffee">
          <IconButton
            href="https://buymeacoffee.com/d2loadouts"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              borderRadius: 4,
              mixBlendMode: 'difference',
            }}
          >
            <LocalCafe />
          </IconButton>
        </Tooltip>
      </Box>
    </animated.div>
  );
}
