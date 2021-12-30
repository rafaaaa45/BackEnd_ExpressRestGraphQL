const crypto = require("crypto");
const res = require("express/lib/response");
const jwt = require("jsonwebtoken");
const { nextTick } = require("process");

const Tipos = {
  ADMIN: "admin",
  EDIT: "edit",
  VIEW: "view",
};

const encryptSha512 = (password) => {
  let encryptedPW;

  encryptedPW = crypto.createHash("sha512").update(password).digest("hex");

  return encryptedPW;
};

const createJWT = (id, email, tipo) => {
  let newToken;

  newToken = jwt.sign(
    { user_id: id, email: email, tipo: tipo },
    process.env.TOKEN_KEY,
    {
      expiresIn: "1h",
    }
  );

  return newToken;
};

const isValidTipo = (tipo) => {
  if (tipo != (Tipos.ADMIN || Tipos.EDIT || Tipos.VIEW)) {
    return false;
  }
  return true;
};

exports.encryptSha512 = encryptSha512;
exports.createJWT = createJWT;
exports.Tipos = Tipos;
exports.isValidTipo = isValidTipo;
