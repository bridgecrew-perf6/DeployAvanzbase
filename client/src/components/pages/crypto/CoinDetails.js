import React, { useState, useEffect, useContext } from "react";
import { onGetCoinPrices } from "../../../api/CryptoAxios";
import { useParams, useLocation } from "react-router-dom";
import { roundBigNumbers, currency, percentageChange } from "./Utils";
import HistoryChart from "./HistoryChart";
import "../../../css/CoinDetails.css";
import MarketStatistic from "./MarketStatistic";
import AddButton from "../../utils/AddButton";
import { UserContext } from "../../UserContext";
import Modal from "../../utils/Modal";
import { AddObjectToPortfolio } from "../../../api/PortfolioApi";

/**
 * Returns a history chart displaying the price of coin over a given
 * time period together with interesting market statistics of the coin
 */
const CoinDetails = () => {
  const [coinData, setcoinData] = useState([]);
  const { contextUser } = useContext(UserContext);
  const { name } = useParams();
  const location = useLocation();
  // Get coin details from paramater pushed by CoinRow
  const coin = location.state.coinDetail;
  const [timePeriod, setTimePeriod] = useState("1");
  const [percentage, setPercentage] = useState(
    coin.price_change_percentage_24h
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // HTTP GET request to get coins prices over time period
    (async () => {
      const responseData = await onGetCoinPrices(name, timePeriod);
      setcoinData(responseData.data.prices);
      setPercentage(calculatePercentageChange(responseData.data.prices));
    })();
  }, [name, timePeriod, coin]);

  /* add coin to portfolio */
  const addCoin = async (portfolio_name, email) => {
    setIsOpen(!isOpen);
    // send post request to server adding coin to selected portfolio
    await AddObjectToPortfolio(
      "coin",
      window.location.href,
      name,
      portfolio_name,
      email
    );
  };

  /* 
  Calculates the percentage change over a time period given an array of 
  the coin prices during the given time period
  */
  const calculatePercentageChange = (coinPriceArray) => {
    return (
      (coinPriceArray[coinPriceArray.length - 1][1] / coinPriceArray[0][1] -
        1) *
      100
    );
  };

  const onChangeTimePeriod = (newTimePeriod) => {
    setTimePeriod(newTimePeriod);
  };

  return (
    <div className="coin-details-container">
      <div className="coin-details-helper-container">
        <div className="details-title">
          <div className="coins-title-left">
            <img src={coin.image} alt="coin-img" />
            <h1>{coin.name} price </h1>
            <h2>
              ( {coin.symbol.toUpperCase()} / {currency[0]} )
            </h2>
          </div>
          {contextUser ? (
            <AddButton
              text={"Add Coin"}
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            />
          ) : (
            <></>
          )}
        </div>
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(!isOpen)}
          onAdd={addCoin}
          modalType={"addObject"}
        ></Modal>

        <div className="details-container">
          <div className="price-percentage-title">
            <p style={{ paddingTop: "5px" }}>{currency[0]}</p>
            <h1 className="coin-price-title"> {coin.current_price} </h1>
            {percentageChange(percentage, "normal")}
          </div>

          <HistoryChart
            data={coinData}
            changeTimePeriod={onChangeTimePeriod}
            timePeriod={timePeriod}
          />

          <hr></hr>
          <br />

          <div className="market-stats-container">
            <p className="market-stats-title">Market Stats</p>
            <MarketStatistic
              name="Market cap"
              value={`${currency[0]} ${roundBigNumbers(coin.market_cap, 2)}`}
              stringClassName="market-cap"
            />
            <MarketStatistic
              name="Volume (24h)"
              value={`${currency[0]} ${roundBigNumbers(coin.total_volume, 2)}`}
              stringClassName="volume-24h"
            />
            <MarketStatistic
              name="Circulating supply"
              value={`${roundBigNumbers(
                coin.circulating_supply,
                2
              )} ${coin.symbol.toUpperCase()}`}
              stringClassName="circulating-supply"
            />
            <MarketStatistic
              name="Total supply"
              value={
                coin.total_supply !== null
                  ? `${roundBigNumbers(
                      coin.total_supply,
                      2
                    )} ${coin.symbol.toUpperCase()}`
                  : "Unlimited"
              }
              stringClassName="total-supply"
            />
            <MarketStatistic
              name="Popularity"
              value={`#${coin.market_cap_rank}`}
              stringClassName="popularity"
            />
            <MarketStatistic
              name="All time high"
              value={`${currency[0]} ${coin.ath}`}
              stringClassName="ath"
            />
            <MarketStatistic
              name="High (24h)"
              value={`${currency[0]} ${coin.high_24h}`}
              stringClassName="high-24h"
            />
            <MarketStatistic
              name="Low (24h)"
              value={`${currency[0]} ${coin.low_24h}`}
              stringClassName="low-24h"
            />
            <MarketStatistic
              name="Price change (24h)"
              value={percentageChange(coin.price_change_percentage_24h, "bold")}
              stringClassName="price-change-24h"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetails;
