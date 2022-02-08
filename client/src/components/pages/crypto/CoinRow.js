import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { roundBigNumbers, currency, percentageChange } from "./Utils";
import "../../../css/CoinRow.css";

/**
 * Renders a row with coin details in the coin table
 */
const CoinRow = ({ coin }) => {
  const history = useHistory();
  // color state is used for hovering over coins
  const [color, setColor] = useState("");

  // push id of coin to url and send coin data to CoinDetails through paramater coinDetail
  const onClickCoin = (id) => {
    history.push(`/crypto-table/details/${id.toString().toLowerCase()}`, {
      coinDetail: coin,
    });
  };

  return (
    <div
      className="crypto-container"
      onClick={() => onClickCoin(coin.id)}
      /* change background color on mouse hover */
      style={{ backgroundColor: color }}
      onMouseEnter={() => setColor("rgba(200, 200, 200, 0.15)")}
      onMouseLeave={() => setColor("")}
    >
      <div className="coin-row">
        <div className="coin-item">
          <img className="coin-img" src={coin.image} alt="coin-img" />
          <h1 className="coin-name">{coin.name}</h1>
          <p className="coin-symbol">{coin.symbol}</p>
        </div>
        <div className="coin-row-data">
          <p className="coin-price">
            {currency[0]} {coin.current_price}
          </p>
          <p className="coin-market-cap">
            {currency[0]} {roundBigNumbers(coin.market_cap, 2)}
          </p>
          {/* returns a <p> tag with either color green or red */}
          {percentageChange(coin.price_change_percentage_24h, "bold")}
          <p className="coin-circulating_supply">
            {roundBigNumbers(coin.circulating_supply, 2)} {"  "}
            {coin.symbol.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoinRow;
