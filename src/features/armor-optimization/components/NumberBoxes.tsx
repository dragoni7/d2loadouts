import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, ButtonBase, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { STATS } from '../../../lib/bungie_api/constants';
import { updateSelectedValues } from '../../../store/DashboardReducer';
import { statIcons } from '../../../util/constants';
import { StatName } from '../../../types/d2l-types';
import { D2LButton } from '@/components/D2LButton';

interface NumberBoxProps {
  isSelected: boolean;
  disabled?: boolean;
}

const NumberBox = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'disabled',
})<NumberBoxProps>(({ isSelected, disabled, theme }) => ({
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
  color: disabled ? 'rgba(255, 255, 255, 0.3)' : isSelected ? '#bdab6d' : 'white',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
  '&:hover': {
    backgroundColor: disabled ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
  },
}));

interface NumberBoxesProps {
  maxReachableValues?: { [key in StatName]: number } | null;
}

const NumberBoxes: React.FC<NumberBoxesProps> = ({ maxReachableValues }) => {
  const dispatch = useDispatch();
  const selectedValues = useSelector((state: RootState) => state.dashboard.selectedValues);

  useEffect(() => {}, [maxReachableValues]);

  const handleSelect = (stat: string, number: number) => {
    const updatedValues = {
      ...selectedValues,
      [stat]: number,
    };
    dispatch(updateSelectedValues(updatedValues));
  };

  const handleClear = () => {
    const clearedValues = Object.keys(selectedValues).reduce((acc, key) => {
      acc[key as StatName] = 0;
      return acc;
    }, {} as { [key in StatName]: number });
    dispatch(updateSelectedValues(clearedValues));
  };

  return (
    <Box
      sx={{
        padding: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(5px)',
        width: '91%',
      }}
    >
      {STATS.map((stat) => (
        <Stack direction="row" key={stat} alignItems="center" spacing={1} marginY={1}>
          <img width="8%" height="8%" src={statIcons[stat.toLowerCase()]} alt={stat} />
          {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((number) => {
            const statName = stat.toLowerCase() as StatName;
            const isDisabled =
              maxReachableValues && number > (maxReachableValues[statName] || 0) ? true : false;

            return (
              <NumberBox
                key={number}
                isSelected={selectedValues[stat] !== undefined && number <= selectedValues[stat]}
                disabled={isDisabled}
                onClick={() => !isDisabled && handleSelect(stat, number)}
              >
                {number / 10}
              </NumberBox>
            );
          })}
        </Stack>
      ))}
      <Box textAlign="center" marginTop={1}>
        <D2LButton onClick={handleClear}>Clear</D2LButton>
      </Box>
    </Box>
  );
};

export default NumberBoxes;
