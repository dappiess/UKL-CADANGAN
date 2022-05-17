const express = require("express");
const login = express();
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const secretKey = "dappiexs";

//membaca request bertipe json
login.use(express.json());

//memanggil model index
const models = require("../models/index");
const user = models.user;

login.post("/", async (request, response) => {
  let newLogin = {
    username: request.body.username,
    password: md5(request.body.password),
  };
  let dataUser = await user.findOne({
    where: newLogin,
  });

  if (dataUser) {
    let payload = JSON.stringify(dataUser);
    let token = jwt.sign(payload, secretKey);
    return response.json({
      logged: true,
      token: token,
      user: dataUser,
    });
  } else {
    return response.json({
      logged: false,
      message: `Invalid username or password`,
    });
  }
});

module.exports = login;
