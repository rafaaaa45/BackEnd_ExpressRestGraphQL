const mongoose = require("mongoose");

const LocationSchema = mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.Model("Localizacoes", LocationSchema);
