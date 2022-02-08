import React from "react";
import "../../../css/MarketStatistic.css";

const MarketStatistic = ({ name, value, stringClassName }) => {
  return (
    <div className={stringClassName}>
      <div className="market-statistic-name">{name}</div>
      <div className="market-statistic-value">{value}</div>
    </div>
  );
};

export default MarketStatistic;
