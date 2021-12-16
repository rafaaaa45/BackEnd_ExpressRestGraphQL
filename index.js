const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//Import Routes
const locationRoutes = require("./routes/tags.js");
const tagRoutes = require("./routes/tags.js");

app.get("/location", locationRoutes);
app.get("/tag", tagRoutes);

//Conexão ao Mongo DB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () =>
  console.log("Conectado ao MongoDB")
);

//Iniciar o Servidor
app.listen(port, () => {
  console.log(`App Ligada em http://localhost:${process.env.PORT}`);
});
