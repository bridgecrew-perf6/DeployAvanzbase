import React, { useState, useEffect } from "react";
import "../../../css/Stats.css";
import StatsRow from "./StatsRow";
import SearchBar from "../../utils/SearchBar";
import { SearchStock, GetPopularStockData } from "../../../api/StockAxios";
import { popularStockList } from "./PopularStocks";

const Stats = ({ updateSelectedStock }) => {
  const [stockData, setStockData] = useState([]);
  const [searchStockData, setSearchStockData] = useState([]);
  const [term, setTerm] = useState("");

  const onTermChange = (newTerm) => {
    setTerm(newTerm);
  };

  /**
   * Search stock with API call through server and filter
   * relevant stocks
   */
  const searchStock = async () => {
    // api call through server
    const response = await SearchStock(term);
    // remove stock symbols with dot(".") in them
    const filteredStocks = response.data.result.filter(
      (stock) => !stock.symbol.includes(".")
    );
    setSearchStockData(filteredStocks);
  };

  // get quote data of popular US stocks
  useEffect(() => {
    let tempStocksData = [];
    let promises = [];
    // eslint-disable-next-line array-callback-return
    popularStockList.map((stock) => {
      promises.push(
        // get stock data and wait
        GetPopularStockData(stock).then((res) => {
          if (typeof res != "undefined") {
            tempStocksData.push({
              name: stock,
              // spread syntax to unpack data
              ...res.data,
            });
          }
        })
      );
    });

    // after all promises have finished
    Promise.all(promises).then(() => {
      setStockData(tempStocksData);
    });
  }, []);

  return (
    <div className="stats">
      <div className="stats-container">
        <div className="stats-header" style={{ marginBottom: "10px" }}>
          Search stocks
        </div>
        <SearchBar
          hint={"Search stock..."}
          searchTerm={term}
          onSearchTermChange={onTermChange}
          classStyle={"search-bar-stocks"}
          searchFunction={searchStock}
        />
        <div className="stats-content">
          <div className="stats-rows">
            {searchStockData.length > 0 ? (
              <div className="search-result-box">
                {searchStockData.map((stock) => (
                  <StatsRow
                    price={stock.description}
                    key={stock.symbol}
                    name={stock.symbol}
                    updateSelectedStock={updateSelectedStock}
                  />
                ))}{" "}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        <div className="stats-header">
          <p>Popular stocks</p>
        </div>
        <div className="stats-content">
          <div className="stats-rows popular-stocks">
            {stockData.map((stock) => (
              <StatsRow
                key={stock.name}
                name={stock.name}
                openPrice={stock.o}
                price={stock.c}
                updateSelectedStock={updateSelectedStock}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
