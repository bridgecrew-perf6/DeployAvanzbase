import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { GetStockTimeSeries } from "../../../api/StockAxios";
import "../../../css/LineGraph.css";

const LineGraph = ({ selectedStock, timeSpan }) => {
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    const getTimeSeriesData = async () => {
      // make request through server
      const response = await GetStockTimeSeries(selectedStock, timeSpan);
      if (typeof response != "undefined") {
        if (response.data["Note"]) return setGraphData([]);
        else formatTimeSeries(response);
      }
    };
    getTimeSeriesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeSpan, selectedStock]);

  // return current date in format yyyy-mm-dd
  const getCurrentDate = () => {
    var currentDate = new Date();
    var dd = String(currentDate.getDate()).padStart(2, "0");
    var mm = String(currentDate.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = currentDate.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };

  // format time series to be processable by chart
  const formatTimeSeries = (response) => {
    if (typeof response != "undefined") {
      // find key value that includes "Time Series" which holds price data
      for (const [key, timeSeries] of Object.entries(response.data)) {
        if (key.includes("Time Series")) {
          let data = [];
          for (const [date, prices] of Object.entries(timeSeries)) {
            if (outsideTimeSpan(getCurrentDate(), date)) break;
            data.push({ x: date, y: prices["4. close"] });
          }
          setGraphData(data);
          break;
        }
      }
    }
  };

  /*
   * check if a date is outside the timespan that is being displayed at the moment
   * if it is return true
   */
  const outsideTimeSpan = (currentDate, date) => {
    const dayDiff = Math.floor(
      (Date.parse(currentDate) - Date.parse(date.split(" ")[0])) / 86400000
    );
    switch (timeSpan) {
      case "1D":
        return dayDiff > 1;
      case "1W":
        return dayDiff > 7;
      case "1M":
        return dayDiff > 30;
      case "3M":
        return dayDiff > 90;
      case "1Y":
        return dayDiff > 365;
      case "3Y":
        return dayDiff > 365 * 3;
      case "5Y":
        return dayDiff > 365 * 5;
      default:
        return false;
    }
  };

  // Function for keeping track of what time unit to display on x-axis
  const getTimeUnit = () => {
    switch (timeSpan) {
      case "1D":
        return "hour";
      case "1W":
      case "1M":
        return "day";
      case "3M":
        return "week";
      case "1Y":
      case "3Y":
      case "5Y":
        return "quarter";
      default:
        return "year";
    }
  };

  const percentage = (currentPrice, oldPrice) => {
    return ((currentPrice - oldPrice) / oldPrice) * 100;
  };

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

  if (graphData.length === 0)
    return (
      <div className="linegraph">
        Only 5 API requests per minute is possible with this API service. Please
        try again soon!
        {graphData.toString()}
      </div>
    );

  const displayColor = () => {
    if (parseFloat(graphData.at(0).y - graphData.at(-1).y) > 0) return "green";
    return "red";
  };

  return (
    <div className="linegraph" style={{ position: "relative", margin: "auto" }}>
      <div className="newsfeed-stockValue">
        <h1>$ {parseFloat(graphData.at(0).y).toFixed(2)}</h1>
        <div className="stock-price-change">
          <p className={`${displayColor()}`}>
            $ {parseFloat(graphData.at(0).y - graphData.at(-1).y).toFixed(2)}
          </p>
          (
          {displayPercentage(
            percentage(graphData.at(0).y, graphData.at(-1).y),
            "bold"
          )}
          )
        </div>
      </div>
      <div style={{ width: "99%" }}>
        <Line
          style={{ height: "500px", width: "600px" }}
          data={{
            labels: graphData.map((dataPoint) => dataPoint.x),
            datasets: [
              {
                type: "line",
                data: graphData,
                borderColor: "#9381ff",
                borderWidth: 2,
                fill: true,
                backgroundColor: "#b8b8ff",
                pointBorderColor: "rgba(0,0,0,0)",
                pointBackgroundColor: "rgba(0,0,0,0)",
                pointHoverBorderColor: "#9381ff",
                pointHoverBorderWidth: 3,
                pointHoverRadius: 8,
              },
            ],
          }}
          options={{
            plugins: {
              responsive: true,
              maintainAspectRatio: true,
              legend: {
                display: false,
              },
              hover: {
                intersect: false,
              },
              elements: {
                line: {
                  tension: 0,
                },
                point: {
                  radius: 0,
                },
              },
            },
            tooltips: {
              mode: "index",
              intersect: false,
            },
            scales: {
              y: {
                //display: false,
              },

              xAxes: {
                // removes weekend dates
                type: "timeseries",
                time: {
                  tooltipFormat: "yyyy-MM-dd",
                  unit: getTimeUnit(),
                },
                // helps with format removed weekend dates
                ticks: {
                  source: "labels",
                  autoSkip: true,
                  maxTicksLimit: 10,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default LineGraph;
