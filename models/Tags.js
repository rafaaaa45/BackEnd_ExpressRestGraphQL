const mongoose = require("mongoose");
//guid, ids gerado
const { v4: uuidv4 } = require("uuid");

const TagSchema = mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  tag: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Tags", TagSchema);
