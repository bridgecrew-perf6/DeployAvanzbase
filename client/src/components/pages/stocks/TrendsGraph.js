import React, { useEffect, useRef } from "react";
import { GetStockRecommendations } from "../../../api/StockAxios";
import Chart from "chart.js/auto";

function TrendsGraph({ selectedStock }) {
  const chartRef = useRef();

  const formatRecommendationData = (recommendData) => {
    const dataset = [
      {
        label: "Strong Sell",
        data: recommendData.data
          .slice(0, 4)
          .map((dataPoint) => dataPoint.strongSell),
        backgroundColor: ["rgb(129, 49, 49)"],
      },
      {
        label: "Sell",
        data: recommendData.data.slice(0, 4).map((dataPoint) => dataPoint.sell),
        backgroundColor: ["rgb(244, 91, 91)"],
      },
      {
        label: "Hold",
        data: recommendData.data.slice(0, 4).map((dataPoint) => dataPoint.hold),
        backgroundColor: ["rgb(185, 139, 29)"],
      },
      {
        label: "Buy",
        data: recommendData.data.slice(0, 4).map((dataPoint) => dataPoint.buy),
        backgroundColor: ["rgb(29, 185, 84)"],
      },
      {
        label: "Strong Buy",
        data: recommendData.data
          .slice(0, 4)
          .map((dataPoint) => dataPoint.strongBuy),
        backgroundColor: ["rgb(23, 111, 55)"],
      },
    ];

    return dataset;
  };

  useEffect(() => {
    let tempBarChart = null;
    const getRecommendations = async () => {
      // get buy and sell recommendations
      const response = await GetStockRecommendations(selectedStock);
      if (chartRef && chartRef.current && typeof response != "undefined") {
        tempBarChart = new Chart(chartRef.current, {
          type: "bar",
          data: {
            labels: response.data
              .slice(0, 4)
              .map((recommendation) => recommendation.period),
            datasets: formatRecommendationData(response),
          },
          options: {
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  usePointStyle: true,
                  boxWidth: 10,
                },
              },
            },
            scales: {
              x: {
                barThickness: 0.2,
                stacked: true,
                grid: {
                  display: false,
                },
              },
              y: {
                stacked: true,
                beginAtZero: true,

                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 7,
                },
              },
            },
          },
        });
        //setBarChart(tempBarChart);
      }
    };
    getRecommendations();

    // Clean up function destroy chart instance and set current barchart to null
    return () => {
      if (tempBarChart != null) {
        tempBarChart.destroy();
      }
    };
  }, [selectedStock]);

  return <canvas ref={chartRef} id="bar-chart"></canvas>;
}

export default TrendsGraph;
