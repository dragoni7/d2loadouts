import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { refreshProfileCharacters } from '../util/profile-characters';
import { useState } from 'react';

export default function RefreshCharacters() {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  async function onRefreshClick() {
    setRefreshing(true);
    await refreshProfileCharacters(dispatch);
    setRefreshing(false);
  }

  return (
    <Box
      sx={{
        mixBlendMode: 'difference',
      }}
    >
      {refreshing ? (
        <CircularProgress color="inherit" />
      ) : (
        <Tooltip title="Refresh Data">
          <IconButton
            onClick={onRefreshClick}
            sx={{
              borderRadius: 4,
              mixBlendMode: 'difference',
            }}
          >
            <Refresh color="inherit" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}
