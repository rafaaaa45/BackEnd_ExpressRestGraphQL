const mongoose = require("mongoose");
//guid, ids gerado
const { v4: uuidv4 } = require("uuid");

const CompanieSchema = mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  companie: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Companies", CompanieSchema);
