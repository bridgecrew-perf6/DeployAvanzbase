import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import StocksAndFunds from "./pages/stocks/StocksAndFunds";
import Navbar from "./navbar/Navbar";
import "../css/App.css";
import CryptoMain from "./pages/crypto/CryptoMain";
import CoinDetails from "./pages/crypto/CoinDetails";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Portfolio from "./pages/Portfolio";
import AboutUs from "./pages/AboutUs";
import Youtube from "./pages/youtube/Youtube";
import { UserContext } from "./UserContext";
import { GetUserInfo, RefreshToken } from "../api/AuthenticateUser";
import Landingpage from "./pages/Landingpage";

// checks if user stored in context
const hasContext = ({ contextUser }, loadContext) => {
  if (contextUser == null && loadContext) return false;
  return true;
};

/*
 * Only authorized users should be able to navigate to AuthRoute.
 * Redirect unauthorized users when trying to access routes
 * which require authentication.
 */
const AuthRoute = ({
  component: Component,
  contextUser,
  loadContext,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      hasContext(contextUser, loadContext) ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/sign-in" }} />
      )
    }
  />
);

const App = () => {
  // state for storing logged in user
  const [contextUser, setContextUser] = useState(null);
  // state for waiting until context has been loaded
  const [loadContext, setLoadContext] = useState(false);
  // state for update context

  // helps handle if there are many changes to the context of the user
  const providerValue = useMemo(
    () => ({ contextUser, setContextUser }),
    [contextUser, setContextUser]
  );

  useEffect(() => {
    (async () => {
      var responseData = await GetUserInfo();
      try {
        // if the user is missing an access token
        // TokenExpiredError=access token has expired, Unauthorized=no access token exist
        if (
          responseData.data.name === "TokenExpiredError" ||
          responseData.data === "Unauthorized"
        ) {
          await RefreshToken();
          await GetUserInfo();
        }
      } catch (error) {
        console.log(`Error: ${error}`);
      }
      if (typeof responseData != "undefined") {
        if (responseData.data === "Unauthorized") setContextUser(null);
        else if (responseData != null) {
          setContextUser(responseData.data);
        }
      }
      setLoadContext(true);
    })();
  }, []);

  return (
    <div className="App">
      <div style={{ minHeight: "calc(10vh-34px)" }}>
        <BrowserRouter>
          {/* context value is passed down in tree to all children */}
          <UserContext.Provider value={providerValue}>
            <Navbar />
            <div className="app-body">
              <Route path="/" exact component={Landingpage} />
              <Route path="/stocks/:symbol" exact component={StocksAndFunds} />
              <Route
                path="/crypto-table/details/:name"
                exact
                component={CoinDetails}
              />
              <Route path="/crypto-table" exact component={CryptoMain} />
              <Route path="/sign-in" exact component={SignIn} />
              <Route path="/sign-up" exact component={SignUp} />
              <Route path="/youtube-api" exact component={Youtube} />
              <Route path="/about-us" exact component={AboutUs} />
              <AuthRoute
                path="/portfolio"
                exact
                component={Portfolio}
                contextUser={providerValue}
                loadContext={loadContext}
              />
              <AuthRoute
                path="/profile"
                exact
                component={Profile}
                contextUser={providerValue}
                loadContext={loadContext}
              />
            </div>
          </UserContext.Provider>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
