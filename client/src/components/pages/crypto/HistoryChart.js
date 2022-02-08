import React, { useState, useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import Button from "../../utils/Button";

/**
 * Creates a history chart over coin prices in a given time period using Chart.js
 * and renders buttons with callback function for changing time period
 */
const HistoryChart = ({ data, changeTimePeriod, timePeriod }) => {
  const chartRef = useRef();
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("1");

  // Transform array of array to array of objects with arbitrarily number of names using spread syntax
  function transformArrayOfArrays(source, ...names) {
    const defaultName = (i) => "field" + i;
    return source.map((a) => {
      return a.reduce((r, v, i) => {
        r[i < names.length ? names[i] : defaultName(i)] = v;
        return r;
      }, {});
    });
  }

  // Helper function for making sure decimals are displayed for very cheap coins
  const roundAxies = () => {
    if (data !== undefined && data.length > 0) {
      // Check if the coin price is very cheap
      if (data[data.length - 1][1] < 0.1) {
        return 10;
      }
    }
    return 2;
  };

  // Function for keeping track of what time unit to display on x-axis
  const timeUnitOnXAxis = (timePeriod) => {
    switch (timePeriod) {
      case "1":
        setSelectedTimePeriod("1D");
        return "hour";
      case "7":
        setSelectedTimePeriod("1W");
        return "day";
      case "30":
        setSelectedTimePeriod("1M");
        return "week";
      case "365":
        setSelectedTimePeriod("1Y");
        return "quarter";
      default:
        setSelectedTimePeriod("ALL");
        return "year";
    }
  };

  // Creates instance of chart
  useEffect(() => {
    if (chartRef && chartRef.current) {
      const chartInstance = new Chart(chartRef.current, {
        type: "line",
        data: {
          datasets: [
            {
              data: transformArrayOfArrays(data, "x", "y"),
              parsing: {
                xAxisKey: "x",
                yAxisKey: "y",
              },
              label: "$",
              borderColor: "#9381ff",
              borderWidth: 2,
              fill: true,
              backgroundColor: "#b8b8ff",
              pointBorderColor: "rgba(0,0,0,0)",
              pointBackgroundColor: "rgba(0,0,0,0)",
              pointHoverBorderColor: "#007900",
              pointHoverBorderWidth: 2,
              pointHoverRadius: 8,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          animation: {
            duration: 600,
          },
          scales: {
            xAxes: {
              type: "time",
              time: {
                unit: timeUnitOnXAxis(timePeriod),
              },
              grid: {
                display: false,
              },
            },
            yAxes: {
              ticks: {
                precision: roundAxies,
              },
              grid: {
                display: true,
              },
            },
          },
        },
      });

      // Clean up function when component unmounts
      return () => {
        chartInstance.destroy();
      };
    }
  });

  return (
    <div>
      <div
        className="chart-container"
        style={{ height: "60vh", width: "80vw" }}
      >
        <canvas ref={chartRef} id="coinChart"></canvas>
      </div>
      <div className="button-container"></div>
      <Button
        children={"1D"}
        buttonStyle={"btn--time"}
        onClick={() => changeTimePeriod("1")}
        timePeriod={selectedTimePeriod}
      ></Button>
      <Button
        children={"1W"}
        buttonStyle={"btn--time"}
        onClick={() => changeTimePeriod("7")}
        timePeriod={selectedTimePeriod}
      ></Button>
      <Button
        children={"1M"}
        buttonStyle={"btn--time"}
        onClick={() => changeTimePeriod("30")}
        timePeriod={selectedTimePeriod}
      ></Button>
      <Button
        children={"1Y"}
        buttonStyle={"btn--time"}
        onClick={() => changeTimePeriod("365")}
        timePeriod={selectedTimePeriod}
      ></Button>
      <Button
        children={"ALL"}
        buttonStyle={"btn--time"}
        onClick={() => changeTimePeriod("max")}
        timePeriod={selectedTimePeriod}
      ></Button>
    </div>
  );
};

export default HistoryChart;
