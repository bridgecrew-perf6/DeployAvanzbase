import axios from "axios";

export const GetUserInfo = () => {
  try {
    return axios
      .get("https://avanzbase.herokuapp.com/get-user", {
        withCredentials: true, // important for handling httpOnly
      })
      .catch(function (err) {
        // needed to catch case where no access-token exist
        if (err.response) {
          // Request made and server responded
          return err.response;
        }
      });
  } catch (e) {
    console.log(`Axios request failed: ${e}`);
    return null;
  }
};

// add /token here to refresh
export const RefreshToken = () => {
  try {
    return axios
      .post(
        "https://avanzbase.herokuapp.com/refresh-token",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, //send credentials or cookies along with the request
        }
      )
      .catch(function (err) {
        if (err.response) {
          return err.response;
        }
      });
  } catch (e) {
    console.log(`Axios request failed: ${e}`);
  }
};

// Logout user, clear cookies and delete refresh token from database
export const Logout = () => {
  try {
    return axios
      .delete("https://avanzbase.herokuapp.com/logout", {
        withCredentials: "true",
      })
      .catch(function (err) {
        if (err.response) {
          return err.response;
        }
      });
  } catch (e) {
    console.log(`Axios request failed: ${e}`);
  }
};
