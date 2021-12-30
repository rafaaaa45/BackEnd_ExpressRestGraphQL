const mongoose = require("mongoose");
//guid, ids gerado
const { v4: uuidv4 } = require("uuid");

const UtilizadorSchema = mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    required: true,
  },
  token: { type: String },
});

//tipos
// view (só vizualiza)
// edit (vizualiza e edita)
// admin (crud todo, inclusive crud de users)

module.exports = mongoose.model("utilizadores", UtilizadorSchema);
