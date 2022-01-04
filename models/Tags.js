const mongoose = require("mongoose");
//guid, ids gerado
const { v4: uuidv4 } = require("uuid");

const TagSchema = mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
    validate: {
      validator: (value) => {
        //incompleto pesquisar sobre validator guid
        if (value) {
          return false;
        }
      },
      message: (props) => {
        return `${props.value} is not a valid QUID`;
      },
    },
  },
  tag: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("tags", TagSchema);
