import React from "react";
import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";

const useStyles = makeStyles({
  root: {
    width: 300,
    margin: "20px auto",
  },
  statRow: {
    marginBottom: "20px",
  },
});

const marks = [
  { value: 0, label: "0" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 30, label: "30" },
  { value: 40, label: "40" },
  { value: 50, label: "50" },
  { value: 60, label: "60" },
  { value: 70, label: "70" },
  { value: 80, label: "80" },
  { value: 90, label: "90" },
  { value: 100, label: "100" },
];

function valuetext(value: number) {
  return `${value}`;
}

const DiscreteSlider: React.FC = () => {
  const classes = useStyles();

  const stats = [
    "Mobility",
    "Resilience",
    "Recovery",
    "Discipline",
    "Intellect",
    "Strength",
  ];

  return (
    <div className={classes.root}>
      {stats.map((stat) => (
        <div key={stat} className={classes.statRow}>
          <Typography id={`${stat}-slider`} gutterBottom>
            {stat}
          </Typography>
          <Slider
            defaultValue={50}
            getAriaValueText={valuetext}
            aria-labelledby={`${stat}-slider`}
            valueLabelDisplay="auto"
            step={10}
            marks={marks}
            min={0}
            max={100}
          />
        </div>
      ))}
    </div>
  );
};

export default DiscreteSlider;
