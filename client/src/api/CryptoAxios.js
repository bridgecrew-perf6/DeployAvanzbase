import axios from "axios";

// HTTP GET request to CoinGecko api to get all coins
export const onGetAllCoins = () => {
  try {
    return axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false",
      {},
      { withCredentials: "include" }
    );
  } catch (e) {
    console.log(`Axios request failed: ${e}`);
  }
};

// HTTP GET request to CoinGecko api to get coin prices over a given time period
export const onGetCoinPrices = (coinName, timePeriod) => {
  try {
    return axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinName}/market_chart?vs_currency=usd&days=${timePeriod}`
    );
  } catch (e) {
    console.log(`Axios request failed: ${e}`);
  }
};
