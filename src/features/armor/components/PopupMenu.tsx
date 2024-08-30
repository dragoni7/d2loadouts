import { Grid } from '@mui/material';

interface PopupMenuProps {
  content: any[];
}

export default function PopupMenu({ content }: PopupMenuProps) {
  return (
    <Grid container>
      {content.map((item) => (
        <Grid item md={2}>
          test
        </Grid>
      ))}
    </Grid>
  );
}
