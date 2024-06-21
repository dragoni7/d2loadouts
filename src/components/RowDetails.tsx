import React from "react";

const RowDetails = ({ row }) => {
  if (!row) {
    return <div>No row selected</div>;
  }

  return (
    <div>
      <h3>Row Details</h3>
      <p>
        <strong>Exotic:</strong>{" "}
        <img
          src={row.exotic}
          alt="exotic"
          style={{ width: "40px", height: "40px" }}
        />
      </p>
      <p>
        <strong>Mobility:</strong> {row.mobility}
      </p>
      <p>
        <strong>Resilience:</strong> {row.resilience}
      </p>
      <p>
        <strong>Recovery:</strong> {row.recovery}
      </p>
      <p>
        <strong>Discipline:</strong> {row.discipline}
      </p>
      <p>
        <strong>Intellect:</strong> {row.intellect}
      </p>
      <p>
        <strong>Strength:</strong> {row.strength}
      </p>
      <p>
        <strong>Tiers:</strong> {row.tiers}
      </p>
      <p>
        <strong>Used Mods:</strong> {row.usedMods}
      </p>
    </div>
  );
};

export default RowDetails;
