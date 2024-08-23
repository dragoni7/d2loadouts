import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Paper, Grid, ButtonBase } from '@mui/material';
import { STATS } from '../../lib/bungie_api/Constants';

const ContainerWithBorder = styled(Paper)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
  width: 'fit-content',
  margin: theme.spacing(1, 0),
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(10px)',
}));

const StatRow = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const NumberBoxContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

interface NumberBoxProps {
  isSelected: boolean;
}

const NumberBox = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<NumberBoxProps>(({ isSelected }) => ({
  width: 40,
  height: 40,
  lineHeight: '40px',
  textAlign: 'center',
  border: `1px solid ${isSelected ? '#bdab6d' : 'white'}`,
  marginRight: 2,
  backgroundColor: 'transparent',
  color: isSelected ? '#bdab6d' : 'white',
  cursor: 'pointer',
  fontSize: 16,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const StatIcon = styled('img')({
  width: 24,
  height: 24,
  marginRight: 10,
});

interface SelectedNumbers {
  [key: string]: number;
}

interface NumberBoxesProps {
  onThresholdChange: (thresholds: SelectedNumbers) => void;
}

const statIcons: Record<string, string> = {
  mobility:
    'https://www.bungie.net/common/destiny2_content/icons/e26e0e93a9daf4fdd21bf64eb9246340.png',
  resilience:
    'https://www.bungie.net/common/destiny2_content/icons/202ecc1c6febeb6b97dafc856e863140.png',
  recovery:
    'https://www.bungie.net/common/destiny2_content/icons/128eee4ee7fc127851ab32eac6ca91cf.png',
  discipline:
    'https://www.bungie.net/common/destiny2_content/icons/79be2d4adef6a19203f7385e5c63b45b.png',
  intellect:
    'https://www.bungie.net/common/destiny2_content/icons/d1c154469670e9a592c9d4cbdcae5764.png',
  strength:
    'https://www.bungie.net/common/destiny2_content/icons/ea5af04ccd6a3470a44fd7bb0f66e2f7.png',
};

const NumberBoxes: React.FC<NumberBoxesProps> = ({ onThresholdChange }) => {
  const [selectedNumbers, setSelectedNumbers] = useState<SelectedNumbers>({});

  const handleSelect = (stat: string, number: number) => {
    const updatedNumbers = {
      ...selectedNumbers,
      [stat]: number,
    };
    setSelectedNumbers(updatedNumbers);
    onThresholdChange(updatedNumbers);
  };

  return (
    <ContainerWithBorder elevation={3}>
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
                    isSelected={
                      selectedNumbers[stat] !== undefined && number <= selectedNumbers[stat]
                    }
                    onClick={() => handleSelect(stat, number)}
                  >
                    {number}
                  </NumberBox>
                ))}
              </NumberBoxContainer>
            </Grid>
          </StatRow>
        ))}
      </Box>
    </ContainerWithBorder>
  );
};

export default NumberBoxes;
