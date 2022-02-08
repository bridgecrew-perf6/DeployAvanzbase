import React, { useState, useEffect } from "react";
import { onGetAllCoins } from "../../../api/CryptoAxios";
import SearchBar from "../../utils/SearchBar";
import CoinRow from "./CoinRow";
import "../../../css/CryptoMain.css";

/*
 * Component for handeling main page with all crypto coins.
 * Includes a search bar and makes api request to get all crypto coins
 * then display these through the use of the component CoinRow
 */
const CryptoMain = () => {
  const [coinData, setcoinData] = useState([]);
  const [term, setTerm] = useState("");

  useEffect(() => {
    // HTTP GET request with with axios to get all crypto coins
    (async () => {
      const responseData = await onGetAllCoins();
      setcoinData(responseData.data);
    })();
  }, []);

  const onTermChange = (newTerm) => {
    setTerm(newTerm);
  };

  // create new array where only coins with the search term are included
  const filteredCoins = coinData.filter((coin) =>
    coin.name.toLowerCase().includes(term)
  );

  if (filteredCoins === null) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="crypto-table-container">
      {filteredCoins.length > 0 ? (
        <div>
          <SearchBar
            hint={"Search all assets..."}
            searchTerm={term}
            onSearchTermChange={onTermChange}
            classStyle={"search-bar-crypto"}
          />
          <div className="table-border">
            <div>
              <div className="table-description">
                <p
                  style={{
                    flexBasis: "125%",
                    textAlign: "left",
                  }}
                >
                  <span>&nbsp;&nbsp;&nbsp;</span>Name
                </p>
                <p>Price</p>
                <p>Market Cap</p>
                <p>Change</p>
                <p>Supply</p>
              </div>
              <hr></hr>
              {filteredCoins.map((coin) => {
                return <CoinRow key={coin.id} coin={coin} />;
              })}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CryptoMain;
