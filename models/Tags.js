const mongoose = require("mongoose");

const TagSchema = mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.Model("Tags", TagSchema);
