import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Grid, ButtonBase, Stack } from '@mui/material';
import { STATS } from '../../lib/bungie_api/constants';
import { updateSelectedValues } from '../../store/DashboardReducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';

const StatRow = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

interface NumberBoxProps {
  isSelected: boolean;
}

const NumberBox = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<NumberBoxProps>(({ isSelected, theme }) => ({
  width: '40px',
  height: '40px',
  fontSize: 16,
  [theme.breakpoints.between('lg', 'xl')]: {
    width: '50px',
    height: '50px',
    fontSize: 20,
  },
  textAlign: 'center',
  border: `1px solid ${isSelected ? '#bdab6d' : 'rgba(255, 255, 255, 0.5)'}`,
  margin: '0 2px',
  backgroundColor: isSelected ? 'rgba(189, 171, 109, 0.2)' : 'transparent',
  color: isSelected ? '#bdab6d' : 'white',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const StatIcon = styled('img')({
  width: '50%',
  height: '50%',
});

const statIcons: Record<string, string> = {
  mobility: '/assets/mob.png',
  resilience: '/assets/res.png',
  recovery: '/assets/rec.png',
  discipline: '/assets/disc.png',
  intellect: '/assets/int.png',
  strength: '/assets/str.png',
};

const NumberBoxes: React.FC = () => {
  const dispatch = useDispatch();
  const selectedValues = useSelector((state: RootState) => state.dashboard.selectedValues);

  const handleSelect = (stat: string, number: number) => {
    const updatedValues = {
      ...selectedValues,
      [stat]: number,
    };
    dispatch(updateSelectedValues(updatedValues));
  };

  return (
    <Box
      sx={{
        padding: 1,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(5px)',
        borderRadius: 0,
      }}
    >
      {STATS.map((stat) => (
        <StatRow key={stat} container alignItems="center" spacing={1}>
          <Grid item md={2}>
            <StatIcon src={statIcons[stat.toLowerCase()]} alt={stat} />
          </Grid>
          <Grid item md={10}>
            <Stack direction="row">
              {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((number) => (
                <NumberBox
                  key={number}
                  isSelected={selectedValues[stat] !== undefined && number <= selectedValues[stat]}
                  onClick={() => handleSelect(stat, number)}
                >
                  {number / 10}
                </NumberBox>
              ))}
            </Stack>
          </Grid>
        </StatRow>
      ))}
    </Box>
  );
};

export default NumberBoxes;
