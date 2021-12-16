const mongoose = require("mongoose");

const TagSchema = mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Tags", TagSchema);
