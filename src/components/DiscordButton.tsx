import { IconButton, Tooltip } from '@mui/material';

export default function DiscordButton() {
  return (
    <Tooltip title="Join our Discord">
      <IconButton
        href="https://discord.gg/WbKvNvRG"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          borderRadius: 4,
          mixBlendMode: 'difference',
          padding: 1,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <img src="/assets/discord.png" alt="Discord logo" style={{ width: 30, height: 30 }} />
      </IconButton>
    </Tooltip>
  );
}
