const mongoose = require("mongoose");
//guid, ids gerado
const { UUIDv4 } = require("uuid-v4-validator");
const { v4: uuidv4 } = require("uuid");

const TagSchema = mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
    validate: {
      isAsync: true,
      validator: function (value) {
        return UUIDv4.validate(value);
      },
      message: function (props) {
        return `${props.value} is not a valid GUID`;
      },
    },
  },
  tag: {
    type: String,
    required: [true, "É obrigatório inserir nome da Tag"],
  },
});

module.exports = mongoose.model("tags", TagSchema);
