import React, { useState } from "react";
import { styled } from "@mui/system";
import Typography from "@mui/material/Typography";

const Root = styled("div")({
  width: "fit-content",
  margin: "10px 0",
});

const StatRow = styled("div")({
  marginBottom: "10px",
  display: "flex",
  alignItems: "center",
});

const NumberBoxContainer = styled("div")({
  display: "flex",
  alignItems: "center",
});

interface NumberBoxProps {
  isSelected: boolean;
}

const NumberBox = styled("div")<NumberBoxProps>(({ isSelected }) => ({
  display: "inline-block",
  width: "14px",
  height: "14px",
  lineHeight: "14px",
  textAlign: "center",
  border: isSelected ? "1px solid lightblue" : "1px solid white",
  marginRight: "1px",
  backgroundColor: "transparent",
  color: isSelected ? "lightblue" : "white",
  cursor: "pointer",
  fontSize: "8px",
}));

const stats = [
  "Mobility",
  "Resilience",
  "Recovery",
  "Discipline",
  "Intellect",
  "Strength",
];

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
    <Root>
      {stats.map((stat) => (
        <StatRow key={stat}>
          <Typography
            id={`${stat}-boxes`}
            gutterBottom
            style={{ marginRight: "10px", fontSize: "10px", minWidth: "70px" }}
          >
            {stat}
          </Typography>
          <NumberBoxContainer>
            {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((number) => (
              <NumberBox
                key={number}
                isSelected={
                  selectedNumbers[stat] !== undefined &&
                  number <= selectedNumbers[stat]
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
  );
};

export default NumberBoxes;
