import axios from "axios";

// Get company description through Finnhub
export const GetVideos = async (term) => {
  try {
    const response = await axios
      .get(
        `https://avanzbase.herokuapp.com/videos?term=${term}`,
        {},
        {
          withCredentials: "include",
        }
      )
      .catch(function (err) {
        if (err.response) {
          return err.response;
        }
      });
    return response;
  } catch (e) {
    console.log(`Axios request failed: ${e}`);
    return null;
  }
};
