const mongoose = require("mongoose");

const LocationSchema = mongoose.Schema({
  nome: String,
});

module.exports = mongoose.Model("Localizacoes", LocationSchema);
