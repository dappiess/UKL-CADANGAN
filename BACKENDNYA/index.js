const express = require("express");
const app = express();
const cors = require("cors");
const routers = require("express").routers;
app.use(cors());

const member = require("./routers/member");
app.use("/api/member", member);

const user = require("./routers/users");
app.use("/api/user", user);

const paket = require("./routers/paket");
app.use("/api/paket", paket);

const transaksi = require("./routers/transaksi");
app.use("/api/transaksi", transaksi);

const login = require("./routers/login");
app.use("/api/auth", login);

const outlet = require("./routers/outlet");
app.use("/api/outlet", outlet);

app.listen(8000, () => {
  console.log(`server on port 8000`);
});
