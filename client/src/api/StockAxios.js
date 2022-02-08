import axios from "axios";

export const SearchStock = (term) => {
  try {
    const response = axios
      .get(
        `https://avanzbase.herokuapp.com/search-stock?term=${term}`,
        {},
        {
          withCredentials: "include",
        }
      )
      .catch(function (err) {
        // needed to catch case where no access-token exist
        if (err.response) {
          // Request made and server responded
          return err.response;
        }
      });
    return response;
  } catch (e) {
    console.log(`Axios request failed: ${e}`);
    return null;
  }
};

// GET request to get quote data for popular US stocks predetermined by developer
export const GetPopularStockData = (symbol) => {
  try {
    const response = axios
      .get(
        `https://avanzbase.herokuapp.com/popular-stock?symbol=${symbol}`,
        {},
        {
          withCredentials: "include",
        }
      )
      .catch(function (err) {
        // needed to catch case where no access-token exist
        if (err.response) {
          // Request made and server responded
          return err.response;
        }
      });
    return response;
  } catch (e) {
    console.log(`Axios request failed: ${e}`);
    return null;
  }
};

// Get company description through Alphavantage
export const GetStockDescription = (symbol) => {
  try {
    const response = axios
      .get(
        `https://avanzbase.herokuapp.com/stock-description?symbol=${symbol}`,
        {},
        {
          withCredentials: "include",
        }
      )
      .catch(function (err) {
        // needed to catch case where no access-token exist
        if (err.response) {
          // Request made and server responded
          return err.response;
        }
      });
    return response;
  } catch (e) {
    console.log(`Axios request failed: ${e}`);
    return null;
  }
};

// Get company description through Finnhub
export const GetStockNews = (symbol) => {
  try {
    const response = axios
      .get(
        `https://avanzbase.herokuapp.com/stock-news?symbol=${symbol}`,
        {},
        {
          withCredentials: "include",
        }
      )
      .catch(function (err) {
        // needed to catch case where no access-token exist
        if (err.response) {
          // Request made and server responded
          return err.response;
        }
      });
    return response;
  } catch (e) {
    console.log(`Axios request failed: ${e}`);
    return null;
  }
};

// Get buy and sell recommendations for stock through Finnhub
export const GetStockRecommendations = (symbol) => {
  try {
    const response = axios
      .get(
        `https://avanzbase.herokuapp.com/recommendation?symbol=${symbol}`,
        {},
        {
          withCredentials: "include",
        }
      )
      .catch(function (err) {
        // needed to catch case where no access-token exist
        if (err.response) {
          // Request made and server responded
          return err.response;
        }
      });
    return response;
  } catch (e) {
    console.log(`Axios request failed: ${e}`);
    return null;
  }
};

// GET request to Alphavantage to get time series data (aka pricing data)
export const GetStockTimeSeries = (symbol, timeSpan) => {
  try {
    const reqParams = getAPIFunctions(timeSpan);
    const response = axios
      .get(
        `https://avanzbase.herokuapp.com/stock-time-series?symbol=${symbol}&function=${reqParams.function}${reqParams.interval}`,
        {},
        {
          withCredentials: "include",
        }
      )
      .catch(function (err) {
        // needed to catch case where no access-token exist
        if (err.response) {
          // Request made and server responded
          return err.response;
        }
      });
    return response;
  } catch (e) {
    console.log(`Axios request failed: ${e}`);
    return null;
  }
};

/**
 * Return function API should use depending on current timespan
 */
const getAPIFunctions = (timeSpan) => {
  switch (timeSpan) {
    case "1D":
      return {
        function: "TIME_SERIES_INTRADAY",
        interval: "&interval=5min",
      };
    case "1W":
      return {
        function: "TIME_SERIES_INTRADAY",
        interval: "&interval=60min",
      };
    case "1M":
    case "3M":
      return { function: "TIME_SERIES_DAILY", interval: "" };
    case "1Y":
      return { function: "TIME_SERIES_WEEKLY_ADJUSTED", interval: "" };
    case "3Y":
    case "5Y":
      return { function: "TIME_SERIES_MONTHLY_ADJUSTED", interval: "" };
    default:
      return { function: "TIME_SERIES_MONTHLY_ADJUSTED", interval: "" };
  }
};

// create new portfolio
export const CreateNewPortfolio = (name, comment, email) => {
  try {
    const response = axios
      .post(
        `https://avanzbase.herokuapp.com/create-portfolio?name=${name}&comment=${comment}&email=${email}`,
        {}
      )
      .catch(function (err) {
        // needed to catch case where no access-token exist
        if (err.response) {
          // Request made and server responded
          return err.response;
        }
      });
    return response;
  } catch (e) {
    console.log(`Axios request failed: ${e}`);
    return null;
  }
};
