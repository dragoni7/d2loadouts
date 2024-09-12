import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Grid, ButtonBase } from '@mui/material';
import { STATS } from '../../lib/bungie_api/constants';
import { updateSelectedValues } from '../../store/DashboardReducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';

const StatRow = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const NumberBoxContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
});

interface NumberBoxProps {
  isSelected: boolean;
}

const NumberBox = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<NumberBoxProps>(({ isSelected }) => ({
  width: 32, // Increased size
  height: 32, // Increased size
  lineHeight: '32px',
  textAlign: 'center',
  border: `1px solid ${isSelected ? '#bdab6d' : 'rgba(255, 255, 255, 0.5)'}`,
  margin: '0 2px', // Increased margin between boxes
  backgroundColor: isSelected ? 'rgba(189, 171, 109, 0.2)' : 'transparent',
  color: isSelected ? '#bdab6d' : 'white',
  cursor: 'pointer',
  fontSize: 14, // Increased font size
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const StatIcon = styled('img')({
  width: 24,
  height: 24,
  marginRight: 12,
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
    <Box>
      {STATS.map((stat) => (
        <StatRow key={stat} container alignItems="center" spacing={1}>
          <Grid item>
            <StatIcon src={statIcons[stat.toLowerCase()]} alt={stat} />
          </Grid>
          <Grid item xs>
            <NumberBoxContainer>
              {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((number) => (
                <NumberBox
                  key={number}
                  isSelected={selectedValues[stat] !== undefined && number <= selectedValues[stat]}
                  onClick={() => handleSelect(stat, number)}
                >
                  {number / 10}
                </NumberBox>
              ))}
            </NumberBoxContainer>
          </Grid>
        </StatRow>
      ))}
    </Box>
  );
};

export default NumberBoxes;
