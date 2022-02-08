import axios from "axios";

// Create new portfolio
export const CreateNewPortfolio = (name, comment, email) => {
  try {
    const response = axios
      .post(
        `https://avanzbase.herokuapp.com/create-portfolio?name=${name}&comment=${comment}&email=${email}`,
        {},
        { withCredentials: true }
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

// Get all users portfolios
export const GetPortfolios = (email) => {
  try {
    const response = axios
      .get(`https://avanzbase.herokuapp.com/get-portfolios?&email=${email}`, {
        withCredentials: true,
      })
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

// Add selected object to database
export const AddObjectToPortfolio = (
  type,
  url,
  symbol,
  portfolio_name,
  email
) => {
  try {
    const response = axios
      .post(
        `https://avanzbase.herokuapp.com/add-${type}?url=${url}&email=${email}&portfolio_name=${portfolio_name}&symbol=${symbol}`,
        {},
        { withCredentials: true }
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

// Get portfolio coins
export const GetPortfolioItems = (type, name, email) => {
  try {
    const response = axios
      .get(
        `https://avanzbase.herokuapp.com/portfolio-${type}?&name=${name}&email=${email}`,
        { withCredentials: true }
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

export const DeletePortfolio = (name, email) => {
  try {
    const response = axios
      .delete(
        `https://avanzbase.herokuapp.com/delete-portfolio?&name=${name}&email=${email}`,
        { withCredentials: true }
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

export const DeleteObject = (type, objectName, portfolioName, email) => {
  try {
    const response = axios
      .delete(
        `https://avanzbase.herokuapp.com/delete-${type}?&objectName=${objectName}&portfolioName=${portfolioName}&email=${email}`,
        { withCredentials: true }
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

// Save edited comment
export const SaveComment = (name, email, comment) => {
  try {
    const response = axios
      .post(
        `https://avanzbase.herokuapp.com/save-comment?&email=${email}&name=${name}&comment=${comment}`,
        {},
        { withCredentials: true }
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
