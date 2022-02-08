import React from "react";
import "../../../css/TimeLine.css";

const TimeLine = ({ timeSpan, changeTimeSpan }) => {
  const activeTimeSpan = (time) => {
    if (time === timeSpan) {
      return "timeline__button active";
    }
    return "timeline__button";
  };

  return (
    <div className="timeline__container">
      <div className="timeline__buttons__container">
        <div
          className={activeTimeSpan("1D")}
          onClick={() => changeTimeSpan("1D")}
        >
          1D
        </div>
        <div
          className={activeTimeSpan("1W")}
          onClick={() => changeTimeSpan("1W")}
        >
          1W
        </div>
        <div
          className={activeTimeSpan("1M")}
          onClick={() => changeTimeSpan("1M")}
        >
          1M
        </div>
        <div
          className={activeTimeSpan("3M")}
          onClick={() => changeTimeSpan("3M")}
        >
          3M
        </div>
        <div
          className={activeTimeSpan("1Y")}
          onClick={() => changeTimeSpan("1Y")}
        >
          1Y
        </div>
        <div
          className={activeTimeSpan("3Y")}
          onClick={() => changeTimeSpan("3Y")}
        >
          3Y
        </div>
        <div
          className={activeTimeSpan("5Y")}
          onClick={() => changeTimeSpan("5Y")}
        >
          5Y
        </div>
        <div
          className={activeTimeSpan("ALL")}
          onClick={() => changeTimeSpan("ALL")}
        >
          ALL
        </div>
      </div>
    </div>
  );
};

export default TimeLine;
