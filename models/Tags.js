const mongoose = require("mongoose");

const TagSchema = mongoose.Schema({
  tag: String,
});

module.exports = mongoose.Model("Tags", TagSchema);
