// CREATION OF TOKENS, DELETE TOKEN, REFRESH TOKEN - AUTHSERVER

const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require("path");

// hashing algorithm
const bcrypt = require("bcrypt");
const salt = 10;
// port for heroku if needed
const PORT = 8080;

// ** MIDDLEWARE ** //
const whitelist = [
  "http://localhost:3000",
  "http://localhost:8080",
  "https://avanzbase.herokuapp.com",
];
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin);
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable");
      callback(null, true);
    } else {
      console.log("Origin rejected");
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const db = mysql.createConnection({
  host: "eu-cdbr-west-02.cleardb.net",
  user: "bb25e132cf8ee3",
  password: "dc998979",
  database: "heroku_5491edb823cbd58",
});

// create access token
const createAccessToken = (user) => {
  // create new JWT access token
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1h", // expires in 1 hour
    }
  );
  return accessToken;
};

//create refresh token
const createRefreshToken = (user) => {
  // create new JWT access token
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30d", // expires in 30 days
    }
  );
  return refreshToken;
};

app.post("/refresh-token", (req, res) => {
  const refreshToken = req.cookies["refresh-token"];
  // check if refresh token exist
  if (!refreshToken) return res.sendStatus(401);
  // verify refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, result) => {
    if (err) return res.sendStatus(401);
    // check for refresh token in database and identify potential user
    sqlFindUser = "SELECT * FROM user_db WHERE refresh_token = ?";
    db.query(sqlFindUser, [refreshToken], (err, user) => {
      // if no user found
      if (user.length === 0) return res.sendStatus(401);

      const accessToken = createAccessToken(user[0]);
      res.cookie("access-token", accessToken, {
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true, // hinder doing document.cookies as it will be httpOnly which will make it more safe
      });
      res.send(user[0]);
    });
  });
});

/**
 * Log out functionality which deletes all cookies containing tokens and deletes refresh token from database
 */
app.delete("/logout", (req, res) => {
  const refreshToken = req.cookies["refresh-token"];
  // delete refresh token from database
  const sqlRemoveRefreshToken =
    "UPDATE user_db SET refresh_token = NULL WHERE refresh_token = ?";
  db.query(sqlRemoveRefreshToken, [refreshToken], (err, result) => {
    if (err) return res.sendStatus(401);

    // delete all cookies
    res.clearCookie("access-token", {
      httpOnly: true, // hinder doing document.cookies as it will be httpOnly which will make it more safe
    });
    res.clearCookie("refresh-token", {
      httpOnly: true, // hinder doing document.cookies as it will be httpOnly which will make it more safe
    });
    res.end();
  });
});

// handle user sign up
app.post("/sign-up", (req, res) => {
  //request information from frontend
  const { first_name, last_name, email, password } = req.body;

  // hash using bcrypt
  bcrypt.hash(password, salt, (err, hash) => {
    if (err) {
      res.send({ err: err });
    }

    // insert into backend with hashed password
    const sqlInsert =
      "INSERT INTO user_db (first_name, last_name, email, password) VALUES (?,?,?,?)";
    db.query(sqlInsert, [first_name, last_name, email, hash], (err, result) => {
      res.send(err);
    });
  });
});

/*
 * Handel user login
 */
app.post("/sign-in", (req, res) => {
  const { email, password } = req.body;

  sqlSelectAllUsers = "SELECT * FROM user_db WHERE email = ?";
  db.query(sqlSelectAllUsers, [email], (err, user) => {
    if (err) {
      res.send({ err: err });
    }

    if (user && user.length > 0) {
      // given the email check if the password is correct

      bcrypt.compare(password, user[0].password, (err, compareUser) => {
        if (compareUser) {
          //req.session.email = user;
          // create access token
          const accessToken = createAccessToken(user[0]);
          const refreshToken = createRefreshToken(user[0]);
          // create cookie and store it in users browser
          res.cookie("access-token", accessToken, {
            maxAge: 1000 * 60 * 30, // 30 min
            httpOnly: true, // hinder doing document.cookies as it will be httpOnly which will make it more safe
          });
          res.cookie("refresh-token", refreshToken, {
            maxAge: 2.63e9, // approx 1 month
            httpOnly: true,
          });

          // update refresh token in database
          const sqlUpdateToken =
            "UPDATE user_db SET refresh_token = ? WHERE email = ?";
          db.query(
            sqlUpdateToken,
            [refreshToken, user[0].email],
            (err, result) => {
              if (err) {
                res.send(err);
              }
              res.sendStatus(200);
            }
          );
        } else {
          res.send({ message: "Wrong email or password" });
        }
      });
    } else {
      res.send({ message: "Wrong email or password" });
    }
  });
});

// --------------------------------------------------------------------------------------------------------------
//------------------------------------------------------JWT------------------------------------------------------

//verify if user has a valid token (next is function when to move forward with the request)
const verifyToken = (req, res, next) => {
  // use request to access cookies, access-token was token created at /sign-in
  //check if user has access token
  const accessToken = req.cookies["access-token"];

  // if access token does not exist
  if (!accessToken) {
    return res.status(400).json({ error: "User not logged in" });
  }

  // check if access token is valid
  try {
    // use verify function to check if token is valid
    const validToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    if (validToken) {
      // authenticated is a variable made up here
      req.authenticated = true;
      // move forward with the request
      return next();
    }
  } catch (err) {
    res.send({ error: err });
  }
};

// --------------------------------------------------------------------------------------------------------------
// ------------------------------------------- Resource/authorization server ------------------------------------

// GETTING POST, SAVING POST ETC. - RESOURCE SERVER
const axios = require("axios");

// verify if user has a valid access token when user wants to access resources
const authenticateAccessToken = (req, res, next) => {
  // use request to access cookies, access-token was token created at /sign-in
  //check if user has access token
  const accessToken = req.cookies["access-token"];

  // if access token does not exist
  if (!accessToken) {
    return res.sendStatus(401);
  }
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    return next();
  });
};

// pass middleware verifyToken to check if user has valid access token, verifyToken needs to pass in order for function to move on
app.get("/get", verifyToken, (req, res) => {
  const sqlSelect = "SELECT * FROM user_db";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

// get users info
app.get("/get-user", authenticateAccessToken, (req, res) => {
  const accessToken = req.cookies["access-token"];
  // case when no access token exist
  if (!accessToken) return res.json({ name: "TokenExpiredError" });
  try {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, result) => {
      // case when token has expired or is wrong
      if (err) return res.json({ name: err.name });
      return res.json({
        id: result.id,
        email: result.email,
        first_name: result.first_name,
        last_name: result.last_name,
      });
    });
  } catch (err) {
    return res.status(401);
  }
});

// get current user from user_db
app.get("/get-current-user", authenticateAccessToken, (req, res) => {
  const accessToken = req.cookies["access-token"];
  const { email } = req.query;
  // case when no access token exist
  if (!accessToken) return res.json({ name: "TokenExpiredError" });
  try {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, result) => {
      // case when token has expired or is wrong
      if (err) return res.json({ name: err.name });

      // get current user data from user_db
      const sqlGet = "SELECT * FROM user_db WHERE email = ?";
      db.query(sqlGet, [email], (err, result) => {
        if (result.length === 0) return res.sendStatus(401);
        return res.json({
          id: result[0].id,
          first_name: result[0].first_name,
          last_name: result[0].last_name,
          email: result[0].email,
        });
      });
    });
  } catch (err) {
    return res.status(401);
  }
});

//----------------- Requests to get stock information ----------------------

// Axios GET request to Finnhub to get stock time series
app.get("/search-stock", async (req, res) => {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/search?q=${req.query.term}&token=${process.env.REACT_APP_API__KEY_FINNHUB}`
    );
    res.json(response.data);
  } catch (e) {
    console.log(`Axios request failed: ${e}`);
  }
});

// Axios GET request to Finnhub to basic values of a predetermined stock considered popular by the developer
app.get("/popular-stock", async (req, res) => {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${req.query.symbol}&token=${process.env.REACT_APP_API__KEY_FINNHUB}`
    );
    res.json(response.data);
  } catch (e) {
    console.log(`Axios request failed: ${e}`);
  }
});

// Axios GET request to Finnhub to get company description
app.get("/stock-news", async (req, res) => {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/company-news?symbol=${req.query.symbol}&from=2021-12-08&to=2021-12-15&token=${process.env.REACT_APP_API__KEY_FINNHUB}`
    );
    res.json(response.data);
  } catch (e) {
    console.log(`Axios request failed: ${e}`);
  }
});

// Axios GET request to Finnhub to get stock recommendations
app.get("/recommendation", async (req, res) => {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/stock/recommendation?symbol=${req.query.symbol}&token=${process.env.REACT_APP_API__KEY_FINNHUB}`
    );
    res.json(response.data);
  } catch (e) {
    console.log(`Axios request failed: ${e}`);
  }
});

// Axios GET request to Alphavantag to get stock prices over time
app.get("/stock-time-series", async (req, res) => {
  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=${req.query.function}&interval=${req.query.interval}&symbol=${req.query.symbol}&outputsize=compact&apikey=${process.env.REACT_APP_API_KEY_ALPHAVANTAGE}`
    );
    res.json(response.data);
  } catch (e) {
    console.log(`Axios request failed: ${e}`);
  }
});

// Axios GET request to Alphavantag to get company description
app.get("/stock-description", async (req, res) => {
  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${req.query.symbol}&apikey=${process.env.REACT_APP_API_KEY_ALPHAVANTAGE}`
    );
    res.json(response.data);
  } catch (e) {
    console.log(`Axios request failed: ${e}`);
  }
});

// GET request to Youtube API to get searched videos (no restrictions for API key in Google Cloud Platform)
app.get("/videos", async (req, res) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&type=video&q=${req.query.term}&key=${process.env.REACT_APP_API_KEY_YOUTUBE}`
    );
    res.json(response.data);
  } catch (e) {
    console.log(`Axios request failed: ${e}`);
  }
});

//---------------------------- Portfolio ---------------------------

// create a new portfolio for the user
app.post("/create-portfolio", authenticateAccessToken, async (req, res) => {
  // request information from frontend
  const { name, comment, email } = req.query;

  // insert into backend with hashed password
  const sqlInsert =
    "INSERT INTO portfolio_db (portfolio_name, comment, user_id) VALUES (?,?,?)";
  db.query(sqlInsert, [name, comment, email], (err, result) => {
    res.send(err);
  });
});

// add coin to database
app.post("/add-coin", authenticateAccessToken, async (req, res) => {
  // request information from frontend
  const { url, symbol, portfolio_name, email } = req.query;

  // insert into backend with hashed password
  const sqlInsert =
    "INSERT INTO coin_db (url, symbol, portfolio_name, email) VALUES (?,?,?,?)";
  db.query(sqlInsert, [url, symbol, portfolio_name, email], (err, result) => {
    res.send(err);
  });
});

// add stock to database
app.post("/add-stock", authenticateAccessToken, async (req, res) => {
  // request information from frontend
  const { url, symbol, portfolio_name, email } = req.query;

  // insert into backend with hashed password
  const sqlInsert =
    "INSERT INTO stock_db (url, symbol, portfolio_name, email) VALUES (?,?,?,?)";
  db.query(sqlInsert, [url, symbol, portfolio_name, email], (err, result) => {
    res.send(err);
  });
});

// add video to database
app.post("/add-video", authenticateAccessToken, async (req, res) => {
  // request information from frontend
  const { url, symbol, portfolio_name, email } = req.query;

  // insert into backend with hashed password
  const sqlInsert =
    "INSERT INTO video_db (url, symbol, portfolio_name, email) VALUES (?,?,?,?)";
  db.query(sqlInsert, [url, symbol, portfolio_name, email], (err, result) => {
    res.send(err);
  });
});

// get portfolio coins
app.get("/portfolio-coins", authenticateAccessToken, async (req, res) => {
  // request information from frontend
  const { name, email } = req.query;

  // insert into backend with hashed password
  const sqlGet = "SELECT * FROM coin_db WHERE portfolio_name = ? AND email = ?";
  db.query(sqlGet, [name, email], (err, result) => {
    //if (result.length === 0) return res.sendStatus(401);
    res.json(result);
  });
});

// get portfolio stocks
app.get("/portfolio-stocks", authenticateAccessToken, async (req, res) => {
  // request information from frontend
  const { name, email } = req.query;

  // insert into backend with hashed password
  const sqlGet =
    "SELECT * FROM stock_db WHERE portfolio_name = ? AND email = ?";
  db.query(sqlGet, [name, email], (err, result) => {
    res.json(result);
  });
});

// get portfolio videos
app.get("/portfolio-videos", authenticateAccessToken, async (req, res) => {
  // request information from frontend
  const { name, email } = req.query;

  // insert into backend with hashed password
  const sqlGet =
    "SELECT * FROM video_db WHERE portfolio_name = ? AND email = ?";
  db.query(sqlGet, [name, email], (err, result) => {
    res.json(result);
  });
});

// get user portfolios
app.get("/get-portfolios", authenticateAccessToken, async (req, res) => {
  // request information from frontend
  const { email } = req.query;

  // insert into backend with hashed password
  const sqlGet = "SELECT * FROM portfolio_db WHERE user_id = ?";
  db.query(sqlGet, [email], (err, result) => {
    if (result.length === 0) return res.sendStatus(204);
    res.json(result);
  });
});

// delete portfolio and every object linked to it
app.delete("/delete-portfolio", authenticateAccessToken, async (req, res) => {
  // request information from frontend
  const { name, email } = req.query;

  // delete coins linked to portfolio in coin_db
  const sqlDeleteCoins =
    "DELETE FROM coin_db WHERE portfolio_name = ? AND email = ?";
  db.query(sqlDeleteCoins, [name, email], (err, result) => {});

  // delete stocks linked to portfolio in stock_db
  const sqlDeleteStocks =
    "DELETE FROM stock_db WHERE portfolio_name = ? AND email = ?";
  db.query(sqlDeleteStocks, [name, email], (err, result) => {});

  // delete videos linked to portfolio in video_db
  const sqlDeleteVideos =
    "DELETE FROM video_db WHERE portfolio_name = ? AND email = ?";
  db.query(sqlDeleteVideos, [name, email], (err, result) => {});

  // delete portfolio from portfolio_db
  const sqlDeletePortfolio =
    "DELETE FROM portfolio_db WHERE portfolio_name = ? AND user_id = ?";
  db.query(sqlDeletePortfolio, [name, email], (err, result) => {
    res.json(result);
  });
});

// delete coin from coin_db
app.delete("/delete-coin", authenticateAccessToken, async (req, res) => {
  // request information from frontend
  const { objectName, portfolioName, email } = req.query;

  // delete coin from portfolio
  const sqlDeleteCoin =
    "DELETE FROM coin_db WHERE symbol = ? AND portfolio_name = ? AND email = ?";
  db.query(sqlDeleteCoin, [objectName, portfolioName, email], (err, result) => {
    res.json(result);
  });
});

// delete stock from stock_db
app.delete("/delete-stock", authenticateAccessToken, async (req, res) => {
  // request information from frontend
  const { objectName, portfolioName, email } = req.query;

  // delete stock from portfolio
  const sqlDeleteStock =
    "DELETE FROM stock_db WHERE symbol = ? AND portfolio_name = ? AND email = ?";
  db.query(
    sqlDeleteStock,
    [objectName, portfolioName, email],
    (err, result) => {
      res.json(result);
    }
  );
});

// delete video from video_db
app.delete("/delete-video", authenticateAccessToken, async (req, res) => {
  // request information from frontend
  const { objectName, portfolioName, email } = req.query;

  // delete video from portfolio
  const sqlDeleteVideo =
    "DELETE FROM video_db WHERE symbol = ? AND portfolio_name = ? AND email = ?";
  db.query(
    sqlDeleteVideo,
    [objectName, portfolioName, email],
    (err, result) => {
      res.json(result);
    }
  );
});

// save edited comment
app.post("/save-comment", authenticateAccessToken, async (req, res) => {
  // request information from frontend
  const { name, email, comment } = req.query;

  // insert into backend with hashed password
  const sqlUpdate =
    "UPDATE portfolio_db SET comment = ? WHERE portfolio_name = ? AND user_id = ?";
  db.query(sqlUpdate, [comment, name, email], (err, result) => {
    res.send(err);
  });
});

// add changes to profile
app.post("/change-profile", authenticateAccessToken, async (req, res) => {
  // request information from frontend
  const { firstName, lastName, password, email } = req.query;

  // hash using bcrypt
  bcrypt.hash(password, salt, (err, hash) => {
    if (err) {
      res.send({ err: err });
    }

    if (firstName.length > 0 && lastName.length > 0 && password.length > 0) {
      const sqlUpdateStatement =
        "UPDATE user_db SET first_name = ?, last_name = ?, password = ? WHERE email = ?";
      db.query(
        sqlUpdateStatement,
        [firstName, lastName, hash, email],
        (err, result) => {
          res.send(err);
        }
      );
    } else if (
      firstName.length > 0 &&
      lastName.length > 0 &&
      password.length === 0
    ) {
      const sqlUpdateStatement =
        "UPDATE user_db SET first_name = ?, last_name = ? WHERE email = ?";
      db.query(
        sqlUpdateStatement,
        [firstName, lastName, email],
        (err, result) => {
          res.send(err);
        }
      );
    } else if (
      firstName.length > 0 &&
      lastName.length === 0 &&
      password.length === 0
    ) {
      const sqlUpdateStatement =
        "UPDATE user_db SET first_name = ? WHERE email = ?";
      db.query(sqlUpdateStatement, [firstName, email], (err, result) => {
        res.send(err);
      });
    } else if (
      firstName.length === 0 &&
      lastName.length > 0 &&
      password.length === 0
    ) {
      const sqlUpdateStatement =
        "UPDATE user_db SET last_name = ? WHERE email = ?";
      db.query(sqlUpdateStatement, [lastName, email], (err, result) => {
        res.send(err);
      });
    } else if (
      firstName.length === 0 &&
      lastName.length === 0 &&
      password.length > 0
    ) {
      const sqlUpdateStatement =
        "UPDATE user_db SET password = ? WHERE email = ?";
      db.query(sqlUpdateStatement, [hash, email], (err, result) => {
        res.send(err);
      });
    } else if (
      firstName.length === 0 &&
      lastName.length > 0 &&
      password.length > 0
    ) {
      const sqlUpdateStatement =
        "UPDATE user_db SET last_name = ?, password = ? WHERE email = ?";
      db.query(sqlUpdateStatement, [lastName, hash, email], (err, result) => {
        res.send(err);
      });
    } else if (
      firstName.length > 0 &&
      lastName.length > 0 &&
      password.length > 0
    ) {
      const sqlUpdateStatement =
        "UPDATE user_db SET first_name = ?, password = ? WHERE email = ?";
      db.query(sqlUpdateStatement, [firstName, hash, email], (err, result) => {
        res.send(err);
      });
    } else {
      console.log("Nothing to updated");
    }
  });
});

// delete user account and everything connected with it
app.delete("/delete-account", authenticateAccessToken, async (req, res) => {
  const accessToken = req.cookies["access-token"];
  const { email } = req.query;
  // case when no access token exist
  if (!accessToken) return res.json({ name: "TokenExpiredError" });
  try {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, result) => {
      // case when token has expired or is wrong
      if (err) return res.json({ name: err.name });

      // delete coins connected with account
      const sqlDeleteCoins = "DELETE FROM coin_db WHERE email = ?";
      db.query(sqlDeleteCoins, [email], (err, result) => {});

      // delete stocks connected with account
      const sqlDeleteStocks = "DELETE FROM stock_db WHERE email = ?";
      db.query(sqlDeleteStocks, [email], (err, result) => {});

      // delete videos connected with account
      const sqlDeleteVideos = "DELETE FROM video_db WHERE email = ?";
      db.query(sqlDeleteVideos, [email], (err, result) => {});

      // delete portfolio connected with account
      const sqlDeletePortfolio = "DELETE FROM portfolio_db WHERE user_id = ?";
      db.query(sqlDeletePortfolio, [email], (err, result) => {});

      // delete account
      const sqlDeleteAccount = "DELETE FROM user_db WHERE email = ?";
      db.query(sqlDeleteAccount, [email], (err, result) => {
        res.json(result);
      });
    });
  } catch (err) {
    return res.status(401);
  }
});

// display react to the browser
if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));
  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
