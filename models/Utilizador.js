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
    unique: true,
    required: [true, "É obrigatório inserir o Email"],
  },
  password: {
    type: String,
    required: [true, "É obrigatório inserir a Password"],
  },
  tipo: {
    type: String,
    required: [true, "É obrigatório inserir o Tipo de Utilizador"],
  },
  token: { type: String },
});

//tipos
// view (só vizualiza)
// edit (vizualiza e edita)
// admin (crud todo, inclusive crud de users)

module.exports = mongoose.model("utilizadores", UtilizadorSchema);
