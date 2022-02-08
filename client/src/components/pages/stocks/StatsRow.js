import React from "react";
import "../../../css/StatsRow.css";

const StatsRow = ({ price, openPrice, name, volume, updateSelectedStock }) => {
  const percentage = ((price - openPrice) / openPrice) * 100;

  /* 
  Returns percentage in either color green or red, fixed to two decimals and 
  some additional styling
  */
  const displayPercentage = (percentage, fontWeight) => {
    if (percentage == null)
      return (
        <p className="coin-percentage" style={{ fontWeight: `${fontWeight}` }}>
          Unknown
        </p>
      );

    return percentage < 0 ? (
      <p
        className="coin-percentage red"
        style={{ fontWeight: `${fontWeight}` }}
      >
        {percentage.toFixed(2)}%
      </p>
    ) : (
      <p
        className="coin-percentage green"
        style={{ fontWeight: `${fontWeight}` }}
      >
        +{percentage.toFixed(2)}%
      </p>
    );
  };

  return (
    <div className="row" onClick={() => updateSelectedStock(name)}>
      <div className="row__intro">
        <h1>{name}</h1>
        <p>{volume && volume + " shares"}</p>
      </div>
      <div className="row__chart"></div>
      <div className="row__numbers">
        <p className="row__price">{price}</p>
        <div className="row__percentage">
          {" "}
          {price && openPrice ? (
            <>{displayPercentage(percentage, "bold")}</>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsRow;
