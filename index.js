const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// mongodb+srv://appIPVC:123appIPVC@cluster0.8fkpd.mongodb.net/AppIPVC?retryWrites=true&w=majority
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () =>
  console.log("Conectado ao MongoDB")
);

app.listen(port, () => {
  console.log(`App Ligada em http://localhost:${port}`);
});
