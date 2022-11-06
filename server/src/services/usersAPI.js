const router = require("express").Router();
const { User } = require("../models/users");
const { hash, compare } = require("bcryptjs");
const {
  createAccessToken,
  sendAccessToken,
  sendRefreshToken,
  createRefreshToken,
} = require("../tokens");
const { isAuth } = require("../isAuth");
const { verify } = require("jsonwebtoken");

router.get("/", async (req, res) => {
  try {
    const AllUsers = await User.find();
    res.send(AllUsers);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send({ err: "Please fill in all the fields!" });
    }
    const user = await User.find({ username: username });
    if (!user.length) {
      return res.status(400).send({ err: "wrong username" });
    }

    const valid = await compare(password, user[0].password);
    if (!valid) {
      return res.status(400).send({ err: "wrong password" });
    }

    const accessToken = createAccessToken(user[0]._id);
    const refreshtoken = createRefreshToken(user[0]._id);

    let update = await User.findOneAndUpdate(
      { username: username },
      { $set: { token: refreshtoken } },
      {
        new: true,
      }
    );
    await update.save();

    sendRefreshToken(res, refreshtoken);
    sendAccessToken(req, res, accessToken, update);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, username, password, phonenumber } = req.body;
    if (!name || !username || !password || !phonenumber) {
      return res
        .status(400)
        .send({ err: "Please fill in all the required fields!" });
    }
    const finduser = await User.find({ username: req.body.username });
    if (finduser.length) {
      return res.status(400).send({ err: "username already taken!" });
    }

    const hashedPassword = await hash(password, 10);

    const UserData = {
      username,
      password: hashedPassword,
    };

    const saveduser = await new User(UserData);
    saveduser.save();
    return res.send({ msg: "account created, please login" });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post("/logout", async (req, res) => {
  res.clearCookie("refreshtoken", { path: "/refresh-token" });
  return res.send({ msg: "legged out" });
});

router.get("/getMyProfile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const myUser = await User.findOne({ _id: id }).select(["-password"]);
    console.log(myUser);

    res.send(myUser);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post("/protected", async (req, res) => {
  try {
    const userId = isAuth(req);
    if (userId !== null) {
      res.send({ data: "protected data" });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post("/refresh-token", async (req, res) => {
  const token = req.cookies.refreshtoken;
  if (!token) {
    return res.send({ accessToken: "" });
  }
  let payload = null;
  try {
    payload = verify(token, "REFRESH_TOKEN_SECRET");
  } catch (err) {
    return res.send({ accessToken: "" });
  }

  const user = await User.find({ _id: payload.userId });

  if (!user) {
    return res.send({ accessToken: "" });
  }

  if (user[0].token !== token) {
    return res.send({ accessToken: "" });
  }

  const accessToken = createAccessToken(user[0]._id);
  const refreshtoken = createRefreshToken(user[0]._id);

  let update = await User.findOneAndUpdate(
    { _id: payload.userId },
    { $set: { token: refreshtoken } },
    {
      new: true,
    }
  );

  await update.save();

  sendRefreshToken(res, refreshtoken);
  sendAccessToken(req, res, accessToken, update);
});

module.exports = router;
