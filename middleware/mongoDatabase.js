const { DB_CONNECTION } = process.env;
const mongoose = require("mongoose");

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(DB_CONNECTION, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("Conectado na base de Dados MongoDB");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      throw error;
    })
    .finally(() => {
      return;
    });
};
