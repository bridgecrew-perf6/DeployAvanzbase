const jwt = require("jsonwebtoken");
require("dotenv").config();

//create access token
const createAccessToken = (user) => {
  // create new JWT access token
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "20s",
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
      expiresIn: "1m",
    }
  );

  return refreshToken;
};

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

module.exports = { createAccessToken, verifyToken, createRefreshToken };
