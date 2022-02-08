import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Newsfeed from "./Newsfeed";
import Stats from "./Stats";
import { useHistory } from "react-router-dom";
import "../../../css/StocksAndFunds.css";
import TrendsGraph from "./TrendsGraph";

const StocksAndFunds = () => {
  const history = useHistory();
  const { symbol } = useParams();
  const [selectedStock, setSelectedStock] = useState(symbol.toUpperCase());
  // state to handle window size changes

  const updateSelectedStock = (newStockSymbol) => {
    setSelectedStock(newStockSymbol.toUpperCase());
    history.push(`/stocks/${newStockSymbol.toString().toLowerCase()}`);
  };

  return (
    <div className="stocks-and-funds">
      <div className="stocks-and-funds-container">
        <Newsfeed selectedStock={selectedStock} />
        <div className="side-panel">
          <Stats updateSelectedStock={updateSelectedStock} />
          <div className="news-title">Recommendation Trends</div>
          <TrendsGraph selectedStock={selectedStock} />
        </div>
      </div>
    </div>
  );
};

export default StocksAndFunds;
