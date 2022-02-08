// verify if user has a valid token, when user wants to access resources
const authenticateAccessToken = (req, res, next) => {
  // use request to access cookies, access-token was token created at /sign-in
  //check if user has access token
  const accessToken = req.cookies["access-token"];

  // if access token does not exist
  if (!accessToken) {
    return res.sendStatus(401);
  }

  // check if access token is valid
  // use verify function to check if token is valid
  //const validToken =
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    return next();
  });
};
