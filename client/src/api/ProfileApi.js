import axios from "axios";

// Add selected object to database
export const ChangeProfile = (firstName, lastName, password, email) => {
  try {
    const response = axios
      .post(
        `https://avanzbase.herokuapp.com/change-profile?firstName=${firstName}&lastName=${lastName}&password=${password}&email=${email}`,
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

// Add selected object to database
export const GetCurrentUser = (email) => {
  try {
    const response = axios
      .get(`https://avanzbase.herokuapp.com/get-current-user?email=${email}`, {
        withCredentials: true, // important for handling httpOnly
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

//delete user account
export const DeleteAccount = (email) => {
  try {
    const response = axios
      .delete(
        `https://avanzbase.herokuapp.com/delete-account?&email=${email}`,
        {
          withCredentials: true,
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
