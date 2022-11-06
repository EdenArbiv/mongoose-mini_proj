const { sign } = require("jsonwebtoken");


const createAccessToken = (userId) => {
  return sign({ userId }, 'ACCESS_TOKEN_SECRET', { expiresIn: "30m" });
};

const createRefreshToken = (userId) => {
  return sign({ userId }, 'REFRESH_TOKEN_SECRET', { expiresIn: "7d" });
};

const sendAccessToken = (req, res, accesstoken, user) => {
    res.send({
        accesstoken,
        user
    })
}

const sendRefreshToken = (res, refreshtoken) => {
  res.cookie('refreshtoken', refreshtoken , {maxAge: 900000, httpOnly: true, path: '/refresh-token'});
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken
};
