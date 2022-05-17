const { response, request } = require("express");
const express = require("express");
const app = express();
const md5 = require("md5");
app.use(express.json());

const models = require("../models/index");
const users = models.user;
const outlet = models.outlet;

// panggil fungsi auth -> validasi token
// const {auth} = require("./login")

// // fungsi auth dijadikan middleware
// app.use(auth)

// endpoint for get all users
app.get("/", async (request, response) => {
  let dataUsers = await users.findAll({
    include: {
      model: models.outlet,
      as: "outlet",
    },
  });

  return response.json(dataUsers);
});

app.post("/", (request, response) => {
  let newUser = {
    //menampung data
    nama: request.body.nama,
    username: request.body.username,
    password: md5(request.body.password),
    role: request.body.role,
    id_outlet: request.body.id_outlet,
  };

  users
    .create(newUser)
    .then((result) => {
      response.json({
        message: `Data berhasil ditambahkan`,
        data: result,
      });
    })
    .catch((error) => {
      response.json({
        message: error.message,
      });
    });
});

//endpoint update data member
app.put("/:id_user", (request, response) => {
  // tampung data user
  let data = {
    nama: request.body.nama,
    username: request.body.username,
    password: md5(req.body.password),
    role: request.body.role,
    id_outlet: request.body.id_outlet,
  };
  if (request.body.password) {
    data.password = md5(request.body.password);
  }

  let parameter = {
    id_user: request.params.id_user,
  };

  //proses update
  users
    .update(data, { where: parameter })
    .then((result) => {
      return response.json({
        message: `Data berhasil diupdate`,
        data: result,
      });
    })
    .catch((error) => {
      return response.json({
        message: error.message,
      });
    });
});

// endpoint hapus data users
app.delete("/:id_user", (request, response) => {
  //tampung data user
  let parameter = {
    id_user: request.params.id_user,
  };

  // proses hapus
  users
    .destroy({ where: parameter })
    .then((result) => {
      return response.json({
        message: `Data berhasil dihapus`,
        data: result,
      });
    })
    .catch((error) => {
      return response.json({
        message: error.message,
      });
    });
});
module.exports = app;
