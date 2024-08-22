import React, { useState } from 'react';
import { styled } from '@mui/system';
import { STATS } from '../../lib/bungie_api/Constants';

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

const StatIcon = styled('img')({
  width: '24px',
  height: '24px',
  marginRight: '10px',
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
    <ContainerWithBorder>
      <Root>
        {STATS.map((stat) => (
          <StatRow key={stat}>
            <StatIcon src={statIcons[stat.toLowerCase()]} alt={stat} />
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
