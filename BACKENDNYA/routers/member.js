const { response, request } = require("express");
const express = require("express");
const app = express();

// middleware for allow the request from body (agar bisa membaca data yg dibody)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// panggil models
const models = require("../models/index");

//panggil model "member"
const member = models.member;

// // panggil fungsi auth -> validasi token
// const {auth} = require("./login")

// // fungsi auth dijadikan middleware
// app.use(auth)

//endpoint for get all member
app.get("/", async (request, response) => {
  let dataMember = await member.findAll();

  return response.json(dataMember);
});

// endpoint add new member
app.post("/", (request, response) => {
  let newMember = {
    //menampung data
    nama: request.body.nama,
    alamat: request.body.alamat,
    jenis_kelamin: request.body.jenis_kelamin,
    telepon: request.body.telepon,
  };

  member
    .create(newMember)
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
app.put("/:id_member", (request, response) => {
  // tampung data yg akan diubah
  let data = {
    nama: request.body.nama,
    alamat: request.body.alamat,
    jenis_kelamin: request.body.jenis_kelamin,
    telepon: request.body.telepon,
  };

  let parameter = {
    id_member: request.params.id_member,
  };

  // proses update
  member
    .update(data, { where: parameter })
    .then((result) => {
      return response.json({
        message: `Data berhasil diubah`,
        data: result,
      });
    })
    .catch((error) => {
      return response.json({
        message: error.message,
      });
    });
});

//endpoint hapus data member
app.delete("/:id_member", (request, response) => {
  // tampung data yang akan dihapus
  let parameter = {
    id_member: request.params.id_member,
  };

  // proses hapus
  member
    .destroy({ where: parameter })
    .then((result) => {
      return response.json({
        message: `Data berhasil dihapus`,
      });
    })
    .catch((error) => {
      return response.json({
        message: error.message,
      });
    });
});

module.exports = app;
