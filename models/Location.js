const mongoose = require("mongoose");
//guid, ids gerado
const { v4: uuidv4 } = require("uuid");

const LocationSchema = mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  location: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("locations", LocationSchema);
