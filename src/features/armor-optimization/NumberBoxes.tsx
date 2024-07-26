import React, { useState } from 'react';
import { styled } from '@mui/system';
import Typography from '@mui/material/Typography';

const ContainerWithBorder = styled('div')({
  border: '1px solid white',
  padding: '10px',
  width: 'fit-content',
  margin: '10px 0',
});

const Root = styled('div')({
  width: 'fit-content',
});

const StatRow = styled('div')({
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
});

const NumberBoxContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

interface NumberBoxProps {
  isSelected: boolean;
}

const NumberBox = styled('div')<NumberBoxProps>(({ isSelected }) => ({
  display: 'inline-block',
  width: '30px',
  height: '30px',
  lineHeight: '30px',
  textAlign: 'center',
  border: isSelected ? '1px solid lightblue' : '1px solid white',
  marginRight: '2px',
  backgroundColor: 'transparent',
  color: isSelected ? 'lightblue' : 'white',
  cursor: 'pointer',
  fontSize: '14px',
}));

const stats = ['Mobility', 'Resilience', 'Recovery', 'Discipline', 'Intellect', 'Strength'];

interface SelectedNumbers {
  [key: string]: number;
}

interface NumberBoxesProps {
  onThresholdChange: (thresholds: SelectedNumbers) => void;
}

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
    <ContainerWithBorder>
      <Root>
        {stats.map((stat) => (
          <StatRow key={stat}>
            <Typography
              id={`${stat}-boxes`}
              gutterBottom
              style={{ marginRight: '10px', fontSize: '14px', minWidth: '80px' }} // Adjust font size
            >
              {stat}
            </Typography>
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
          </StatRow>
        ))}
      </Root>
    </ContainerWithBorder>
  );
};

export default NumberBoxes;
