import React, { useState } from "react";
import { styled } from "@mui/system";
import Typography from "@mui/material/Typography";

const Root = styled('div')({
  width: 'fit-content',
  margin: '10px 0', // Reduced margin
});

const StatRow = styled('div')({
  marginBottom: '10px', // Reduced margin
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
  width: '14px', // Smaller width
  height: '14px', // Smaller height
  lineHeight: '14px', // Match height
  textAlign: 'center',
  border: isSelected ? '1px solid lightblue' : '1px solid white',
  marginRight: '1px', // Small margin to stick boxes together
  backgroundColor: 'transparent',
  color: isSelected ? 'lightblue' : 'white',
  cursor: 'pointer',
  fontSize: '8px', // Smaller font size
}));

const stats = [
  'Mobility',
  'Resilience',
  'Recovery',
  'Discipline',
  'Intellect',
  'Strength',
];

interface selectedNumbers {
  [key: string]: number
}

const NumberBoxes: React.FC = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<selectedNumbers>({});

  const handleSelect = (stat : string, number : number) => {
    setSelectedNumbers((prev) => ({
      ...prev,
      [stat]: number,
    }));
  };

  return (
    <Root>
      {stats.map((stat) => (
        <StatRow key={stat}>
          <Typography id={`${stat}-boxes`} gutterBottom style={{ marginRight: '10px', fontSize: '10px', minWidth: '70px' }}>
            {stat}
          </Typography>
          <NumberBoxContainer>
            {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((number) => (
              <NumberBox
                key={number}
                isSelected={selectedNumbers[stat] !== undefined && number <= selectedNumbers[stat]}
                onClick={() => handleSelect(stat, number)}
              >
                {number}
              </NumberBox>
            ))}
          </NumberBoxContainer>
        </StatRow>
      ))}
    </Root>
  );
};

export default NumberBoxes;
